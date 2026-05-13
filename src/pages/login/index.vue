<template>
  <view class="login-page">
    <view class="login-header">
      <view class="logo-area">
        <text class="logo-icon">🏫</text>
        <text class="app-name">数字校园</text>
        <text class="app-desc">连接家校 · 关爱成长</text>
      </view>
    </view>

    <view class="login-body">
      <u-button
        type="primary"
        icon="weixin-fill"
        text="微信授权登录"
        shape="circle"
        :customStyle="{ marginBottom: '20rpx', height: '96rpx' }"
        @click="handleWechatLogin"
      />

      <view class="phone-login">
        <view class="divider">
          <view class="divider-line"></view>
          <text class="divider-text">手机号登录</text>
          <view class="divider-line"></view>
        </view>

        <u-form :model="phoneForm" ref="phoneFormRef">
          <u-form-item prop="phone">
            <u-input
              v-model="phoneForm.phone"
              placeholder="请输入手机号"
              type="number"
              maxlength="11"
              prefixIcon="phone"
            />
          </u-form-item>
          <u-form-item prop="code">
            <u-input
              v-model="phoneForm.code"
              placeholder="请输入验证码"
              maxlength="6"
              prefixIcon="lock"
            >
              <template #suffix>
                <u-code
                  :seconds="60"
                  @end="codeEnd"
                  @start="codeStart"
                  ref="codeRef"
                  changeText="X秒"
                />
              </template>
            </u-input>
          </u-form-item>
        </u-form>

        <u-button
          type="primary"
          text="登录"
          shape="circle"
          :customStyle="{ height: '96rpx' }"
          @click="handlePhoneLogin"
        />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const codeRef = ref();

const phoneForm = reactive({
  phone: '',
  code: '',
});

function codeEnd() {}
function codeStart() {}

async function handleWechatLogin() {
  await userStore.loginByWechat();
  uni.switchTab({ url: '/pages/home/index' });
}

async function handlePhoneLogin() {
  if (!phoneForm.phone || phoneForm.phone.length !== 11) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' });
    return;
  }
  if (!phoneForm.code) {
    uni.showToast({ title: '请输入验证码', icon: 'none' });
    return;
  }
  await userStore.loginByPhone(phoneForm.phone);
  uni.switchTab({ url: '/pages/home/index' });
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #4A90D9 0%, #7AB8F5 50%, #F0F6FF 100%);
  display: flex;
  flex-direction: column;
  padding: 0 60rpx;
}

.login-header {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-area {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-icon {
  font-size: 100rpx;
  margin-bottom: 20rpx;
}

.app-name {
  font-size: 48rpx;
  font-weight: bold;
  color: #fff;
}

.app-desc {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 10rpx;
}

.login-body {
  padding-bottom: 100rpx;
}

.phone-login {
  margin-top: 40rpx;
}

.divider {
  display: flex;
  align-items: center;
  margin: 30rpx 0;
}

.divider-line {
  flex: 1;
  height: 1rpx;
  background-color: rgba(255, 255, 255, 0.5);
}

.divider-text {
  padding: 0 20rpx;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}
</style>
