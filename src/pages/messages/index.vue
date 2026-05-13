<template>
  <view class="messages-page">
    <u-tabs
      :list="tabs"
      :current="currentTab"
      @change="onTabChange"
      :activeStyle="{ color: '#4A90D9' }"
      lineColor="#4A90D9"
    />

    <view class="message-list">
      <view class="message-item" v-for="msg in displayMessages" :key="msg.id" @click="readMessage(msg)">
        <view class="msg-left">
          <view class="msg-dot" v-if="!msg.read"></view>
          <text class="msg-title">{{ msg.title }}</text>
        </view>
        <view class="msg-right">
          <text class="msg-content">{{ msg.content }}</text>
          <text class="msg-date">{{ msg.createdAt }}</text>
        </view>
      </view>

      <u-empty v-if="!displayMessages.length" text="暂无消息" mode="list" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useMessageStore } from '@/stores/message';
import { useUserStore } from '@/stores/user';
import type { Message, MessageType } from '@/types';

const messageStore = useMessageStore();
const userStore = useUserStore();
const currentTab = ref(0);

const tabs = computed(() => {
  const list = [
    { name: '班级通知' },
    { name: '系统消息' },
  ] as { name: string }[];

  if (userStore.isParent) {
    list.splice(1, 0, { name: '孩子动态' });
  }
  return list;
});

const displayMessages = ref<Message[]>([]);

function getCurrentType(): MessageType {
  if (currentTab.value === 0) return 'class_notice';
  if (userStore.isParent && currentTab.value === 1) return 'child_update';
  return 'system';
}

function filterMessages() {
  const type = getCurrentType();
  displayMessages.value = messageStore.messages.filter(m => m.type === type);
}

function onTabChange(index: number) {
  currentTab.value = index;
  filterMessages();
}

function readMessage(msg: Message) {
  messageStore.markAsRead(msg.id);
  uni.showToast({ title: msg.content, icon: 'none', duration: 2000 });
}

onMounted(async () => {
  await messageStore.fetchMessages();
  filterMessages();
});
</script>

<style lang="scss" scoped>
.messages-page {
  min-height: 100vh;
  background: #F0F6FF;
}

.message-list {
  padding: 20rpx 30rpx;
}

.message-item {
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.msg-left {
  display: flex;
  align-items: center;
  gap: 10rpx;
  margin-bottom: 10rpx;
}

.msg-dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background: #FF6B6B;
  flex-shrink: 0;
}

.msg-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.msg-content {
  font-size: 26rpx;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

.msg-date {
  font-size: 22rpx;
  color: #999;
  margin-top: 8rpx;
  display: block;
}
</style>
