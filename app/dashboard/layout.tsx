'use client';

import Sidebar from '@/app/components/layout/Sidebar';
import Header from '@/app/components/layout/Header';
import { PeriodProvider } from '@/app/hooks/usePeriod';
import PeriodBanner from '@/app/components/common/PeriodBanner';
import PeriodFloatingNav from '@/app/components/common/PeriodFloatingNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PeriodProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <PeriodBanner />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
      <PeriodFloatingNav />
    </PeriodProvider>
  );
}
