/**
 * ImportAgent — parses uploaded API definitions in many formats into normalised
 * CustomApi records the dashboard can preview and save.
 *
 * Supported formats (auto-detected from extension + content):
 *   - OpenAPI / Swagger  (.json / .yaml / .yml)
 *   - Postman collection (v2.x .json)
 *   - HAR                (.har / .json)
 *   - cURL command(s)    (.txt / .sh / raw text)
 *   - Excel / CSV table  (.xlsx / .xls / .csv)
 *   - Word               (.docx  → text → curl/json/table heuristics)
 *   - PDF                (.pdf   → text → curl/json/table heuristics)
 *   - Raw JSON array/obj of CustomApi-shaped records
 *
 * Everything is best-effort and never throws to the caller: unparseable input
 * yields an empty api list plus warnings.
 */

import * as XLSX from 'xlsx';
import mammoth from 'mammoth';
import { load as loadYaml } from 'js-yaml';
import { PDFParse } from 'pdf-parse';

import { Agent, AgentContext } from './types';
import type { CustomApi, CustomAuth, CustomMethod, KeyVal } from '../../src/types';
import { SUPPORTED_METHODS } from './util';

export interface ImportInput {
  filename?: string;
  buffer?: Buffer;
  /** Pasted text (cURL / JSON / YAML) when no file was uploaded. */
  text?: string;
  /** Caller hint; otherwise auto-detected. */
  formatHint?: string;
}

export interface ImportResult {
  format: string;
  apis: CustomApi[];
  warnings: string[];
}

type PartialApi = Partial<Omit<CustomApi, 'id' | 'createdAt'>>;

const DEFAULT_BASE = 'https://restful-booker.herokuapp.com';

export class ImportAgent extends Agent<ImportInput, ImportResult> {
  readonly name = 'import';

  constructor(ctx: AgentContext) {
    super(ctx, 'import');
  }

  async run(input: ImportInput): Promise<ImportResult> {
    const warnings: string[] = [];
    const ext = (input.filename ?? '').toLowerCase().split('.').pop() ?? '';
    let parsed: { format: string; apis: PartialApi[] };

    try {
      if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') {
        parsed = { format: ext === 'csv' ? 'csv' : 'excel', apis: this.parseSpreadsheet(input.buffer, ext, warnings) };
      } else if (ext === 'docx') {
        const text = input.buffer ? (await mammoth.extractRawText({ buffer: input.buffer })).value : '';
        parsed = { format: 'word', apis: this.parseText(text, warnings) };
      } else if (ext === 'pdf') {
        const text = input.buffer ? await this.extractPdfText(input.buffer) : '';
        parsed = { format: 'pdf', apis: this.parseText(text, warnings) };
      } else {
        const raw = input.text ?? (input.buffer ? input.buffer.toString('utf-8') : '');
        parsed = this.parseTextual(raw, ext, warnings);
      }
    } catch (err) {
      this.log.error('import failed', { error: (err as Error).message });
      warnings.push(`Import failed: ${(err as Error).message}`);
      parsed = { format: 'unknown', apis: [] };
    }

