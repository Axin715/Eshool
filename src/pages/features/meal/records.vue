<template>
  <view class="records-page">
    <view class="records-list">
      <view class="record-item pressable" v-for="item in records" :key="item.id">
        <view class="r-left">
          <text class="r-student">为学生充值</text>
          <text class="r-date">{{ item.date }}</text>
        </view>
        <text class="r-amount">+¥ {{ item.amount }}</text>
      </view>
      <u-empty v-if="!records.length" text="暂无充值记录" mode="list" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface RecordItem {
  id: string;
  studentName: string;
  amount: number;
  date: string;
}

const records = ref<RecordItem[]>([]);
</script>

<style lang="scss" scoped>
.records-page {
  min-height: 100vh;
  background: var(--color-bg);
  padding: var(--space-lg);
}

.record-item {
  background: var(--color-bg-card);
  border-radius: var(--space-sm);
  padding: var(--space-md);
  margin-bottom: var(--space-sm);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.r-left { display: flex; flex-direction: column; gap: var(--space-xs); }
.r-student { font-size: var(--font-base); font-weight: bold; }
.r-date { font-size: var(--font-sm); color: var(--color-text-tertiary); }

.r-amount {
  font-size: var(--font-md);
  font-weight: bold;
  color: var(--color-accent);
}
</style>
