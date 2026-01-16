'use client';

import { usePeriod } from '@/app/hooks/usePeriod';
import Select from '@/app/components/ui/Select';

// ============================================
// Types
// ============================================

interface PeriodSelectorProps {
  /** Additional CSS classes */
  className?: string;
  /** Show loading skeleton when periods are loading */
  showSkeleton?: boolean;
  /** Callback when period changes */
  onPeriodChange?: (periodId: string) => void;
}

// ============================================
// Component
// ============================================

/**
 * Reusable period selector dropdown.
 * Uses the global PeriodContext to manage selection.
 * 
 * @example
 * <PeriodSelector onPeriodChange={(id) => refetchData(id)} />
 */
export default function PeriodSelector({
  className = '',
  showSkeleton = true,
  onPeriodChange,
}: PeriodSelectorProps) {
  const { periods, selectedPeriod, isLoading, selectPeriod } = usePeriod();

  // Handle selection change
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const periodId = e.target.value;
    selectPeriod(periodId);
    onPeriodChange?.(periodId);
  };

  // Loading state
  if (isLoading && showSkeleton) {
    return (
      <div className={`w-48 h-10 bg-gray-200 animate-pulse rounded-xl ${className}`} />
    );
  }

  // No periods available
  if (periods.length === 0) {
    return (
      <div className={`text-sm text-gray-500 ${className}`}>
        Tidak ada periode
      </div>
    );
  }

  // Build options with status indicators
  const options = periods.map(period => ({
    value: period.id,
    label: `${period.code}${period.isActive ? ' ✓' : period.isArchived ? ' (Arsip)' : ''}`,
  }));

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-gray-500 whitespace-nowrap">Periode:</span>
      <Select
        value={selectedPeriod?.id || ''}
        onChange={handleChange}
        options={options}
      />
    </div>
  );
}
