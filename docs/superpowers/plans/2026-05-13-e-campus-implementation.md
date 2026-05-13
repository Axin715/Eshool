# 数字校园微信小程序 - 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建完整的数字校园微信小程序，包含登录、主页、消息、功能（请假/访校/心理校园/饭卡充值/值班排班）、我的 5 大模块。

**Architecture:** uni-app (Vue 3 + TypeScript) + uView Plus 3.x + Pinia。分层架构：Pages → Components → Stores → Services(Mock+API) → Utils。Mock 数据驱动开发，API 接口预留。

**Tech Stack:** uni-app (Vue 3 Composition API), TypeScript, uView Plus 3.x, Pinia, SCSS, Vite

---

## Phase 1: 项目脚手架搭建

### Task 1: 创建 uni-app 项目

**Files:**
- Create: 整个项目骨架

- [ ] **Step 1: 使用 degit 创建 uni-app Vue3 TS 模板**

```bash
cd /Users/axin/Documents/program/Code/E-Campus
npx degit dcloudio/uni-preset-vue#vite-ts . --force
```

- [ ] **Step 2: 安装基础依赖**

```bash
npm install
```

- [ ] **Step 3: 安装 uView Plus 和 Pinia**

```bash
npm install uview-plus pinia
```

- [ ] **Step 4: 验证项目可运行**

```bash
npx uni-app dev
# 确认编译无错误，Ctrl+C 停止
```

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: scaffold uni-app Vue3 TS project with uView Plus and Pinia"
```

---

### Task 2: 配置 uView Plus 主题与全局样式

**Files:**
- Modify: `src/main.ts`
- Modify: `src/uni.scss`
- Modify: `src/App.vue`

- [ ] **Step 1: 在 main.ts 中注册 uView Plus 和 Pinia**

```typescript
// src/main.ts
import { createSSRApp } from "vue";
import * as Pinia from "pinia";
import uviewPlus from "uview-plus";
import App from "./App.vue";

export function createApp() {
  const app = createSSRApp(App);
  app.use(Pinia.createPinia());
  app.use(uviewPlus);
  return {
    app,
    Pinia,
  };
}
```

- [ ] **Step 2: 在 uni.scss 中引入 uView Plus 全局样式并设置主题色**

```scss
// src/uni.scss
@import 'uview-plus/theme.scss';

// 主题色覆盖
$u-primary: #4A90D9;
$u-success: #4CAF50;
$u-warning: #FFB347;
$u-error: #FF6B6B;
$u-info: #909399;

// 全局页面背景色
page {
  background-color: #F0F6FF;
}
```

- [ ] **Step 3: 设置 App.vue 全局样式**

```vue
<!-- src/App.vue -->
<script setup lang="ts">
import { onLaunch } from '@dcloudio/uni-app';
import { useUserStore } from '@/stores/user';

onLaunch(() => {
  // 检查本地存储的登录状态
  const userStore = useUserStore();
  userStore.checkLoginStatus();
});
</script>

<style lang="scss">
@import 'uview-plus/index.scss';

/* 全局通用样式 */
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-container {
  min-height: 100vh;
  background-color: #F0F6FF;
}
</style>
```

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: configure uView Plus theme, Pinia, and global styles"
```

---

### Task 3: 配置 pages.json 路由和 TabBar

**Files:**
- Modify: `src/pages.json`

- [ ] **Step 1: 编写完整的 pages.json**

```json
{
  "pages": [
    {
      "path": "pages/login/index",
      "style": {
        "navigationBarTitleText": "",
        "navigationStyle": "custom"
      }
    },
    {
      "path": "pages/login/bind",
      "style": {
        "navigationBarTitleText": "绑定信息"
      }
    },
    {
      "path": "pages/features/leave/create",
      "style": {
        "navigationBarTitleText": "请假申请"
      }
    },
    {
      "path": "pages/features/leave/detail",
      "style": {
        "navigationBarTitleText": "请假详情"
      }
    },
    {
      "path": "pages/features/visit/create",
      "style": {
        "navigationBarTitleText": "访校申请"
      }
    },
    {
      "path": "pages/features/visit/detail",
      "style": {
        "navigationBarTitleText": "访校详情"
      }
    },
    {
      "path": "pages/features/psychology/create",
      "style": {
        "navigationBarTitleText": "预约申请"
      }
    },
    {
      "path": "pages/features/meal/recharge",
      "style": {
        "navigationBarTitleText": "饭卡充值"
      }
    },
    {
      "path": "pages/features/meal/records",
      "style": {
        "navigationBarTitleText": "充值记录"
      }
    },
    {
      "path": "pages/features/duty/index",
      "style": {
        "navigationBarTitleText": "班级值班排班"
      }
    },
    {
      "path": "pages/features/duty/edit",
      "style": {
        "navigationBarTitleText": "编辑排班"
      }
    }
  ],
  "globalStyle": {
    "navigationBarTextStyle": "white",
    "navigationBarTitleText": "数字校园",
    "navigationBarBackgroundColor": "#4A90D9",
    "backgroundColor": "#F0F6FF"
  },
  "tabBar": {
    "color": "#999999",
    "selectedColor": "#4A90D9",
    "borderStyle": "black",
    "backgroundColor": "#ffffff",
    "list": [
      {
        "pagePath": "pages/home/index",
        "iconPath": "static/tab/home.png",
        "selectedIconPath": "static/tab/home-active.png",
        "text": "主页"
      },
      {
        "pagePath": "pages/messages/index",
        "iconPath": "static/tab/message.png",
        "selectedIconPath": "static/tab/message-active.png",
        "text": "消息"
      },
      {
        "pagePath": "pages/features/index",
        "iconPath": "static/tab/features.png",
        "selectedIconPath": "static/tab/features-active.png",
        "text": "功能"
      },
      {
        "pagePath": "pages/profile/index",
        "iconPath": "static/tab/profile.png",
        "selectedIconPath": "static/tab/profile-active.png",
        "text": "我的"
      }
    ]
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: configure pages.json with routes and tab bar"
```

---

## Phase 2: 核心基础设施

### Task 4: 创建类型定义

**Files:**
- Create: `src/types/index.ts`

- [ ] **Step 1: 编写完整的 TypeScript 类型定义**

```typescript
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
  // 家长身份
  studentIds?: string[];
  // 老师身份
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
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: add TypeScript type definitions"
```

---

### Task 5: 创建工具函数

**Files:**
- Create: `src/utils/constants.ts`
- Create: `src/utils/auth.ts`
- Create: `src/utils/request.ts`
- Create: `src/utils/date.ts`

- [ ] **Step 1: 创建常量定义**

```typescript
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
```

- [ ] **Step 2: 创建权限判断工具**

```typescript
// src/utils/auth.ts
import type { IdentityContext, UserRole } from '@/types';

export function isParent(identity: IdentityContext): boolean {
  return identity.activeRole === 'parent';
}

export function isTeacher(identity: IdentityContext): boolean {
  return identity.activeRole === 'teacher';
}

export function isHeadTeacher(identity: IdentityContext): boolean {
  return identity.activeRole === 'teacher' && identity.isHeadTeacher === true;
}

export function canApproveLeave(identity: IdentityContext): boolean {
  return identity.activeRole === 'teacher';
}

export function canManageDuty(identity: IdentityContext): boolean {
  return isHeadTeacher(identity);
}

export function canViewChildUpdates(identity: IdentityContext): boolean {
  return identity.activeRole === 'parent';
}
```

- [ ] **Step 3: 创建请求封装**

```typescript
// src/utils/request.ts
import type { ApiResponse } from '@/types';
import { STORAGE_KEYS } from './constants';

const BASE_URL = ''; // Mock 模式无需真实 URL

interface RequestOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: Record<string, any>;
  showLoading?: boolean;
}

export function request<T = any>(options: RequestOptions): Promise<ApiResponse<T>> {
  const { url, method = 'GET', data = {}, showLoading = true } = options;

  if (showLoading) {
    uni.showLoading({ title: '加载中...', mask: true });
  }

  // 从本地存储获取 token
  const token = uni.getStorageSync(STORAGE_KEYS.TOKEN) || '';

  return new Promise((resolve, reject) => {
    uni.request({
      url,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      success: (res) => {
        if (showLoading) uni.hideLoading();
        const response = res.data as ApiResponse<T>;
        if (response.code === 0) {
          resolve(response);
        } else {
          uni.showToast({ title: response.message || '请求失败', icon: 'none' });
          reject(response);
        }
      },
      fail: (err) => {
        if (showLoading) uni.hideLoading();
        uni.showToast({ title: '网络异常', icon: 'none' });
        reject(err);
      },
    });
  });
}
```

- [ ] **Step 4: 创建日期工具函数**

