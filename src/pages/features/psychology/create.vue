<template>
  <view class="psychology-page">
    <u-form :model="form" ref="formRef" labelWidth="140">
      <u-form-item label="预约类型" required>
        <view class="type-select">
          <view class="type-card" :class="{ active: form.type === 'doctor' }"
                @click="form.type = 'doctor'">
            <text class="type-icon">🏥</text>
            <text class="type-name">校医</text>
          </view>
          <view class="type-card" :class="{ active: form.type === 'counsel' }"
                @click="form.type = 'counsel'">
            <text class="type-icon">💬</text>
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
          <view class="slot-item" v-for="slot in timeSlots" :key="slot"
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
              :customStyle="{ margin: '40rpx 30rpx', height: '96rpx' }"
              @click="handleSubmit" />

    <view class="history-section" v-if="historyList.length">
      <text class="history-title">我的预约</text>
      <view class="history-item" v-for="item in historyList" :key="item.id">
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
  background: #F0F6FF;
  padding: 30rpx;
}

.type-select {
  display: flex;
  gap: 20rpx;
}

.type-card {
  flex: 1;
  text-align: center;
  padding: 24rpx;
  border-radius: 12rpx;
  border: 2rpx solid #e0e0e0;
  background: #fff;
}

.type-card.active {
  border-color: #4A90D9;
  background: #F0F6FF;
}

.type-icon { font-size: 40rpx; display: block; }
.type-name { font-size: 26rpx; display: block; margin-top: 6rpx; }

.slot-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12rpx;
}

.slot-item {
  text-align: center;
  padding: 14rpx;
  border-radius: 8rpx;
  background: #f5f5f5;
  font-size: 22rpx;
}

.slot-item.active {
  background: #4A90D9;
  color: #fff;
}

.history-section { margin-top: 40rpx; }

.history-title {
  font-size: 30rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 20rpx;
}

.history-item {
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.h-left { display: flex; flex-direction: column; gap: 6rpx; }
.h-type { font-size: 28rpx; font-weight: bold; }
.h-time { font-size: 24rpx; color: #999; }
</style>
