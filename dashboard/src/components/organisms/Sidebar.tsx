import { useStore, type PageId } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { Activity, BookOpen, ChevronLeft, ClipboardList, GaugeCircle, Rocket, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const NAV: { id: PageId; label: string; icon: LucideIcon }[] = [
  { id: 'mission', label: 'Mission Control', icon: GaugeCircle },
  { id: 'execution', label: 'Execution', icon: Activity },
  { id: 'runner', label: 'API Runner', icon: Rocket },
  { id: 'results', label: 'Results', icon: ClipboardList },
  { id: 'playbook', label: 'SDET Playbook', icon: BookOpen },
];

export function Sidebar() {
  const { activePage, setPage, sidebarCollapsed, toggleSidebar, connected } = useStore();
  return (
    <aside
      className={cn(
        'sticky top-0 flex h-screen flex-col border-r border-black/10 bg-surface/40 backdrop-blur-[24px] transition-all duration-300',
        sidebarCollapsed ? 'w-[72px]' : 'w-[200px]',
      )}
    >
      <div className="flex items-center gap-2.5 px-4 py-5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-grad-mixed shadow-glow-violet">
          <Zap size={18} className="text-white" />
        </span>
        {!sidebarCollapsed && (
          <div className="leading-tight">
            <div className="heading text-sm">Control Plane</div>
            <div className="text-[10px] text-slate-500">API Automation</div>
          </div>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {NAV.map((item) => {
          const active = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={cn(
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-grad-violet text-white shadow-glow-violet'
                  : 'text-slate-600 hover:bg-black/5 hover:text-slate-900',
              )}
            >
              <item.icon size={18} className="shrink-0" />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="px-3 pb-3">
        <div
          className={cn(
            'mb-2 flex items-center gap-2 rounded-xl border border-black/10 px-3 py-2 text-xs',
            connected ? 'text-ok' : 'text-slate-500',
          )}
        >
          <span className={cn('h-2 w-2 rounded-full', connected ? 'bg-ok animate-breathe' : 'bg-slate-600')} />
          {!sidebarCollapsed && (connected ? 'Live · connected' : 'Offline')}
        </div>
        <button
          onClick={toggleSidebar}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-black/10 py-2 text-xs text-slate-600 transition-colors hover:bg-black/5 hover:text-slate-900"
        >
          <ChevronLeft size={15} className={cn('transition-transform', sidebarCollapsed && 'rotate-180')} />
          {!sidebarCollapsed && 'Collapse'}
        </button>
      </div>
    </aside>
  );
}
