<template>
  <view class="bind-page">
    <view class="bind-header">
      <text class="bind-title">完善信息</text>
      <text class="bind-desc">请选择您的身份并完成绑定</text>
    </view>

    <view class="role-select">
      <view
        class="role-card pressable"
        :class="{ active: selectedRole === 'parent' }"
        @click="selectedRole = 'parent'"
      >
        <u-icon name="account-fill" size="32" />
        <text class="role-name">我是家长</text>
      </view>
      <view
        class="role-card pressable"
        :class="{ active: selectedRole === 'teacher' }"
        @click="selectedRole = 'teacher'"
        v-if="userStore.user?.roles.includes('teacher')"
      >
        <u-icon name="account" size="32" />
        <text class="role-name">我是老师</text>
      </view>
    </view>

    <view class="bind-form" v-if="selectedRole === 'parent'">
      <text class="section-title">关联您的孩子</text>
      <view class="student-list" v-if="userStore.students.length">
        <view
          class="student-item pressable"
          v-for="s in userStore.students"
          :key="s.id"
          :class="{ selected: selectedStudentIds.includes(s.id) }"
          @click="toggleStudent(s.id)"
        >
          <text>{{ s.name }} - {{ s.className }}</text>
          <u-icon v-if="selectedStudentIds.includes(s.id)" name="checkbox-mark" color="var(--color-primary)" />
        </view>
      </view>
      <u-input
        v-model="studentCode"
        placeholder="输入学生编号绑定"
        border="surround"
        class="bind-input"
      />
    </view>

    <view class="bind-form" v-if="selectedRole === 'teacher'">
      <text class="section-title">任教班级</text>
      <view class="class-list" v-if="userStore.teacherClasses.length">
        <view
          class="class-item pressable"
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
      class="submit-btn confirm-btn"
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
  background: var(--color-bg);
  padding: var(--space-xl) var(--space-xl);
}

.bind-header {
  text-align: center;
  padding: var(--space-2xl) 0;
}

.bind-title {
  font-size: 40rpx;
  font-weight: bold;
  color: var(--color-text-primary);
  display: block;
}

.bind-desc {
  font-size: 26rpx;
  color: var(--color-text-secondary);
  margin-top: var(--space-xs);
  display: block;
}

.role-select {
  display: flex;
  gap: var(--space-lg);
  margin: var(--space-xl) 0;
}

.role-card {
  flex: 1;
  background: var(--color-bg-card);
  border-radius: 16rpx;
  padding: var(--space-xl);
  text-align: center;
  border: 2rpx solid var(--color-border);
}

.role-card.active {
  border-color: var(--color-primary);
  background: var(--color-bg);
}

.role-icon {
  font-size: 60rpx;
  display: block;
}

.role-name {
  font-size: 28rpx;
  color: var(--color-text-primary);
  margin-top: var(--space-xs);
  display: block;
}

.bind-form {
  background: var(--color-bg-card);
  border-radius: 16rpx;
  padding: var(--space-lg);
  margin-top: var(--space-sm);
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: var(--color-text-primary);
  margin-bottom: var(--space-sm);
  display: block;
}

.student-item,
.class-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-sm);
  border-bottom: 1rpx solid var(--color-border-light);
  font-size: 28rpx;
}

.bind-input {
  margin-top: var(--space-sm);
}

.confirm-btn {
  margin-top: var(--space-2xl);
}
</style>
