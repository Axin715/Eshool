<template>
  <view class="psychology-page">
    <u-form :model="form" ref="formRef" labelWidth="140">
      <u-form-item label="预约类型" required>
        <view class="type-select">
          <view class="type-card pressable" :class="{ active: form.type === 'doctor' }"
                @click="form.type = 'doctor'">
            <u-icon name="plus-circle-fill" size="24" :color="form.type === 'doctor' ? 'var(--color-primary)' : 'var(--color-text-tertiary)'" />
            <text class="type-name">校医</text>
          </view>
          <view class="type-card pressable" :class="{ active: form.type === 'counsel' }"
                @click="form.type = 'counsel'">
            <u-icon name="chat-fill" size="24" :color="form.type === 'counsel' ? 'var(--color-primary)' : 'var(--color-text-tertiary)'" />
            <text class="type-name">心理咨询</text>
          </view>
        </view>
      </u-form-item>

      <u-form-item label="预约日期" required>
        <u-datetime-picker
          :value="form.date"
          mode="date"
          @confirm="(e: any) => form.date = e.value"
          ref="datePicker"
        />
      </u-form-item>

      <u-form-item label="预约时段" required>
        <view class="slot-grid">
          <view class="slot-item pressable" v-for="slot in timeSlots" :key="slot"
                :class="{ active: form.timeSlot === slot }"
                @click="form.timeSlot = slot">
            <text>{{ slot }}</text>
          </view>
        </view>
      </u-form-item>

      <u-form-item label="简要描述">
        <u-textarea v-model="form.description" placeholder="请简要描述您的情况" maxlength="300" />
      </u-form-item>
    </u-form>

    <u-button type="primary" text="提交预约" shape="circle"
              class="submit-btn"
              @click="handleSubmit" />

    <view class="history-section" v-if="historyList.length">
      <text class="history-title">我的预约</text>
      <view class="history-item pressable" v-for="item in historyList" :key="item.id">
        <view class="h-left">
          <text class="h-type">{{ item.type === 'doctor' ? '校医' : '心理咨询' }}</text>
          <text class="h-time">{{ item.date }} {{ item.timeSlot }}</text>
        </view>
        <u-tag :text="item.status === 'confirmed' ? '已确认' : '已取消'"
               :type="item.status === 'confirmed' ? 'success' : 'warning'" size="mini" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useUserStore } from '@/stores/user';
import { api } from '@/services/api';
import type { Appointment } from '@/types';
import { TIME_SLOTS } from '@/utils/constants';

const userStore = useUserStore();
const timeSlots = TIME_SLOTS;
const historyList = ref<Appointment[]>([]);

const form = reactive({
  type: 'doctor' as 'doctor' | 'counsel',
  date: '',
  timeSlot: '',
  description: '',
});

async function loadHistory() {
  const res = await api.getAppointments(userStore.user!.id);
  historyList.value = res.data;
}

async function handleSubmit() {
  if (!form.date || !form.timeSlot) {
    uni.showToast({ title: '请完善信息', icon: 'none' });
    return;
  }

  await api.createAppointment({
    ...form,
    userId: userStore.user!.id,
    userName: userStore.user!.nickname,
  });

  uni.showToast({ title: '预约成功', icon: 'success' });
  loadHistory();
  form.date = '';
  form.timeSlot = '';
  form.description = '';
}

loadHistory();
</script>

<style lang="scss" scoped>
.psychology-page {
  min-height: 100vh;
  background: var(--color-bg);
  padding: var(--space-lg);
}

.type-select {
  display: flex;
  gap: var(--space-sm);
}

.type-card {
  flex: 1;
  text-align: center;
  padding: var(--space-md);
  border-radius: var(--space-sm);
  border: 2rpx solid var(--color-border);
  background: var(--color-bg-card);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
}

.type-card.active {
  border-color: var(--color-primary);
  background: var(--color-bg);
}

.type-name { font-size: 26rpx; display: block; }

.slot-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-sm);
}

.slot-item {
  text-align: center;
  padding: 14rpx;
  border-radius: var(--space-xs);
  background: var(--color-bg-subtle);
  font-size: var(--font-xs);
}

.slot-item.active {
  background: var(--color-primary);
  color: var(--color-bg-card);
}

.history-section { margin-top: var(--space-xl); }

.history-title {
  font-size: 30rpx;
  font-weight: bold;
  display: block;
  margin-bottom: var(--space-sm);
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

.h-left { display: flex; flex-direction: column; gap: var(--space-xs); }
.h-type { font-size: var(--font-base); font-weight: bold; }
.h-time { font-size: var(--font-sm); color: var(--color-text-tertiary); }
</style>
