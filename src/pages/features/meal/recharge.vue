<template>
  <view class="meal-page">
    <view class="student-picker pressable" @click="showStudentPicker = true">
      <text class="picker-label">充值对象</text>
      <view class="picker-value">
        <text v-if="selectedStudent">{{ selectedStudent.name }}</text>
        <text v-else class="placeholder">请选择学生</text>
        <u-icon name="arrow-down" size="16" color="var(--color-text-tertiary)" />
      </view>
    </view>

    <view class="balance-card" v-if="selectedStudent">
      <text class="balance-label">当前余额</text>
      <text class="balance-amount">¥ {{ selectedStudent.mealBalance.toFixed(2) }}</text>
    </view>

    <view class="amount-section">
      <text class="section-label">选择充值金额</text>
      <view class="amount-grid">
        <view class="amount-item pressable" v-for="amt in amounts" :key="amt"
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
              class="submit-btn"
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
          <u-icon v-if="selectedStudent?.id === s.id" name="checkbox-mark" color="var(--color-primary)" />
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
  background: var(--color-bg);
  padding: var(--space-lg);
}

.student-picker {
  background: var(--color-bg-card);
  border-radius: var(--space-sm);
  padding: var(--space-md);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.picker-label { font-size: var(--font-base); color: var(--color-text-primary); }
.picker-value { display: flex; align-items: center; gap: var(--space-xs); font-size: var(--font-base); }
.placeholder { color: var(--color-text-tertiary); }

.balance-card {
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  border-radius: 16rpx;
  padding: var(--space-xl);
  text-align: center;
  margin: var(--space-lg) 0;
  color: var(--color-bg-card);
}

.balance-label { font-size: 26rpx; opacity: 0.8; display: block; }
.balance-amount { font-size: 56rpx; font-weight: bold; display: block; margin-top: var(--space-xs); }

.amount-section { margin-top: var(--space-xl); }
.section-label { font-size: var(--font-base); color: var(--color-text-primary); margin-bottom: var(--space-sm); display: block; }

.amount-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-sm);
}

.amount-item {
  background: var(--color-bg-card);
  border-radius: var(--space-sm);
  padding: var(--space-md);
  text-align: center;
  font-size: 30rpx;
  border: 2rpx solid var(--color-border);
}

.amount-item.active {
  border-color: var(--color-primary);
  background: #F0F6FF;
  color: var(--color-primary);
}

.amount-item.custom {
  padding: var(--space-sm);
}

.picker-content { padding: var(--space-lg); }
.picker-title { font-size: var(--font-md); font-weight: bold; text-align: center; margin-bottom: var(--space-sm); }

.picker-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md) 0;
  border-bottom: 1rpx solid var(--color-border-light);
  font-size: var(--font-base);
}

.picker-balance { font-size: var(--font-sm); color: var(--color-text-tertiary); display: block; }
</style>
