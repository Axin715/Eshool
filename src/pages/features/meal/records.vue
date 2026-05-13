<template>
  <view class="records-page">
    <view class="records-list">
      <view class="record-item" v-for="item in records" :key="item.id">
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
  background: #F0F6FF;
  padding: 30rpx;
}

.record-item {
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.r-left { display: flex; flex-direction: column; gap: 6rpx; }
.r-student { font-size: 28rpx; font-weight: bold; }
.r-date { font-size: 24rpx; color: #999; }

.r-amount {
  font-size: 32rpx;
  font-weight: bold;
  color: #4CAF50;
}
</style>
