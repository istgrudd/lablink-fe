'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { api } from '@/app/lib/api';
import { Period } from '@/app/types';

// ============================================
// Types
// ============================================

interface PeriodContextValue {
  // State
  periods: Period[];
  activePeriod: Period | null;
  selectedPeriod: Period | null;
  isLoading: boolean;
  error: string | null;
  
  // Computed
  isReadOnly: boolean;
  
  // Actions
  selectPeriod: (periodId: string | null) => void;
  refreshPeriods: () => Promise<void>;
}

// ============================================
// Context
// ============================================

const PeriodContext = createContext<PeriodContextValue | undefined>(undefined);

// ============================================
// Provider
// ============================================

interface PeriodProviderProps {
  children: ReactNode;
}

export function PeriodProvider({ children }: PeriodProviderProps) {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [activePeriod, setActivePeriod] = useState<Period | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<Period | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all periods and determine active
  const fetchPeriods = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const allPeriods = await api.get<Period[]>('/periods');
      setPeriods(allPeriods);
      
      // Find active period
      const active = allPeriods.find(p => p.isActive) || null;
      setActivePeriod(active);
      
      // Default selection is active period
      if (!selectedPeriod && active) {
        setSelectedPeriod(active);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat periode');
    } finally {
      setIsLoading(false);
    }
  }, [selectedPeriod]);

  // Initial fetch
  useEffect(() => {
    fetchPeriods();
  }, []);

  // Select a specific period
  const selectPeriod = useCallback((periodId: string | null) => {
    if (!periodId) {
      setSelectedPeriod(activePeriod);
      return;
    }
    const period = periods.find(p => p.id === periodId) || null;
    setSelectedPeriod(period);
  }, [periods, activePeriod]);

  // Computed: is current selection read-only?
  const isReadOnly = selectedPeriod?.isArchived ?? false;

  // Context value
  const value: PeriodContextValue = {
    periods,
    activePeriod,
    selectedPeriod,
    isLoading,
    error,
    isReadOnly,
    selectPeriod,
    refreshPeriods: fetchPeriods,
  };

  return (
    <PeriodContext.Provider value={value}>
      {children}
    </PeriodContext.Provider>
  );
}

// ============================================
// Hook
// ============================================

export function usePeriod(): PeriodContextValue {
  const context = useContext(PeriodContext);
  if (!context) {
    throw new Error('usePeriod must be used within a PeriodProvider');
  }
  return context;
}
