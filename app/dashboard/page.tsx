'use client';

import { useEffect, useState } from 'react';
import { api } from '@/app/lib/api';
import { DashboardSummary } from '@/app/types';
import { useAuth } from '@/app/context/AuthContext';
import Card from '@/app/components/ui/Card';
import StatCard from '@/app/components/ui/StatCard';
import { CardSkeleton } from '@/app/components/ui/Skeleton';
import EmptyState from '@/app/components/ui/EmptyState';
import { Users, FolderOpen, Calendar, Archive, Clock, Activity } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
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

  if (error) {
    return (
      <div className="bg-error-light border border-error rounded-lg p-4 text-error">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="relative rounded-2xl p-8 shadow-2xl overflow-hidden border border-primary/20">
        {/* FIXED: Menggunakan bg-linear-to-r agar gradient muncul (Tailwind v4) */}
        <div className="absolute inset-0 bg-linear-to-r from-primary via-red-800 to-red-950"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2 text-white drop-shadow-md">
            Selamat Datang, {user?.fullName || 'Administrator'}! 👋
          </h1>
          <p className="text-red-100 font-medium drop-shadow-sm">
            Kelola laboratorium riset Anda dengan mudah dan efisien
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <CardSkeleton count={4} />
        ) : data ? (
          <>
            <StatCard
              title="Total Members"
              value={data.statistics.totalMembers}
              subtitle={`${data.statistics.activeMembers} active`}
              icon={Users}
              color="blue"
            />
            <StatCard
              title="Total Projects"
              value={data.statistics.totalProjects}
              subtitle={`${data.statistics.activeProjects} active`}
              icon={FolderOpen}
              color="green"
            />
            <StatCard
              title="Total Events"
              value={data.statistics.totalEvents}
              subtitle={`${data.statistics.ongoingEvents} ongoing`}
              icon={Calendar}
              color="purple"
            />
            <StatCard
              title="Total Archives"
              value={data.statistics.totalArchives}
              subtitle={`${data.statistics.totalLetters} letters`}
              icon={Archive}
              color="orange"
            />
          </>
        ) : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            {/* FIXED: Menggunakan bg-linear-to-br agar background muncul */}
            <div className="w-12 h-12 bg-linear-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Deadline Terdekat</h2>
              <p className="text-sm text-muted-foreground">30 hari ke depan</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {isLoading ? (
              <div className="space-y-3">
                {[1,2,3].map((i) => (
                  <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            ) : !data || data.upcomingDeadlines.length === 0 ? (
              <div className="py-8">
                <EmptyState
                  title="Tidak ada deadline"
                  description="Tidak ada project atau event dengan deadline dalam 30 hari ke depan"
                  icon="events"
                />
              </div>
            ) : (
              data.upcomingDeadlines.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border border-default hover:shadow-md hover:scale-[1.01] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      item.type === 'PROJECT' 
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' 
                        : 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                    }`}>
                      {item.type === 'PROJECT' ? (
                        <FolderOpen className="w-5 h-5" />
                      ) : (
                        <Calendar className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.code}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                    item.daysRemaining <= 3 ? 'bg-error-light text-error' :
                    item.daysRemaining <= 7 ? 'bg-warning-light text-warning' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {item.daysRemaining === 0 ? 'Hari ini!' :
                     item.daysRemaining === 1 ? 'Besok' :
                     `${item.daysRemaining} hari`}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Recent Activities */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            {/* FIXED: Menggunakan bg-linear-to-br agar background muncul */}
            <div className="w-12 h-12 bg-linear-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Aktivitas Terbaru</h2>
              <p className="text-sm text-muted-foreground">10 terakhir</p>
            </div>
          </div>

          <div className="space-y-3">
            {isLoading ? (
              <div className="space-y-3">
                {[1,2,3].map((i) => (
                  <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            ) : !data || data.recentActivities.length === 0 ? (
              <div className="py-8">
                <EmptyState
                  title="Belum ada aktivitas"
                  description="Aktivitas akan muncul di sini setelah ada perubahan data"
                  icon="default"
                />
              </div>
            ) : (
              data.recentActivities.map((activity, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl border border-default hover:shadow-md hover:scale-[1.01] transition-all"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border border-border ${
                    activity.action === 'CREATE' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                    activity.action === 'UPDATE' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                    activity.action === 'DELETE' ? 'bg-red-500/10 text-red-600 dark:text-red-400' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {activity.action === 'CREATE' ? '➕' :
                     activity.action === 'UPDATE' ? '✏️' :
                     activity.action === 'DELETE' ? '🗑️' : '🔵'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">
                      <span className="font-bold">{activity.userName}</span>
                      {' '}{activity.action.toLowerCase()}{' '}
                      <span className="font-semibold">{activity.targetName}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.timeAgo}</p>
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