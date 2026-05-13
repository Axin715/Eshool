<template>
  <view class="detail-page" v-if="detail">
    <view class="status-card" :class="detail.status">
      <text class="status-text">{{ statusText }}</text>
    </view>

    <view class="info-card">
      <view class="info-row">
        <text class="info-label">请假学生</text>
        <text class="info-value">{{ detail.studentName }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">请假类型</text>
        <text class="info-value">{{ LEAVE_TYPE_MAP[detail.leaveType] }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">时间</text>
        <text class="info-value">{{ detail.startTime }} 至 {{ detail.endTime }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">原因</text>
        <text class="info-value">{{ detail.reason }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">审批人</text>
        <text class="info-value">{{ detail.approverName }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { LEAVE_TYPE_MAP, LEAVE_STATUS_MAP } from '@/utils/constants';
import type { LeaveRequest } from '@/types';

const detail = ref<LeaveRequest | null>(null);

const statusText = computed(() => {
  if (!detail.value) return '';
  return LEAVE_STATUS_MAP[detail.value.status];
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
.status-card.rejected { background: #FFEBEE; }

.status-text { font-size: 32rpx; font-weight: bold; }

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
.info-value { font-size: 28rpx; color: #333; text-align: right; flex: 1; }
</style>
