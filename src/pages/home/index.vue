<template>
  <view class="home-page">
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

    <u-swiper :list="bannerList" height="300" radius="12" :autoplay="true" />

    <view class="quick-actions">
      <view class="action-item pressable" v-for="item in quickActions" :key="item.path"
            @click="navigateTo(item.path)">
        <view class="action-icon" :style="{ background: item.bgColor }">
          <u-icon :name="item.icon" size="28" color="#fff" />
        </view>
        <text class="action-text">{{ item.name }}</text>
      </view>
    </view>

    <view class="section-card">
      <view class="section-header">
        <view class="section-title-wrap">
          <u-icon name="bell-fill" size="20" color="var(--color-primary)" />
          <text class="section-title">最新公告</text>
        </view>
        <text class="section-more" @click="viewAllNews">查看全部 ></text>
      </view>
      <view class="news-list">
        <view class="news-item pressable" v-for="item in newsList" :key="item.id">
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
  { name: '请假申请', icon: 'edit-pen-fill', path: '/pages/features/leave/create', bgColor: '#3B82F6' },
  { name: '访校申请', icon: 'coupon-fill', path: '/pages/features/visit/create', bgColor: '#6366F1' },
  { name: '心理校园', icon: 'heart-fill', path: '/pages/features/psychology/create', bgColor: '#059669' },
  { name: '饭卡充值', icon: 'rmb-circle-fill', path: '/pages/features/meal/recharge', bgColor: '#F59E0B' },
];

async function loadNews() {
  const res = await api.getNewsList();
  newsList.value = res.data.slice(0, 5);
}

function navigateTo(path: string) {
  uni.navigateTo({ url: path });
}

function viewAllNews() {}

onMounted(() => {
  loadNews();
});
</script>

<style lang="scss" scoped>
.home-page {
  min-height: 100vh;
  background: var(--color-bg);
  padding-bottom: var(--space-sm);
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-lg) var(--space-lg) var(--space-sm);
  background: var(--color-primary);
}

.greeting-text {
  font-size: var(--font-sm);
  color: rgba(255,255,255,0.8);
}

.user-name {
  font-size: var(--font-lg);
  font-weight: bold;
  color: var(--color-text-inverse);
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-lg);
  margin-top: var(--space-md);
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.action-icon {
  width: 90rpx;
  height: 90rpx;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
}

.action-text {
  font-size: var(--font-xs);
  color: var(--color-text-secondary);
  margin-top: var(--space-xs);
}

.section-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  margin: 0 var(--space-lg) var(--space-sm);
  padding: var(--space-md);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-sm);
}

.section-title-wrap {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.section-title {
  font-size: var(--font-md);
  font-weight: bold;
  color: var(--color-text-primary);
}

.section-more {
  font-size: var(--font-sm);
  color: var(--color-primary);
}

.news-item {
  padding: var(--space-sm) 0;
  border-bottom: 1rpx solid var(--color-border-light);
}

.news-title {
  font-size: var(--font-base);
  color: var(--color-text-primary);
}

.news-date {
  font-size: var(--font-xs);
  color: var(--color-text-tertiary);
  margin-top: var(--space-xs);
}
</style>
