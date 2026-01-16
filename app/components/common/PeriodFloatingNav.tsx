'use client';

import { useState, useRef, useEffect } from 'react';
import { usePeriod } from '@/app/hooks/usePeriod';

/**
 * Floating navigation button for quick period switching.
 * Prominent design, appears at bottom-right corner.
 */
export default function PeriodFloatingNav() {
  const { periods, selectedPeriod, activePeriod, selectPeriod, isLoading } = usePeriod();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Don't show if no periods or loading
  if (isLoading || periods.length === 0) {
    return null;
  }

  const isViewingOtherPeriod = selectedPeriod && activePeriod && selectedPeriod.id !== activePeriod.id;

  const handleSelectPeriod = (periodId: string | null) => {
    selectPeriod(periodId);
    setIsOpen(false);
  };

  return (
    <div ref={menuRef} className="fixed bottom-6 right-6 z-50">
      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-4 py-3 rounded-full shadow-lg
          font-medium transition-all duration-200
          ${isViewingOtherPeriod 
            ? 'bg-amber-500 hover:bg-amber-600 text-white' 
            : 'bg-blue-600 hover:bg-blue-700 text-white'}
        `}
      >
        <span className="text-lg">📅</span>
        <span>{selectedPeriod?.code || 'Pilih Periode'}</span>
        <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-600">Pilih Periode</span>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {periods.map(period => (
              <button
                key={period.id}
                onClick={() => handleSelectPeriod(period.id)}
                className={`
                  w-full px-4 py-3 text-left flex items-center justify-between
                  hover:bg-gray-50 transition-colors
                  ${selectedPeriod?.id === period.id ? 'bg-blue-50' : ''}
                `}
              >
                <div>
                  <div className="font-medium text-gray-900">{period.code}</div>
                  <div className="text-xs text-gray-500">{period.name}</div>
                </div>
                <div className="flex items-center gap-2">
                  {period.isActive && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                      Aktif
                    </span>
                  )}
                  {period.isArchived && (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                      Arsip
                    </span>
                  )}
                  {selectedPeriod?.id === period.id && (
                    <span className="text-blue-600">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
          
          {/* Back to Active Period */}
          {isViewingOtherPeriod && (
            <div className="border-t border-gray-200">
              <button
                onClick={() => handleSelectPeriod(null)}
                className="w-full px-4 py-3 text-left flex items-center gap-2 text-blue-600 hover:bg-blue-50 font-medium"
              >
                <span>↩</span>
                <span>Kembali ke Periode Aktif</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
