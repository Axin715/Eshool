<template>
  <view class="detail-page" v-if="detail">
    <view class="status-card" :class="detail.status">
      <u-icon :name="statusIconName" size="36" :color="statusColor" />
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

const statusIconName = computed(() => {
  const icons: Record<string, string> = {
    approved: 'checkmark-circle-fill', pending: 'hourglass-half-fill',
    rejected: 'close-circle-fill', expired: 'clock-fill',
  };
  return icons[detail.value?.status || ''] || '';
});
const statusColor = computed(() => {
  const colors: Record<string, string> = {
    approved: 'var(--color-accent)', pending: 'var(--color-warning)',
    rejected: 'var(--color-error)', expired: 'var(--color-text-tertiary)',
  };
  return colors[detail.value?.status || ''] || '';
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
.status-card.expired { background: var(--color-bg-subtle); }

.status-icon { font-size: 60rpx; display: block; }
.status-text { font-size: var(--font-md); font-weight: bold; display: block; margin-top: var(--space-xs); }

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
.info-value { font-size: var(--font-base); color: var(--color-text-primary); }

.qr-section {
  text-align: center;
  margin-top: 60rpx;
}

.qr-label {
  font-size: 30rpx;
  font-weight: bold;
  display: block;
  margin-bottom: var(--space-lg);
}

.qr-code-wrap {
  display: inline-block;
  background: var(--color-bg-card);
  padding: var(--space-lg);
  border-radius: 16rpx;
}

.qr-placeholder {
  width: 280rpx;
  height: 280rpx;
  background: var(--color-bg-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx dashed var(--color-text-tertiary);
  border-radius: var(--space-xs);
}

.qr-token-text {
  font-size: 20rpx;
  color: var(--color-text-tertiary);
  text-align: center;
  word-break: break-all;
  padding: var(--space-sm);
}

.qr-tip {
  font-size: var(--font-sm);
  color: var(--color-text-tertiary);
  display: block;
  margin-top: var(--space-sm);
}
</style>
