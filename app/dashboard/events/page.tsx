'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/app/lib/api';
import { Event } from '@/app/types';
import { useAuth } from '@/app/context/AuthContext';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Table from '@/app/components/ui/Table';
import Select from '@/app/components/ui/Select';
import EventDetailModal from '@/app/components/events/EventDetailModal';
import CreateArchiveModal from '@/app/components/archives/CreateArchiveModal';
import Modal from '@/app/components/ui/Modal';
import Toast from '@/app/components/ui/Toast';
import { useToast } from '@/app/hooks/useToast';

export default function EventsPage() {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal States
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    event: Event | null;
  }>({ isOpen: false, event: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [archiveModal, setArchiveModal] = useState<{
    isOpen: boolean;
    event: Event | null;
  }>({ isOpen: false, event: null });
  
  // Filter & Sort States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [sortConfig, setSortConfig] = useState('newest');

  const { toasts, removeToast, success, error: showError } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<Event[]>('/events');
      setEvents(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (event: Event) => {
    setDeleteModal({ isOpen: true, event });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.event) return;

    try {
      setIsDeleting(true);
      await api.delete(`/events/${deleteModal.event.id}`);
      setEvents(events.filter((e) => e.id !== deleteModal.event!.id));
      success(`Event ${deleteModal.event.eventCode} berhasil dihapus`);
      setDeleteModal({ isOpen: false, event: null });
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Gagal menghapus event');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredEvents = events
    .filter(event => {
      const matchSearch = 
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        event.eventCode.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = filterStatus === 'ALL' || event.status === filterStatus;
      
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      switch (sortConfig) {
        case 'name_asc': return a.name.localeCompare(b.name);
        case 'name_desc': return b.name.localeCompare(a.name);
        case 'oldest': return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        case 'newest': default: return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      }
    });

  const columns = [
    { key: 'eventCode', header: 'Kode' },
    { key: 'name', header: 'Nama Event' },
    { 
      key: 'startDate', 
      header: 'Tanggal',
      render: (item: Event) => (
        <span className="text-sm">
             {new Date(item.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      )
    },
    { 
      key: 'pic', 
      header: 'PIC',
      render: (item: Event) => (
        <span className="font-medium text-blue-600 text-sm">{item.pic.fullName}</span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: Event) => {
        const colors: Record<string, string> = {
          PLANNED: 'bg-gray-100 text-gray-700',
          ONGOING: 'bg-blue-100 text-blue-700',
          COMPLETED: 'bg-green-100 text-green-700',
          CANCELLED: 'bg-red-100 text-red-700',
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[item.status] || 'bg-gray-100'}`}>
            {item.status.replace('_', ' ')}
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: 'Aksi',
      render: (item: Event) => (
        <div className="flex gap-2">
           <Button
             size="sm"
             variant="secondary"
             onClick={(e) => {
               e.stopPropagation();
               setSelectedEvent(item);
             }}
           >
             Detail
           </Button>
          {isAdmin && item.status === 'COMPLETED' && (
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                setArchiveModal({ isOpen: true, event: item });
              }}
            >
              📁 Arsipkan
            </Button>
          )}
          {isAdmin && (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/dashboard/events/${item.id}`);
                }}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(item);
                }}
              >
                Hapus
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Events / Kegiatan</h1>
          {isAdmin && (
            <Button onClick={() => router.push('/dashboard/events/new')}>
              + Buat Event
            </Button>
          )}
        </div>

        <Card>
          {/* Filters */}
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Cari event / kode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
            </div>
            <div className="w-full md:w-48">
              <Select
                label=""
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                options={[
                  { value: 'ALL', label: 'Semua Status' },
                  { value: 'PLANNED', label: 'Planned' },
                  { value: 'ONGOING', label: 'Ongoing' },
                  { value: 'COMPLETED', label: 'Completed' },
                ]}
              />
            </div>
            <div className="w-full md:w-48">
              <Select
                label=""
                value={sortConfig}
                onChange={(e) => setSortConfig(e.target.value)}
                options={[
                  { value: 'newest', label: 'Terbaru' },
                  { value: 'oldest', label: 'Terlama' },
                  { value: 'name_asc', label: 'Nama (A-Z)' },
                  { value: 'name_desc', label: 'Nama (Z-A)' },
                ]}
              />
            </div>
          </div>

          <Table
            columns={columns}
            data={filteredEvents}
            keyField="id"
            isLoading={isLoading}
            emptyMessage="Belum ada event"
          />
        </Card>
      </div>

      {/* Detail Modal */}
      <EventDetailModal
         isOpen={!!selectedEvent}
         onClose={() => setSelectedEvent(null)}
         event={selectedEvent}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, event: null })}
        onConfirm={handleDeleteConfirm}
        title="Konfirmasi Hapus"
        confirmText="Hapus"
        cancelText="Batal"
        variant="danger"
        isLoading={isDeleting}
      >
        <p>
          Apakah Anda yakin ingin menghapus event{' '}
          <strong>{deleteModal.event?.name}</strong>?
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Tindakan ini tidak dapat dibatalkan.
        </p>
      </Modal>

      {/* Archive Modal */}
      <CreateArchiveModal
        isOpen={archiveModal.isOpen}
        onClose={() => setArchiveModal({ isOpen: false, event: null })}
        onSuccess={() => {
          fetchEvents();
          setArchiveModal({ isOpen: false, event: null });
        }}
        sourceType="EVENT"
        sourceId={archiveModal.event?.id || ''}
        sourceName={archiveModal.event?.name || ''}
      />

      {/* Toast Notifications */}
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
