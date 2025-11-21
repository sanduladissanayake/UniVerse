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


export interface SocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
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



// Navigation types
export type NavigationPage = 'home' | 'events' | 'clubs' | 'announcements' | 'contact' | 'profile' | 'dashboard';