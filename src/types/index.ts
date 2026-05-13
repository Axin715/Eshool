// src/types/index.ts

// ========== 枚举 ==========
export type UserRole = 'parent' | 'teacher';

export type LeaveType = 'sick' | 'personal' | 'other';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export type VisitType = 'short' | 'long';
export type VisitStatus = 'pending' | 'approved' | 'rejected' | 'expired';

export type AppointmentType = 'doctor' | 'counsel';
export type AppointmentStatus = 'confirmed' | 'cancelled';

export type MessageType = 'class_notice' | 'child_update' | 'system';

// ========== 核心实体 ==========
export interface User {
  id: string;
  openid: string;
  nickname: string;
  avatar: string;
  phone: string;
  roles: UserRole[];
}

export interface Parent {
  userId: string;
  studentIds: string[];
}

export interface Teacher {
  userId: string;
  classIds: string[];
  isHeadTeacher: boolean;
  headClassId: string;
}

export interface Student {
  id: string;
  name: string;
  className: string;
  classId: string;
  parentId: string;
  mealBalance: number;
}

export interface Class {
  id: string;
  name: string;
  grade: number;
  headTeacherId: string;
}

// ========== 业务实体 ==========
export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  applicantId: string;
  applicantName: string;
  leaveType: LeaveType;
  startTime: string;
  endTime: string;
  reason: string;
  status: LeaveStatus;
  approverId: string;
  approverName: string;
  createdAt: string;
}

export interface VisitRequest {
  id: string;
  userId: string;
  userName: string;
  visitType: VisitType;
  date: string;
  dateRange?: { start: string; end: string };
  reason: string;
  status: VisitStatus;
  qrCodeToken: string;
  expireTime: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  userId: string;
  userName: string;
  type: AppointmentType;
  date: string;
  timeSlot: string;
  description: string;
  status: AppointmentStatus;
  createdAt: string;
}

export interface DutyDay {
  date: string;
  parentId: string;
  parentName: string;
}

export interface DutySchedule {
  id: string;
  classId: string;
  className: string;
  weekStart: string;
  dailyAssignments: DutyDay[];
  published: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  coverImage: string;
  type: 'news' | 'activity' | 'notice';
  createdAt: string;
}

export interface Message {
  id: string;
  type: MessageType;
  title: string;
  content: string;
  targetClassId?: string;
  targetStudentId?: string;
  read: boolean;
  createdAt: string;
}

// ========== 身份上下文 ==========
export interface IdentityContext {
  activeRole: UserRole;
  studentIds?: string[];
  classIds?: string[];
  isHeadTeacher?: boolean;
  headClassId?: string;
}

// ========== API 响应格式 ==========
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
