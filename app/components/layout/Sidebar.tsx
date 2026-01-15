'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  Calendar,
  Archive,
  Mail,
  CalendarDays,
  FileText,
  LogOut,
  Zap,
  ChevronRight
} from 'lucide-react';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/members', label: 'Members', icon: Users },
  { href: '/dashboard/projects', label: 'Projects', icon: FolderOpen },
  { href: '/dashboard/events', label: 'Events', icon: Calendar },
  { href: '/dashboard/archives', label: 'Archives', icon: Archive },
  { href: '/dashboard/letters', label: 'Surat', icon: Mail },
  { href: '/dashboard/periods', label: 'Periode', icon: CalendarDays },
  { href: '/dashboard/activity-logs', label: 'Activity Log', icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isProfilePage = pathname === '/dashboard/profile';

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white min-h-screen flex flex-col shadow-2xl">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              LabLink
            </h1>
            <p className="text-xs text-slate-400">Research Lab</p>
          </div>
        </div>
      </div>

      {/* User Profile Card - Clickable */}
      <div className="p-4 border-b border-slate-700/50">
        <Link
          href="/dashboard/profile"
          className={`group block p-4 rounded-xl transition-all duration-300 transform hover:scale-102 ${
            isProfilePage
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg'
              : 'bg-gradient-to-r from-slate-800/50 to-slate-700/50 hover:from-slate-700/70 hover:to-slate-600/70 border border-slate-600/30'
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center font-bold text-lg shadow-lg">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate text-white">{user?.fullName || 'User'}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium inline-block ${
                user?.role === 'ADMIN' 
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900' 
                  : 'bg-gradient-to-r from-blue-400 to-cyan-400 text-blue-900'
              }`}>
                {user?.role || 'GUEST'}
              </span>
            </div>
            <ChevronRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${
              isProfilePage ? 'text-white' : 'text-slate-400'
            }`} />
          </div>
          <p className="text-xs text-slate-300 group-hover:text-white transition-colors">
            Klik untuk lihat profile
          </p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                transition-all duration-200 transform
                ${isActive 
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg scale-105' 
                  : 'text-slate-300 hover:bg-slate-800/50 hover:text-white hover:scale-102 hover:translate-x-1'
                }
              `}
            >
              <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'animate-pulse' : ''}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-700/50">
        <button
          onClick={handleLogout}
          className="w-full group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-300 hover:bg-red-900/30 hover:text-red-200 transition-all duration-200 transform hover:scale-102 border border-red-900/20 hover:border-red-700/50"
        >
          <LogOut className="w-5 h-5 transition-transform group-hover:scale-110 group-hover:rotate-12" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
