import { useEffect, useState } from 'react';
import { useStore, useActiveRun } from '@/store/useStore';
import { EnvSwitcher } from '@/components/molecules/EnvSwitcher';
import { Tooltip } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Download, Loader2, Sparkles } from 'lucide-react';

const PAGE_TITLES: Record<string, string> = {
  mission: 'Mission Control',
  execution: 'Test Execution & Timeline',
  runner: 'API Runner · Pipeline',
  healer: "The Healer's Log",
};

export function TopBar() {
  const run = useActiveRun();
  const env = useStore((s) => s.env);
  const aurora = useStore((s) => s.aurora);
  const toggleAurora = useStore((s) => s.toggleAurora);
  const activePage = useStore((s) => s.activePage);
  const [now, setNow] = useState(() => new Date());
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  async function exportPdf() {
    setExporting(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);
      const el = document.getElementById('dashboard-capture');
      if (!el) return;
      const canvas = await html2canvas(el, { backgroundColor: '#0B0E14', scale: 2 });
      const img = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width, canvas.height] });
      pdf.addImage(img, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`dashboard-${env}-${Date.now()}.pdf`);
    } finally {
      setExporting(false);
    }
  }

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-black/10 bg-base/40 px-6 py-4 backdrop-blur-[24px]">
      <div>
        <h1 className="heading text-xl">
          {PAGE_TITLES[activePage]}{' '}
          <span className="grad-text">
            · {env.charAt(0).toUpperCase() + env.slice(1)} Environment
          </span>
        </h1>
        <p className="text-xs text-slate-500">
          API {run?.apiVersion ?? '—'} · {now.toLocaleDateString()}{' '}
          <span className="tabular-nums text-slate-600">{now.toLocaleTimeString()}</span>
        </p>
      </div>

      <div className="flex items-center gap-3">
        <EnvSwitcher />
        <Tooltip content={aurora ? 'Aurora mode: on' : 'Aurora mode: off'}>
          <button
            onClick={toggleAurora}
            className={cn(
              'grid h-9 w-9 place-items-center rounded-xl border border-black/10 transition-all duration-200 hover:scale-[1.05]',
              aurora ? 'bg-grad-violet text-white shadow-glow-violet' : 'bg-surface/60 text-slate-600',
            )}
          >
            <Sparkles size={16} />
          </button>
        </Tooltip>
        <button
          onClick={exportPdf}
          disabled={exporting}
          className="flex items-center gap-2 rounded-xl bg-grad-cyan px-3.5 py-2 text-sm font-medium text-white shadow-glow-cyan transition-all duration-200 hover:scale-[1.03] disabled:opacity-60"
        >
          {exporting ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
          Export PDF
        </button>
      </div>
    </header>
  );
}
