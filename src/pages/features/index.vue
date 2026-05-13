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
