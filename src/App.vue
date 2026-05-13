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

/* 全局通用样式 */
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-container {
  min-height: 100vh;
  background-color: #F0F6FF;
}
</style>
