'use client';

import Modal from '@/app/components/ui/Modal';
import { Project } from '@/app/types';

interface ProjectDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

export default function ProjectDetailModal({
  isOpen,
  onClose,
  project,
}: ProjectDetailModalProps) {
  if (!project) return null;

  const STATUS_COLORS: Record<string, string> = {
    NOT_STARTED: 'bg-gray-100 text-gray-700',
    IN_PROGRESS: 'bg-blue-100 text-blue-700',
    ON_HOLD: 'bg-yellow-100 text-yellow-700',
    COMPLETED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
  };

  const statusLabel = project.status.replace('_', ' ');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Detail Proyek: ${project.projectCode}`}
      cancelText="Tutup"
    >
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                STATUS_COLORS[project.status] || 'bg-gray-100'
              }`}
            >
              {statusLabel}
            </span>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
              {project.division.replace('_', ' ')}
            </span>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
              {project.activityType}
            </span>
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
            Progress ({project.progressPercent}%)
          </label>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
            <div
              className={`h-2.5 rounded-full ${
                project.progressPercent === 100 ? 'bg-green-600' : 'bg-blue-600'
              }`}
              style={{ width: `${project.progressPercent}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
              Tanggal Mulai
            </label>
            <p className="text-sm text-gray-900 mt-1">
              {project.startDate
                ? new Date(project.startDate).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : '-'}
            </p>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
              Tanggal Selesai
            </label>
            <p className="text-sm text-gray-900 mt-1">
              {project.endDate
                ? new Date(project.endDate).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : '-'}
            </p>
          </div>
        </div>

        {project.description && (
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
              Deskripsi
            </label>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 mt-1">
              {project.description}
            </p>
          </div>
        )}

        {/* Team Section */}
        <div className="border-t border-gray-100 pt-4">
          <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-3 block">
            Tim Proyek
          </label>
          
          <div className="space-y-4">
            {/* Leader */}
            <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
              <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm">
                {project.leader.fullName.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">
                  {project.leader.fullName} <span className="text-blue-600 text-xs font-normal">(Ketua)</span>
                </p>
                <p className="text-xs text-gray-500">{project.leader.expertDivision}</p>
              </div>
            </div>

            {/* Members */}
            {project.teamMembers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold text-xs">
                      {member.fullName.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium text-gray-900 truncate">{member.fullName}</p>
                      <p className="text-xs text-gray-500 truncate">{member.expertDivision}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
                <p className="text-sm text-gray-400 italic">Belum ada anggota tim tambahan.</p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