    const apis = parsed.apis
      .map((p, i) => this.normalise(p, i))
      .filter((a): a is CustomApi => a !== null);
    this.log.info('import parsed', { format: parsed.format, count: apis.length, warnings: warnings.length });
    return { format: parsed.format, apis, warnings };
  }

  /** Extract concatenated text from a PDF buffer (pdf-parse 2.x). */
  private async extractPdfText(buffer: Buffer): Promise<string> {
    const parser = new PDFParse({ data: new Uint8Array(buffer) });
    try {
      const result = await parser.getText();
      return result.text;
    } finally {
      await parser.destroy();
    }
  }

  // ---- Textual dispatch (json/yaml/curl/har) ------------------------------
  private parseTextual(raw: string, ext: string, warnings: string[]): { format: string; apis: PartialApi[] } {
    const trimmed = raw.trim();
    if (!trimmed) {
      warnings.push('Empty input.');
      return { format: 'unknown', apis: [] };
    }

    // YAML OpenAPI.
    if (ext === 'yaml' || ext === 'yml') {
      const doc = loadYaml(trimmed) as Record<string, unknown>;
      return { format: 'openapi', apis: this.parseOpenApi(doc, warnings) };
    }

    // cURL (may be mixed with prose).
    if (/(^|\s)curl\s/.test(trimmed) && !trimmed.startsWith('{') && !trimmed.startsWith('[')) {
      return { format: 'curl', apis: this.parseCurl(trimmed, warnings) };
    }

    // JSON family.
    let doc: unknown;
    try {
      doc = JSON.parse(trimmed);
    } catch {
      // Not JSON — fall back to text heuristics (curl / line table).
      return { format: 'text', apis: this.parseText(trimmed, warnings) };
    }
    return this.parseJsonDoc(doc, warnings);
  }

  /** Route a parsed JSON document to the right sub-parser. */
  private parseJsonDoc(doc: unknown, warnings: string[]): { format: string; apis: PartialApi[] } {
    const obj = doc as Record<string, unknown>;
    if (obj && (obj.openapi || obj.swagger || (obj.paths && typeof obj.paths === 'object'))) {
      return { format: 'openapi', apis: this.parseOpenApi(obj, warnings) };
    }
    if (obj && obj.info && Array.isArray(obj.item)) {
      return { format: 'postman', apis: this.parsePostman(obj, warnings) };
    }
    if (obj && obj.log && typeof obj.log === 'object') {
      return { format: 'har', apis: this.parseHar(obj, warnings) };
    }
    // Array / single CustomApi-shaped record(s).
    const arr = Array.isArray(doc) ? doc : [doc];
    return { format: 'json', apis: arr.map((x) => this.fromLooseRecord(x as Record<string, unknown>)) };
  }

  // ---- OpenAPI / Swagger --------------------------------------------------
  private parseOpenApi(doc: Record<string, unknown>, warnings: string[]): PartialApi[] {
    const apis: PartialApi[] = [];
    const baseUrl = this.openApiBaseUrl(doc);
    const paths = (doc.paths ?? {}) as Record<string, Record<string, unknown>>;
    const secDefault = this.openApiAuth(doc);

    for (const [p, ops] of Object.entries(paths)) {
      for (const [verb, opRaw] of Object.entries(ops)) {
        const method = verb.toUpperCase();
        if (!SUPPORTED_METHODS.includes(method as CustomMethod)) continue;
        const op = (opRaw ?? {}) as Record<string, unknown>;
        const params = (op.parameters ?? []) as Record<string, unknown>[];
        const headers: KeyVal[] = [];
        const query: KeyVal[] = [];
        for (const prm of params) {
          const loc = String(prm.in ?? '');
          const key = String(prm.name ?? '');
          if (!key) continue;
          const example = prm.example !== undefined ? String(prm.example) : '';
          if (loc === 'header') headers.push({ key, value: example });
          else if (loc === 'query') query.push({ key, value: example });
        }
        const expectedStatus = this.openApiSuccessStatus(op);
        apis.push({
          name: String(op.summary || op.operationId || `${method} ${p}`),
          method: method as CustomMethod,
          baseUrl,
          path: p,
          headers,
          query,
          body: this.openApiBody(op),
          auth: secDefault,
          expectedStatus,
        });
      }
    }
    if (apis.length === 0) warnings.push('No operations found in the OpenAPI/Swagger document.');
    return apis;
  }

  private openApiBaseUrl(doc: Record<string, unknown>): string {
    const servers = doc.servers as { url?: string }[] | undefined;
    if (servers?.[0]?.url && /^https?:\/\//i.test(servers[0].url)) return servers[0].url.replace(/\/$/, '');
    // Swagger 2.0
    const host = doc.host as string | undefined;
    if (host) {
      const scheme = ((doc.schemes as string[] | undefined)?.[0]) ?? 'https';
      const basePath = (doc.basePath as string | undefined) ?? '';
      return `${scheme}://${host}${basePath}`.replace(/\/$/, '');
    }
    return DEFAULT_BASE;
  }

  private openApiAuth(doc: Record<string, unknown>): CustomAuth {
    const comps = (doc.components as Record<string, unknown>)?.securitySchemes as Record<string, Record<string, unknown>> | undefined;
    const swagger = doc.securityDefinitions as Record<string, Record<string, unknown>> | undefined;
    const schemes = comps ?? swagger;
    if (!schemes) return 'none';
    for (const s of Object.values(schemes)) {
      const type = String(s.type ?? '').toLowerCase();
      const scheme = String(s.scheme ?? '').toLowerCase();
      if (type === 'http' && scheme === 'bearer') return 'bearer';
      if (type === 'http' && scheme === 'basic') return 'basic';
      if (type === 'basic') return 'basic';
    }
    return 'none';
  }

  private openApiSuccessStatus(op: Record<string, unknown>): number {
    const responses = (op.responses ?? {}) as Record<string, unknown>;
    const codes = Object.keys(responses).map((c) => Number(c)).filter((n) => n >= 200 && n < 300);
    return codes.length ? Math.min(...codes) : 200;
  }

  private openApiBody(op: Record<string, unknown>): string {
    const rb = op.requestBody as Record<string, unknown> | undefined;
    const content = rb?.content as Record<string, Record<string, unknown>> | undefined;
    const json = content?.['application/json'];
    if (json?.example) return JSON.stringify(json.example, null, 2);
    const schema = json?.schema as Record<string, unknown> | undefined;
    if (schema?.example) return JSON.stringify(schema.example, null, 2);
    return '';
  }

  // ---- Postman ------------------------------------------------------------
  private parsePostman(doc: Record<string, unknown>, warnings: string[]): PartialApi[] {
    const apis: PartialApi[] = [];
    const walk = (items: Record<string, unknown>[]): void => {
      for (const item of items) {
        if (Array.isArray(item.item)) {
          walk(item.item as Record<string, unknown>[]);
          continue;
        }
        const req = item.request as Record<string, unknown> | undefined;
        if (!req) continue;
        const method = String(req.method ?? 'GET').toUpperCase();
        const url = req.url as Record<string, unknown> | string | undefined;
        const { baseUrl, path, query } = this.postmanUrl(url);
        const headers: KeyVal[] = [];
        for (const h of (req.header as Record<string, unknown>[] | undefined) ?? []) {
          if (h.disabled) continue;
          headers.push({ key: String(h.key ?? ''), value: String(h.value ?? '') });
        }
        const body = this.postmanBody(req.body as Record<string, unknown> | undefined);
        apis.push({
          name: String(item.name ?? `${method} ${path}`),
          method: SUPPORTED_METHODS.includes(method as CustomMethod) ? (method as CustomMethod) : 'GET',
          baseUrl,
          path,
          headers,
          query,
          body,
          auth: this.postmanAuth(req.auth as Record<string, unknown> | undefined),
          expectedStatus: 200,
        });
      }
    };
    walk((doc.item as Record<string, unknown>[]) ?? []);
    if (apis.length === 0) warnings.push('No requests found in the Postman collection.');
    return apis;
  }

  private postmanUrl(url: Record<string, unknown> | string | undefined): {
    baseUrl: string;
    path: string;
    query: KeyVal[];
  } {
    if (!url) return { baseUrl: DEFAULT_BASE, path: '/', query: [] };
    const raw = typeof url === 'string' ? url : String((url as Record<string, unknown>).raw ?? '');
    const query: KeyVal[] = [];
    if (typeof url === 'object') {
      for (const q of ((url as Record<string, unknown>).query as Record<string, unknown>[] | undefined) ?? []) {
        if (q.disabled) continue;
        query.push({ key: String(q.key ?? ''), value: String(q.value ?? '') });
      }
    }
    return { ...this.splitUrl(raw), query };
  }

  private postmanBody(body: Record<string, unknown> | undefined): string {
    if (!body) return '';
    if (body.mode === 'raw' && typeof body.raw === 'string') return body.raw;
    if (body.mode === 'urlencoded') {
      const obj: Record<string, string> = {};
      for (const kv of (body.urlencoded as Record<string, unknown>[] | undefined) ?? []) {
        obj[String(kv.key)] = String(kv.value ?? '');
      }
      return JSON.stringify(obj, null, 2);
    }
    return '';
  }

  private postmanAuth(auth: Record<string, unknown> | undefined): CustomAuth {
    const t = String(auth?.type ?? '').toLowerCase();
    if (t === 'bearer') return 'bearer';
    if (t === 'basic') return 'basic';
    return 'none';
  }

  // ---- HAR ----------------------------------------------------------------
  private parseHar(doc: Record<string, unknown>, warnings: string[]): PartialApi[] {
    const log = doc.log as Record<string, unknown>;
    const entries = (log.entries as Record<string, unknown>[] | undefined) ?? [];
    const apis: PartialApi[] = [];
    for (const e of entries) {
      const req = e.request as Record<string, unknown> | undefined;
      if (!req) continue;
      const method = String(req.method ?? 'GET').toUpperCase();
      const { baseUrl, path } = this.splitUrl(String(req.url ?? ''));
      const headers: KeyVal[] = [];
      for (const h of (req.headers as Record<string, unknown>[] | undefined) ?? []) {
        const key = String(h.name ?? '');
        if (key.startsWith(':') || /^(host|content-length|cookie)$/i.test(key)) continue;
        headers.push({ key, value: String(h.value ?? '') });
      }
      const query: KeyVal[] = [];
      for (const q of (req.queryString as Record<string, unknown>[] | undefined) ?? []) {
        query.push({ key: String(q.name ?? ''), value: String(q.value ?? '') });
      }
      const postData = req.postData as Record<string, unknown> | undefined;
      apis.push({
        name: `${method} ${path}`,
        method: SUPPORTED_METHODS.includes(method as CustomMethod) ? (method as CustomMethod) : 'GET',
        baseUrl,
        path,
        headers,
        query,
        body: typeof postData?.text === 'string' ? postData.text : '',
        auth: 'none',
        expectedStatus: 200,
      });
    }
    if (apis.length === 0) warnings.push('No entries found in the HAR file.');
    return apis;
  }

  // ---- cURL ---------------------------------------------------------------
  private parseCurl(text: string, warnings: string[]): PartialApi[] {
    // Split on each "curl" invocation (allow line-continuations first).
    const joined = text.replace(/\\\r?\n/g, ' ');
    const commands = joined
      .split(/(?=(?:^|\s)curl\s)/)
      .map((c) => c.trim())
      .filter((c) => /^curl\s/.test(c) || c.startsWith('curl'));
    const apis: PartialApi[] = [];
    for (const cmd of commands) {
      const api = this.parseSingleCurl(cmd);
      if (api) apis.push(api);
    }
    if (apis.length === 0) warnings.push('No cURL commands recognised.');
    return apis;
  }

  private parseSingleCurl(cmd: string): PartialApi | null {
    const tokens = this.tokenize(cmd);
    let method = '';
    let url = '';
    const headers: KeyVal[] = [];
    let body = '';
    let auth: CustomAuth = 'none';
    let bearerToken: string | undefined;

    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i];
      if (t === 'curl') continue;
      if (t === '-X' || t === '--request') {
        method = (tokens[++i] ?? '').toUpperCase();
      } else if (t === '-H' || t === '--header') {
        const h = tokens[++i] ?? '';
        const idx = h.indexOf(':');
        if (idx > 0) {
          const key = h.slice(0, idx).trim();
          const value = h.slice(idx + 1).trim();
          if (/^authorization$/i.test(key) && /^bearer\s+/i.test(value)) {
            auth = 'bearer';
            bearerToken = value.replace(/^bearer\s+/i, '');
          } else {
            headers.push({ key, value });
          }
        }
      } else if (t === '-d' || t === '--data' || t === '--data-raw' || t === '--data-binary') {
        body = tokens[++i] ?? '';
        if (!method) method = 'POST';
      } else if (t === '-u' || t === '--user') {
        auth = 'basic';
        i++; // consume credentials (not stored)
      } else if (t === '--url') {
        url = tokens[++i] ?? '';
      } else if (/^https?:\/\//i.test(t)) {
        url = t;
      }
    }
    if (!url) return null;
    const { baseUrl, path, query } = this.splitUrlWithQuery(url);
    return {
      name: `${method || 'GET'} ${path}`,
      method: (SUPPORTED_METHODS.includes(method as CustomMethod) ? method : 'GET') as CustomMethod,
      baseUrl,
      path,
      headers,
      query,
      body,
      auth,
      bearerToken,
      expectedStatus: 200,
    };
  }

  /** Shell-ish tokenizer honouring single/double quotes. */
  private tokenize(cmd: string): string[] {
    const out: string[] = [];
    const re = /"([^"]*)"|'([^']*)'|(\S+)/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(cmd)) !== null) {
      out.push(m[1] ?? m[2] ?? m[3] ?? '');
    }
    return out;
  }

  // ---- Spreadsheet (Excel / CSV) ------------------------------------------
  private parseSpreadsheet(buffer: Buffer | undefined, ext: string, warnings: string[]): PartialApi[] {
    if (!buffer) return [];
    const wb = XLSX.read(buffer, { type: 'buffer' });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    if (!sheet) {
      warnings.push('The spreadsheet has no sheets.');
      return [];
    }
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });
    const apis = rows.map((r) => this.fromLooseRecord(this.lowerKeys(r))).filter((a) => a.path || a.name);
    if (apis.length === 0) warnings.push('No usable rows found. Expected columns: name, method, baseUrl, path, auth, expectedStatus, headers, query, body.');
    return apis;
  }

  private lowerKeys(r: Record<string, unknown>): Record<string, unknown> {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(r)) out[k.toLowerCase().replace(/[\s_-]+/g, '')] = v;
    return out;
  }

  // ---- Plain text heuristics (Word/PDF/loose text) ------------------------
  private parseText(text: string, warnings: string[]): PartialApi[] {
    const trimmed = text.trim();
    if (!trimmed) {
      warnings.push('No extractable text.');
      return [];
    }
    if (/curl\s/.test(trimmed)) return this.parseCurl(trimmed, warnings);
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        return this.parseJsonDoc(JSON.parse(trimmed), warnings).apis;
      } catch {
        /* fall through */
      }
    }
    // Line table: "METHOD https://host/path [expects NNN]"
    const apis: PartialApi[] = [];
    const lineRe = /\b(GET|POST|PUT|PATCH|DELETE)\b\s+(https?:\/\/\S+|\/\S+)(?:.*?\b(\d{3})\b)?/gi;
    let m: RegExpExecArray | null;
    while ((m = lineRe.exec(trimmed)) !== null) {
      const method = m[1].toUpperCase() as CustomMethod;
      const { baseUrl, path, query } = this.splitUrlWithQuery(m[2]);
      apis.push({
        name: `${method} ${path}`,
        method,
        baseUrl: baseUrl || DEFAULT_BASE,
        path,
        headers: [],
        query,
        body: '',
        auth: 'none',
        expectedStatus: m[3] ? Number(m[3]) : 200,
      });
    }
    if (apis.length === 0) warnings.push('Could not detect any API definitions in the document text.');
    return apis;
  }

  // ---- Normalisation helpers ----------------------------------------------
  private splitUrl(raw: string): { baseUrl: string; path: string } {
    const cleaned = raw.replace(/\{\{[^}]+\}\}/g, ''); // strip Postman {{vars}}
    try {
      const u = new URL(cleaned);
      return { baseUrl: `${u.protocol}//${u.host}`, path: u.pathname || '/' };
    } catch {
      // Relative or templated URL.
      if (cleaned.startsWith('/')) return { baseUrl: DEFAULT_BASE, path: cleaned };
      return { baseUrl: DEFAULT_BASE, path: `/${cleaned.replace(/^\/+/, '')}` };
    }
  }

  private splitUrlWithQuery(raw: string): { baseUrl: string; path: string; query: KeyVal[] } {
    const query: KeyVal[] = [];
    try {
      const u = new URL(raw);
      u.searchParams.forEach((value, key) => query.push({ key, value }));
      return { baseUrl: `${u.protocol}//${u.host}`, path: u.pathname || '/', query };
    } catch {
      const [pathPart, qs] = raw.split('?');
      if (qs) {
        for (const pair of qs.split('&')) {
          const [k, v = ''] = pair.split('=');
          if (k) query.push({ key: decodeURIComponent(k), value: decodeURIComponent(v) });
        }
      }
      const s = this.splitUrl(pathPart);
      return { ...s, query };
    }
  }

  /** Coerce a loose record (spreadsheet row / JSON object) into a PartialApi. */
  private fromLooseRecord(r: Record<string, unknown>): PartialApi {
    const get = (...keys: string[]): string => {
      for (const k of keys) {
        const v = r[k] ?? r[k.toLowerCase()];
        if (v !== undefined && v !== null && String(v).trim() !== '') return String(v).trim();
      }
      return '';
    };
    const rawUrl = get('url', 'endpoint', 'path');
    let baseUrl = get('baseurl', 'base', 'host', 'server');
    let path = get('path', 'endpoint');
    if (!path && rawUrl) {
      if (/^https?:\/\//i.test(rawUrl)) {
        const s = this.splitUrl(rawUrl);
        baseUrl = baseUrl || s.baseUrl;
        path = s.path;
      } else {
        path = rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`;
      }
    }
    const method = get('method', 'verb').toUpperCase();
    const authRaw = get('auth', 'authentication', 'authtype').toLowerCase();
    const auth: CustomAuth = ['none', 'cookie', 'basic', 'bearer'].includes(authRaw)
      ? (authRaw as CustomAuth)
      : 'none';
    const expected = Number(get('expectedstatus', 'expected', 'status', 'statuscode'));
    return {
      name: get('name', 'title', 'summary') || (method && path ? `${method} ${path}` : ''),
      method: (SUPPORTED_METHODS.includes(method as CustomMethod) ? method : 'GET') as CustomMethod,
      baseUrl: baseUrl || DEFAULT_BASE,
      path: path || '/',
      headers: this.parseKvField(get('headers', 'header')),
      query: this.parseKvField(get('query', 'queryparams', 'params')),
      body: get('body', 'payload', 'data'),
      auth,
      bearerToken: get('bearertoken', 'token') || undefined,
      expectedStatus: Number.isFinite(expected) && expected > 0 ? expected : 200,
    };
  }

  /** Parse "k:v;k2:v2" or JSON `{k:v}` into KeyVal[]. */
  private parseKvField(raw: string): KeyVal[] {
    if (!raw) return [];
    const t = raw.trim();
    if (t.startsWith('{')) {
      try {
        const obj = JSON.parse(t) as Record<string, unknown>;
        return Object.entries(obj).map(([key, value]) => ({ key, value: String(value) }));
      } catch {
        /* fall through */
      }
    }
    const out: KeyVal[] = [];
    for (const pair of t.split(/[;\n]+/)) {
      const idx = pair.indexOf(':');
      if (idx > 0) out.push({ key: pair.slice(0, idx).trim(), value: pair.slice(idx + 1).trim() });
    }
    return out;
  }

  /** Finalise a PartialApi into a full CustomApi (id + createdAt + defaults). */
  private normalise(p: PartialApi, index: number): CustomApi | null {
    if (!p.path && !p.name) return null;
    const now = new Date().toISOString();
    return {
      id: `import-${Date.now()}-${index}`,
      name: p.name || `${p.method ?? 'GET'} ${p.path ?? '/'}`,
      method: (p.method ?? 'GET') as CustomMethod,
      baseUrl: p.baseUrl || DEFAULT_BASE,
      path: p.path || '/',
      headers: p.headers ?? [],
      query: p.query ?? [],
      body: p.body ?? '',
      auth: p.auth ?? 'none',
      bearerToken: p.bearerToken,
      expectedStatus: p.expectedStatus ?? 200,
      createdAt: now,
    };
  }
}
