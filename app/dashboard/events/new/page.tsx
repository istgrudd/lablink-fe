'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/app/lib/api';
import { Member, CreateEventRequest } from '@/app/types';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Select from '@/app/components/ui/Select';
import { useToast } from '@/app/hooks/useToast';
import Toast from '@/app/components/ui/Toast';

export default function NewEventPage() {
  const router = useRouter();
  const { toasts, removeToast, success, error: showError } = useToast();
  const [members, setMembers] = useState<Member[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState<Partial<CreateEventRequest>>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    picId: '',
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await api.get<Member[]>('/members');
      setMembers(response);
    } catch (err) {
      showError('Gagal memuat data member');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.picId || !formData.startDate || !formData.endDate) {
        showError('Mohon lengkapi field wajib');
        return;
    }

    try {
      setIsSubmitting(true);
      await api.post('/events', formData);
      success('Event berhasil dibuat');
      setTimeout(() => {
        router.push('/dashboard/events');
      }, 1500);
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Gagal membuat event');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Buat Event Baru</h1>
        <Button variant="ghost" onClick={() => router.back()}>Kembali</Button>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Event *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Contoh: Workshop IoT Basic"
                  required
                />
             </div>

             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai *</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
             </div>

             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Selesai *</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
             </div>
             
             <div className="md:col-span-2">
                  <Select
                      label="Ketua Pelaksana (PIC) *"
                      name="picId"
                      value={formData.picId}
                      onChange={handleChange}
                      options={members.map(m => ({ value: m.id, label: `${m.fullName} (${m.expertDivision})` }))}
                      required
                  />
                  <p className="text-xs text-gray-500 mt-1">Hanya memilih PIC utama. Anggota panitia lain dapat ditambahkan setelah event dibuat (sementara).</p>
             </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
             <textarea
               name="description"
               value={formData.description}
               onChange={handleChange}
               rows={4}
               className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
               placeholder="Jelaskan detail kegiatan..."
             />
          </div>

          <div className="flex justify-end gap-3 pt-4">
             <Button type="button" variant="secondary" onClick={() => router.back()}>
               Batal
             </Button>
             <Button type="submit" isLoading={isSubmitting}>
               Buat Event
             </Button>
          </div>
        </form>
      </Card>

      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
