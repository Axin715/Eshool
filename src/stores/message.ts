// src/stores/message.ts
import { defineStore } from 'pinia';
import type { Message, MessageType } from '@/types';
import { api } from '@/services/api';
import { useUserStore } from './user';

interface MessageState {
  messages: Message[];
  activeTab: MessageType;
}

export const useMessageStore = defineStore('message', {
  state: (): MessageState => ({
    messages: [],
    activeTab: 'class_notice',
  }),

  getters: {
    filteredMessages: (state) => {
      if (state.activeTab) {
        return state.messages.filter(m => m.type === state.activeTab);
      }
      return state.messages;
    },
    unreadCount: (state) => state.messages.filter(m => !m.read).length,
    classNotices: (state) => state.messages.filter(m => m.type === 'class_notice'),
    childUpdates: (state) => state.messages.filter(m => m.type === 'child_update'),
    systemMessages: (state) => state.messages.filter(m => m.type === 'system'),
  },

  actions: {
    async fetchMessages() {
      const userStore = useUserStore();
      if (!userStore.user) return;
      const res = await api.getMessages(userStore.user.id, userStore.isParent);
      this.messages = res.data;
    },

    setActiveTab(tab: MessageType) {
      this.activeTab = tab;
    },

    markAsRead(messageId: string) {
      const msg = this.messages.find(m => m.id === messageId);
      if (msg) msg.read = true;
    },
  },
});
