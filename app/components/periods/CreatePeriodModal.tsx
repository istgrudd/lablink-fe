'use client';

import { useState } from 'react';
import Modal from '@/app/components/ui/Modal';
import { CreatePeriodRequest } from '@/app/types';

// ============================================
// Types
// ============================================

interface CreatePeriodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePeriodRequest) => void;
  isLoading?: boolean;
}

// ============================================
// Component
// ============================================

export default function CreatePeriodModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: CreatePeriodModalProps) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  // Reset form on close
  const handleClose = () => {
    setCode('');
    setName('');
    setStartDate('');
    setEndDate('');
    setError('');
    onClose();
  };

  // Handle submit
  const handleSubmit = () => {
    setError('');
    
    if (!code.trim() || !name.trim() || !startDate || !endDate) {
      setError('Mohon lengkapi semua field');
      return;
    }
    
    // Date validation
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) {
      setError('Tanggal mulai tidak boleh setelah tanggal selesai');
      return;
    }
    
    onSubmit({ code, name, startDate, endDate });
  };

  // Auto-generate name from code
  const handleCodeChange = (value: string) => {
    setCode(value);
    // Auto-generate name: "2024-2025" -> "Periode 2024/2025"
    if (value.includes('-')) {
      const formatted = value.replace('-', '/');
      setName(`Periode ${formatted}`);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      onConfirm={handleSubmit}
      title="Buat Periode Baru"
      confirmText="Buat"
      cancelText="Batal"
      isLoading={isLoading}
    >
      <div className="space-y-4">
        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
            {error}
          </div>
        )}
        
        {/* Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kode Periode <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            placeholder="Contoh: 2024-2025"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Format: TAHUN-TAHUN (contoh: 2024-2025)
          </p>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Periode <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Periode 2024/2025"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Mulai <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Selesai <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
