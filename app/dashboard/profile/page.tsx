'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { api } from '@/app/lib/api';
import { Member } from '@/app/types';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import Select from '@/app/components/ui/Select';
import Toast from '@/app/components/ui/Toast';
import { useToast } from '@/app/hooks/useToast';
import { EXPERT_DIVISIONS, DEPARTMENTS } from '@/app/lib/constants';
import { User, Lock, Mail, Phone, Link as LinkIcon, Briefcase, Building } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, login } = useAuth();
  const [memberData, setMemberData] = useState<Member | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  
  const [profileForm, setProfileForm] = useState({
    email: '',
    phoneNumber: '',
    socialMediaLink: '',
    expertDivision: '',
    department: '',
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const { toasts, removeToast, success, error: showError } = useToast();

  useEffect(() => {
    if (user?.id) {
      fetchMemberData();
    }
  }, [user?.id]);

  const fetchMemberData = async () => {
    try {
      const data = await api.get<Member>(`/members/${user!.id}`);
      setMemberData(data);
      setProfileForm({
        email: data.email || '',
        phoneNumber: data.phoneNumber || '',
        socialMediaLink: data.socialMediaLink || '',
        expertDivision: data.expertDivision || '',
        department: data.department || '',
      });
      
      // IMPORTANT: Update AuthContext with latest isPasswordChanged status
      if (user && data.isPasswordChanged !== user.isPasswordChanged) {
        const updatedUser = { ...user, isPasswordChanged: data.isPasswordChanged };
        login(localStorage.getItem('token') || '', updatedUser);
      }
    } catch (err) {
      showError('Gagal memuat data profile');
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoadingProfile(true);
      await api.put('/auth/profile', profileForm);
      success('Profile berhasil diperbarui!');
      fetchMemberData(); // Reload data
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Gagal memperbarui profile');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
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
      setIsLoadingPassword(true);
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
      setIsLoadingPassword(false);
    }
  };

  if (!user) {
    return null;
  }

  const mustChangePassword = !user.isPasswordChanged;

  return (
    <>
      <div className="space-y-6">
        {/* Warning Banner for First-Time Users */}
        {mustChangePassword && (
          <div className="bg-red-50 border-2 border-red-500 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-red-900">WAJIB Ganti Password!</h2>
                <p className="text-sm text-red-700">Anda harus mengganti password default untuk keamanan akun</p>
              </div>
            </div>
          </div>
        )}
        {/* Header */}
        <div className="bg-gradient from-purple-600 to-pink-600 rounded-2xl p-8 shadow-2xl text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center font-bold text-3xl border-4 border-white/30">
              {user.fullName?.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{user.fullName}</h1>
              <p className="text-purple-100">@{user.username}</p>
            </div>
          </div>
          <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
            user.role === 'ADMIN'
              ? 'bg-yellow-400 text-yellow-900'
              : 'bg-blue-400 text-blue-900'
          }`}>
            {user.role}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Edit Profile - Only show after password changed */}
          {!mustChangePassword && (
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Edit Profile</h2>
                  <p className="text-sm text-gray-500">Perbarui informasi pribadi Anda</p>
                </div>
              </div>
            
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username / NIM
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500">
                    {user.username}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500">
                    {user.fullName}
                  </div>
                </div>
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  placeholder="email@example.com"
                  className="pl-10"
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
                <Input
                  label="Nomor Telepon"
                  type="tel"
                  name="phoneNumber"
                  value={profileForm.phoneNumber}
                  onChange={handleProfileChange}
                  placeholder="08123456789"
                  className="pl-10"
                />
              </div>

              <div className="relative">
                <LinkIcon className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
                <Input
                  label="Social Media Link"
                  type="url"
                  name="socialMediaLink"
                  value={profileForm.socialMediaLink}
                  onChange={handleProfileChange}
                  placeholder="https://instagram.com/username"
                  className="pl-10"
                />
              </div>

              <div className="relative">
                <Briefcase className="absolute left-3 top-9 w-5 h-5 text-gray-400 z-10" />
                <Select
                  label="Divisi Keahlian"
                  name="expertDivision"
                  value={profileForm.expertDivision}
                  onChange={handleProfileChange}
                  options={EXPERT_DIVISIONS}
                  className="pl-10"
                />
              </div>

              <div className="relative">
                <Building className="absolute left-3 top-9 w-5 h-5 text-gray-400 z-10" />
                <Select
                  label="Departemen"
                  name="department"
                  value={profileForm.department}
                  onChange={handleProfileChange}
                  options={DEPARTMENTS}
                  className="pl-10"
                />
              </div>

              <Button type="submit" isLoading={isLoadingProfile} className="w-full">
                Simpan Perubahan
              </Button>
            </form>
          </Card>
          )}

          {/* Change Password */}
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Ubah Password</h2>
                <p className="text-sm text-gray-500">Ganti password akun Anda</p>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Input
                label="Password Saat Ini"
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                required
              />
              <Input
                label="Password Baru"
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                required
              />
              <Input
                label="Konfirmasi Password Baru"
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                required
              />

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                <p className="font-bold flex items-center gap-2">
                  ⚠️ Perhatian
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
                  <li>Password minimal 6 karakter</li>
                  <li>Anda akan logout otomatis setelah berhasil</li>
                </ul>
              </div>

              <Button type="submit" isLoading={isLoadingPassword} variant="danger" className="w-full">
                Ubah Password
              </Button>
            </form>
          </Card>
        </div>
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
