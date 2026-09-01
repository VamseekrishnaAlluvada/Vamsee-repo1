import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { api } from '@/lib/api';
import { GlowCard } from '@/components/atoms/GlowCard';
import { MethodBadge } from '@/components/atoms/Badge';
import { ImportDialog } from '@/components/organisms/ImportDialog';
import { cn } from '@/lib/utils';
import {
  AlertTriangle,
  Braces,
  Loader2,
  Plus,
  Rocket,
  ShieldCheck,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import type {
  CustomApi,
  CustomAuth,
  CustomMethod,
  KeyVal,
  ValidationResult,
} from '@/types';

const METHODS: CustomMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
const AUTHS: { id: CustomAuth; label: string }[] = [
  { id: 'none', label: 'None' },
  { id: 'cookie', label: 'Cookie token' },
  { id: 'basic', label: 'Basic' },
  { id: 'bearer', label: 'Bearer' },
];

interface FormState {
  id?: string;
  name: string;
  method: CustomMethod;
  baseUrl: string;
  path: string;
  auth: CustomAuth;
  bearerToken: string;
  expectedStatus: number;
  headers: KeyVal[];
  query: KeyVal[];
  body: string;
}

const BLANK: FormState = {
  name: 'Get all bookings',
  method: 'GET',
  baseUrl: 'https://restful-booker.herokuapp.com',
  path: '/booking',
  auth: 'none',
  bearerToken: '',
  expectedStatus: 200,
  headers: [],
  query: [],
  body: '',
};

// -------------------------------------------------------------------------
// Small building blocks
// -------------------------------------------------------------------------
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-500">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  'w-full rounded-lg border border-black/10 bg-base/50 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-violet/50 focus:outline-none';

function KeyValEditor({
  rows,
  onChange,
  label,
}: {
  rows: KeyVal[];
  onChange: (rows: KeyVal[]) => void;
  label: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{label}</span>
        <button
          type="button"
          onClick={() => onChange([...rows, { key: '', value: '' }])}
          className="flex items-center gap-1 text-xs text-violet transition-colors hover:text-pink"
        >
          <Plus size={12} /> Add
        </button>
      </div>
      <div className="space-y-2">
        {rows.length === 0 && <p className="text-xs text-slate-400">None</p>}
        {rows.map((r, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              className={inputCls}
              placeholder="key"
              value={r.key}
              onChange={(e) => onChange(rows.map((x, j) => (j === i ? { ...x, key: e.target.value } : x)))}
            />
            <input
              className={inputCls}
              placeholder="value"
              value={r.value}
              onChange={(e) => onChange(rows.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))}
            />
            <button
              type="button"
              onClick={() => onChange(rows.filter((_, j) => j !== i))}
              className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-fail/10 hover:text-fail"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------------------
// Page
// -------------------------------------------------------------------------
export function ApiRunner() {
  const customApis = useStore((s) => s.customApis);
  const pipeline = useStore((s) => s.pipeline);
  const startPipeline = useStore((s) => s.startPipeline);

  const [form, setForm] = useState<FormState>(BLANK);
  const [importOpen, setImportOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setValidation(null); // any edit invalidates the last check
  };
  const hasBody = form.method === 'POST' || form.method === 'PUT' || form.method === 'PATCH';

  /** Client-side structural pre-check before hitting the server probe. */
  function localCheck(): string | null {
    if (!form.name.trim()) return 'API is not valid: a name is required';
    if (!form.path.trim()) return 'API is not valid: a path or URL is required';
    try {
      const raw = /^https?:\/\//i.test(form.path)
        ? form.path
        : `${form.baseUrl.replace(/\/$/, '')}${form.path.startsWith('/') ? form.path : `/${form.path}`}`;
      // eslint-disable-next-line no-new
      new URL(raw);
    } catch {
      return 'API is not valid: the base URL + path is not a well-formed URL';
    }
    if (hasBody && form.body.trim()) {
      try {
        JSON.parse(form.body);
      } catch {
        return 'API is not valid: the request body is not valid JSON';
      }
    }
    return null;
  }

  async function validate(): Promise<boolean> {
    const local = localCheck();
    if (local) {
      setValidation({ valid: false, reason: local });
      return false;
    }
    setValidating(true);
    setError(null);
    try {
      const result = await api.validateApi(form);
      setValidation(result);
      return result.valid;
    } catch (e) {
      setValidation({ valid: false, reason: `API is not valid: ${(e as Error).message}` });
      return false;
    } finally {
      setValidating(false);
    }
  }

  async function save() {
    // Checkpoint: an invalid API is never saved.
    const ok = await validate();
    if (!ok) return;
    setSaving(true);
    setError(null);
    try {
      await api.saveCustomApi(form);
      setForm(BLANK); // socket refreshes the list
      setValidation(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  function editApi(a: CustomApi) {
    setForm({
      id: a.id,
      name: a.name,
      method: a.method,
      baseUrl: a.baseUrl,
      path: a.path,
      auth: a.auth,
      bearerToken: a.bearerToken ?? '',
      expectedStatus: a.expectedStatus,
      headers: a.headers,
      query: a.query,
      body: a.body,
    });
  }

  async function run(a: CustomApi) {
    try {
      const { runId } = await api.runPipeline(a.id);
      startPipeline(runId, a.id);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function remove(id: string) {
    await api.deleteCustomApi(id);
  }

  return (
    <div className="space-y-5">
      <ImportDialog open={importOpen} onOpenChange={setImportOpen} />
      <div className="grid grid-cols-1 gap-5">
        {/* ---- Form ---- */}
        <GlowCard className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-violet/15 p-1.5 text-violet">
                <Braces size={16} />
              </span>
              <h3 className="heading text-sm">{form.id ? 'Edit API' : 'Add an API'}</h3>
            </div>
            <button
              onClick={() => setImportOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-violet/30 bg-violet/5 px-3 py-1.5 text-xs font-medium text-violet transition-all duration-200 hover:bg-violet/10"
            >
              <Upload size={14} /> Import APIs
            </button>
          </div>

          <Field label="Name">
            <input className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Get all bookings" />
          </Field>

          <div className="grid grid-cols-[120px_1fr] gap-3">
            <Field label="Method">
              <select className={inputCls} value={form.method} onChange={(e) => set('method', e.target.value as CustomMethod)}>
                {METHODS.map((m) => (
                  <option key={m} value={m} className="bg-surface">
                    {m}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Path">
              <input className={inputCls} value={form.path} onChange={(e) => set('path', e.target.value)} placeholder="/booking" />
            </Field>
          </div>

          <Field label="Base URL">
            <input className={inputCls} value={form.baseUrl} onChange={(e) => set('baseUrl', e.target.value)} />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Auth">
              <select className={inputCls} value={form.auth} onChange={(e) => set('auth', e.target.value as CustomAuth)}>
                {AUTHS.map((a) => (
                  <option key={a.id} value={a.id} className="bg-surface">
                    {a.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Expected status">
              <input
                type="number"
                className={inputCls}
                value={form.expectedStatus}
                onChange={(e) => set('expectedStatus', Number(e.target.value))}
              />
            </Field>
          </div>

          {form.auth === 'bearer' && (
            <Field label="Bearer token">
              <input className={inputCls} value={form.bearerToken} onChange={(e) => set('bearerToken', e.target.value)} placeholder="eyJhbGc…" />
            </Field>
          )}

          <KeyValEditor label="Headers" rows={form.headers} onChange={(r) => set('headers', r)} />
          <KeyValEditor label="Query params" rows={form.query} onChange={(r) => set('query', r)} />

          {hasBody && (
            <Field label="Body (JSON)">
              <textarea
                className={cn(inputCls, 'h-28 resize-y font-mono text-xs')}
                value={form.body}
                onChange={(e) => set('body', e.target.value)}
                placeholder={'{\n  "firstname": "Jim"\n}'}
              />
            </Field>
          )}

          {/* Validity checkpoint result */}
          {validation && (
            <div
              className={cn(
                'flex items-start gap-2 rounded-xl border p-3 text-xs',
                validation.valid ? 'border-ok/30 bg-ok/5 text-ok' : 'border-fail/30 bg-fail/5 text-fail',
              )}
            >
              {validation.valid ? (
                <ShieldCheck size={15} className="mt-0.5 shrink-0" />
              ) : (
                <AlertTriangle size={15} className="mt-0.5 shrink-0" />
              )}
              <div>
                <p className="font-medium">{validation.reason}</p>
                {validation.url && (
                  <p className="mt-0.5 font-mono text-[11px] opacity-70">
                    {validation.url}
                    {validation.responseTimeMs !== undefined && ` · ${validation.responseTimeMs}ms`}
                  </p>
                )}
              </div>
            </div>
          )}

          {error && <p className="rounded-lg bg-fail/10 p-2 text-xs text-fail">{error}</p>}

          <div className="flex flex-wrap gap-2">
            <button
              onClick={validate}
              disabled={validating || !form.name || !form.path}
              className="flex items-center gap-2 rounded-xl border border-black/10 bg-base/50 px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-black/5 disabled:opacity-50"
            >
              {validating ? <Loader2 size={15} className="animate-spin" /> : <ShieldCheck size={15} />}
              Validate
            </button>
            <button
              onClick={save}
              disabled={saving || validating || !form.name || !form.path}
              className="flex items-center gap-2 rounded-xl bg-grad-violet px-4 py-2 text-sm font-medium text-white shadow-glow-violet transition-all duration-200 hover:scale-[1.03] disabled:opacity-50"
            >
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
              {form.id ? 'Update API' : 'Save API'}
            </button>
            {form.id && (
              <button onClick={() => setForm(BLANK)} className="rounded-xl border border-black/10 px-4 py-2 text-sm text-slate-600 hover:bg-black/5">
                Cancel
              </button>
            )}
          </div>
        </GlowCard>
      </div>

      {/* ---- Saved APIs ---- */}
      <GlowCard glow="none">
        <h3 className="heading mb-3 text-sm">Saved APIs ({customApis.length})</h3>
        {customApis.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">No APIs yet. Add one above and press Run Automation.</p>
        ) : (
          <div className="space-y-2">
            {customApis.map((a) => {
              const isRunning = pipeline.running && pipeline.apiId === a.id;
              return (
                <div
                  key={a.id}
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-black/5 bg-base/40 p-3 transition-colors hover:border-black/15"
                >
                  <MethodBadge method={a.method} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">{a.name}</p>
                    <p className="truncate font-mono text-xs text-slate-500">
                      {a.baseUrl.replace(/^https?:\/\//, '')}
                      {a.path} · expect {a.expectedStatus} · {a.auth}
                    </p>
                  </div>
                  <button
                    onClick={() => run(a)}
                    disabled={pipeline.running}
                    className="flex items-center gap-2 rounded-lg bg-grad-cyan px-3 py-1.5 text-xs font-medium text-white shadow-glow-cyan transition-all duration-200 hover:scale-[1.03] disabled:opacity-50"
                  >
                    {isRunning ? <Loader2 size={13} className="animate-spin" /> : <Rocket size={13} />}
                    Run Automation
                  </button>
                  <button onClick={() => editApi(a)} className="rounded-lg border border-black/10 px-3 py-1.5 text-xs text-slate-600 hover:bg-black/5">
                    Edit
                  </button>
                  <button
                    onClick={() => remove(a.id)}
                    className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-fail/10 hover:text-fail"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </GlowCard>
    </div>
  );
}
