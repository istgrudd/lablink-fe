'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { api } from '@/app/lib/api';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import Toast from '@/app/components/ui/Toast';
import { useToast } from '@/app/hooks/useToast';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const { toasts, removeToast, success, error: showError } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showError('Password baru tidak cocok');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showError('Password minimal 6 karakter');
      return;
    }

    try {
      setIsLoading(true);
      await api.put('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      
      success('Password berhasil diubah! Silakan login kembali');
      
      // Logout after 2 seconds
      setTimeout(() => {
        logout();
        router.push('/login');
      }, 2000);
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Gagal mengubah password');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            ← Kembali
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        </div>

        {/* User Info */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">Informasi Pengguna</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Username / NIM</p>
              <p className="font-medium">{user.username}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Nama Lengkap</p>
              <p className="font-medium">{user.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  user.role === 'ADMIN'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {user.role}
              </span>
            </div>
          </div>
        </Card>

        {/* Change Password */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">Ubah Password</h2>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <Input
              label="Password Saat Ini"
              type="password"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handleChange}
              required
            />
            <Input
              label="Password Baru"
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handleChange}
              required
            />
            <Input
              label="Konfirmasi Password Baru"
              type="password"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handleChange}
              required
            />

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
              <p className="font-medium">ℹ️ Informasi:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Password minimal 6 karakter</li>
                <li>Anda akan logout otomatis setelah berhasil mengubah password</li>
              </ul>
            </div>

            <Button type="submit" isLoading={isLoading}>
              Ubah Password
            </Button>
          </form>
        </Card>
      </div>

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
