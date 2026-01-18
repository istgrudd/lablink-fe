"use client";

import { useRouter } from 'next/navigation';
import { api } from '@/app/lib/api';
import { useAuth } from '@/app/context/AuthContext';
import { useLanguage } from '@/app/context/LanguageContext';
import { useTheme } from 'next-themes';
import { Moon, Sun, Globe, LogOut } from 'lucide-react'; 
import { useState, useEffect } from 'react';

export default function Header() {
  const router = useRouter();
  const { user } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Mencegah error hydration (perbedaan render server vs client)
  useEffect(() => setMounted(true), []);

  const handleLogout = () => {
    api.clearToken();
    router.push('/login');
  };

  if (!mounted) return null;

  // Format tanggal bahasa Indonesia (dari kodemu)
  const currentDate = new Date().toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 h-16 px-6 flex items-center justify-between sticky top-0 z-10 transition-colors">
      
      {/* KIRI: Sapaan & Tanggal */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          {t('welcome')} <span className="text-primary">{user?.username || 'Admin'}</span> 👋
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {currentDate}
        </p>
      </div>

      {/* KANAN: Controls (Bahasa, Tema, Logout) */}
      <div className="flex items-center gap-3">
        
        {/* Toggle Bahasa */}
        <button 
          onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1 transition-colors"
          title="Ganti Bahasa"
        >
          <Globe size={18} />
          <span className="hidden sm:inline">{language.toUpperCase()}</span>
        </button>

        {/* Toggle Dark Mode */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 transition-colors"
          title="Ganti Tema"
        >
          {theme === 'dark' ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} />}
        </button>

        <div className="h-6 w-px bg-gray-200 dark:bg-slate-600 mx-1"></div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">{t('logout')}</span>
        </button>
      </div>
    </header>
  );
}