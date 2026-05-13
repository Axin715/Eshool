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
import type { UserRole } from '@/types';

const userStore = useUserStore();
const selectedRole = ref<UserRole | ''>('');
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
  if (!selectedRole.value) return;
  userStore.switchRole(selectedRole.value as UserRole);
  uni.switchTab({ url: '/pages/home/index' });
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
  display: block;
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
