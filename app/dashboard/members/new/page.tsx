'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/app/lib/api';
import { CreateMemberRequest } from '@/app/types';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';

const expertDivisions = [
  { value: 'CYBER_SECURITY', label: 'Cyber Security' },
  { value: 'BIG_DATA', label: 'Big Data' },
  { value: 'GIS', label: 'Geographic Information System' },
  { value: 'GAME_TECH', label: 'Game Technology' },
];

const departments = [
  { value: 'INTERNAL', label: 'Internal' },
  { value: 'EKSTERNAL', label: 'Eksternal' },
];

export default function NewMemberPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateMemberRequest>({
    nim: '',
    fullName: '',
    expertDivision: 'CYBER_SECURITY',
    department: 'INTERNAL',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      await api.post('/members', formData);
      router.push('/dashboard/members');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create member');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          ← Kembali
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Tambah Member Baru</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
          <Input
            label="NIM"
            name="nim"
            value={formData.nim}
            onChange={handleChange}
            placeholder="Masukkan NIM"
            required
          />

          <Input
            label="Nama Lengkap"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Masukkan nama lengkap"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Divisi Keahlian
              </label>
              <select
                name="expertDivision"
                value={formData.expertDivision}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {expertDivisions.map((div) => (
                  <option key={div.value} value={div.value}>
                    {div.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Departemen
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {departments.map((dept) => (
                  <option key={dept.value} value={dept.value}>
                    {dept.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="text-sm text-gray-500">
            Password default = NIM. Member harus ganti password saat pertama login.
          </p>

          <div className="flex gap-3 pt-4">
            <Button type="submit" isLoading={isLoading}>
              Simpan
            </Button>
            <Button type="button" variant="secondary" onClick={() => router.back()}>
              Batal
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
