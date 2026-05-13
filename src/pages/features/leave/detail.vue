<template>
  <view class="detail-page" v-if="detail">
    <view class="status-card" :class="detail.status">
      <view class="status-header">
        <u-icon v-if="detail.status === 'approved'" name="checkmark-circle-fill" size="24" color="var(--color-accent)" />
        <u-icon v-else-if="detail.status === 'pending'" name="hourglass-half-fill" size="24" color="var(--color-warning)" />
        <u-icon v-else-if="detail.status === 'rejected'" name="close-circle-fill" size="24" color="var(--color-error)" />
        <text class="status-text">{{ statusText }}</text>
      </view>
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
  background: var(--color-bg);
  padding: var(--space-lg);
}

.status-card {
  text-align: center;
  padding: var(--space-xl);
  border-radius: 16rpx;
  margin-bottom: var(--space-lg);
}

.status-card.approved { background: var(--color-status-success-bg); }
.status-card.pending { background: var(--color-status-warning-bg); }
.status-card.rejected { background: var(--color-status-error-bg); }

.status-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
}

.status-text { font-size: var(--font-md); font-weight: bold; }

.info-card {
  background: var(--color-bg-card);
  border-radius: 16rpx;
  padding: var(--space-md);
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: var(--space-sm) 0;
  border-bottom: 1rpx solid var(--color-bg-subtle);
}

.info-label { font-size: var(--font-base); color: var(--color-text-tertiary); }
.info-value { font-size: var(--font-base); color: var(--color-text-primary); text-align: right; flex: 1; }
</style>
