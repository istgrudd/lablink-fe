"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/app/context/SidebarContext';
import { useAuth } from '@/app/context/AuthContext';
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  Calendar,
  Mail,
  Archive,
  ClipboardCheck,
  Clock,
  FileText,
  ChevronLeft,
  ChevronRight,
  User
} from 'lucide-react';

interface MenuItem {
  label: string;
  href: string;
  icon: React.ElementType;
  adminOnly?: boolean;
}

const menuItems: MenuItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Proyek', href: '/dashboard/projects', icon: FolderOpen },
  { label: 'Anggota', href: '/dashboard/members', icon: Users, adminOnly: true },
  { label: 'Kegiatan', href: '/dashboard/events', icon: Calendar },
  { label: 'Surat', href: '/dashboard/letters', icon: Mail },
  { label: 'Arsip', href: '/dashboard/archives', icon: Archive },
  { label: 'Presensi', href: '/dashboard/presence', icon: ClipboardCheck },
  { label: 'Periode', href: '/dashboard/periods', icon: Clock, adminOnly: true },
  { label: 'Activity Log', href: '/dashboard/activity-logs', icon: FileText, adminOnly: true },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const { isAdmin, user } = useAuth();

  const filteredMenu = menuItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-sidebar text-sidebar-foreground flex flex-col shadow-2xl transition-all duration-300 z-50 ${
        isCollapsed ? 'w-24' : 'w-72'
      }`}
    >
      {/* Logo Section - Adaptive Size & Better Contrast */}
      <div className={`flex items-center justify-center border-b border-white/20 transition-all duration-300 ${
        isCollapsed ? 'p-4' : 'p-6'
      }`}>
        <Link href="/dashboard" className="flex items-center gap-3 group">
          {/* Logo with white background for better contrast */}
          <div className={`bg-white rounded-xl p-2 shadow-lg transition-all duration-300 ${
            isCollapsed ? 'w-12 h-12' : 'w-20 h-20'
          }`}>
            <img
              src="/Logo-mbc lab.png"
              alt="MBC Lab"
              className="w-full h-full object-contain group-hover:scale-105 transition-transform"
            />
          </div>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 scrollbar-thin">
        <ul className="space-y-2">
          {filteredMenu.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                    isActive
                      ? 'bg-white/25 text-white font-semibold shadow-lg backdrop-blur-sm'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full" />
                  )}
                  
                  <Icon className={`shrink-0 ${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'} ${isActive ? 'drop-shadow-md' : ''}`} />
                  
                  {!isCollapsed && (
                    <span className="text-sm font-medium truncate">
                      {item.label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Profile Section - New */}
      <div className="p-3 border-t border-white/20">
        <Link
          href="/dashboard/profile"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
            pathname === '/dashboard/profile'
              ? 'bg-white/25 text-white font-semibold'
              : 'text-white/80 hover:bg-white/10 hover:text-white'
          }`}
          title={isCollapsed ? 'Profile' : undefined}
        >
          <User className={`shrink-0 ${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'}`} />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.fullName || 'Profile'}</p>
              <p className="text-xs text-white/60 truncate">{user?.role || 'View Profile'}</p>
            </div>
          )}
        </Link>
      </div>

      {/* Toggle Button - Elegant & Subtle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-sidebar border-2 border-white/30 rounded-full flex items-center justify-center hover:bg-primary hover:scale-110 hover:border-white/50 transition-all duration-200 shadow-lg"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <ChevronRight className="w-3 h-3 text-white" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-white" />
        )}
      </button>
    </aside>
  );
}