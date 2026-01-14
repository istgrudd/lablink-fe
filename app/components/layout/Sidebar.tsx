'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/dashboard/members', label: 'Members', icon: '👥' },
  { href: '/dashboard/projects', label: 'Projects', icon: '📁' },
  { href: '/dashboard/events', label: 'Events', icon: '📅' },
  { href: '/dashboard/archives', label: 'Archives', icon: '📦' },
  { href: '/dashboard/letters', label: 'Surat', icon: '✉️' },
  { href: '/dashboard/periods', label: 'Periode', icon: '📆' },
  { href: '/dashboard/activity-logs', label: 'Activity Log', icon: '📋' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          LabLink
        </h1>
        <p className="text-xs text-slate-400 mt-1">Research Lab Management</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/dashboard' && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-200
                ${isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }
              `}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Admin</p>
            <p className="text-xs text-slate-400 truncate">admin@lab.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
