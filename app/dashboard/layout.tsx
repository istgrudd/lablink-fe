"use client";

import Sidebar from '@/app/components/layout/Sidebar';
import Header from '@/app/components/layout/Header';
import { SidebarProvider, useSidebar } from '@/app/context/SidebarContext';

// Inner Component - Menggunakan hook useSidebar
function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex min-h-screen bg-background transition-colors duration-300">
      {/* Sidebar - Fixed Position */}
      <Sidebar />

      {/* Main Content Area */}
      {/* Margin kiri harus sinkron dengan lebar sidebar */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isCollapsed ? 'ml-24' : 'ml-72'
        }`}
      >
        {/* Header */}
        <Header />
        
        {/* Page Content */}
        <main className="flex-1 p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

// Outer Component - Provider Wrapper
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardContent>
        {children}
      </DashboardContent>
    </SidebarProvider>
  );
}