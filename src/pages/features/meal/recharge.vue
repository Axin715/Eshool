<template>
  <view class="meal-page">
    <view class="student-picker" @click="showStudentPicker = true">
      <text class="picker-label">充值对象</text>
      <view class="picker-value">
        <text v-if="selectedStudent">{{ selectedStudent.name }}</text>
        <text v-else class="placeholder">请选择学生</text>
        <u-icon name="arrow-down" size="16" color="#999" />
      </view>
    </view>

    <view class="balance-card" v-if="selectedStudent">
      <text class="balance-label">当前余额</text>
      <text class="balance-amount">¥ {{ selectedStudent.mealBalance.toFixed(2) }}</text>
    </view>

    <view class="amount-section">
      <text class="section-label">选择充值金额</text>
      <view class="amount-grid">
        <view class="amount-item" v-for="amt in amounts" :key="amt"
              :class="{ active: rechargeAmount === amt }"
              @click="rechargeAmount = amt">
          <text>¥ {{ amt }}</text>
        </view>
        <view class="amount-item custom" :class="{ active: isCustom }">
          <u-input v-model="customAmount" type="number" placeholder="自定义"
                   :focus="isCustom" @focus="onCustomFocus" />
        </view>
      </view>
    </view>

    <u-button type="primary" text="确认充值" shape="circle"
              :customStyle="{ margin: '40rpx 30rpx', height: '96rpx' }"
              :disabled="!canRecharge"
              @click="handleRecharge" />

    <u-popup :show="showStudentPicker" mode="bottom" @close="showStudentPicker = false">
      <view class="picker-content">
        <view class="picker-title">选择学生</view>
        <view class="picker-item" v-for="s in studentList" :key="s.id"
              @click="selectStudent(s)">
          <view>
            <text>{{ s.name }} - {{ s.className }}</text>
            <text class="picker-balance">余额: ¥{{ s.mealBalance.toFixed(2) }}</text>
          </view>
          <u-icon v-if="selectedStudent?.id === s.id" name="checkbox-mark" color="#4A90D9" />
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/user';
import { api } from '@/services/api';
import type { Student } from '@/types';
import { MEAL_AMOUNTS } from '@/utils/constants';

const userStore = useUserStore();
const amounts = MEAL_AMOUNTS;
const studentList = ref<Student[]>([]);
const selectedStudent = ref<Student | null>(null);
const showStudentPicker = ref(false);
const rechargeAmount = ref(0);
const customAmount = ref('');
const isCustom = ref(false);

const canRecharge = computed(() =>
  selectedStudent.value && (rechargeAmount.value > 0 || Number(customAmount.value) > 0)
);

async function loadStudents() {
  const res = await api.getStudentsForRecharge(userStore.user!.id, userStore.isParent);
  studentList.value = res.data;
  if (studentList.value.length === 1) {
    selectedStudent.value = studentList.value[0];
  }
}

function selectStudent(s: Student) {
  selectedStudent.value = s;
  showStudentPicker.value = false;
}

function onCustomFocus() {
  isCustom.value = true;
  rechargeAmount.value = 0;
}

async function handleRecharge() {
  const amount = isCustom.value ? Number(customAmount.value) : rechargeAmount.value;
  if (!amount || amount <= 0) {
    uni.showToast({ title: '请输入有效金额', icon: 'none' });
    return;
  }

  uni.showModal({
    title: '确认充值',
    content: `为 ${selectedStudent.value?.name} 充值 ¥${amount}？`,
    success: async (res) => {
      if (res.confirm) {
        const result = await api.rechargeMealCard(selectedStudent.value!.id, amount);
        if (selectedStudent.value) {
          selectedStudent.value.mealBalance = result.data.balance;
        }
        uni.showToast({ title: '充值成功', icon: 'success' });
        rechargeAmount.value = 0;
        customAmount.value = '';
        isCustom.value = false;
      }
    },
  });
}

loadStudents();
</script>

<style lang="scss" scoped>
.meal-page {
  min-height: 100vh;
  background: #F0F6FF;
  padding: 30rpx;
}

.student-picker {
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.picker-label { font-size: 28rpx; color: #333; }
.picker-value { display: flex; align-items: center; gap: 10rpx; font-size: 28rpx; }
.placeholder { color: #ccc; }

.balance-card {
  background: linear-gradient(135deg, #4A90D9, #5BA0F5);
  border-radius: 16rpx;
  padding: 40rpx;
  text-align: center;
  margin: 30rpx 0;
  color: #fff;
}

.balance-label { font-size: 26rpx; opacity: 0.8; display: block; }
.balance-amount { font-size: 56rpx; font-weight: bold; display: block; margin-top: 10rpx; }

.amount-section { margin-top: 40rpx; }
.section-label { font-size: 28rpx; color: #333; margin-bottom: 20rpx; display: block; }

.amount-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}

.amount-item {
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  text-align: center;
  font-size: 30rpx;
  border: 2rpx solid #e0e0e0;
}

.amount-item.active {
  border-color: #4A90D9;
  background: #F0F6FF;
  color: #4A90D9;
}

.amount-item.custom {
  padding: 12rpx;
}

.picker-content { padding: 30rpx; }
.picker-title { font-size: 32rpx; font-weight: bold; text-align: center; margin-bottom: 20rpx; }

.picker-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
  font-size: 28rpx;
}

.picker-balance { font-size: 24rpx; color: #999; display: block; }
</style>