```typescript
// src/utils/date.ts

export function formatDate(date: Date | string, fmt = 'yyyy-MM-dd'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const o: Record<string, number> = {
    'M+': d.getMonth() + 1,
    'd+': d.getDate(),
    'h+': d.getHours(),
    'm+': d.getMinutes(),
    's+': d.getSeconds(),
  };

  let result = fmt;
  if (/(y+)/.test(result)) {
    result = result.replace(RegExp.$1, String(d.getFullYear()).slice(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(result)) {
      const val = String(o[k]);
      result = result.replace(RegExp.$1, RegExp.$1.length === 1 ? val : val.padStart(2, '0'));
    }
  }
  return result;
}

export function getWeekRange(date: Date = new Date()): { start: string; end: string } {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  const sunday = new Date(new Date(monday).setDate(monday.getDate() + 6));
  return {
    start: formatDate(monday),
    end: formatDate(sunday),
  };
}

export function getWeekDates(weekStart: string): string[] {
  const dates: string[] = [];
  const start = new Date(weekStart);
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    dates.push(formatDate(d));
  }
  return dates;
}

export function getDayOfWeek(dateStr: string): string {
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const d = new Date(dateStr);
  return days[d.getDay()];
}
```

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add utility functions - constants, auth, request, date"
```

---

### Task 6: 创建 Mock 数据

**Files:**
- Create: `src/services/mock/data.ts`

- [ ] **Step 1: 编写完整 Mock 数据集**

```typescript
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
  { id: 'n1', title: '2026年春季运动会圆满举行', content: '近日，我校成功举办了2026年春季运动会...', coverImage: '/static/news/sports.jpg', type: 'activity', createdAt: '2026-05-10' },
  { id: 'n2', title: '关于开展"书香校园"读书月活动的通知', content: '为培养学生阅读习惯...', coverImage: '/static/news/reading.jpg', type: 'notice', createdAt: '2026-05-08' },
  { id: 'n3', title: '我校学生在市数学竞赛中荣获佳绩', content: '在刚刚结束的市级数学竞赛中...', coverImage: '/static/news/math.jpg', type: 'news', createdAt: '2026-05-05' },
  { id: 'n4', title: '端午节放假通知', content: '根据国家法定节假日安排...', coverImage: '/static/news/holiday.jpg', type: 'notice', createdAt: '2026-05-12' },
];

// ========== 消息 ==========
export const mockMessages: Message[] = [
  { id: 'm1', type: 'class_notice', title: '班级通知：家长会时间调整', content: '原定于本周五的家长会调整至下周一...', targetClassId: 'c1', read: false, createdAt: '2026-05-12' },
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
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: add comprehensive mock data"
```

---

### Task 7: 创建 Mock API 服务层

**Files:**
- Create: `src/services/mock/index.ts`
- Create: `src/services/api/index.ts`

- [ ] **Step 1: 创建 Mock 服务（模拟异步请求）**

```typescript
// src/services/mock/index.ts
import type { ApiResponse, User, NewsItem, Message, LeaveRequest, VisitRequest, Appointment, DutySchedule, Student } from '@/types';
import {
  mockUsers, mockNews, mockMessages, mockLeaveRequests,
  mockVisitRequests, mockAppointments, mockDutySchedules,
  mockStudents, mockClasses, mockParents, mockTeachers,
} from './data';

// 模拟网络延迟
function delay<T>(data: T, ms = 300): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(data), ms));
}

// 模拟 API 响应包装
function ok<T>(data: T): ApiResponse<T> {
  return { code: 0, message: 'ok', data };
}

