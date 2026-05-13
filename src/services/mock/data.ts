// src/services/mock/data.ts
import type { User, Student, Class, NewsItem, Message, LeaveRequest, VisitRequest, Appointment, DutySchedule, Parent, Teacher } from '@/types';

// ========== 班级 ==========
export const mockClasses: Class[] = [
  { id: 'c1', name: '一年级1班', grade: 1, headTeacherId: 'u3' },
  { id: 'c2', name: '一年级2班', grade: 1, headTeacherId: 'u4' },
  { id: 'c3', name: '二年级1班', grade: 2, headTeacherId: 'u5' },
];

// ========== 学生 ==========
export const mockStudents: Student[] = [
  { id: 's1', name: '小明', classId: 'c1', className: '一年级1班', parentId: 'u1', mealBalance: 125.50 },
  { id: 's2', name: '小红', classId: 'c1', className: '一年级1班', parentId: 'u2', mealBalance: 80.00 },
  { id: 's3', name: '小刚', classId: 'c2', className: '一年级2班', parentId: 'u2', mealBalance: 200.00 },
  { id: 's4', name: '小丽', classId: 'c3', className: '二年级1班', parentId: 'u1', mealBalance: 55.00 },
  { id: 's5', name: '小华', classId: 'c3', className: '二年级1班', parentId: 'u3', mealBalance: 310.00 },
];

// ========== 用户 ==========
export const mockUsers: User[] = [
  { id: 'u1', openid: 'mock_openid_1', nickname: '张妈妈', avatar: '/static/avatar/parent1.png', phone: '13800001001', roles: ['parent'] },
  { id: 'u2', openid: 'mock_openid_2', nickname: '李妈妈', avatar: '/static/avatar/parent2.png', phone: '13800001002', roles: ['parent', 'teacher'] },
  { id: 'u3', openid: 'mock_openid_3', nickname: '王老师', avatar: '/static/avatar/teacher1.png', phone: '13800001003', roles: ['teacher'] },
  { id: 'u4', openid: 'mock_openid_4', nickname: '赵老师', avatar: '/static/avatar/teacher2.png', phone: '13800001004', roles: ['teacher'] },
  { id: 'u5', openid: 'mock_openid_5', nickname: '刘老师', avatar: '/static/avatar/teacher3.png', phone: '13800001005', roles: ['teacher'] },
];

// ========== 家长关联 ==========
export const mockParents: Record<string, Parent> = {
  'u1': { userId: 'u1', studentIds: ['s1', 's4'] },
  'u2': { userId: 'u2', studentIds: ['s2', 's3'] },
};

// ========== 老师关联 ==========
export const mockTeachers: Record<string, Teacher> = {
  'u2': { userId: 'u2', classIds: ['c2'], isHeadTeacher: false, headClassId: '' },
  'u3': { userId: 'u3', classIds: ['c1'], isHeadTeacher: true, headClassId: 'c1' },
  'u4': { userId: 'u4', classIds: ['c2'], isHeadTeacher: true, headClassId: 'c2' },
  'u5': { userId: 'u5', classIds: ['c3'], isHeadTeacher: true, headClassId: 'c3' },
};

// ========== 新闻 ==========
export const mockNews: NewsItem[] = [
  { id: 'n1', title: '2026年春季运动会圆满举行', content: '近日，我校成功举办了2026年春季运动会，全校师生积极参与，展现了良好的精神风貌。', coverImage: '/static/news/sports.jpg', type: 'activity', createdAt: '2026-05-10' },
  { id: 'n2', title: '关于开展"书香校园"读书月活动的通知', content: '为培养学生阅读习惯，营造浓厚的读书氛围，学校决定开展读书月活动。', coverImage: '/static/news/reading.jpg', type: 'notice', createdAt: '2026-05-08' },
  { id: 'n3', title: '我校学生在市数学竞赛中荣获佳绩', content: '在刚刚结束的市级数学竞赛中，我校多名学生获得优异成绩。', coverImage: '/static/news/math.jpg', type: 'news', createdAt: '2026-05-05' },
  { id: 'n4', title: '端午节放假通知', content: '根据国家法定节假日安排，端午节放假时间为6月22日至24日。', coverImage: '/static/news/holiday.jpg', type: 'notice', createdAt: '2026-05-12' },
];

// ========== 消息 ==========
export const mockMessages: Message[] = [
  { id: 'm1', type: 'class_notice', title: '班级通知：家长会时间调整', content: '原定于本周五的家长会调整至下周一晚上7点，请各位家长准时参加。', targetClassId: 'c1', read: false, createdAt: '2026-05-12' },
  { id: 'm2', type: 'child_update', title: '小明今天表现优秀', content: '小明在数学课上积极回答问题，获得老师表扬。', targetStudentId: 's1', read: false, createdAt: '2026-05-12' },
  { id: 'm3', type: 'system', title: '请假审批结果', content: '您的请假申请已通过审批。', read: true, createdAt: '2026-05-11' },
];

// ========== 请假记录 ==========
export const mockLeaveRequests: LeaveRequest[] = [
  { id: 'l1', studentId: 's1', studentName: '小明', applicantId: 'u1', applicantName: '张妈妈', leaveType: 'sick', startTime: '2026-05-15', endTime: '2026-05-16', reason: '感冒发烧需要在家休息', status: 'pending', approverId: 'u3', approverName: '王老师', createdAt: '2026-05-13' },
  { id: 'l2', studentId: 's3', studentName: '小刚', applicantId: 'u4', applicantName: '赵老师', leaveType: 'personal', startTime: '2026-05-14', endTime: '2026-05-14', reason: '家里有急事需请假一天', status: 'approved', approverId: 'u4', approverName: '赵老师', createdAt: '2026-05-12' },
];

// ========== 访校记录 ==========
export const mockVisitRequests: VisitRequest[] = [
  { id: 'v1', userId: 'u1', userName: '张妈妈', visitType: 'short', date: '2026-05-16', reason: '给孩子送学习用品', status: 'approved', qrCodeToken: 'visit_token_v1_abc123', expireTime: '2026-05-16', createdAt: '2026-05-13' },
];

// ========== 预约记录 ==========
export const mockAppointments: Appointment[] = [
  { id: 'a1', userId: 'u1', userName: '张妈妈', type: 'doctor', date: '2026-05-20', timeSlot: '09:00-09:30', description: '孩子最近经常头疼，想咨询一下', status: 'confirmed', createdAt: '2026-05-13' },
];

// ========== 值班排班 ==========
export const mockDutySchedules: DutySchedule[] = [
  {
    id: 'd1',
    classId: 'c1',
    className: '一年级1班',
    weekStart: '2026-05-11',
    dailyAssignments: [
      { date: '2026-05-11', parentId: 'u1', parentName: '张妈妈' },
      { date: '2026-05-12', parentId: 'u2', parentName: '李妈妈' },
    ],
    published: true,
  },
];
