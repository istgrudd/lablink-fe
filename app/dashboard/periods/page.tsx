'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/app/lib/api';
import { Period, CreatePeriodRequest } from '@/app/types';
import { usePeriod } from '@/app/hooks/usePeriod';
import { useAuth } from '@/app/context/AuthContext';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Table from '@/app/components/ui/Table';
import Modal from '@/app/components/ui/Modal';
import Toast from '@/app/components/ui/Toast';
import { useToast } from '@/app/hooks/useToast';
import CreatePeriodModal from '@/app/components/periods/CreatePeriodModal';
import ClosePeriodModal from '@/app/components/periods/ClosePeriodModal';

// ============================================
// Status Badges
// ============================================

const STATUS_STYLES = {
  active: 'bg-green-100 text-green-700',
  archived: 'bg-gray-100 text-gray-600',
  inactive: 'bg-yellow-100 text-yellow-700',
};

function getStatusLabel(period: Period): { label: string; style: string } {
  if (period.isActive) return { label: 'Aktif', style: STATUS_STYLES.active };
  if (period.isArchived) return { label: 'Arsip', style: STATUS_STYLES.archived };
  return { label: 'Tidak Aktif', style: STATUS_STYLES.inactive };
}

// ============================================
// Page Component
// ============================================

export default function PeriodsPage() {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const { periods, activePeriod, isLoading, refreshPeriods, selectPeriod } = usePeriod();
  const { toasts, removeToast, success, error: showError } = useToast();

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<Period | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Handlers
  const handleCreate = async (data: CreatePeriodRequest) => {
    try {
      setIsProcessing(true);
      await api.post('/periods', data);
      success('Periode berhasil dibuat');
      setCreateModalOpen(false);
      refreshPeriods();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Gagal membuat periode');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleActivate = async (period: Period) => {
    try {
      setIsProcessing(true);
      await api.post(`/periods/${period.id}/activate`);
      success(`Periode ${period.code} berhasil diaktifkan`);
      refreshPeriods();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Gagal mengaktifkan periode');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOpenCloseModal = (period: Period) => {
    setSelectedPeriod(period);
    setCloseModalOpen(true);
  };

  const handleClosePeriod = async (newPeriodId: string, continuingMemberIds: string[]) => {
    if (!selectedPeriod) return;
    try {
      setIsProcessing(true);
      await api.post(`/periods/${selectedPeriod.id}/close`, {
        newPeriodId,
        continuingMemberIds,
      });
      success('Periode berhasil ditutup');
      setCloseModalOpen(false);
      setSelectedPeriod(null);
      refreshPeriods();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Gagal menutup periode');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewArchive = (period: Period) => {
    selectPeriod(period.id);
    router.push('/dashboard');
  };

  const handleOpenDeleteModal = (period: Period) => {
    setSelectedPeriod(period);
    setDeleteModalOpen(true);
  };

  const handleDeletePeriod = async () => {
    if (!selectedPeriod) return;
    try {
      setIsProcessing(true);
      await api.delete(`/periods/${selectedPeriod.id}`);
      success(`Periode ${selectedPeriod.code} berhasil dihapus`);
      setDeleteModalOpen(false);
      setSelectedPeriod(null);
      refreshPeriods();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Gagal menghapus periode');
    } finally {
      setIsProcessing(false);
    }
  };

  // Table columns
  const columns = [
    {
      key: 'code',
      header: 'Kode',
      render: (p: Period) => <span className="font-mono font-medium">{p.code}</span>,
    },
    { key: 'name', header: 'Nama Periode' },
    {
      key: 'dateRange',
      header: 'Rentang Waktu',
      render: (p: Period) => (
        <span className="text-sm text-gray-600">
          {new Date(p.startDate).toLocaleDateString('id-ID')} - {new Date(p.endDate).toLocaleDateString('id-ID')}
        </span>
      ),
    },
    {
      key: 'stats',
      header: 'Statistik',
      render: (p: Period) => (
        <div className="flex gap-3 text-xs">
          <span title="Members">👥 {p.totalMembers}</span>
          <span title="Projects">📁 {p.totalProjects}</span>
          <span title="Events">📅 {p.totalEvents}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (p: Period) => {
        const { label, style } = getStatusLabel(p);
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${style}`}>
            {label}
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: 'Aksi',
      render: (p: Period) => (
        <div className="flex gap-2 flex-wrap">
          {/* View Archive - for archived periods */}
          {p.isArchived && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleViewArchive(p)}
            >
              👁 Lihat Arsip
            </Button>
          )}
          
          {/* Activate - for inactive non-archived periods */}
          {isAdmin && !p.isActive && !p.isArchived && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => handleActivate(p)}
              disabled={isProcessing}
            >
              Aktifkan
            </Button>
          )}
          
          {/* Close Period - for active periods */}
          {isAdmin && p.isActive && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleOpenCloseModal(p)}
              disabled={isProcessing}
            >
              Tutup Periode
            </Button>
          )}
          
          {/* Delete - for archived periods */}
          {isAdmin && p.isArchived && (
            <Button
              size="sm"
              variant="danger"
              onClick={() => handleOpenDeleteModal(p)}
              disabled={isProcessing}
            >
              Hapus
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Periode</h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola periode kepengurusan lab
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setCreateModalOpen(true)}>
            + Buat Periode
          </Button>
        )}
      </div>

      {/* Table */}
      <Card>
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Memuat...</div>
        ) : periods.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Belum ada periode. Silakan buat periode baru.
          </div>
        ) : (
          <Table data={periods} columns={columns} keyField="id" />
        )}
      </Card>

      {/* Modals */}
      <CreatePeriodModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreate}
        isLoading={isProcessing}
      />

      {selectedPeriod && (
        <ClosePeriodModal
          isOpen={closeModalOpen}
          onClose={() => {
            setCloseModalOpen(false);
            setSelectedPeriod(null);
          }}
          currentPeriod={selectedPeriod}
          availablePeriods={periods.filter(p => !p.isActive && !p.isArchived)}
          onSubmit={handleClosePeriod}
          isLoading={isProcessing}
        />
      )}

      {/* Delete Period Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedPeriod(null);
        }}
        onConfirm={handleDeletePeriod}
        title={`Hapus Periode ${selectedPeriod?.code || ''}`}
        confirmText="Hapus Permanen"
        cancelText="Batal"
        variant="danger"
        isLoading={isProcessing}
      >
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-medium flex items-center gap-2">
              <span>⚠️</span> Peringatan: Aksi ini tidak dapat dibatalkan!
            </p>
          </div>
          <p className="text-gray-700">
            Menghapus periode <strong>{selectedPeriod?.code}</strong> akan menghapus <strong>semua data</strong> yang terkait:
          </p>
          <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
            <li>👥 {selectedPeriod?.totalMembers || 0} member dalam periode ini</li>
            <li>📁 {selectedPeriod?.totalProjects || 0} proyek</li>
            <li>📅 {selectedPeriod?.totalEvents || 0} kegiatan</li>
            <li>📝 Semua surat dan arsip terkait</li>
          </ul>
          <p className="text-sm text-red-600 font-medium">
            Pastikan Anda sudah backup data yang diperlukan sebelum melanjutkan.
          </p>
        </div>
      </Modal>

      {/* Toasts */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );
}
