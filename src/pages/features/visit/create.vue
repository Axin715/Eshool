<template>
  <view class="visit-page">
    <u-form :model="form" ref="formRef" labelWidth="140">
      <u-form-item label="访校类型" required>
        <u-radio-group v-model="form.visitType" placement="row">
          <u-radio label="短期" name="short" />
          <u-radio label="长期" name="long" />
        </u-radio-group>
      </u-form-item>

      <u-form-item label="访校日期" required>
        <u-datetime-picker
          :value="form.date"
          mode="date"
          @confirm="(e: any) => form.date = e.value"
          ref="datePicker"
        />
      </u-form-item>

      <u-form-item label="结束日期" v-if="form.visitType === 'long'" required>
        <u-datetime-picker
          :value="endDate"
          mode="date"
          @confirm="(e: any) => endDate = e.value"
          ref="endDatePicker"
        />
      </u-form-item>

      <u-form-item label="访校事由" required>
        <u-textarea v-model="form.reason" placeholder="请输入访校事由" maxlength="300" />
      </u-form-item>
    </u-form>

    <u-button type="primary" text="提交申请" shape="circle"
              class="submit-btn"
              @click="handleSubmit" />

    <view class="history-section" v-if="historyList.length">
      <text class="history-title">申请记录</text>
      <view class="history-item pressable" v-for="item in historyList" :key="item.id"
            @click="viewDetail(item)">
        <view class="h-left">
          <text class="h-type">{{ item.visitType === 'short' ? '短期' : '长期' }}</text>
          <text class="h-date">{{ item.date }}</text>
        </view>
        <u-tag :text="item.status === 'approved' ? '已通过' : '待审批'"
               :type="item.status === 'approved' ? 'success' : 'warning'" size="mini" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useUserStore } from '@/stores/user';
import { api } from '@/services/api';
import type { VisitRequest } from '@/types';

const userStore = useUserStore();
const historyList = ref<VisitRequest[]>([]);
const endDate = ref('');

const form = reactive({
  visitType: 'short' as 'short' | 'long',
  date: '',
  reason: '',
});

async function loadHistory() {
  const res = await api.getVisitRequests(userStore.user!.id);
  historyList.value = res.data;
}

async function handleSubmit() {
  if (!form.date || !form.reason) {
    uni.showToast({ title: '请完善信息', icon: 'none' });
    return;
  }

  const res = await api.createVisitRequest({
    ...form,
    userId: userStore.user!.id,
    userName: userStore.user!.nickname,
    dateRange: form.visitType === 'long' ? { start: form.date, end: endDate.value } : undefined,
  });

  if (res.code === 0) {
    uni.showToast({ title: '申请成功', icon: 'success' });
    setTimeout(() => {
      uni.navigateTo({ url: `/pages/features/visit/detail?id=${res.data.id}` });
    }, 1000);
  }
}

function viewDetail(item: VisitRequest) {
  uni.navigateTo({ url: `/pages/features/visit/detail?id=${item.id}` });
}

loadHistory();
</script>

<style lang="scss" scoped>
.visit-page {
  min-height: 100vh;
  background: var(--color-bg);
  padding: var(--space-lg);
}

.history-section {
  margin-top: var(--space-xl);
}

.history-title {
  font-size: 30rpx;
  font-weight: bold;
  color: var(--color-text-primary);
  margin-bottom: var(--space-sm);
  display: block;
}

.history-item {
  background: var(--color-bg-card);
  border-radius: var(--space-sm);
  padding: var(--space-md);
  margin-bottom: var(--space-sm);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.h-left {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.h-type {
  font-size: var(--font-base);
  font-weight: bold;
}

.h-date {
  font-size: var(--font-sm);
  color: var(--color-text-tertiary);
}
</style>
