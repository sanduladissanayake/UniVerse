export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  studentId?: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  STUDENT = 'STUDENT',
  CLUB_ADMIN = 'CLUB_ADMIN',
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
  FACULTY = 'FACULTY'
}

export interface Event {
  id: string;
  title: string;
  description: string;
  eventDate: Date;
  startTime: string;
  endTime: string;
  location: string;
  venue?: string;
  maxAttendees?: number;
  currentAttendees: number;
  registrationDeadline?: Date;
  isPublic: boolean;
  requiresRegistration: boolean;
  eventType: EventType;
  imageUrl?: string;
  //club: Club;
  organizer: User;
  attendees: User[];
  createdAt: Date;
  updatedAt: Date;
}

export enum EventType {
  WORKSHOP = 'WORKSHOP',
  SEMINAR = 'SEMINAR',
  MEETING = 'MEETING',
  SOCIAL = 'SOCIAL',
  COMPETITION = 'COMPETITION',
  CONFERENCE = 'CONFERENCE',
  FUNDRAISER = 'FUNDRAISER',
  VOLUNTEER = 'VOLUNTEER',
  SPORTS = 'SPORTS',
  CULTURAL = 'CULTURAL'
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: AnnouncementPriority;
  isActive: boolean;
  targetAudience: string[];
  // club?: Club;
  author: User;
  expiryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum AnnouncementPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export interface SocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
}

export interface ContactInfo {
  email: string;
  phone?: string;
  address?: string;
  officeHours?: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}


export interface CreateAnnouncementForm {
  title: string;
  content: string;
  priority: AnnouncementPriority;
  targetAudience: string[];
  expiryDate?: string;
}

// Navigation types
export type NavigationPage = 'home' | 'events' | 'clubs' | 'announcements' | 'contact' | 'profile' | 'dashboard';