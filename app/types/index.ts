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
  position?: string; // Jabatan dalam periode
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
  totalMembers: number;
  totalProjects: number;
  totalEvents: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePeriodRequest {
  code: string;
  name: string;
  startDate: string;
  endDate: string;
}

export interface ClosePeriodRequest {
  newPeriodId: string;
  continuingMemberIds: string[];
}

export interface MemberPeriod {
  memberId: string;
  memberName: string;
  memberNim: string;
  periodCode: string;
  status: string; // ACTIVE | ALUMNI
  position: string;
}

export interface AddMemberToPeriodRequest {
  memberId: string;
  position: string;
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

// Letter (Surat)
export interface LetterEventSummary {
  id: string;
  eventCode: string;
  name: string;
}

export interface Letter {
  id: string;
  letterNumber: string | null;  // null until approved
  letterType: string;
  category: string;
  subject: string;
  recipient: string;
  content: string;
  attachment: string;
  
  // Requester info (auto-filled)
  requesterName: string;
  requesterNim: string;
  
  // Borrow date and Return Date
  borrowDate: string;
  borrowReturnDate: string;
  
  // Dates
  issueDate: string | null;  // Set on approval
  
  // Status: PENDING, APPROVED, REJECTED
  status: string;
  
  // Approval info
  approvedBy: string;
  rejectionReason: string;
  
  event?: LetterEventSummary;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLetterRequest {
  letterType: string;
  category: string;
  subject: string;
  recipient: string;
  content?: string;
  attachment?: string;
  eventId?: string;
  borrowDate?: string;
  borrowReturnDate?: string;
}

export interface IncomingLetter {
  id: string;
  senderName: string;
  senderInstitution: string;
  subject: string;
  receivedDate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIncomingLetterRequest {
  senderName: string;
  senderInstitution: string;
  subject: string;
  receivedDate: string;
  notes?: string;
}
