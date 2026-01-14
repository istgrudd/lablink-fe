'use client';

import { useEffect, useState } from 'react';
import { api } from '@/app/lib/api';
import { DashboardSummary } from '@/app/types';
import Card from '@/app/components/ui/Card';

export default function DashboardPage() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<DashboardSummary>('/dashboard/summary');
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

  if (!data) return null;

  const stats = data.statistics;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Projects"
          value={stats.totalProjects}
          subtitle={`${stats.activeProjects} active`}
          icon="📁"
          color="blue"
        />
        <StatCard
          title="Events"
          value={stats.totalEvents}
          subtitle={`${stats.ongoingEvents} ongoing`}
          icon="📅"
          color="green"
        />
        <StatCard
          title="Members"
          value={stats.totalMembers}
          subtitle={`${stats.activeMembers} active`}
          icon="👥"
          color="purple"
        />
        <StatCard
          title="Archives"
          value={stats.totalArchives}
          subtitle={`${stats.totalLetters} letters`}
          icon="📦"
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <Card title="Deadline Terdekat" subtitle="30 hari ke depan">
          <div className="space-y-3">
            {data.upcomingDeadlines.length === 0 ? (
              <p className="text-gray-500 text-sm">Tidak ada deadline terdekat</p>
            ) : (
              data.upcomingDeadlines.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">
                      {item.type === 'PROJECT' ? '📁' : '📅'}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.code}</p>
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${
                    item.daysRemaining <= 3 ? 'text-red-600' :
                    item.daysRemaining <= 7 ? 'text-orange-600' :
                    'text-gray-600'
                  }`}>
                    {item.daysRemaining === 0 ? 'Hari ini' :
                     item.daysRemaining === 1 ? 'Besok' :
                     `${item.daysRemaining} hari lagi`}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Recent Activities */}
        <Card title="Aktivitas Terbaru" subtitle="10 terakhir">
          <div className="space-y-3">
            {data.recentActivities.length === 0 ? (
              <p className="text-gray-500 text-sm">Belum ada aktivitas</p>
            ) : (
              data.recentActivities.map((activity, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-lg">
                    {activity.action === 'CREATE' ? '➕' :
                     activity.action === 'UPDATE' ? '✏️' :
                     activity.action === 'DELETE' ? '🗑️' : '🔵'}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.userName}</span>
                      {' '}
                      {activity.action.toLowerCase()}
                      {' '}
                      <span className="font-medium">{activity.targetName}</span>
                    </p>
                    <p className="text-xs text-gray-500">{activity.timeAgo}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  color,
}: {
  title: string;
  value: number;
  subtitle: string;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl ${colors[color]} flex items-center justify-center text-2xl`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-400">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
