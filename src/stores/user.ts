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
      const studentRes = await api.getParentStudents(this.user.id);
      this.students = studentRes.data;
      const classRes = await api.getTeacherClasses(this.user.id);
      this.teacherClasses = classRes.data;

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
