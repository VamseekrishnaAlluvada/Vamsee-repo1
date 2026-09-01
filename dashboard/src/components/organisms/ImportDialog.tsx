import { useRef, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { MethodBadge } from '@/components/atoms/Badge';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import {
  AlertTriangle,
  CheckSquare,
  FileUp,
  Loader2,
  Square,
  UploadCloud,
} from 'lucide-react';
import type { CustomApi } from '@/types';

const ACCEPT =
  '.json,.yaml,.yml,.har,.txt,.sh,.csv,.xlsx,.xls,.docx,.pdf,application/json,text/csv,application/pdf';

const FORMAT_HINTS = [
  'OpenAPI / Swagger (.json/.yaml)',
  'Postman collection',
  'cURL',
  'HAR',
  'Excel / CSV',
  'Word (.docx)',
  'PDF',
];

export function ImportDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [format, setFormat] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [parsed, setParsed] = useState<CustomApi[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [dragging, setDragging] = useState(false);
  const [pasteMode, setPasteMode] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  function reset() {
    setFormat(null);
    setWarnings([]);
    setParsed([]);
    setSelected(new Set());
    setError(null);
    setPasteText('');
    setPasteMode(false);
  }

  function ingest(res: { format: string; apis: CustomApi[]; warnings: string[] }) {
    setFormat(res.format);
    setWarnings(res.warnings);
    setParsed(res.apis);
    setSelected(new Set(res.apis.map((_, i) => i)));
    if (res.apis.length === 0 && res.warnings.length === 0) {
      setError('No API definitions were found in that input.');
    }
  }

  async function handleFile(file: File) {
    setBusy(true);
    setError(null);
    try {
      ingest(await api.importFile(file));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function handlePaste() {
    if (!pasteText.trim()) return;
    setBusy(true);
    setError(null);
    try {
      ingest(await api.importText(pasteText));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function toggle(i: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  async function importSelected() {
    const apis = parsed.filter((_, i) => selected.has(i));
    if (apis.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      await api.bulkSave(apis); // socket refreshes the saved list
      reset();
      onOpenChange(false);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) reset();
        onOpenChange(o);
      }}
    >
      <DialogContent title="Import APIs">
        {parsed.length === 0 ? (
          <div className="space-y-4">
            {/* Drop zone */}
            {!pasteMode && (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  const f = e.dataTransfer.files?.[0];
                  if (f) void handleFile(f);
                }}
                onClick={() => fileRef.current?.click()}
                className={cn(
                  'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 text-center transition-colors',
                  dragging ? 'border-violet bg-violet/5' : 'border-black/15 hover:border-violet/50 hover:bg-black/[0.02]',
                )}
              >
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-grad-violet text-white shadow-glow-violet">
                  {busy ? <Loader2 size={24} className="animate-spin" /> : <UploadCloud size={24} />}
                </span>
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    Drop a file here or <span className="text-violet">browse</span>
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    The importer auto-detects the format and picks up every field.
                  </p>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept={ACCEPT}
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void handleFile(f);
                    e.target.value = '';
                  }}
                />
              </div>
            )}

            {/* Paste mode */}
            {pasteMode && (
              <div className="space-y-2">
                <textarea
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  placeholder={'Paste a cURL command, OpenAPI/Swagger JSON/YAML, a Postman collection, or a HAR…'}
                  className="h-48 w-full resize-y rounded-xl border border-black/10 bg-base/50 p-3 font-mono text-xs text-slate-800 focus:border-violet/50 focus:outline-none"
                />
                <button
                  onClick={handlePaste}
                  disabled={busy || !pasteText.trim()}
                  className="flex items-center gap-2 rounded-xl bg-grad-violet px-4 py-2 text-sm font-medium text-white shadow-glow-violet transition-all hover:scale-[1.02] disabled:opacity-50"
                >
                  {busy ? <Loader2 size={15} className="animate-spin" /> : <FileUp size={15} />}
                  Parse text
                </button>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1.5">
                {FORMAT_HINTS.map((f) => (
                  <span key={f} className="rounded-md bg-black/5 px-1.5 py-0.5 text-[10px] text-slate-500">
                    {f}
                  </span>
                ))}
              </div>
              <button
                onClick={() => {
                  reset();
                  setPasteMode((m) => !m);
                }}
                className="shrink-0 text-xs font-medium text-violet hover:text-pink"
              >
                {pasteMode ? 'Upload a file' : 'Paste text instead'}
              </button>
            </div>

            {error && <p className="rounded-lg bg-fail/10 p-2 text-xs text-fail">{error}</p>}
          </div>
        ) : (
          /* ---- Preview + select ---- */
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-slate-700">
                Detected <span className="font-semibold text-violet">{format}</span> · {parsed.length} API
                {parsed.length === 1 ? '' : 's'} found
              </p>
              <button
                onClick={() =>
                  setSelected(selected.size === parsed.length ? new Set() : new Set(parsed.map((_, i) => i)))
                }
                className="text-xs font-medium text-violet hover:text-pink"
              >
                {selected.size === parsed.length ? 'Deselect all' : 'Select all'}
              </button>
            </div>

            {warnings.length > 0 && (
              <div className="flex items-start gap-2 rounded-lg bg-warn/10 p-2 text-xs text-warn">
                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                <ul className="space-y-0.5">
                  {warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="max-h-[46vh] space-y-2 overflow-auto pr-1">
              {parsed.map((a, i) => {
                const on = selected.has(i);
                return (
                  <button
                    key={i}
                    onClick={() => toggle(i)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors',
                      on ? 'border-violet/40 bg-violet/5' : 'border-black/10 bg-base/40 hover:border-black/20',
                    )}
                  >
                    {on ? <CheckSquare size={16} className="shrink-0 text-violet" /> : <Square size={16} className="shrink-0 text-slate-400" />}
                    <MethodBadge method={a.method} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-800">{a.name}</p>
                      <p className="truncate font-mono text-[11px] text-slate-500">
                        {a.baseUrl.replace(/^https?:\/\//, '')}
                        {a.path} · expect {a.expectedStatus} · {a.auth}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {error && <p className="rounded-lg bg-fail/10 p-2 text-xs text-fail">{error}</p>}

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={reset}
                className="rounded-xl border border-black/10 px-4 py-2 text-sm text-slate-600 hover:bg-black/5"
              >
                Back
              </button>
              <button
                onClick={importSelected}
                disabled={busy || selected.size === 0}
                className="flex items-center gap-2 rounded-xl bg-grad-violet px-4 py-2 text-sm font-medium text-white shadow-glow-violet transition-all hover:scale-[1.02] disabled:opacity-50"
              >
                {busy ? <Loader2 size={15} className="animate-spin" /> : <FileUp size={15} />}
                Import {selected.size} selected
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
