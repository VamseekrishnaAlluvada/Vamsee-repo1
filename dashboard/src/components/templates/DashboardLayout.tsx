import { AuroraBackground } from '@/components/organisms/AuroraBackground';
import { Sidebar } from '@/components/organisms/Sidebar';
import { TopBar } from '@/components/organisms/TopBar';
import type { ReactNode } from 'react';

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen">
      <AuroraBackground />
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main id="dashboard-capture" className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
