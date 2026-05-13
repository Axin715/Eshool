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

    <view class="qr-section" v-if="detail.status === 'approved'">
      <text class="qr-label">进校请出示此二维码</text>
      <view class="qr-code-wrap">
        <view class="qr-placeholder">
          <text class="qr-token-text">访校码: {{ detail.qrCodeToken }}</text>
        </view>
      </view>
      <text class="qr-tip">门卫扫码验证后即可入校</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { api } from '@/services/api';
import type { VisitRequest } from '@/types';

const userStore = useUserStore();
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
    const res = await api.getVisitRequests(userStore.user!.id);
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

.qr-placeholder {
  width: 280rpx;
  height: 280rpx;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx dashed #ccc;
  border-radius: 8rpx;
}

.qr-token-text {
  font-size: 20rpx;
  color: #999;
  text-align: center;
  word-break: break-all;
  padding: 20rpx;
}

.qr-tip {
  font-size: 24rpx;
  color: #999;
  display: block;
  margin-top: 20rpx;
}
</style>
