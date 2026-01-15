// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Auth
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: string;
  isPasswordChanged: boolean;
}

// Member
export interface Member {
  id: string;
  username: string;
  fullName: string;
  role: string;
  expertDivision: string;
  department: string;
  email: string;
  phoneNumber: string;
  socialMediaLink: string;
  isActive: boolean;
  isPasswordChanged: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMemberRequest {
  nim: string;
  fullName: string;
  expertDivision: string;
  department: string;
}

export interface UpdateMemberRequest {
  fullName?: string;
  expertDivision?: string;
  department?: string;
  email?: string;
  phoneNumber?: string;
  socialMediaLink?: string;
}

// Dashboard
export interface DashboardSummary {
  statistics: Statistics;
  upcomingDeadlines: UpcomingItem[];
  recentActivities: RecentActivity[];
}

export interface Statistics {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalEvents: number;
  ongoingEvents: number;
  completedEvents: number;
  totalMembers: number;
  activeMembers: number;
  totalArchives: number;
  totalLetters: number;
}

export interface UpcomingItem {
  type: string;
  id: string;
  code: string;
  name: string;
  deadline: string;
  daysRemaining: number;
}

export interface RecentActivity {
  action: string;
  targetType: string;
  targetName: string;
  userName: string;
  timestamp: string;
  timeAgo: string;
}

// Period
export interface Period {
  id: string;
  code: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isArchived: boolean;
}
