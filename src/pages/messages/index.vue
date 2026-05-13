<template>
  <view class="messages-page">
    <u-tabs
      :list="tabs"
      :current="currentTab"
      @change="onTabChange"
      :activeStyle="{ color: 'var(--color-primary)' }"
      lineColor="#3B82F6"
    />

    <view class="message-list">
      <view class="message-item pressable" v-for="msg in displayMessages" :key="msg.id" @click="readMessage(msg)">
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
  background: var(--color-bg);
}

.message-list {
  padding: var(--space-sm) var(--space-lg);
}

.message-item {
  background: var(--color-bg-card);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  margin-bottom: var(--space-sm);
}

.msg-left {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  margin-bottom: var(--space-xs);
}

.msg-dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background: var(--color-error);
  flex-shrink: 0;
}

.msg-title {
  font-size: var(--font-md);
  font-weight: bold;
  color: var(--color-text-primary);
}

.msg-content {
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

.msg-date {
  font-size: var(--font-xs);
  color: var(--color-text-tertiary);
  margin-top: var(--space-xs);
  display: block;
}
</style>
