'use client';

import { useState, useEffect } from 'react';
import { api } from '@/app/lib/api';
import Card from '@/app/components/ui/Card';
import Input from '@/app/components/ui/Input';
import Select from '@/app/components/ui/Select';
import { Search, Filter, Calendar, User, FileText, RefreshCw } from 'lucide-react';

interface ActivityLog {
  id: string;
  action: string;
  targetType: string;
  targetName: string;
  userName: string;
  timestamp: string;
  details?: string;
}

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<ActivityLog[]>('/activity-logs');
      // Ensure response is an array
      setLogs(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Failed to fetch activity logs:', error);
      setLogs([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const getActionBadge = (action: string) => {
    const badges = {
      CREATE: 'bg-success-light text-success',
      UPDATE: 'bg-info-light text-info',
      DELETE: 'bg-error-light text-error',
      APPROVE: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      REJECT: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    };
    return badges[action as keyof typeof badges] || 'bg-muted text-muted-foreground';
  };

  const getActionIcon = (action: string) => {
    const icons = {
      CREATE: '➕',
      UPDATE: '✏️',
      DELETE: '🗑️',
      APPROVE: '✅',
      REJECT: '❌',
    };
    return icons[action as keyof typeof icons] || '📝';
  };

  const filteredLogs = Array.isArray(logs) ? logs.filter((log) => {
    const matchesSearch = 
      log.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.targetName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAction = !actionFilter || log.action === actionFilter;
    const matchesType = !typeFilter || log.targetType === typeFilter;
    
    return matchesSearch && matchesAction && matchesType;
  }) : [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Activity Log</h1>
          <p className="text-muted-foreground mt-1">
            Rekam jejak aktivitas sistem sedang dalam tahap pengembangan
          </p>
        </div>
        
        <button 
          onClick={fetchLogs}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <Input
              type="search"
              placeholder="Cari user, target, atau detail..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-5 h-5" />}
            />
          </div>

          {/* Action Filter */}
          <Select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            options={[
              { value: '', label: 'Semua Aksi' },
              { value: 'CREATE', label: 'Create' },
              { value: 'UPDATE', label: 'Update' },
              { value: 'DELETE', label: 'Delete' },
              { value: 'APPROVE', label: 'Approve' },
              { value: 'REJECT', label: 'Reject' },
            ]}
          />

          {/* Type Filter */}
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            options={[
              { value: '', label: 'Semua Tipe' },
              { value: 'MEMBER', label: 'Member' },
              { value: 'PROJECT', label: 'Project' },
              { value: 'EVENT', label: 'Event' },
              { value: 'LETTER', label: 'Letter' },
              { value: 'ARCHIVE', label: 'Archive' },
              { value: 'PRESENCE', label: 'Presence' },
            ]}
          />

          {/* Date Range */}
          <div className="flex gap-2">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="text-sm"
            />
          </div>
        </div>
      </Card>

      {/* Activity Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-default">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Waktu
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  User
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Aksi
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Target
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Detail
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-default">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Memuat data...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="w-12 h-12 text-muted-foreground" />
                      <p className="text-muted-foreground">Tidak ada aktivitas yang ditemukan</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr 
                    key={log.id} 
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(log.timestamp).toLocaleString('id-ID')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">{log.userName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getActionBadge(log.action)}`}>
                        <span>{getActionIcon(log.action)}</span>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-foreground">{log.targetName}</p>
                        <p className="text-xs text-muted-foreground">{log.targetType}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground max-w-md truncate">
                      {log.details || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Info */}
        {!isLoading && filteredLogs.length > 0 && (
          <div className="px-6 py-4 border-t border-default bg-muted/30">
            <p className="text-sm text-muted-foreground text-center">
              Menampilkan {filteredLogs.length} dari {logs.length} aktivitas
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}