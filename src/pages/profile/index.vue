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
      <view class="menu-item" v-for="item in menuItems" :key="item.title" @click="handleMenu(item)">
        <text>{{ item.icon }} {{ item.title }}</text>
        <u-icon name="arrow-right" color="#ccc" size="16" />
      </view>
    </view>

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
