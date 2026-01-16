'use client';

import { useState, useEffect } from 'react';
import { api } from '@/app/lib/api';
import Modal from '@/app/components/ui/Modal';
import Select from '@/app/components/ui/Select';
import { Period, MemberPeriod } from '@/app/types';

// ============================================
// Types
// ============================================

interface ClosePeriodModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPeriod: Period;
  availablePeriods: Period[];
  onSubmit: (newPeriodId: string, continuingMemberIds: string[]) => void;
  isLoading?: boolean;
}

// ============================================
// Component
// ============================================

export default function ClosePeriodModal({
  isOpen,
  onClose,
  currentPeriod,
  availablePeriods,
  onSubmit,
  isLoading = false,
}: ClosePeriodModalProps) {
  const [newPeriodId, setNewPeriodId] = useState('');
  const [members, setMembers] = useState<MemberPeriod[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
  const [isFetchingMembers, setIsFetchingMembers] = useState(false);

  // Fetch members when modal opens
  useEffect(() => {
    if (isOpen && currentPeriod) {
      fetchMembers();
    }
  }, [isOpen, currentPeriod]);

  const fetchMembers = async () => {
    try {
      setIsFetchingMembers(true);
      const data = await api.get<MemberPeriod[]>(`/periods/${currentPeriod.id}/members`);
      // Only show active members
      const activeMembers = data.filter(m => m.status === 'ACTIVE');
      setMembers(activeMembers);
      // Pre-select all members by default
      setSelectedMembers(new Set(activeMembers.map(m => m.memberId)));
    } catch {
      setMembers([]);
    } finally {
      setIsFetchingMembers(false);
    }
  };

  // Toggle member selection
  const toggleMember = (memberId: string) => {
    setSelectedMembers(prev => {
      const next = new Set(prev);
      if (next.has(memberId)) {
        next.delete(memberId);
      } else {
        next.add(memberId);
      }
      return next;
    });
  };

  // Select/Deselect all
  const toggleAll = () => {
    if (selectedMembers.size === members.length) {
      setSelectedMembers(new Set());
    } else {
      setSelectedMembers(new Set(members.map(m => m.memberId)));
    }
  };

  // Handle submit
  const handleSubmit = () => {
    if (!newPeriodId) return;
    onSubmit(newPeriodId, Array.from(selectedMembers));
  };

  // Handle close
  const handleClose = () => {
    setNewPeriodId('');
    setSelectedMembers(new Set());
    onClose();
  };

  const alumniCount = members.length - selectedMembers.size;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      onConfirm={handleSubmit}
      title={`Tutup Periode ${currentPeriod.code}`}
      confirmText="Tutup Periode"
      cancelText="Batal"
      variant="danger"
      isLoading={isLoading}
    >
      <div className="space-y-4">
        {/* Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-800">
            ⚠️ Periode yang ditutup akan diarsipkan dan datanya menjadi <strong>read-only</strong>.
          </p>
        </div>

        {/* New Period Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Periode Baru <span className="text-red-500">*</span>
          </label>
          {availablePeriods.length === 0 ? (
            <p className="text-sm text-red-500">
              Tidak ada periode pengganti. Buat periode baru terlebih dahulu.
            </p>
          ) : (
            <Select
              value={newPeriodId}
              onChange={(e) => setNewPeriodId(e.target.value)}
              options={[
                { value: '', label: 'Pilih periode...' },
                ...availablePeriods.map(p => ({
                  value: p.id,
                  label: `${p.code} - ${p.name}`,
                })),
              ]}
            />
          )}
        </div>

        {/* Member Selection */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">
              Pilih Member yang Lanjut
            </label>
            <button
              type="button"
              onClick={toggleAll}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              {selectedMembers.size === members.length ? 'Batalkan Semua' : 'Pilih Semua'}
            </button>
          </div>

          {isFetchingMembers ? (
            <div className="text-center py-4 text-gray-500 text-sm">Memuat member...</div>
          ) : members.length === 0 ? (
            <div className="text-center py-4 text-gray-500 text-sm">
              Tidak ada member aktif di periode ini
            </div>
          ) : (
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg divide-y">
              {members.map(member => (
                <label
                  key={member.memberId}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedMembers.has(member.memberId)}
                    onChange={() => toggleMember(member.memberId)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{member.memberName}</div>
                    <div className="text-xs text-gray-500">{member.memberNim}</div>
                  </div>
                  <span className="text-xs text-gray-400">{member.position}</span>
                </label>
              ))}
            </div>
          )}

          {/* Summary */}
          <div className="mt-2 text-xs text-gray-500">
            {selectedMembers.size} member akan lanjut ke periode baru
            {alumniCount > 0 && (
              <span className="text-orange-600 font-medium">
                , {alumniCount} member menjadi Alumni
              </span>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
