<template>
  <view class="features-page">
    <view class="feature-grid">
      <view class="feature-card pressable" v-for="item in visibleFeatures" :key="item.path"
            @click="navigateTo(item.path)">
        <view class="feature-icon-wrap" :style="{ background: item.bgColor }">
          <u-icon :name="item.icon" size="28" :color="item.iconColor" />
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
  { name: '请假申请', desc: '为学生提交请假', icon: 'edit-pen-fill', path: '/pages/features/leave/create', bgColor: '#EFF6FF', iconColor: '#3B82F6', roles: ['parent', 'teacher'] },
  { name: '访校申请', desc: '申请进入校园', icon: 'coupon-fill', path: '/pages/features/visit/create', bgColor: '#EEF2FF', iconColor: '#6366F1', roles: ['parent', 'teacher'] },
  { name: '心理校园', desc: '预约校医或咨询', icon: 'heart-fill', path: '/pages/features/psychology/create', bgColor: '#ECFDF5', iconColor: '#059669', roles: ['parent', 'teacher'] },
  { name: '饭卡充值', desc: '为学生饭卡充值', icon: 'rmb-circle-fill', path: '/pages/features/meal/recharge', bgColor: '#FFFBEB', iconColor: '#D97706', roles: ['parent', 'teacher'] },
  { name: '值班排班', desc: '班级家长值班安排', icon: 'calendar-fill', path: '/pages/features/duty/index', bgColor: '#F5F3FF', iconColor: '#8B5CF6', roles: ['head_teacher'] },
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
  background: var(--color-bg);
  padding: var(--space-lg);
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-sm);
}

.feature-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.feature-icon-wrap {
  width: 100rpx;
  height: 100rpx;
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-sm);
}

.feature-name {
  font-size: var(--font-base);
  font-weight: bold;
  color: var(--color-text-primary);
}

.feature-desc {
  font-size: var(--font-xs);
  color: var(--color-text-tertiary);
  margin-top: var(--space-xs);
}
</style>
