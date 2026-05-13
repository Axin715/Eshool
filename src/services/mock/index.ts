// src/services/mock/index.ts
import type { ApiResponse, User, NewsItem, Message, LeaveRequest, VisitRequest, Appointment, DutySchedule, Student } from '@/types';
import {
  mockUsers, mockNews, mockMessages, mockLeaveRequests,
  mockVisitRequests, mockAppointments, mockDutySchedules,
  mockStudents, mockClasses, mockParents, mockTeachers,
} from './data';

function delay<T>(data: T, ms = 300): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(data), ms));
}

function ok<T>(data: T): ApiResponse<T> {
  return { code: 0, message: 'ok', data };
}

export const mockApi = {
  // ====== 用户 ======
  async loginByWechat(): Promise<ApiResponse<{ token: string; user: User }>> {
    const user = mockUsers[0];
    const token = 'mock_token_' + user.id;
    return delay(ok({ token, user }));
  },

  async loginByPhone(phone: string): Promise<ApiResponse<{ token: string; user: User }>> {
    const user = mockUsers.find(u => u.phone === phone);
    if (!user) return delay({ code: 1001, message: '用户不存在', data: null as any });
    return delay(ok({ token: 'mock_token_' + user.id, user }));
  },

  async switchUser(userId: string): Promise<ApiResponse<User>> {
    const user = mockUsers.find(u => u.id === userId)!;
    return delay(ok(user));
  },

  // ====== 绑定数据 ======
  async getParentStudents(userId: string): Promise<ApiResponse<Student[]>> {
    const parent = mockParents[userId];
    if (!parent) return delay(ok([]));
    const students = parent.studentIds.map(sid => mockStudents.find(s => s.id === sid)!).filter(Boolean);
    return delay(ok(students));
  },

  async getTeacherClasses(userId: string): Promise<ApiResponse<{ id: string; name: string; grade: number; isHeadTeacher: boolean }[]>> {
    const teacher = mockTeachers[userId];
    if (!teacher) return delay(ok([]));
    const classes = teacher.classIds.map(cid => {
      const c = mockClasses.find(cl => cl.id === cid)!;
      return { id: c.id, name: c.name, grade: c.grade, isHeadTeacher: teacher.isHeadTeacher && teacher.headClassId === c.id };
    });
    return delay(ok(classes));
  },

  // ====== 新闻 ======
  async getNewsList(): Promise<ApiResponse<NewsItem[]>> {
    return delay(ok([...mockNews].sort((a, b) => b.createdAt.localeCompare(a.createdAt))));
  },

  // ====== 消息 ======
  async getMessages(userId: string, isParentMode: boolean): Promise<ApiResponse<Message[]>> {
    let msgs = [...mockMessages];
    if (isParentMode) {
      const parent = mockParents[userId];
      if (parent) {
        const studentIds = parent.studentIds;
        msgs = msgs.filter(m =>
          m.type === 'system' ||
          (m.type === 'child_update' && studentIds.includes(m.targetStudentId || '')) ||
          m.type === 'class_notice'
        );
      }
    }
    return delay(ok(msgs));
  },

  // ====== 请假 ======
  async getLeaveRequests(userId: string, isParentMode: boolean): Promise<ApiResponse<LeaveRequest[]>> {
    let list = [...mockLeaveRequests];
    if (isParentMode) {
      const parent = mockParents[userId];
      list = list.filter(l => parent?.studentIds.includes(l.studentId));
    } else {
      const teacher = mockTeachers[userId];
      const classIds = teacher?.classIds || [];
      list = list.filter(l => classIds.includes(mockStudents.find(s => s.id === l.studentId)?.classId || ''));
    }
    return delay(ok(list));
  },

  async createLeaveRequest(data: Partial<LeaveRequest>): Promise<ApiResponse<LeaveRequest>> {
    const newItem: LeaveRequest = {
      id: 'l' + Date.now(),
      studentId: data.studentId || '',
      studentName: data.studentName || '',
      applicantId: data.applicantId || '',
      applicantName: data.applicantName || '',
      leaveType: data.leaveType || 'personal',
      startTime: data.startTime || '',
      endTime: data.endTime || '',
      reason: data.reason || '',
      status: data.applicantId && mockTeachers[data.applicantId] ? 'approved' : 'pending',
      approverId: data.approverId || '',
      approverName: data.approverName || '',
      createdAt: new Date().toISOString().slice(0, 10),
    };
    mockLeaveRequests.unshift(newItem);
    return delay(ok(newItem));
  },

  async approveLeave(leaveId: string, approved: boolean): Promise<ApiResponse<LeaveRequest>> {
    const item = mockLeaveRequests.find(l => l.id === leaveId);
    if (item) {
      item.status = approved ? 'approved' : 'rejected';
    }
    return delay(ok(item!));
  },

  // ====== 访校 ======
  async getVisitRequests(userId: string): Promise<ApiResponse<VisitRequest[]>> {
    return delay(ok(mockVisitRequests.filter(v => v.userId === userId)));
  },

  async createVisitRequest(data: Partial<VisitRequest>): Promise<ApiResponse<VisitRequest>> {
    const newItem: VisitRequest = {
      id: 'v' + Date.now(),
      userId: data.userId || '',
      userName: data.userName || '',
      visitType: data.visitType || 'short',
      date: data.date || '',
      dateRange: data.dateRange,
      reason: data.reason || '',
      status: 'approved',
      qrCodeToken: 'visit_token_' + Date.now(),
      expireTime: data.visitType === 'long' ? (data.dateRange?.end || data.date || '') : (data.date || ''),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    mockVisitRequests.unshift(newItem);
    return delay(ok(newItem));
  },

  // ====== 心理校园 ======
  async getAppointments(userId: string): Promise<ApiResponse<Appointment[]>> {
    return delay(ok(mockAppointments.filter(a => a.userId === userId)));
  },

  async createAppointment(data: Partial<Appointment>): Promise<ApiResponse<Appointment>> {
    const newItem: Appointment = {
      id: 'a' + Date.now(),
      userId: data.userId || '',
      userName: data.userName || '',
      type: data.type || 'doctor',
      date: data.date || '',
      timeSlot: data.timeSlot || '',
      description: data.description || '',
      status: 'confirmed',
      createdAt: new Date().toISOString().slice(0, 10),
    };
    mockAppointments.unshift(newItem);
    return delay(ok(newItem));
  },

  async cancelAppointment(appointmentId: string): Promise<ApiResponse<Appointment>> {
    const item = mockAppointments.find(a => a.id === appointmentId);
    if (item) item.status = 'cancelled';
    return delay(ok(item!));
  },

  // ====== 饭卡 ======
  async getStudentsForRecharge(userId: string, isParentMode: boolean): Promise<ApiResponse<Student[]>> {
    if (isParentMode) {
      const parent = mockParents[userId];
      const students = parent?.studentIds.map(sid => mockStudents.find(s => s.id === sid)!).filter(Boolean) || [];
      return delay(ok(students));
    } else {
      const teacher = mockTeachers[userId];
      const classIds = teacher?.classIds || [];
      const students = mockStudents.filter(s => classIds.includes(s.classId));
      return delay(ok(students));
    }
  },

  async rechargeMealCard(studentId: string, amount: number): Promise<ApiResponse<{ balance: number }>> {
    const student = mockStudents.find(s => s.id === studentId);
    if (student) student.mealBalance += amount;
    return delay(ok({ balance: student?.mealBalance || 0 }));
  },

  // ====== 值班排班 ======
  async getDutySchedule(classId: string, weekStart: string): Promise<ApiResponse<DutySchedule | null>> {
    const schedule = mockDutySchedules.find(
      d => d.classId === classId && d.weekStart === weekStart
    ) || null;
    return delay(ok(schedule));
  },

  async saveDutySchedule(data: Partial<DutySchedule>): Promise<ApiResponse<DutySchedule>> {
    const existing = mockDutySchedules.findIndex(
      d => d.classId === data.classId && d.weekStart === data.weekStart
    );
    const item: DutySchedule = {
      id: data.id || 'd' + Date.now(),
      classId: data.classId || '',
      className: data.className || '',
      weekStart: data.weekStart || '',
      dailyAssignments: data.dailyAssignments || [],
      published: data.published ?? false,
    };
    if (existing >= 0) {
      mockDutySchedules[existing] = item;
    } else {
      mockDutySchedules.push(item);
    }
    return delay(ok(item));
  },

  // ====== 班级家长列表 ======
  async getClassParents(classId: string): Promise<ApiResponse<{ id: string; name: string }[]>> {
    const studentIds = mockStudents.filter(s => s.classId === classId).map(s => s.parentId);
    const parentIds = [...new Set(studentIds)];
    const parents = parentIds.map(pid => {
      const user = mockUsers.find(u => u.id === pid);
      return { id: pid, name: user?.nickname || '未知' };
    });
    return delay(ok(parents));
  },
};
