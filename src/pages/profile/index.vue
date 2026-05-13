<template>
  <view class="profile-page">
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

    <view class="section-card" v-if="hasMultipleRoles">
      <text class="section-label">当前身份</text>
      <view class="identity-switch">
        <view
          class="identity-option pressable"
          :class="{ active: userStore.isParent }"
          @click="switchToParent"
        >
          <u-icon name="account-fill" size="24" />
          <text>家长</text>
        </view>
        <view
          class="identity-option pressable"
          :class="{ active: userStore.isTeacher }"
          @click="switchToTeacher"
          v-if="userStore.user?.roles.includes('teacher')"
        >
          <u-icon name="account" size="24" />
          <text>{{ userStore.isHeadTeacher ? '班主任' : '老师' }}</text>
        </view>
      </view>
    </view>

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

    <view class="section-card">
      <view class="menu-item pressable" v-for="item in menuItems" :key="item.title" @click="handleMenu(item)">
        <view class="menu-left">
          <u-icon :name="item.icon" size="20" color="var(--color-primary)" />
          <text>{{ item.title }}</text>
        </view>
        <u-icon name="arrow-right" color="var(--color-text-tertiary)" size="16" />
      </view>
    </view>

    <u-button text="退出登录" type="error" class="submit-btn" @click="handleLogout" />
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
  { title: '我的请假记录', icon: 'edit-pen-fill', type: 'leave' },
  { title: '我的访校记录', icon: 'coupon-fill', type: 'visit' },
  { title: '我的预约记录', icon: 'heart-fill', type: 'appointment' },
  { title: '充值记录', icon: 'rmb-circle-fill', type: 'meal' },
  { title: '设置', icon: 'setting-fill', type: 'settings' },
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
  background: var(--color-bg);
}

.user-card {
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  padding: var(--space-xl) var(--space-lg);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.user-name {
  font-size: var(--font-lg);
  font-weight: bold;
  color: var(--color-text-inverse);
  display: block;
}

.user-roles {
  display: flex;
  gap: var(--space-xs);
  margin-top: var(--space-xs);
}

.section-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  margin: var(--space-sm) var(--space-lg);
  padding: var(--space-md);
}

.section-label {
  font-size: var(--font-sm);
  color: var(--color-text-tertiary);
  margin-bottom: var(--space-sm);
  display: block;
}

.identity-switch {
  display: flex;
  gap: var(--space-sm);
}

.identity-option {
  flex: 1;
  text-align: center;
  padding: var(--space-sm);
  border-radius: var(--radius-md);
  background: var(--color-bg-subtle);
  font-size: var(--font-base);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
}

.identity-option.active {
  background: var(--color-primary-light);
  border: 2rpx solid var(--color-primary);
  color: var(--color-primary);
}

.child-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-sm) 0;
  border-bottom: 1rpx solid var(--color-border-light);
  font-size: var(--font-base);
}

.child-class {
  color: var(--color-text-tertiary);
  font-size: var(--font-sm);
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-sm) 0;
  border-bottom: 1rpx solid var(--color-border-light);
  font-size: var(--font-base);
}

.menu-left {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}
</style>