export const mockApi = {
  // ====== 用户 ======
  async loginByWechat(): Promise<ApiResponse<{ token: string; user: User }>> {
    const user = mockUsers[0]; // 默认返回第一个用户用于测试
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
    const students = parent.studentIds.map(sid => mockStudents.find(s => s.id === sid)!);
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
      // 家长模式：显示班级通知 + 孩子动态 + 系统消息
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
      const students = parent?.studentIds.map(sid => mockStudents.find(s => s.id === sid)!) || [];
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

  // ====== 班级家长列表（用于排班选择） ======
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
```

- [ ] **Step 2: 创建 API 接口定义（预留真实 API 对接）**

```typescript
// src/services/api/index.ts
// 真实 API 接口定义 - 与 Mock API 保持相同接口签名
// 后期切换到真实后端时，只需修改导入源

import { mockApi } from '@/services/mock';

// 直接导出 mockApi，后期替换为真实 API
export const api = mockApi;
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add mock API service layer with full CRUD operations"
```

---

## Phase 3: 状态管理 (Pinia Stores)

### Task 8: 创建 User Store

**Files:**
- Create: `src/stores/user.ts`

- [ ] **Step 1: 编写 userStore**

```typescript
// src/stores/user.ts
import { defineStore } from 'pinia';
import type { User, IdentityContext, Student, UserRole } from '@/types';
import { api } from '@/services/api';
import { STORAGE_KEYS } from '@/utils/constants';

interface UserState {
  user: User | null;
  token: string;
  activeIdentity: IdentityContext | null;
  students: Student[];
  teacherClasses: { id: string; name: string; grade: number; isHeadTeacher: boolean }[];
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    token: '',
    activeIdentity: null,
    students: [],
    teacherClasses: [],
  }),

  getters: {
    isLoggedIn: (state) => !!state.token && !!state.user,
    activeRole: (state) => state.activeIdentity?.activeRole || null,
    isParent: (state) => state.activeIdentity?.activeRole === 'parent',
    isTeacher: (state) => state.activeIdentity?.activeRole === 'teacher',
    isHeadTeacher: (state) => state.activeIdentity?.isHeadTeacher === true,
    headClassId: (state) => state.activeIdentity?.headClassId || '',
    currentStudents: (state) => state.students,
    currentClasses: (state) => state.teacherClasses,
  },

  actions: {
    checkLoginStatus() {
      const token = uni.getStorageSync(STORAGE_KEYS.TOKEN);
      const userStr = uni.getStorageSync(STORAGE_KEYS.USER);
      const identityStr = uni.getStorageSync(STORAGE_KEYS.ACTIVE_IDENTITY);
      if (token && userStr) {
        this.token = token;
        this.user = JSON.parse(userStr);
        if (identityStr) {
          this.activeIdentity = JSON.parse(identityStr);
        }
      }
    },

    async loginByWechat() {
      const res = await api.loginByWechat();
      this.token = res.data.token;
      this.user = res.data.user;
      this.persistLogin();
      await this.loadIdentityData();
    },

    async loginByPhone(phone: string) {
      const res = await api.loginByPhone(phone);
      this.token = res.data.token;
      this.user = res.data.user;
      this.persistLogin();
      await this.loadIdentityData();
    },

    async loadIdentityData() {
      if (!this.user) return;
      // 加载家长数据
      const studentRes = await api.getParentStudents(this.user.id);
      this.students = studentRes.data;
      // 加载老师数据
      const classRes = await api.getTeacherClasses(this.user.id);
      this.teacherClasses = classRes.data;

      // 设置默认身份：有老师角色默认选老师，否则选家长
      if (this.user.roles.includes('teacher')) {
        const headClass = this.teacherClasses.find(c => c.isHeadTeacher);
        this.activeIdentity = {
          activeRole: 'teacher',
          classIds: this.teacherClasses.map(c => c.id),
          isHeadTeacher: !!headClass,
          headClassId: headClass?.id || '',
        };
      } else if (this.user.roles.includes('parent')) {
        this.activeIdentity = {
          activeRole: 'parent',
          studentIds: this.students.map(s => s.id),
        };
      }
      this.persistIdentity();
    },

    switchRole(role: UserRole) {
      if (!this.user || !this.user.roles.includes(role)) return;
      if (role === 'parent') {
        this.activeIdentity = {
          activeRole: 'parent',
          studentIds: this.students.map(s => s.id),
        };
      } else {
        const headClass = this.teacherClasses.find(c => c.isHeadTeacher);
        this.activeIdentity = {
          activeRole: 'teacher',
          classIds: this.teacherClasses.map(c => c.id),
          isHeadTeacher: !!headClass,
          headClassId: headClass?.id || '',
        };
      }
      this.persistIdentity();
    },

    persistLogin() {
      uni.setStorageSync(STORAGE_KEYS.TOKEN, this.token);
      uni.setStorageSync(STORAGE_KEYS.USER, JSON.stringify(this.user));
    },

    persistIdentity() {
      uni.setStorageSync(STORAGE_KEYS.ACTIVE_IDENTITY, JSON.stringify(this.activeIdentity));
    },

    logout() {
      this.user = null;
      this.token = '';
      this.activeIdentity = null;
      this.students = [];
      this.teacherClasses = [];
      uni.removeStorageSync(STORAGE_KEYS.TOKEN);
      uni.removeStorageSync(STORAGE_KEYS.USER);
      uni.removeStorageSync(STORAGE_KEYS.ACTIVE_IDENTITY);
    },
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: add user store with login, identity switching, and persistence"
```

---

### Task 9: 创建 Message Store

**Files:**
- Create: `src/stores/message.ts`

- [ ] **Step 1: 编写 messageStore**

```typescript
// src/stores/message.ts
import { defineStore } from 'pinia';
import type { Message, MessageType } from '@/types';
import { api } from '@/services/api';
import { useUserStore } from './user';

interface MessageState {
  messages: Message[];
  activeTab: MessageType;
}

export const useMessageStore = defineStore('message', {
  state: (): MessageState => ({
    messages: [],
    activeTab: 'class_notice',
  }),

  getters: {
    filteredMessages: (state) => {
      if (state.activeTab) {
        return state.messages.filter(m => m.type === state.activeTab);
      }
      return state.messages;
    },
    unreadCount: (state) => state.messages.filter(m => !m.read).length,
    classNotices: (state) => state.messages.filter(m => m.type === 'class_notice'),
    childUpdates: (state) => state.messages.filter(m => m.type === 'child_update'),
    systemMessages: (state) => state.messages.filter(m => m.type === 'system'),
  },

  actions: {
    async fetchMessages() {
      const userStore = useUserStore();
      if (!userStore.user) return;
      const res = await api.getMessages(userStore.user.id, userStore.isParent);
      this.messages = res.data;
    },

    setActiveTab(tab: MessageType) {
      this.activeTab = tab;
    },

    markAsRead(messageId: string) {
      const msg = this.messages.find(m => m.id === messageId);
      if (msg) msg.read = true;
    },
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: add message store with filtering and unread tracking"
```

---

## Phase 4: 登录与认证

### Task 10: 创建登录页

**Files:**
- Create: `src/pages/login/index.vue`

- [ ] **Step 1: 编写登录页**

```vue
<!-- src/pages/login/index.vue -->
<template>
  <view class="login-page">
    <view class="login-header">
      <view class="logo-area">
        <text class="logo-icon">🏫</text>
        <text class="app-name">数字校园</text>
        <text class="app-desc">连接家校 · 关爱成长</text>
      </view>
    </view>

    <view class="login-body">
      <!-- 微信授权登录 -->
      <u-button
        type="primary"
        icon="weixin-fill"
        text="微信授权登录"
        shape="circle"
        :customStyle="{ marginBottom: '20rpx', height: '96rpx' }"
        @click="handleWechatLogin"
      />

      <!-- 手机号登录 -->
      <view class="phone-login">
        <view class="divider">
          <view class="divider-line"></view>
          <text class="divider-text">手机号登录</text>
          <view class="divider-line"></view>
        </view>

        <u-form :model="phoneForm" ref="phoneFormRef">
          <u-form-item prop="phone">
            <u-input
              v-model="phoneForm.phone"
              placeholder="请输入手机号"
              type="number"
              maxlength="11"
              prefixIcon="phone"
            />
          </u-form-item>
          <u-form-item prop="code">
            <u-input
              v-model="phoneForm.code"
              placeholder="请输入验证码"
              maxlength="6"
              prefixIcon="lock"
            >
              <template #suffix>
                <u-code
                  :seconds="60"
                  @end="codeEnd"
                  @start="codeStart"
                  ref="codeRef"
                  changeText="X秒"
                />
              </template>
            </u-input>
          </u-form-item>
        </u-form>

        <u-button
          type="primary"
          text="登录"
          shape="circle"
          :customStyle="{ height: '96rpx' }"
          @click="handlePhoneLogin"
        />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const codeRef = ref();

const phoneForm = reactive({
  phone: '',
  code: '',
});

function codeEnd() {}
function codeStart() {}

async function handleWechatLogin() {
  // Mock 模式直接登录
  await userStore.loginByWechat();
  uni.switchTab({ url: '/pages/home/index' });
}

async function handlePhoneLogin() {
  if (!phoneForm.phone || phoneForm.phone.length !== 11) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' });
    return;
  }
  if (!phoneForm.code) {
    uni.showToast({ title: '请输入验证码', icon: 'none' });
    return;
  }
  // Mock 模式验证码任意
  await userStore.loginByPhone(phoneForm.phone);
  uni.switchTab({ url: '/pages/home/index' });
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #4A90D9 0%, #7AB8F5 50%, #F0F6FF 100%);
  display: flex;
  flex-direction: column;
  padding: 0 60rpx;
}

.login-header {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-area {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-icon {
  font-size: 100rpx;
  margin-bottom: 20rpx;
}

.app-name {
  font-size: 48rpx;
  font-weight: bold;
  color: #fff;
}

.app-desc {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 10rpx;
}

.login-body {
  padding-bottom: 100rpx;
}

.phone-login {
  margin-top: 40rpx;
}

.divider {
  display: flex;
  align-items: center;
  margin: 30rpx 0;
}

.divider-line {
  flex: 1;
  height: 1rpx;
  background-color: rgba(255, 255, 255, 0.5);
}

.divider-text {
  padding: 0 20rpx;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: add login page with WeChat auth and phone login"
```

---

### Task 11: 创建身份选择与绑定页

**Files:**
- Create: `src/pages/login/bind.vue`

- [ ] **Step 1: 编写绑定页**

```vue
<!-- src/pages/login/bind.vue -->
<template>
  <view class="bind-page">
    <view class="bind-header">
      <text class="bind-title">完善信息</text>
      <text class="bind-desc">请选择您的身份并完成绑定</text>
    </view>

    <view class="role-select">
      <view
        class="role-card"
        :class="{ active: selectedRole === 'parent' }"
        @click="selectedRole = 'parent'"
      >
        <text class="role-icon">👨‍👩‍👧</text>
        <text class="role-name">我是家长</text>
      </view>
      <view
        class="role-card"
        :class="{ active: selectedRole === 'teacher' }"
        @click="selectedRole = 'teacher'"
        v-if="userStore.user?.roles.includes('teacher')"
      >
        <text class="role-icon">👩‍🏫</text>
        <text class="role-name">我是老师</text>
      </view>
    </view>

    <!-- 家长绑定学生 -->
    <view class="bind-form" v-if="selectedRole === 'parent'">
      <text class="section-title">关联您的孩子</text>
      <view class="student-list" v-if="userStore.students.length">
        <view
          class="student-item"
          v-for="s in userStore.students"
          :key="s.id"
          :class="{ selected: selectedStudentIds.includes(s.id) }"
          @click="toggleStudent(s.id)"
        >
          <text>{{ s.name }} - {{ s.className }}</text>
          <u-icon v-if="selectedStudentIds.includes(s.id)" name="checkbox-mark" color="#4A90D9" />
        </view>
      </view>
      <u-input
        v-model="studentCode"
        placeholder="输入学生编号绑定"
        border="surround"
        :customStyle="{ marginTop: '20rpx' }"
      />
    </view>

    <!-- 老师关联班级 -->
    <view class="bind-form" v-if="selectedRole === 'teacher'">
      <text class="section-title">任教班级</text>
      <view class="class-list" v-if="userStore.teacherClasses.length">
        <view
          class="class-item"
          v-for="c in userStore.teacherClasses"
          :key="c.id"
        >
          <text>{{ c.name }}</text>
          <u-tag v-if="c.isHeadTeacher" text="班主任" type="primary" size="mini" />
        </view>
      </view>
    </view>

    <u-button
      type="primary"
      text="确认进入"
      shape="circle"
      :customStyle="{ marginTop: '60rpx', height: '96rpx' }"
      @click="handleConfirm"
      :disabled="!selectedRole"
    />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const selectedRole = ref<'parent' | 'teacher' | ''>('');
const selectedStudentIds = ref<string[]>([]);
const studentCode = ref('');

function toggleStudent(id: string) {
  const idx = selectedStudentIds.value.indexOf(id);
  if (idx >= 0) {
    selectedStudentIds.value.splice(idx, 1);
  } else {
    selectedStudentIds.value.push(id);
  }
}

function handleConfirm() {
  if (selectedRole.value) {
    userStore.switchRole(selectedRole.value);
    uni.switchTab({ url: '/pages/home/index' });
  }
}
</script>

<style lang="scss" scoped>
.bind-page {
  min-height: 100vh;
  background: #F0F6FF;
  padding: 40rpx 40rpx;
}

.bind-header {
  text-align: center;
  padding: 60rpx 0;
}

.bind-title {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
  display: block;
}

.bind-desc {
  font-size: 26rpx;
  color: #999;
  margin-top: 10rpx;
  display: block;
}

.role-select {
  display: flex;
  gap: 30rpx;
  margin: 40rpx 0;
}

.role-card {
  flex: 1;
  background: #fff;
  border-radius: 16rpx;
  padding: 40rpx;
  text-align: center;
  border: 2rpx solid #e0e0e0;
}

.role-card.active {
  border-color: #4A90D9;
  background: #F0F6FF;
}

.role-icon {
  font-size: 60rpx;
  display: block;
}

.role-name {
  font-size: 28rpx;
  color: #333;
  margin-top: 10rpx;
  display: block;
}

.bind-form {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-top: 20rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.student-item,
.class-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
  font-size: 28rpx;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: add identity selection and binding page"
```

---

## Phase 5: Tab 页面

### Task 12: 创建主页

**Files:**
- Create: `src/pages/home/index.vue`

- [ ] **Step 1: 编写主页**

```vue
<!-- src/pages/home/index.vue -->
<template>
  <view class="home-page">
    <!-- 顶部信息栏 -->
    <view class="top-bar">
      <view class="greeting">
        <text class="greeting-text">{{ greetingText }}</text>
        <text class="user-name">{{ userStore.user?.nickname }}</text>
      </view>
      <view class="role-tag">
        <u-tag :text="userStore.isParent ? '家长' : userStore.isHeadTeacher ? '班主任' : '老师'"
               type="primary" size="mini" />
      </view>
    </view>

    <!-- 新闻轮播 -->
    <u-swiper :list="bannerList" height="300" radius="12" :autoplay="true" />

    <!-- 快捷入口 -->
    <view class="quick-actions">
      <view class="action-item" v-for="item in quickActions" :key="item.path"
            @click="navigateTo(item.path)">
        <view class="action-icon" :style="{ background: item.color }">
          <text>{{ item.icon }}</text>
        </view>
        <text class="action-text">{{ item.name }}</text>
      </view>
    </view>

    <!-- 最新公告 -->
    <view class="section-card">
      <view class="section-header">
        <text class="section-title">📢 最新公告</text>
        <text class="section-more" @click="viewAllNews">查看全部 ></text>
      </view>
      <view class="news-list">
        <view class="news-item" v-for="item in newsList" :key="item.id">
          <text class="news-title">{{ item.title }}</text>
          <text class="news-date">{{ item.createdAt }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { api } from '@/services/api';
import type { NewsItem } from '@/types';

const userStore = useUserStore();
const newsList = ref<NewsItem[]>([]);

const greetingText = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return '早上好，';
  if (hour < 18) return '下午好，';
  return '晚上好，';
});

const bannerList = [
  { image: '/static/banner/sports.jpg', title: '2026春季运动会' },
  { image: '/static/banner/reading.jpg', title: '书香校园读书月' },
  { image: '/static/banner/campus.jpg', title: '美丽校园欢迎你' },
];

const quickActions = [
  { name: '请假申请', icon: '📝', path: '/pages/features/leave/create', color: '#4A90D9' },
  { name: '访校申请', icon: '🎫', path: '/pages/features/visit/create', color: '#5BA0F5' },
  { name: '心理校园', icon: '💚', path: '/pages/features/psychology/create', color: '#4CAF50' },
  { name: '饭卡充值', icon: '💳', path: '/pages/features/meal/recharge', color: '#FFB347' },
];

async function loadNews() {
  const res = await api.getNewsList();
  newsList.value = res.data.slice(0, 5);
}

function navigateTo(path: string) {
  uni.navigateTo({ url: path });
}

function viewAllNews() {
  // 暂不实现独立新闻列表页
}

onMounted(() => {
  loadNews();
});
</script>

<style lang="scss" scoped>
.home-page {
  min-height: 100vh;
  background: #F0F6FF;
  padding-bottom: 20rpx;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 30rpx 20rpx;
  background: #4A90D9;
}

.greeting-text {
  font-size: 26rpx;
  color: rgba(255,255,255,0.8);
}

.user-name {
  font-size: 34rpx;
  font-weight: bold;
  color: #fff;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
  padding: 20rpx 30rpx;
  margin-top: -20rpx;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.action-icon {
  width: 90rpx;
  height: 90rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  background: #fff;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.08);
}

.action-text {
  font-size: 22rpx;
  color: #666;
  margin-top: 8rpx;
}

.section-card {
  background: #fff;
  border-radius: 16rpx;
  margin: 0 30rpx 20rpx;
  padding: 24rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
}

.section-more {
  font-size: 24rpx;
  color: #4A90D9;
}

.news-item {
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.news-title {
  font-size: 28rpx;
  color: #333;
}

.news-date {
  font-size: 22rpx;
  color: #999;
  margin-top: 6rpx;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: add home page with news carousel, quick actions, and announcements"
```

---

### Task 13: 创建消息页

**Files:**
- Create: `src/pages/messages/index.vue`

- [ ] **Step 1: 编写消息页**

```vue
<!-- src/pages/messages/index.vue -->
<template>
  <view class="messages-page">
    <!-- 消息类型 Tab -->
    <u-tabs
      :list="tabs"
      :current="currentTab"
      @change="onTabChange"
      :activeStyle="{ color: '#4A90D9' }"
      lineColor="#4A90D9"
    />

    <!-- 消息列表 -->
    <view class="message-list">
      <view class="message-item" v-for="msg in displayMessages" :key="msg.id" @click="readMessage(msg)">
        <view class="msg-left">
          <view class="msg-dot" v-if="!msg.read"></view>
          <text class="msg-title">{{ msg.title }}</text>
        </view>
        <view class="msg-right">
          <text class="msg-content">{{ msg.content }}</text>
          <text class="msg-date">{{ msg.createdAt }}</text>
        </view>
      </view>

      <u-empty v-if="!displayMessages.length" text="暂无消息" mode="list" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useMessageStore } from '@/stores/message';
import { useUserStore } from '@/stores/user';
import type { Message, MessageType } from '@/types';

const messageStore = useMessageStore();
const userStore = useUserStore();
const currentTab = ref(0);

const tabs = computed(() => {
  const list = [
    { name: '班级通知' },
    { name: '系统消息' },
  ] as { name: string; type?: MessageType }[];

  if (userStore.isParent) {
    list.splice(1, 0, { name: '孩子动态' });
  }
  return list;
});

const displayMessages = ref<Message[]>([]);

function getCurrentType(): MessageType {
  if (currentTab.value === 0) return 'class_notice';
  if (userStore.isParent && currentTab.value === 1) return 'child_update';
  return 'system';
}

function filterMessages() {
  const type = getCurrentType();
  displayMessages.value = messageStore.messages.filter(m => m.type === type);
}

function onTabChange(index: number) {
  currentTab.value = index;
  filterMessages();
}

function readMessage(msg: Message) {
  messageStore.markAsRead(msg.id);
  uni.showToast({ title: msg.content, icon: 'none', duration: 2000 });
}

onMounted(async () => {
  await messageStore.fetchMessages();
  filterMessages();
});
</script>

<style lang="scss" scoped>
.messages-page {
  min-height: 100vh;
  background: #F0F6FF;
}

.message-list {
  padding: 20rpx 30rpx;
}

.message-item {
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.msg-left {
  display: flex;
  align-items: center;
  gap: 10rpx;
  margin-bottom: 10rpx;
}

.msg-dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background: #FF6B6B;
  flex-shrink: 0;
}

.msg-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.msg-content {
  font-size: 26rpx;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

.msg-date {
  font-size: 22rpx;
  color: #999;
  margin-top: 8rpx;
  display: block;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: add messages page with category tabs and unread indicators"
```

---

### Task 14: 创建功能入口页

**Files:**
- Create: `src/pages/features/index.vue`

- [ ] **Step 1: 编写功能页**

```vue
<!-- src/pages/features/index.vue -->
<template>
  <view class="features-page">
    <view class="feature-grid">
      <view class="feature-card" v-for="item in visibleFeatures" :key="item.path"
            @click="navigateTo(item.path)">
        <view class="feature-icon-wrap" :style="{ background: item.bgColor }">
          <text class="feature-icon">{{ item.icon }}</text>
        </view>
        <text class="feature-name">{{ item.name }}</text>
        <text class="feature-desc">{{ item.desc }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

const allFeatures = [
  { name: '请假申请', desc: '为学生提交请假', icon: '📝', path: '/pages/features/leave/create', bgColor: '#E8F4FD', roles: ['parent', 'teacher'] },
  { name: '访校申请', desc: '申请进入校园', icon: '🎫', path: '/pages/features/visit/create', bgColor: '#E0F2E9', roles: ['parent', 'teacher'] },
  { name: '心理校园', desc: '预约校医或咨询', icon: '💚', path: '/pages/features/psychology/create', bgColor: '#F0FAF5', roles: ['parent', 'teacher'] },
  { name: '饭卡充值', desc: '为学生饭卡充值', icon: '💳', path: '/pages/features/meal/recharge', bgColor: '#FFF3E0', roles: ['parent', 'teacher'] },
  { name: '值班排班', desc: '班级家长值班安排', icon: '📅', path: '/pages/features/duty/index', bgColor: '#F3E8FF', roles: ['head_teacher'] },
];

const visibleFeatures = computed(() => {
  return allFeatures.filter(f => {
    if (f.roles.includes('head_teacher') && userStore.isHeadTeacher) return true;
    if (f.roles.includes(userStore.activeRole || '')) return true;
    return false;
  });
});

function navigateTo(path: string) {
  uni.navigateTo({ url: path });
}
</script>

<style lang="scss" scoped>
.features-page {
  min-height: 100vh;
  background: #F0F6FF;
  padding: 30rpx;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.feature-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.feature-icon-wrap {
  width: 100rpx;
  height: 100rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16rpx;
}

.feature-icon {
  font-size: 48rpx;
}

.feature-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.feature-desc {
  font-size: 22rpx;
  color: #999;
  margin-top: 6rpx;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: add features page with role-based visibility"
```

---

### Task 15: 创建我的页面

**Files:**
- Create: `src/pages/profile/index.vue`

- [ ] **Step 1: 编写我的页面**

```vue
<!-- src/pages/profile/index.vue -->
<template>
  <view class="profile-page">
    <!-- 用户信息卡片 -->
    <view class="user-card">
      <u-avatar :src="userStore.user?.avatar" size="80" />
      <view class="user-info">
        <text class="user-name">{{ userStore.user?.nickname }}</text>
        <view class="user-roles">
          <u-tag v-for="role in userStore.user?.roles" :key="role"
                 :text="role === 'parent' ? '家长' : '老师'"
                 type="primary" size="mini" />
        </view>
      </view>
    </view>

    <!-- 身份切换 -->
    <view class="section-card" v-if="hasMultipleRoles">
      <text class="section-label">当前身份</text>
      <view class="identity-switch">
        <view
          class="identity-option"
          :class="{ active: userStore.isParent }"
          @click="switchToParent"
        >
          <text class="identity-icon">👨‍👩‍👧</text>
          <text>家长</text>
        </view>
        <view
          class="identity-option"
          :class="{ active: userStore.isTeacher }"
          @click="switchToTeacher"
          v-if="userStore.user?.roles.includes('teacher')"
        >
          <text class="identity-icon">👩‍🏫</text>
          <text>{{ userStore.isHeadTeacher ? '班主任' : '老师' }}</text>
        </view>
      </view>
    </view>

    <!-- 关联信息 -->
    <view class="section-card" v-if="userStore.isParent && userStore.students.length">
      <text class="section-label">我的孩子</text>
      <view class="child-item" v-for="s in userStore.students" :key="s.id">
        <text>{{ s.name }}</text>
        <text class="child-class">{{ s.className }}</text>
      </view>
    </view>

    <view class="section-card" v-if="userStore.isTeacher && userStore.teacherClasses.length">
      <text class="section-label">任教班级</text>
      <view class="child-item" v-for="c in userStore.teacherClasses" :key="c.id">
        <text>{{ c.name }}</text>
        <u-tag v-if="c.isHeadTeacher" text="班主任" type="primary" size="mini" />
      </view>
    </view>

    <!-- 菜单 -->
    <view class="section-card">
      <view class="menu-item" v-for="item in menuItems" :key="item.title" @click="handleMenu(item)">
        <text>{{ item.icon }} {{ item.title }}</text>
        <u-icon name="arrow-right" color="#ccc" size="16" />
      </view>
    </view>

    <!-- 退出登录 -->
    <u-button text="退出登录" type="error" :customStyle="{ margin: '30rpx' }" @click="handleLogout" />
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

const hasMultipleRoles = computed(() =>
  (userStore.user?.roles.length || 0) > 1
);

const menuItems = [
  { title: '我的请假记录', icon: '📝', type: 'leave' },
  { title: '我的访校记录', icon: '🎫', type: 'visit' },
  { title: '我的预约记录', icon: '💚', type: 'appointment' },
  { title: '充值记录', icon: '💳', type: 'meal' },
  { title: '设置', icon: '⚙️', type: 'settings' },
];

function switchToParent() {
  userStore.switchRole('parent');
}

function switchToTeacher() {
  userStore.switchRole('teacher');
}

function handleMenu(item: { type: string }) {
  const routes: Record<string, string> = {
    leave: '/pages/features/leave/create',
    visit: '/pages/features/visit/create',
    appointment: '/pages/features/psychology/create',
    meal: '/pages/features/meal/records',
    settings: '',
  };
  if (routes[item.type]) {
    uni.navigateTo({ url: routes[item.type] });
  }
}

function handleLogout() {
  userStore.logout();
  uni.reLaunch({ url: '/pages/login/index' });
}
</script>

<style lang="scss" scoped>
.profile-page {
  min-height: 100vh;
  background: #F0F6FF;
}

.user-card {
  background: linear-gradient(135deg, #4A90D9, #5BA0F5);
  padding: 40rpx 30rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.user-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #fff;
  display: block;
}

.user-roles {
  display: flex;
  gap: 10rpx;
  margin-top: 10rpx;
}

.section-card {
  background: #fff;
  border-radius: 16rpx;
  margin: 20rpx 30rpx;
  padding: 24rpx;
}

.section-label {
  font-size: 26rpx;
  color: #999;
  margin-bottom: 16rpx;
  display: block;
}

.identity-switch {
  display: flex;
  gap: 20rpx;
}

.identity-option {
  flex: 1;
  text-align: center;
  padding: 20rpx;
  border-radius: 12rpx;
  background: #f5f5f5;
  font-size: 28rpx;
}

.identity-option.active {
  background: #F0F6FF;
  border: 2rpx solid #4A90D9;
  color: #4A90D9;
}

.identity-icon {
  display: block;
  font-size: 40rpx;
  margin-bottom: 6rpx;
}

.child-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
  font-size: 28rpx;
}

.child-class {
  color: #999;
  font-size: 24rpx;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
  font-size: 28rpx;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: add profile page with user info, identity switch, and logout"
```

---

## Phase 6: 功能子页面

### Task 16: 请假申请页

**Files:**
- Create: `src/pages/features/leave/create.vue`
- Create: `src/pages/features/leave/detail.vue`

- [ ] **Step 1: 编写请假申请页**

```vue
<!-- src/pages/features/leave/create.vue -->
<template>
  <view class="leave-page">
    <u-form :model="form" ref="formRef" labelWidth="140">
      <!-- 选择学生 -->
      <u-form-item label="请假学生" required>
        <view class="student-picker" @click="showStudentPicker = true">
          <text>{{ form.studentName || '请选择学生' }}</text>
          <u-icon name="arrow-down" size="16" color="#999" />
        </view>
      </u-form-item>

      <!-- 请假类型 -->
      <u-form-item label="请假类型" required>
        <u-radio-group v-model="form.leaveType" placement="row">
          <u-radio v-for="(label, key) in leaveTypes" :key="key"
                   :label="label" :name="key" />
        </u-radio-group>
      </u-form-item>

      <!-- 日期选择 -->
      <u-form-item label="开始日期" required>
        <u-datetime-picker
          :value="form.startTime"
          mode="date"
          @confirm="(e: any) => form.startTime = e.value"
          ref="startPicker"
        />
      </u-form-item>

      <u-form-item label="结束日期" required>
        <u-datetime-picker
          :value="form.endTime"
          mode="date"
          @confirm="(e: any) => form.endTime = e.value"
          ref="endPicker"
        />
      </u-form-item>

      <!-- 请假原因 -->
      <u-form-item label="请假原因" required>
        <u-textarea v-model="form.reason" placeholder="请输入请假原因" maxlength="200" />
      </u-form-item>
    </u-form>

    <u-button type="primary" text="提交申请" shape="circle"
              :customStyle="{ margin: '40rpx 30rpx', height: '96rpx' }"
              @click="handleSubmit" />

    <!-- 学生选择弹窗 -->
    <u-popup :show="showStudentPicker" mode="bottom" @close="showStudentPicker = false">
      <view class="picker-content">
        <view class="picker-title">选择学生</view>
        <view class="picker-item" v-for="s in studentList" :key="s.id"
              @click="selectStudent(s)">
          <text>{{ s.name }} - {{ s.className }}</text>
          <u-icon v-if="form.studentId === s.id" name="checkbox-mark" color="#4A90D9" />
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useUserStore } from '@/stores/user';
import { api } from '@/services/api';
import type { Student } from '@/types';
import { LEAVE_TYPE_MAP } from '@/utils/constants';

const userStore = useUserStore();
const showStudentPicker = ref(false);
const studentList = ref<Student[]>([]);

const leaveTypes = LEAVE_TYPE_MAP;

const form = reactive({
  studentId: '',
  studentName: '',
  leaveType: 'personal' as 'sick' | 'personal' | 'other',
  startTime: '',
  endTime: '',
  reason: '',
});

async function loadStudents() {
  const res = await api.getStudentsForRecharge(userStore.user!.id, userStore.isParent);
  studentList.value = res.data;
}

function selectStudent(s: Student) {
  form.studentId = s.id;
  form.studentName = s.name;
  showStudentPicker.value = false;
}

async function handleSubmit() {
  if (!form.studentId || !form.startTime || !form.endTime || !form.reason) {
    uni.showToast({ title: '请完善信息', icon: 'none' });
    return;
  }

  const approver = userStore.isParent
    ? { approverId: 'u3', approverName: '王老师' } // Mock: 假设该班的班主任
    : { approverId: userStore.user!.id, approverName: userStore.user!.nickname };

  await api.createLeaveRequest({
    ...form,
    applicantId: userStore.user!.id,
    applicantName: userStore.user!.nickname,
    ...approver,
    studentName: form.studentName,
  });

  uni.showToast({ title: '提交成功', icon: 'success' });
  setTimeout(() => uni.navigateBack(), 1500);
}

loadStudents();
</script>

<style lang="scss" scoped>
.leave-page {
  min-height: 100vh;
  background: #F0F6FF;
  padding: 30rpx;
}

.student-picker {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 20rpx;
  border: 1rpx solid #e0e0e0;
  border-radius: 8rpx;
  font-size: 28rpx;
}

.picker-content {
  padding: 30rpx;
}

.picker-title {
  font-size: 32rpx;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20rpx;
}

.picker-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
  font-size: 28rpx;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: add leave request page with student picker and form"
```

---

### Task 17: 访校申请页

**Files:**
- Create: `src/pages/features/visit/create.vue`
- Create: `src/pages/features/visit/detail.vue`

- [ ] **Step 1: 编写访校申请页**

```vue
<!-- src/pages/features/visit/create.vue -->
<template>
  <view class="visit-page">
    <u-form :model="form" ref="formRef" labelWidth="140">
      <u-form-item label="访校类型" required>
        <u-radio-group v-model="form.visitType" placement="row">
          <u-radio label="短期" name="short" />
          <u-radio label="长期" name="long" />
        </u-radio-group>
      </u-form-item>

      <u-form-item label="访校日期" required>
        <u-datetime-picker
          :value="form.date"
          mode="date"
          @confirm="(e: any) => form.date = e.value"
          ref="datePicker"
        />
      </u-form-item>

      <u-form-item label="结束日期" v-if="form.visitType === 'long'" required>
        <u-datetime-picker
          :value="endDate"
          mode="date"
          @confirm="(e: any) => endDate = e.value"
          ref="endDatePicker"
        />
      </u-form-item>

      <u-form-item label="访校事由" required>
        <u-textarea v-model="form.reason" placeholder="请输入访校事由" maxlength="300" />
      </u-form-item>
    </u-form>

    <u-button type="primary" text="提交申请" shape="circle"
              :customStyle="{ margin: '40rpx 30rpx', height: '96rpx' }"
              @click="handleSubmit" />

    <!-- 访校记录 -->
    <view class="history-section" v-if="historyList.length">
      <text class="history-title">申请记录</text>
      <view class="history-item" v-for="item in historyList" :key="item.id"
            @click="viewDetail(item)">
        <view class="h-left">
          <text class="h-type">{{ item.visitType === 'short' ? '短期' : '长期' }}</text>
          <text class="h-date">{{ item.date }}</text>
        </view>
        <u-tag :text="item.status === 'approved' ? '已通过' : '待审批'"
               :type="item.status === 'approved' ? 'success' : 'warning'" size="mini" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useUserStore } from '@/stores/user';
import { api } from '@/services/api';
import type { VisitRequest } from '@/types';

const userStore = useUserStore();
const historyList = ref<VisitRequest[]>([]);
const endDate = ref('');

const form = reactive({
  visitType: 'short' as 'short' | 'long',
  date: '',
  reason: '',
});

async function loadHistory() {
  const res = await api.getVisitRequests(userStore.user!.id);
  historyList.value = res.data;
}

async function handleSubmit() {
  if (!form.date || !form.reason) {
    uni.showToast({ title: '请完善信息', icon: 'none' });
    return;
  }

  const res = await api.createVisitRequest({
    ...form,
    userId: userStore.user!.id,
    userName: userStore.user!.nickname,
    dateRange: form.visitType === 'long' ? { start: form.date, end: endDate.value } : undefined,
  });

  if (res.code === 0) {
    uni.showToast({ title: '申请成功', icon: 'success' });
    setTimeout(() => {
      uni.navigateTo({ url: `/pages/features/visit/detail?id=${res.data.id}` });
    }, 1000);
  }
}

function viewDetail(item: VisitRequest) {
  uni.navigateTo({ url: `/pages/features/visit/detail?id=${item.id}` });
}

loadHistory();
</script>

<style lang="scss" scoped>
.visit-page {
  min-height: 100vh;
  background: #F0F6FF;
  padding: 30rpx;
}

.history-section {
  margin-top: 40rpx;
}

.history-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.history-item {
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.h-left {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.h-type {
  font-size: 28rpx;
  font-weight: bold;
}

.h-date {
  font-size: 24rpx;
  color: #999;
}
</style>
```

- [ ] **Step 2: 编写访校详情页（含二维码展示）**

```vue
<!-- src/pages/features/visit/detail.vue -->
<template>
  <view class="detail-page" v-if="detail">
    <view class="status-card" :class="detail.status">
      <text class="status-icon">{{ statusIcon }}</text>
      <text class="status-text">{{ statusText }}</text>
    </view>

    <view class="info-card">
      <view class="info-row">
        <text class="info-label">访校类型</text>
        <text class="info-value">{{ detail.visitType === 'short' ? '短期访校' : '长期访校' }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">访校日期</text>
        <text class="info-value">{{ detail.date }}</text>
      </view>
      <view class="info-row" v-if="detail.dateRange">
        <text class="info-label">有效期</text>
        <text class="info-value">{{ detail.dateRange.start }} 至 {{ detail.dateRange.end }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">事由</text>
        <text class="info-value">{{ detail.reason }}</text>
      </view>
    </view>

    <!-- 二维码 -->
    <view class="qr-section" v-if="detail.status === 'approved'">
      <text class="qr-label">进校请出示此二维码</text>
      <view class="qr-code-wrap">
        <uqrcode ref="qrcode" :value="detail.qrCodeToken" :size="280" />
      </view>
      <text class="qr-tip">门卫扫码验证后即可入校</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { api } from '@/services/api';
import type { VisitRequest } from '@/types';

const detail = ref<VisitRequest | null>(null);

const statusIcon = computed(() => {
  const icons: Record<string, string> = {
    approved: '✅', pending: '⏳', rejected: '❌', expired: '⏰',
  };
  return icons[detail.value?.status || ''] || '';
});

const statusText = computed(() => {
  const texts: Record<string, string> = {
    approved: '审批通过', pending: '待审批', rejected: '已拒绝', expired: '已过期',
  };
  return texts[detail.value?.status || ''] || '';
});

onMounted(async () => {
  const pages = getCurrentPages();
  const id = (pages[pages.length - 1] as any).options?.id;
  if (id) {
    const res = await api.getVisitRequests('');
    detail.value = res.data.find(v => v.id === id) || null;
  }
});
</script>

<style lang="scss" scoped>
.detail-page {
  min-height: 100vh;
  background: #F0F6FF;
  padding: 30rpx;
}

.status-card {
  text-align: center;
  padding: 40rpx;
  border-radius: 16rpx;
  margin-bottom: 30rpx;
}

.status-card.approved { background: #E8F5E9; }
.status-card.pending { background: #FFF3E0; }

.status-icon { font-size: 60rpx; display: block; }
.status-text { font-size: 32rpx; font-weight: bold; display: block; margin-top: 10rpx; }

.info-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.info-label { font-size: 28rpx; color: #999; }
.info-value { font-size: 28rpx; color: #333; }

.qr-section {
  text-align: center;
  margin-top: 60rpx;
}

.qr-label {
  font-size: 30rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 30rpx;
}

.qr-code-wrap {
  display: inline-block;
  background: #fff;
  padding: 30rpx;
  border-radius: 16rpx;
}

.qr-tip {
  font-size: 24rpx;
  color: #999;
  display: block;
  margin-top: 20rpx;
}
</style>
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add visit application page with QR code display"
```

---

### Task 18: 心理校园预约页

**Files:**
- Create: `src/pages/features/psychology/create.vue`

- [ ] **Step 1: 编写心理校园预约页**

```vue
<!-- src/pages/features/psychology/create.vue -->
<template>
  <view class="psychology-page">
    <u-form :model="form" ref="formRef" labelWidth="140">
      <u-form-item label="预约类型" required>
        <view class="type-select">
          <view class="type-card" :class="{ active: form.type === 'doctor' }"
                @click="form.type = 'doctor'">
            <text class="type-icon">🏥</text>
            <text class="type-name">校医</text>
          </view>
          <view class="type-card" :class="{ active: form.type === 'counsel' }"
                @click="form.type = 'counsel'">
            <text class="type-icon">💬</text>
            <text class="type-name">心理咨询</text>
          </view>
        </view>
      </u-form-item>

      <u-form-item label="预约日期" required>
        <u-datetime-picker
          :value="form.date"
          mode="date"
          @confirm="(e: any) => form.date = e.value"
          ref="datePicker"
        />
      </u-form-item>

      <u-form-item label="预约时段" required>
        <view class="slot-grid">
          <view class="slot-item" v-for="slot in timeSlots" :key="slot"
                :class="{ active: form.timeSlot === slot }"
                @click="form.timeSlot = slot">
            <text>{{ slot }}</text>
          </view>
        </view>
      </u-form-item>

      <u-form-item label="简要描述">
        <u-textarea v-model="form.description" placeholder="请简要描述您的情况" maxlength="300" />
      </u-form-item>
    </u-form>

    <u-button type="primary" text="提交预约" shape="circle"
              :customStyle="{ margin: '40rpx 30rpx', height: '96rpx' }"
              @click="handleSubmit" />

    <!-- 预约记录 -->
    <view class="history-section" v-if="historyList.length">
      <text class="history-title">我的预约</text>
      <view class="history-item" v-for="item in historyList" :key="item.id">
        <view class="h-left">
          <text class="h-type">{{ item.type === 'doctor' ? '校医' : '心理咨询' }}</text>
          <text class="h-time">{{ item.date }} {{ item.timeSlot }}</text>
        </view>
        <u-tag :text="item.status === 'confirmed' ? '已确认' : '已取消'"
               :type="item.status === 'confirmed' ? 'success' : 'warning'" size="mini" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useUserStore } from '@/stores/user';
import { api } from '@/services/api';
import type { Appointment } from '@/types';
import { TIME_SLOTS } from '@/utils/constants';

const userStore = useUserStore();
const timeSlots = TIME_SLOTS;
const historyList = ref<Appointment[]>([]);

const form = reactive({
  type: 'doctor' as 'doctor' | 'counsel',
  date: '',
  timeSlot: '',
  description: '',
});

async function loadHistory() {
  const res = await api.getAppointments(userStore.user!.id);
  historyList.value = res.data;
}

async function handleSubmit() {
  if (!form.date || !form.timeSlot) {
    uni.showToast({ title: '请完善信息', icon: 'none' });
    return;
  }

  await api.createAppointment({
    ...form,
    userId: userStore.user!.id,
    userName: userStore.user!.nickname,
  });

  uni.showToast({ title: '预约成功', icon: 'success' });
  loadHistory();
  // 重置表单
  form.date = '';
  form.timeSlot = '';
  form.description = '';
}

loadHistory();
</script>

<style lang="scss" scoped>
.psychology-page {
  min-height: 100vh;
  background: #F0F6FF;
  padding: 30rpx;
}

.type-select {
  display: flex;
  gap: 20rpx;
}

.type-card {
  flex: 1;
  text-align: center;
  padding: 24rpx;
  border-radius: 12rpx;
  border: 2rpx solid #e0e0e0;
  background: #fff;
}

.type-card.active {
  border-color: #4A90D9;
  background: #F0F6FF;
}

.type-icon { font-size: 40rpx; display: block; }
.type-name { font-size: 26rpx; display: block; margin-top: 6rpx; }

.slot-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12rpx;
}

.slot-item {
  text-align: center;
  padding: 14rpx;
  border-radius: 8rpx;
  background: #f5f5f5;
  font-size: 22rpx;
}

.slot-item.active {
  background: #4A90D9;
  color: #fff;
}

.history-section { margin-top: 40rpx; }

.history-title {
  font-size: 30rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 20rpx;
}

.history-item {
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.h-left { display: flex; flex-direction: column; gap: 6rpx; }
.h-type { font-size: 28rpx; font-weight: bold; }
.h-time { font-size: 24rpx; color: #999; }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: add psychology campus appointment page"
```

---

### Task 19: 饭卡充值页

**Files:**
- Create: `src/pages/features/meal/recharge.vue`
- Create: `src/pages/features/meal/records.vue`

- [ ] **Step 1: 编写饭卡充值页**

```vue
<!-- src/pages/features/meal/recharge.vue -->
<template>
  <view class="meal-page">
    <!-- 选择学生 -->
    <view class="student-picker" @click="showStudentPicker = true">
      <text class="picker-label">充值对象</text>
      <view class="picker-value">
        <text v-if="selectedStudent">{{ selectedStudent.name }}</text>
        <text v-else class="placeholder">请选择学生</text>
        <u-icon name="arrow-down" size="16" color="#999" />
      </view>
    </view>

    <!-- 余额显示 -->
    <view class="balance-card" v-if="selectedStudent">
      <text class="balance-label">当前余额</text>
      <text class="balance-amount">¥ {{ selectedStudent.mealBalance.toFixed(2) }}</text>
    </view>

    <!-- 充值金额 -->
    <view class="amount-section">
      <text class="section-label">选择充值金额</text>
      <view class="amount-grid">
        <view class="amount-item" v-for="amt in amounts" :key="amt"
              :class="{ active: rechargeAmount === amt }"
              @click="rechargeAmount = amt">
          <text>¥ {{ amt }}</text>
        </view>
        <view class="amount-item custom" :class="{ active: isCustom }">
          <u-input v-model="customAmount" type="number" placeholder="自定义"
                   :focus="isCustom" @focus="onCustomFocus" />
        </view>
      </view>
    </view>

    <u-button type="primary" text="确认充值" shape="circle"
              :customStyle="{ margin: '40rpx 30rpx', height: '96rpx' }"
              :disabled="!canRecharge"
              @click="handleRecharge" />

    <!-- 学生选择弹窗 -->
    <u-popup :show="showStudentPicker" mode="bottom" @close="showStudentPicker = false">
      <view class="picker-content">
        <view class="picker-title">选择学生</view>
        <view class="picker-item" v-for="s in studentList" :key="s.id"
              @click="selectStudent(s)">
          <view>
            <text>{{ s.name }} - {{ s.className }}</text>
            <text class="picker-balance">余额: ¥{{ s.mealBalance.toFixed(2) }}</text>
          </view>
          <u-icon v-if="selectedStudent?.id === s.id" name="checkbox-mark" color="#4A90D9" />
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/user';
import { api } from '@/services/api';
import type { Student } from '@/types';
import { MEAL_AMOUNTS } from '@/utils/constants';

const userStore = useUserStore();
const amounts = MEAL_AMOUNTS;
const studentList = ref<Student[]>([]);
const selectedStudent = ref<Student | null>(null);
const showStudentPicker = ref(false);
const rechargeAmount = ref(0);
const customAmount = ref('');
const isCustom = ref(false);

const canRecharge = computed(() =>
  selectedStudent.value && (rechargeAmount.value > 0 || Number(customAmount.value) > 0)
);

async function loadStudents() {
  const res = await api.getStudentsForRecharge(userStore.user!.id, userStore.isParent);
  studentList.value = res.data;
  if (studentList.value.length === 1) {
    selectedStudent.value = studentList.value[0];
  }
}

function selectStudent(s: Student) {
  selectedStudent.value = s;
  showStudentPicker.value = false;
}

function onCustomFocus() {
  isCustom.value = true;
  rechargeAmount.value = 0;
}

async function handleRecharge() {
  const amount = isCustom.value ? Number(customAmount.value) : rechargeAmount.value;
  if (!amount || amount <= 0) {
    uni.showToast({ title: '请输入有效金额', icon: 'none' });
    return;
  }

  // Mock 支付确认
  uni.showModal({
    title: '确认充值',
    content: `为 ${selectedStudent.value?.name} 充值 ¥${amount}？`,
    success: async (res) => {
      if (res.confirm) {
        const result = await api.rechargeMealCard(selectedStudent.value!.id, amount);
        // 更新本地余额
        if (selectedStudent.value) {
          selectedStudent.value.mealBalance = result.data.balance;
        }
        uni.showToast({ title: '充值成功', icon: 'success' });
        rechargeAmount.value = 0;
        customAmount.value = '';
        isCustom.value = false;
      }
    },
  });
}

loadStudents();
</script>

<style lang="scss" scoped>
.meal-page {
  min-height: 100vh;
  background: #F0F6FF;
  padding: 30rpx;
}

.student-picker {
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.picker-label { font-size: 28rpx; color: #333; }
.picker-value { display: flex; align-items: center; gap: 10rpx; font-size: 28rpx; }
.placeholder { color: #ccc; }

.balance-card {
  background: linear-gradient(135deg, #4A90D9, #5BA0F5);
  border-radius: 16rpx;
  padding: 40rpx;
  text-align: center;
  margin: 30rpx 0;
  color: #fff;
}

.balance-label { font-size: 26rpx; opacity: 0.8; display: block; }
.balance-amount { font-size: 56rpx; font-weight: bold; display: block; margin-top: 10rpx; }

.amount-section { margin-top: 40rpx; }
.section-label { font-size: 28rpx; color: #333; margin-bottom: 20rpx; display: block; }

.amount-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}

.amount-item {
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  text-align: center;
  font-size: 30rpx;
  border: 2rpx solid #e0e0e0;
}

.amount-item.active {
  border-color: #4A90D9;
  background: #F0F6FF;
  color: #4A90D9;
}

.amount-item.custom {
  padding: 12rpx;
}

.picker-content { padding: 30rpx; }
.picker-title { font-size: 32rpx; font-weight: bold; text-align: center; margin-bottom: 20rpx; }

.picker-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
  font-size: 28rpx;
}

.picker-balance { font-size: 24rpx; color: #999; display: block; }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: add meal card recharge page with balance display"
```

---

### Task 20: 班级值班排班页

**Files:**
- Create: `src/pages/features/duty/index.vue`
- Create: `src/pages/features/duty/edit.vue`

- [ ] **Step 1: 编写值班排班主页**

```vue
<!-- src/pages/features/duty/index.vue -->
<template>
  <view class="duty-page">
    <!-- 周选择 -->
    <view class="week-selector">
      <u-icon name="arrow-left" size="20" @click="prevWeek" />
      <text class="week-text">{{ weekRange.start }} ~ {{ weekRange.end }}</text>
      <u-icon name="arrow-right" size="20" @click="nextWeek" />
    </view>

    <!-- 排班表 -->
    <view class="schedule-table" v-if="schedule">
      <view class="day-row" v-for="day in weekDays" :key="day.date">
        <view class="day-label">
          <text class="day-name">{{ day.dayOfWeek }}</text>
          <text class="day-date">{{ day.date.slice(5) }}</text>
        </view>
        <view class="day-duty">
          <text v-if="day.assignment" class="duty-name">{{ day.assignment.parentName }}</text>
          <text v-else class="duty-empty">未安排</text>
        </view>
      </view>
    </view>

    <u-empty v-else text="暂无排班，点击下方按钮创建" mode="list" />

    <u-button type="primary" text="编辑排班" shape="circle"
              :customStyle="{ margin: '40rpx 30rpx', height: '96rpx' }"
              @click="goEdit" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/user';
import { api } from '@/services/api';
import type { DutySchedule, DutyDay } from '@/types';
import { getWeekRange, getWeekDates, getDayOfWeek } from '@/utils/date';

const userStore = useUserStore();
const currentWeekStart = ref(getWeekRange().start);
const schedule = ref<DutySchedule | null>(null);

const weekRange = computed(() => getWeekRange(new Date(currentWeekStart.value)));

const weekDays = computed(() => {
  const dates = getWeekDates(currentWeekStart.value);
  return dates.map(date => ({
    date,
    dayOfWeek: getDayOfWeek(date),
    assignment: schedule.value?.dailyAssignments.find(a => a.date === date) || null,
  }));
});

function prevWeek() {
  const d = new Date(currentWeekStart.value);
  d.setDate(d.getDate() - 7);
  currentWeekStart.value = d.toISOString().slice(0, 10);
  loadSchedule();
}

function nextWeek() {
  const d = new Date(currentWeekStart.value);
  d.setDate(d.getDate() + 7);
  currentWeekStart.value = d.toISOString().slice(0, 10);
  loadSchedule();
}

async function loadSchedule() {
  if (!userStore.headClassId) return;
  const res = await api.getDutySchedule(userStore.headClassId, currentWeekStart.value);
  schedule.value = res.data;
}

function goEdit() {
  uni.navigateTo({
    url: `/pages/features/duty/edit?classId=${userStore.headClassId}&weekStart=${currentWeekStart.value}`
  });
}

loadSchedule();
</script>

<style lang="scss" scoped>
.duty-page {
  min-height: 100vh;
  background: #F0F6FF;
  padding: 30rpx;
}

.week-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
  padding: 20rpx;
  background: #fff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
}

.week-text { font-size: 28rpx; font-weight: bold; }

.schedule-table {
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
}

.day-row {
  display: flex;
  border-bottom: 1rpx solid #f0f0f0;
}

.day-label {
  width: 160rpx;
  padding: 20rpx;
  background: #F8FAFC;
  text-align: center;
}

.day-name { font-size: 26rpx; font-weight: bold; display: block; }
.day-date { font-size: 22rpx; color: #999; display: block; }

.day-duty {
  flex: 1;
  padding: 20rpx;
  display: flex;
  align-items: center;
}

.duty-name { font-size: 28rpx; color: #4A90D9; }
.duty-empty { font-size: 26rpx; color: #ccc; }
</style>
```

- [ ] **Step 2: 编写排班编辑页**

```vue
<!-- src/pages/features/duty/edit.vue -->
<template>
  <view class="duty-edit-page">
    <view class="edit-tip">请为每天选择值班家长</view>

    <view class="edit-list">
      <view class="edit-row" v-for="(day, index) in weekDays" :key="day.date">
        <view class="edit-day">
          <text class="edit-day-name">{{ day.dayOfWeek }}</text>
          <text class="edit-day-date">{{ day.date.slice(5) }}</text>
        </view>
        <view class="edit-picker" @click="openPicker(index)">
          <text v-if="assignments[index]?.parentName" class="selected-name">
            {{ assignments[index].parentName }}
          </text>
          <text v-else class="no-selection">点击选择</text>
          <u-icon name="arrow-down" size="16" color="#999" />
        </view>
      </view>
    </view>

    <u-button type="primary" text="保存并发布" shape="circle"
              :customStyle="{ margin: '40rpx 30rpx', height: '96rpx' }"
              @click="handleSave" />

    <!-- 家长选择弹窗 -->
    <u-popup :show="showPicker" mode="bottom" @close="showPicker = false">
      <view class="picker-content">
        <view class="picker-title">选择值班家长</view>
        <view class="picker-item" v-for="p in parentList" :key="p.id"
              @click="selectParent(p)">
          <text>{{ p.name }}</text>
          <u-icon v-if="currentPickIndex >= 0 && assignments[currentPickIndex]?.parentId === p.id"
                  name="checkbox-mark" color="#4A90D9" />
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useUserStore } from '@/stores/user';
import { api } from '@/services/api';
import type { DutyDay } from '@/types';
import { getWeekDates, getDayOfWeek } from '@/utils/date';

const userStore = useUserStore();
const parentList = ref<{ id: string; name: string }[]>([]);
const showPicker = ref(false);
const currentPickIndex = ref(-1);

const pages = getCurrentPages();
const options = (pages[pages.length - 1] as any).options || {};
const classId = options.classId || userStore.headClassId;
const weekStart = options.weekStart || '';

const weekDays = getWeekDates(weekStart).map(date => ({
  date,
  dayOfWeek: getDayOfWeek(date),
}));

const assignments = reactive<DutyDay[]>(weekDays.map(d => ({
  date: d.date,
  parentId: '',
  parentName: '',
})));

function openPicker(index: number) {
  currentPickIndex.value = index;
  showPicker.value = true;
}

function selectParent(p: { id: string; name: string }) {
  assignments[currentPickIndex.value] = {
    date: weekDays[currentPickIndex.value].date,
    parentId: p.id,
    parentName: p.name,
  };
  showPicker.value = false;
}

async function handleSave() {
  const hasAssignment = assignments.some(a => a.parentId);
  if (!hasAssignment) {
    uni.showToast({ title: '请至少安排一天值班', icon: 'none' });
    return;
  }

  await api.saveDutySchedule({
    classId,
    weekStart,
    className: userStore.teacherClasses.find(c => c.id === classId)?.name || '',
    dailyAssignments: [...assignments],
    published: true,
  });

  uni.showToast({ title: '发布成功', icon: 'success' });
  setTimeout(() => uni.navigateBack(), 1500);
}

async function loadParents() {
  const res = await api.getClassParents(classId);
  parentList.value = res.data;
}

async function loadExistingSchedule() {
  const res = await api.getDutySchedule(classId, weekStart);
  if (res.data) {
    res.data.dailyAssignments.forEach((a, i) => {
      if (i < assignments.length) {
        assignments[i] = { ...a };
      }
    });
  }
}

loadParents();
loadExistingSchedule();
</script>

<style lang="scss" scoped>
.duty-edit-page {
  min-height: 100vh;
  background: #F0F6FF;
  padding: 30rpx;
}

.edit-tip {
  font-size: 26rpx;
  color: #999;
  margin-bottom: 20rpx;
  text-align: center;
}

.edit-list {
  background: #fff;
  border-radius: 16rpx;
}

.edit-row {
  display: flex;
  align-items: center;
  border-bottom: 1rpx solid #f0f0f0;
}

.edit-day {
  width: 160rpx;
  padding: 24rpx;
  background: #F8FAFC;
  text-align: center;
}

.edit-day-name { font-size: 26rpx; font-weight: bold; display: block; }
.edit-day-date { font-size: 22rpx; color: #999; display: block; }

.edit-picker {
  flex: 1;
  padding: 24rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.selected-name { font-size: 28rpx; color: #4A90D9; }
.no-selection { font-size: 26rpx; color: #ccc; }

.picker-content { padding: 30rpx; }
.picker-title { font-size: 32rpx; font-weight: bold; text-align: center; margin-bottom: 20rpx; }

.picker-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
  font-size: 28rpx;
}
</style>
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add duty scheduling pages with weekly view and parent assignment"
```

---

## Phase 7: TabBar 图标与收尾

### Task 21: 添加 TabBar 图标与最终配置

**Files:**
- Create: `src/static/tab/` 中的占位图标
- Modify: `src/manifest.json`

- [ ] **Step 1: 生成 TabBar 图标占位 SVG**

由于 uni-app 需要实际的图标文件，使用 uView Plus 的内置图标方案替代自定义图标：

修改 `src/pages.json` 中的 tabBar 配置，去掉 iconPath，改用纯文字 Tab（临时方案），或使用 uni-icons。

更简洁的方案：使用 uView Plus 的 `u-tabbar` 组件在 App.vue 中自定义 TabBar。

```bash
# 创建占位图标目录
mkdir -p src/static/tab
# 使用 touch 创建占位文件（实际运行时替换为真正的图标）
touch src/static/tab/home.png
touch src/static/tab/home-active.png
touch src/static/tab/message.png
touch src/static/tab/message-active.png
touch src/static/tab/features.png
touch src/static/tab/features-active.png
touch src/static/tab/profile.png
touch src/static/tab/profile-active.png
```

- [ ] **Step 2: 更新 manifest.json 微信小程序配置**

在 `src/manifest.json` 中添加微信小程序 appid 配置：

```json
{
  "name": "数字校园",
  "appid": "",
  "description": "数字校园微信小程序",
  "versionName": "1.0.0",
  "versionCode": "100",
  "mp-weixin": {
    "appid": "",
    "setting": {
      "urlCheck": false,
      "es6": true,
      "postcss": true,
      "minified": true
    },
    "usingComponents": true,
    "permission": {
      "scope.userLocation": {
        "desc": "获取位置信息用于访校验证"
      }
    }
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add tab bar icons and update manifest.json"
```

---

### Task 22: 最终整合与验证

- [ ] **Step 1: 安装所有依赖并验证编译**

```bash
npm install
npx uni-app dev
```

检查控制台是否有编译错误，确认所有页面路由正确。

- [ ] **Step 2: 验证所有页面路由**

确认以下页面可正常访问：
- `/pages/login/index` - 登录页
- `/pages/home/index` - 主页
- `/pages/messages/index` - 消息
- `/pages/features/index` - 功能
- `/pages/profile/index` - 我的
- `/pages/features/leave/create` - 请假
- `/pages/features/visit/create` - 访校
- `/pages/features/psychology/create` - 心理校园
- `/pages/features/meal/recharge` - 饭卡充值
- `/pages/features/duty/index` - 值班排班

- [ ] **Step 3: 最终提交**

```bash
git add -A && git commit -m "feat: complete digital campus mini program implementation"
git push origin main
```

---

## 实施备注

1. **TabBar 图标**: 占位图标需替换为实际设计的 PNG 图标（建议使用微信小程序开发者工具生成图标素材）

2. **二维码生成**: 访校详情页使用了 `uqrcode` 组件，如未安装请执行 `npm install uqrcode`（如使用 uView Plus 集成组件则无需额外安装）

3. **Mock 数据切换**: 所有数据通过 `src/services/api/index.ts` 统一导出，后期替换为真实 API 只需修改该文件的导入源

4. **微信小程序真机测试**: 需要在 `manifest.json` 中配置真实的微信小程序 AppID

5. **主题定制**: 所有页面使用硬编码的 `#4A90D9` 主题色，如需统一修改请全局搜索替换
