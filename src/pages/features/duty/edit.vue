<template>
  <view class="duty-edit-page">
    <view class="edit-tip">请为每天选择值班家长</view>

    <view class="edit-list">
      <view class="edit-row" v-for="(day, index) in weekDays" :key="day.date">
        <view class="edit-day">
          <text class="edit-day-name">{{ day.dayOfWeek }}</text>
          <text class="edit-day-date">{{ day.date.slice(5) }}</text>
        </view>
        <view class="edit-picker pressable" @click="openPicker(index)">
          <text v-if="assignments[index]?.parentName" class="selected-name">
            {{ assignments[index].parentName }}
          </text>
          <text v-else class="no-selection">点击选择</text>
          <u-icon name="arrow-down" size="16" color="var(--color-text-tertiary)" />
        </view>
      </view>
    </view>

    <u-button type="primary" text="保存并发布" shape="circle"
              class="submit-btn"
              @click="handleSave" />

    <u-popup :show="showPicker" mode="bottom" @close="showPicker = false">
      <view class="picker-content">
        <view class="picker-title">选择值班家长</view>
        <view class="picker-item pressable" v-for="p in parentList" :key="p.id"
              @click="selectParent(p)">
          <text>{{ p.name }}</text>
          <u-icon v-if="currentPickIndex >= 0 && assignments[currentPickIndex]?.parentId === p.id"
                  name="checkbox-mark" color="var(--color-primary)" />
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useUserStore } from '@/stores/user';
import { api } from '@/services/api';
import type { DutyDay } from '@/types';
import { getWeekDates, getDayOfWeek } from '@/utils/date';

const userStore = useUserStore();
const parentList = ref<{ id: string; name: string }[]>([]);
const showPicker = ref(false);
const currentPickIndex = ref(-1);

const pages = getCurrentPages();
const options = (pages[pages.length - 1] as any).options || {};
const classId = options.classId || userStore.headClassId;
const weekStart = options.weekStart || '';

const weekDays = getWeekDates(weekStart).map(date => ({
  date,
  dayOfWeek: getDayOfWeek(date),
}));

const assignments = reactive<DutyDay[]>(weekDays.map(d => ({
  date: d.date,
  parentId: '',
  parentName: '',
})));

function openPicker(index: number) {
  currentPickIndex.value = index;
  showPicker.value = true;
}

function selectParent(p: { id: string; name: string }) {
  assignments[currentPickIndex.value] = {
    date: weekDays[currentPickIndex.value].date,
    parentId: p.id,
    parentName: p.name,
  };
  showPicker.value = false;
}

async function handleSave() {
  const hasAssignment = assignments.some(a => a.parentId);
  if (!hasAssignment) {
    uni.showToast({ title: '请至少安排一天值班', icon: 'none' });
    return;
  }

  await api.saveDutySchedule({
    classId,
    weekStart,
    className: userStore.teacherClasses.find(c => c.id === classId)?.name || '',
    dailyAssignments: [...assignments],
    published: true,
  });

  uni.showToast({ title: '发布成功', icon: 'success' });
  setTimeout(() => uni.navigateBack(), 1500);
}

async function loadParents() {
  const res = await api.getClassParents(classId);
  parentList.value = res.data;
}

async function loadExistingSchedule() {
  const res = await api.getDutySchedule(classId, weekStart);
  if (res.data) {
    res.data.dailyAssignments.forEach((a, i) => {
      if (i < assignments.length) {
        assignments[i] = { ...a };
      }
    });
  }
}

loadParents();
loadExistingSchedule();
</script>

<style lang="scss" scoped>
.duty-edit-page {
  min-height: 100vh;
  background: var(--color-bg);
  padding: var(--space-lg);
}

.edit-tip {
  font-size: 26rpx;
  color: var(--color-text-tertiary);
  margin-bottom: var(--space-sm);
  text-align: center;
}

.edit-list {
  background: var(--color-bg-card);
  border-radius: 16rpx;
}

.edit-row {
  display: flex;
  align-items: center;
  border-bottom: 1rpx solid var(--color-border-light);
}

.edit-day {
  width: 160rpx;
  padding: var(--space-md);
  background: var(--color-bg-subtle);
  text-align: center;
}

.edit-day-name { font-size: 26rpx; font-weight: bold; display: block; }
.edit-day-date { font-size: var(--font-xs); color: var(--color-text-tertiary); display: block; }

.edit-picker {
  flex: 1;
  padding: var(--space-md);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.selected-name { font-size: var(--font-base); color: var(--color-primary); }
.no-selection { font-size: 26rpx; color: var(--color-text-tertiary); }

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
</style>
