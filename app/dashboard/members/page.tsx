'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/app/lib/api';
import { Member } from '@/app/types';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Table from '@/app/components/ui/Table';

export default function MembersPage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus member ini?')) return;
    
    try {
      await api.delete(`/members/${id}`);
      setMembers(members.filter((m) => m.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete member');
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
          {item.isActive ? 'Active' : 'Inactive'}
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
              handleDelete(item.id);
            }}
          >
            Hapus
          </Button>
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Members</h1>
        <Button onClick={() => router.push('/dashboard/members/new')}>
          + Tambah Member
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          data={members}
          keyField="id"
          isLoading={isLoading}
          emptyMessage="Belum ada member"
        />
      </Card>
    </div>
  );
}
