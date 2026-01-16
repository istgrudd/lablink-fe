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

// Project
export interface MemberSummary {
  id: string;
  username: string;
  fullName: string;
  expertDivision: string;
}

export interface Project {
  id: string;
  projectCode: string;
  name: string;
  division: string;
  activityType: string;
  status: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  progressPercent: number;
  leader: MemberSummary;
  teamMembers: MemberSummary[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  name: string;
  division: string;
  activityType: string;
  status: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  progressPercent: number;
  leaderId: string;
  teamMemberIds: string[];
}

export interface UpdateProjectRequest {
  name?: string;
  division?: string;
  activityType?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  progressPercent?: number;
  leaderId?: string;
  teamMemberIds?: string[];
}

// Event
export interface CommitteeMember {
  memberId: string;
  username: string;
  fullName: string;
  role: string;
}

export interface Event {
  id: string;
  eventCode: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  pic: MemberSummary;
  committee: CommitteeMember[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventRequest {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  picId: string;
}

export interface UpdateEventRequest {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  picId?: string;
  committee?: { memberId: string; role: string }[];
}

// Archive
export interface ArchiveSource {
  id: string;
  code: string;
  name: string;
  leader: string;
}

export interface Archive {
  id: string;
  archiveCode: string;
  title: string;
  description: string;
  archiveType: string;
  department: string;
  sourceType: string;
  source: ArchiveSource;
  publishLocation: string;
  referenceNumber: string;
  publishDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateArchiveRequest {
  title: string;
  description?: string;
  archiveType: string;
  sourceType: string;
  projectId?: string;
  eventId?: string;
  publishLocation?: string;
  referenceNumber?: string;
  publishDate?: string;
}

export interface UpdateArchiveRequest {
  title?: string;
  description?: string;
  publishLocation?: string;
  referenceNumber?: string;
  publishDate?: string;
}
