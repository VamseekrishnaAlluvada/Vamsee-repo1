import { useMemo, useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table';
import { useStore, useActiveRun } from '@/store/useStore';
import { StatusBadge, MethodBadge, Tag } from '@/components/atoms/Badge';
import { CodeBlock } from '@/components/atoms/CodeBlock';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { cn, formatMs } from '@/lib/utils';
import { ArrowUpDown, RotateCw } from 'lucide-react';
import type { TestRow } from '@/types';

const col = createColumnHelper<TestRow>();

function RowDetail({ row }: { row: TestRow }) {
  const payload = {
    id: row.id,
    suite: row.suite,
    endpoint: `${row.method} ${row.endpoint}`,
    status: row.status,
    durationMs: row.durationMs,
    retryCount: row.retryCount,
    tags: row.tags,
    error: row.error ?? null,
  };
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <MethodBadge method={row.method} />
        <span className="font-mono text-sm text-slate-700">{row.endpoint}</span>
        <StatusBadge status={row.status} />
        {row.retryCount > 0 && (
          <span className="flex items-center gap-1 text-xs text-healed">
            <RotateCw size={12} /> {row.retryCount} retr{row.retryCount === 1 ? 'y' : 'ies'}
          </span>
        )}
      </div>
      <div>
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">Test</p>
        <p className="text-sm text-slate-800">{row.title}</p>
      </div>
      <div>
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">Raw result</p>
        <CodeBlock code={JSON.stringify(payload, null, 2)} language="json" className="max-h-80" />
      </div>
    </div>
  );
}

export function TestGrid() {
  const run = useActiveRun();
  const filters = useStore((s) => s.filters);
  const [sorting, setSorting] = useState<SortingState>([]);

  const data = useMemo(() => {
    const rows = run?.rows ?? [];
    return rows.filter((r) => {
      if (filters.status !== 'all' && r.status !== filters.status) return false;
      if (filters.tag !== 'all' && !r.tags.includes(filters.tag)) return false;
      if (filters.slowOnly && r.durationMs <= 1000) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !r.title.toLowerCase().includes(q) &&
          !r.suite.toLowerCase().includes(q) &&
          !r.endpoint.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [run, filters]);

  const columns = useMemo(
    () => [
      col.accessor('suite', {
        header: 'Suite',
        cell: (c) => <span className="font-medium text-slate-800">{c.getValue()}</span>,
      }),
      col.accessor('endpoint', {
        header: 'Endpoint',
        cell: (c) => (
          <div className="flex items-center gap-2">
            <MethodBadge method={c.row.original.method} />
            <span className="font-mono text-xs text-slate-600">{c.getValue()}</span>
          </div>
        ),
      }),
      col.accessor('status', {
        header: 'Status',
        cell: (c) => <StatusBadge status={c.getValue()} />,
      }),
      col.accessor('durationMs', {
        header: 'Duration',
        cell: (c) => (
          <span className={cn('tabular-nums text-sm', c.getValue() > 1000 ? 'text-warn' : 'text-slate-700')}>
            {formatMs(c.getValue())}
          </span>
        ),
      }),
      col.accessor('retryCount', {
        header: 'Retries',
        cell: (c) =>
          c.getValue() > 0 ? (
            <span className="flex items-center gap-1 text-sm text-healed">
              <RotateCw size={12} /> {c.getValue()}
            </span>
          ) : (
            <span className="text-slate-400">0</span>
          ),
      }),
      col.accessor('tags', {
        header: 'Tags',
        enableSorting: false,
        cell: (c) => (
          <div className="flex flex-wrap gap-1">
            {c.getValue().slice(0, 3).map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        ),
      }),
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="glass overflow-hidden">
      <div className="max-h-[560px] overflow-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="sticky top-0 z-10 bg-surface-2/90 backdrop-blur">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th key={h.id} className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                    <button
                      className={cn('flex items-center gap-1.5', h.column.getCanSort() && 'hover:text-slate-700')}
                      onClick={h.column.getToggleSortingHandler()}
                      disabled={!h.column.getCanSort()}
                    >
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      {h.column.getCanSort() && <ArrowUpDown size={11} className="opacity-50" />}
                    </button>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((r) => (
              <Dialog key={r.id}>
                <DialogTrigger asChild>
                  <tr className="cursor-pointer border-t border-black/5 transition-colors hover:bg-black/5">
                    {r.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                </DialogTrigger>
                <DialogContent title={r.original.title}>
                  <RowDetail row={r.original} />
                </DialogContent>
              </Dialog>
            ))}
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16 text-center text-slate-400">
                  No tests match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
