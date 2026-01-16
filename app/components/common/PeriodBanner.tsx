'use client';

import { useState, useEffect } from 'react';
import { usePeriod } from '@/app/hooks/usePeriod';

/**
 * Banner that appears when viewing a non-active period.
 * Dismissable by the user.
 */
export default function PeriodBanner() {
  const { selectedPeriod, activePeriod, isReadOnly } = usePeriod();
  const [isDismissed, setIsDismissed] = useState(false);

  // Reset dismissed state when period changes
  useEffect(() => {
    setIsDismissed(false);
  }, [selectedPeriod?.id]);

  // Don't show if viewing active period or already dismissed
  const isViewingOtherPeriod = selectedPeriod && activePeriod && selectedPeriod.id !== activePeriod.id;
  if (!isViewingOtherPeriod || isDismissed) {
    return null;
  }

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-amber-600 text-lg">⚠️</span>
          <div>
            <span className="font-medium text-amber-800">
              Melihat data periode {selectedPeriod.code}
            </span>
            {isReadOnly && (
              <span className="text-amber-600 ml-2 text-sm">
                (Arsip - Read Only)
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-amber-600 hover:text-amber-800 transition-colors p-1"
          aria-label="Tutup banner"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
