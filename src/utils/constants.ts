// src/utils/constants.ts

export const LEAVE_TYPE_MAP = {
  sick: '病假',
  personal: '事假',
  other: '其他',
} as const;

export const LEAVE_STATUS_MAP = {
  pending: '待审批',
  approved: '已批准',
  rejected: '已拒绝',
} as const;

export const VISIT_TYPE_MAP = {
  short: '短期访校',
  long: '长期访校',
} as const;

export const APPOINTMENT_TYPE_MAP = {
  doctor: '校医',
  counsel: '心理咨询',
} as const;

export const MESSAGE_TYPE_MAP = {
  class_notice: '班级通知',
  child_update: '孩子动态',
  system: '系统消息',
} as const;

export const MEAL_AMOUNTS = [50, 100, 200, 300, 500];

export const TIME_SLOTS = [
  '08:00-08:30', '08:30-09:00', '09:00-09:30', '09:30-10:00',
  '10:00-10:30', '10:30-11:00', '11:00-11:30',
  '14:00-14:30', '14:30-15:00', '15:00-15:30', '15:30-16:00',
  '16:00-16:30', '16:30-17:00',
];

export const STORAGE_KEYS = {
  USER: 'ec_user',
  TOKEN: 'ec_token',
  ACTIVE_IDENTITY: 'ec_active_identity',
} as const;
