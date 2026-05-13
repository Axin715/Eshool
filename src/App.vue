<script setup lang="ts">
import { onLaunch } from '@dcloudio/uni-app';
import { useUserStore } from '@/stores/user';

onLaunch(() => {
  const userStore = useUserStore();
  userStore.checkLoginStatus();
});
</script>

<style lang="scss">
@import 'uview-plus/index.scss';

/* ========== Layout ========== */
.page-container {
  min-height: 100vh;
  background-color: var(--color-bg);
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ========== Card ========== */
.card {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
  box-shadow: var(--shadow-sm);
}

/* ========== Press Feedback ========== */
.pressable {
  transition: transform 0.15s ease, opacity 0.15s ease;

  &:active {
    transform: scale(0.97);
    opacity: 0.85;
  }
}
</style>
