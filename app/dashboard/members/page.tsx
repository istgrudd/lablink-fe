'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/app/lib/api';
import { Member } from '@/app/types';
import { useAuth } from '@/app/context/AuthContext';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Table from '@/app/components/ui/Table';
import Link from 'next/link';
import Select from '@/app/components/ui/Select';
import Modal from '@/app/components/ui/Modal';
import Toast from '@/app/components/ui/Toast';
import { useToast } from '@/app/hooks/useToast';

export default function MembersPage() {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    member: Member | null;
  }>({ isOpen: false, member: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const { toasts, removeToast, success, error: showError } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterDivision, setFilterDivision] = useState('ALL');
  const [sortConfig, setSortConfig] = useState('name_asc');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<Member[]>('/members');
      setMembers(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load members');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMembers = members
    .filter(member => {
      const matchSearch = 
        member.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        member.username.includes(searchQuery);
      const matchDivision = filterDivision === 'ALL' || member.expertDivision === filterDivision;
      return matchSearch && matchDivision;
    })
    .sort((a, b) => {
      if (sortConfig === 'name_asc') return a.fullName.localeCompare(b.fullName);
      if (sortConfig === 'name_desc') return b.fullName.localeCompare(a.fullName);
      if (sortConfig === 'nim_asc') return a.username.localeCompare(b.username);
      if (sortConfig === 'nim_desc') return b.username.localeCompare(a.username);
      return 0;
    });

  const handleDeleteClick = (member: Member) => {
    setDeleteModal({ isOpen: true, member });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.member) return;

    try {
      setIsDeleting(true);
      await api.delete(`/members/${deleteModal.member.id}`);
      setMembers(members.filter((m) => m.id !== deleteModal.member!.id));
      success(`Member ${deleteModal.member.fullName} berhasil dihapus`);
      setDeleteModal({ isOpen: false, member: null });
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Gagal menghapus member');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    { key: 'username', header: 'NIM' },
    { key: 'fullName', header: 'Nama' },
    { key: 'expertDivision', header: 'Divisi' },
    { key: 'department', header: 'Departemen' },
    {
      key: 'isActive',
      header: 'Status',
      render: (item: Member) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.isActive
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          {item.isActive ? 'Mahasiswa' : 'Alumni'}
        </span>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (item: Member) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.role === 'ADMIN'
              ? 'bg-purple-100 text-purple-700'
              : 'bg-blue-100 text-blue-700'
          }`}
        >
          {item.role}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Aksi',
      render: (item: Member) => (
        <div className="flex gap-2">
           <Button
             size="sm"
             variant="secondary"
             onClick={(e) => {
               e.stopPropagation();
               setSelectedMember(item);
             }}
           >
             Detail
           </Button>
          {isAdmin && (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/dashboard/members/${item.id}`);
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
          <h1 className="text-2xl font-bold text-gray-900">Members</h1>
          {isAdmin && (
            <Button onClick={() => router.push('/dashboard/members/new')}>
              + Tambah Member
            </Button>
          )}
        </div>

        <Card>
          {/* Filters */}
          <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between">
            <div className="w-full md:w-64">
              <input
                type="text"
                placeholder="Cari member..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="flex gap-2">
               <div className="w-40">
                  <Select
                    label=""
                    value={filterDivision}
                    onChange={(e) => setFilterDivision(e.target.value)}
                    options={[
                      { value: 'ALL', label: 'Semua Divisi' },
                      { value: 'BIG_DATA', label: 'Big Data' },
                      { value: 'CYBER_SECURITY', label: 'Cyber Security' },
                      { value: 'GAME_TECH', label: 'Game Tech' },
                      { value: 'GIS', label: 'GIS' },
                    ]}
                  />
               </div>
               <div className="w-40">
                  <Select
                    label=""
                    value={sortConfig}
                    onChange={(e) => setSortConfig(e.target.value)}
                    options={[
                      { value: 'name_asc', label: 'Nama (A-Z)' },
                      { value: 'name_desc', label: 'Nama (Z-A)' },
                      { value: 'nim_asc', label: 'NIM (Asc)' },
                      { value: 'nim_desc', label: 'NIM (Desc)' },
                    ]}
                  />
               </div>
            </div>
          </div>

          <Table
            columns={columns}
            data={filteredMembers}
            keyField="id"
            isLoading={isLoading}
            emptyMessage="Belum ada member"
          />
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, member: null })}
        onConfirm={handleDeleteConfirm}
        title="Konfirmasi Hapus"
        confirmText="Hapus"
        cancelText="Batal"
        variant="danger"
        isLoading={isDeleting}
      >
        <p>
          Apakah Anda yakin ingin menghapus member{' '}
          <strong>{deleteModal.member?.fullName}</strong>?
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Tindakan ini tidak dapat dibatalkan. Member yang sudah menjadi ketua
          proyek tidak dapat dihapus.
        </p>
      </Modal>

      {/* Member Detail Modal */}
      <Modal
         isOpen={!!selectedMember}
         onClose={() => setSelectedMember(null)}
         title={`Detail Anggota: ${selectedMember?.fullName}`}
         cancelText="Tutup"
      >
        {selectedMember && (
           <div className="space-y-6">
              <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">
                    {selectedMember.fullName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{selectedMember.fullName}</h4>
                    <p className="text-gray-500 text-sm">{selectedMember.username}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100">
                      {selectedMember.expertDivision}
                    </span>
                  </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                 <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold block mb-1">Email</label>
                    <a href={`mailto:${selectedMember.email || ''}`} className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
                       {selectedMember.email || '-'}
                    </a>
                 </div>
                 
                 <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold block mb-1">WhatsApp / Telepon</label>
                     <a href={`https://wa.me/${selectedMember.phoneNumber?.replace(/^0/, '62') || ''}`} target="_blank" rel="noreferrer" className="text-green-600 hover:text-green-800 flex items-center gap-2">
                       {selectedMember.phoneNumber || '-'}
                    </a>
                 </div>

                 <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold block mb-1">Social Media</label>
                    {selectedMember.socialMediaLink ? (
                       <a href={selectedMember.socialMediaLink} target="_blank" rel="noreferrer" className="text-purple-600 hover:text-purple-800 break-all">
                          {selectedMember.socialMediaLink}
                       </a>
                    ) : (
                       <span className="text-gray-400">-</span>
                    )}
                 </div>
              </div>
           </div>
        )}
      </Modal>

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
