'use client';

import { useState, useEffect } from 'react';
import { api } from '@/app/lib/api';
import { Period } from '@/app/types';
import Card from '@/app/components/ui/Card';
import Input from '@/app/components/ui/Input';
import Button from '@/app/components/ui/Button';
import { Plus, Search, Calendar, CheckCircle, XCircle, Archive, Edit, Trash2, Power } from 'lucide-react';

export default function PeriodsPage() {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<Period | null>(null);

  useEffect(() => {
    fetchPeriods();
  }, []);

  const fetchPeriods = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<Period[]>('/periods');
      // Ensure response is an array
      setPeriods(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Failed to fetch periods:', error);
      setPeriods([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivatePeriod = async (id: string) => {
    try {
      await api.patch(`/periods/${id}/activate`, {});
      fetchPeriods();
    } catch (error) {
      console.error('Failed to activate period:', error);
    }
  };

  const handleArchivePeriod = async (id: string) => {
    if (!confirm('Yakin ingin mengarsipkan periode ini?')) return;
    
    try {
      await api.patch(`/periods/${id}/archive`, {});
      fetchPeriods();
    } catch (error) {
      console.error('Failed to archive period:', error);
    }
  };

  const handleDeletePeriod = async (id: string) => {
    if (!confirm('Yakin ingin menghapus periode ini? Aksi ini tidak dapat dibatalkan.')) return;
    
    try {
      await api.delete(`/periods/${id}`);
      fetchPeriods();
    } catch (error) {
      console.error('Failed to delete period:', error);
    }
  };

  const filteredPeriods = Array.isArray(periods) ? periods.filter((period) => {
    const matchesSearch = 
      period.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      period.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  }) : [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manajemen Periode</h1>
          <p className="text-muted-foreground mt-1">
            Fitur pengelolaan periode rekrutmen dan kegiatan lab sedang disiapkan
          </p>
        </div>
        
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          Buat Periode
        </button>
      </div>

      {/* Search & Filters */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Cari kode atau nama periode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-5 h-5" />}
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Total: {periods.length} periode</span>
          </div>
        </div>
      </Card>

      {/* Periods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-32 bg-muted rounded-lg"></div>
            </Card>
          ))
        ) : filteredPeriods.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Tidak ada periode
                </h3>
                <p className="text-muted-foreground">
                  Mulai dengan membuat periode pertama Anda
                </p>
              </div>
            </Card>
          </div>
        ) : (
          filteredPeriods.map((period) => (
            <Card key={period.id} hover className="relative overflow-hidden">
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                {period.isActive ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-success-light text-success text-xs font-semibold rounded-full">
                    <CheckCircle className="w-3 h-3" />
                    Aktif
                  </span>
                ) : period.isArchived ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-muted text-muted-foreground text-xs font-semibold rounded-full">
                    <Archive className="w-3 h-3" />
                    Arsip
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-warning-light text-warning text-xs font-semibold rounded-full">
                    <XCircle className="w-3 h-3" />
                    Nonaktif
                  </span>
                )}
              </div>

              {/* Period Info */}
              <div className="pr-24">
                <p className="text-sm text-muted-foreground mb-1">{period.code}</p>
                <h3 className="text-xl font-bold text-foreground mb-3">{period.name}</h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(period.startDate).toLocaleDateString('id-ID')} - {new Date(period.endDate).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex items-center gap-2 pt-4 border-t border-default">
                {!period.isActive && !period.isArchived && (
                  <button
                    onClick={() => handleActivatePeriod(period.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-success-light text-success hover:bg-success hover:text-white rounded-lg text-sm font-medium transition-all"
                  >
                    <Power className="w-4 h-4" />
                    Aktifkan
                  </button>
                )}
                
                {period.isActive && (
                  <button
                    onClick={() => handleArchivePeriod(period.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-muted text-muted-foreground hover:bg-warning-light hover:text-warning rounded-lg text-sm font-medium transition-all"
                  >
                    <Archive className="w-4 h-4" />
                    Arsipkan
                  </button>
                )}
                
                <button
                  onClick={() => setEditingPeriod(period)}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-info-light text-info hover:bg-info hover:text-white rounded-lg text-sm font-medium transition-all"
                >
                  <Edit className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => handleDeletePeriod(period.id)}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-error-light text-error hover:bg-error hover:text-white rounded-lg text-sm font-medium transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create/Edit Modal - Placeholder */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                {editingPeriod ? 'Edit Periode' : 'Buat Periode Baru'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingPeriod(null);
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <Input label="Kode Periode" placeholder="Contoh: P2024-1" />
              <Input label="Nama Periode" placeholder="Contoh: Periode Rekrutmen 2024/2025" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Tanggal Mulai" type="date" />
                <Input label="Tanggal Selesai" type="date" />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button className="flex-1">
                  {editingPeriod ? 'Simpan Perubahan' : 'Buat Periode'}
                </Button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingPeriod(null);
                  }}
                  className="flex-1 px-4 py-2 border border-default rounded-lg text-foreground hover:bg-muted transition-colors"
                >
                  Batal
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}