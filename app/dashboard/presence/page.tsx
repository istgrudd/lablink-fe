'use client';

import { useState, useEffect } from 'react';
import { api } from '@/app/lib/api';
import Link from 'next/link';
import { Presence } from '@/app/types/presence';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import { Camera, Calendar, FileText, Upload, Clock, CheckCircle, Lock } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { usePeriod } from '@/app/hooks/usePeriod';
import Select from '@/app/components/ui/Select';

export default function PresencePage() {
  const { user } = useAuth();
  const { isReadOnly, selectedPeriod, activePeriod } = usePeriod();
  const [history, setHistory] = useState<Presence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    type: 'MEETING',
    date: new Date().toISOString().split('T')[0], // Default today
    title: '',
    notes: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const data = await api.getMyPresenceHistory();
      setHistory(data);
    } catch (err) {
      console.error(err);
      setError('Gagal memuat riwayat presensi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Ukuran file maksimal 5MB');
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Mohon upload foto bukti kehadiran');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccessMessage(null);

      // Auto-set title based on type if empty
      const title = formData.title || (formData.type === 'MEETING' ? 'Rapat Rutin' : 'On Call Duty');

      await api.uploadPresence({
        ...formData,
        title
      }, selectedFile);

      setSuccessMessage('Presensi berhasil dikirim!');
      
      // Reset form
      setFormData({
        type: 'MEETING',
        date: new Date().toISOString().split('T')[0],
        title: '',
        notes: ''
      });
      setSelectedFile(null);
      setPreviewUrl(null);
      
      // Refresh history
      fetchHistory();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengirim presensi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const PRESENCE_TYPES = [
    { value: 'MEETING', label: 'Rapat 2 Mingguan' },
    { value: 'ON_CALL', label: 'On Call' },
    { value: 'OTHER', label: 'Lainnya' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Presensi</h1>
          <p className="text-gray-500">Input dan riwayat kehadiran Anda</p>
        </div>
        
        {user?.role === 'ADMIN' && (
          <Link 
            href="/dashboard/presence/recap"
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
          >
            <FileText className="w-4 h-4" />
            <span>Lihat Rekap Presensi</span>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Input Form - Only show when not in read-only mode */}
        {!isReadOnly ? (
        <div className="lg:col-span-1">
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Camera className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Input Kehadiran</h2>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-200 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Select
                  label="Tipe Kehadiran"
                  name="type"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  options={PRESENCE_TYPES}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catatan (Optional)</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Contoh: Diskusi progress project..."
                  />
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Foto Bukti</label>
                <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-all ${
                  previewUrl ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <div className="space-y-1 text-center">
                    {previewUrl ? (
                      <div className="relative">
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          className="mx-auto h-48 object-cover rounded-lg shadow-md"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            setPreviewUrl(null);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600 justify-center">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                            <span>Upload a file</span>
                            <input 
                              type="file" 
                              className="sr-only" 
                              accept="image/*"
                              onChange={handleFileChange}
                              required
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <Button type="submit" isLoading={isSubmitting} className="w-full">
                Kirim Presensi
              </Button>
            </form>
          </Card>
        </div>
        ) : (
        <div className="lg:col-span-1">
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-gray-500" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Input Kehadiran</h2>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
              <p className="text-amber-700 font-medium">Mode Read-Only</p>
              <p className="text-sm text-amber-600 mt-1">
                Anda sedang melihat data periode arsip. Input presensi tidak tersedia.
              </p>
            </div>
          </Card>
        </div>
        )}

        {/* History List */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Riwayat Presensi</h2>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex gap-4 p-4 border rounded-xl">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                Belum ada data presensi
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                    <div className="flex-shrink-0">
                      <img 
                        src={item.imageUrl} 
                        alt="Evidence" 
                        className="w-full sm:w-32 h-32 object-cover rounded-lg bg-gray-100"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Error';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mb-2 ${
                            item.type === 'MEETING' ? 'bg-blue-100 text-blue-800' :
                            item.type === 'ON_CALL' ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {item.type === 'MEETING' ? 'Rapat 2 Mingguan' : item.type.replace('_', ' ')}
                          </span>
                          <h3 className="font-semibold text-gray-900">{item.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(item.date).toLocaleDateString('id-ID', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </div>
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(item.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      
                      {item.notes && (
                        <p className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                          "{item.notes}"
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

      </div>
    </div>
  );
}
