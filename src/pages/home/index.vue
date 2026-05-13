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
      <view class="action-item" v-for="item in quickActions" :key="item.path"
            @click="navigateTo(item.path)">
        <view class="action-icon" :style="{ background: item.color }">
          <text>{{ item.icon }}</text>
        </view>
        <text class="action-text">{{ item.name }}</text>
      </view>
    </view>

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

function viewAllNews() {}

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
