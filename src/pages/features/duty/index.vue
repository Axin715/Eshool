<template>
  <view class="duty-page">
    <view class="week-selector">
      <u-icon name="arrow-left" size="20" @click="prevWeek" />
      <text class="week-text">{{ weekRange.start }} ~ {{ weekRange.end }}</text>
      <u-icon name="arrow-right" size="20" @click="nextWeek" />
    </view>

    <view class="schedule-table" v-if="schedule">
      <view class="day-row" v-for="day in weekDays" :key="day.date">
        <view class="day-label">
          <text class="day-name">{{ day.dayOfWeek }}</text>
          <text class="day-date">{{ day.date.slice(5) }}</text>
        </view>
        <view class="day-duty">
          <text v-if="day.assignment" class="duty-name">{{ day.assignment.parentName }}</text>
          <text v-else class="duty-empty">未安排</text>
        </view>
      </view>
    </view>

    <u-empty v-else text="暂无排班，点击下方按钮创建" mode="list" />

    <u-button type="primary" text="编辑排班" shape="circle"
              class="submit-btn"
              @click="goEdit" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/user';
import { api } from '@/services/api';
import type { DutySchedule, DutyDay } from '@/types';
import { getWeekRange, getWeekDates, getDayOfWeek } from '@/utils/date';

const userStore = useUserStore();
const currentWeekStart = ref(getWeekRange().start);
const schedule = ref<DutySchedule | null>(null);

const weekRange = computed(() => getWeekRange(new Date(currentWeekStart.value)));

const weekDays = computed(() => {
  const dates = getWeekDates(currentWeekStart.value);
  return dates.map(date => ({
    date,
    dayOfWeek: getDayOfWeek(date),
    assignment: schedule.value?.dailyAssignments.find(a => a.date === date) || null,
  }));
});

function prevWeek() {
  const d = new Date(currentWeekStart.value);
  d.setDate(d.getDate() - 7);
  currentWeekStart.value = d.toISOString().slice(0, 10);
  loadSchedule();
}

function nextWeek() {
  const d = new Date(currentWeekStart.value);
  d.setDate(d.getDate() + 7);
  currentWeekStart.value = d.toISOString().slice(0, 10);
  loadSchedule();
}

async function loadSchedule() {
  if (!userStore.headClassId) return;
  const res = await api.getDutySchedule(userStore.headClassId, currentWeekStart.value);
  schedule.value = res.data;
}

function goEdit() {
  uni.navigateTo({
    url: `/pages/features/duty/edit?classId=${userStore.headClassId}&weekStart=${currentWeekStart.value}`
  });
}

loadSchedule();
</script>

<style lang="scss" scoped>
.duty-page {
  min-height: 100vh;
  background: var(--color-bg);
  padding: var(--space-lg);
}

.week-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: var(--space-sm);
  background: var(--color-bg-card);
  border-radius: var(--space-sm);
  margin-bottom: var(--space-sm);
}

.week-text { font-size: var(--font-base); font-weight: bold; }

.schedule-table {
  background: var(--color-bg-card);
  border-radius: 16rpx;
  overflow: hidden;
}

.day-row {
  display: flex;
  border-bottom: 1rpx solid var(--color-border-light);
}

.day-label {
  width: 160rpx;
  padding: var(--space-sm);
  background: var(--color-bg-subtle);
  text-align: center;
}

.day-name { font-size: 26rpx; font-weight: bold; display: block; }
.day-date { font-size: var(--font-xs); color: var(--color-text-tertiary); display: block; }

.day-duty {
  flex: 1;
  padding: var(--space-sm);
  display: flex;
  align-items: center;
}

.duty-name { font-size: var(--font-base); color: var(--color-primary); }
.duty-empty { font-size: 26rpx; color: var(--color-text-tertiary); }
</style>
