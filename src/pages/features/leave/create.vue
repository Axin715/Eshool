<template>
  <view class="leave-page">
    <u-form :model="form" ref="formRef" labelWidth="140">
      <u-form-item label="请假学生" required>
        <view class="student-picker" @click="showStudentPicker = true">
          <text>{{ form.studentName || '请选择学生' }}</text>
          <u-icon name="arrow-down" size="16" color="#999" />
        </view>
      </u-form-item>

      <u-form-item label="请假类型" required>
        <u-radio-group v-model="form.leaveType" placement="row">
          <u-radio v-for="(label, key) in leaveTypes" :key="key"
                   :label="label" :name="key" />
        </u-radio-group>
      </u-form-item>

      <u-form-item label="开始日期" required>
        <u-datetime-picker
          :value="form.startTime"
          mode="date"
          @confirm="(e: any) => form.startTime = e.value"
          ref="startPicker"
        />
      </u-form-item>

      <u-form-item label="结束日期" required>
        <u-datetime-picker
          :value="form.endTime"
          mode="date"
          @confirm="(e: any) => form.endTime = e.value"
          ref="endPicker"
        />
      </u-form-item>

      <u-form-item label="请假原因" required>
        <u-textarea v-model="form.reason" placeholder="请输入请假原因" maxlength="200" />
      </u-form-item>
    </u-form>

    <u-button type="primary" text="提交申请" shape="circle"
              :customStyle="{ margin: '40rpx 30rpx', height: '96rpx' }"
              @click="handleSubmit" />

    <u-popup :show="showStudentPicker" mode="bottom" @close="showStudentPicker = false">
      <view class="picker-content">
        <view class="picker-title">选择学生</view>
        <view class="picker-item" v-for="s in studentList" :key="s.id"
              @click="selectStudent(s)">
          <text>{{ s.name }} - {{ s.className }}</text>
          <u-icon v-if="form.studentId === s.id" name="checkbox-mark" color="#4A90D9" />
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useUserStore } from '@/stores/user';
import { api } from '@/services/api';
import type { Student } from '@/types';
import { LEAVE_TYPE_MAP } from '@/utils/constants';

const userStore = useUserStore();
const showStudentPicker = ref(false);
const studentList = ref<Student[]>([]);

const leaveTypes = LEAVE_TYPE_MAP;

const form = reactive({
  studentId: '',
  studentName: '',
  leaveType: 'personal' as 'sick' | 'personal' | 'other',
  startTime: '',
  endTime: '',
  reason: '',
});

async function loadStudents() {
  const res = await api.getStudentsForRecharge(userStore.user!.id, userStore.isParent);
  studentList.value = res.data;
}

function selectStudent(s: Student) {
  form.studentId = s.id;
  form.studentName = s.name;
  showStudentPicker.value = false;
}

async function handleSubmit() {
  if (!form.studentId || !form.startTime || !form.endTime || !form.reason) {
    uni.showToast({ title: '请完善信息', icon: 'none' });
    return;
  }

  const approver = userStore.isParent
    ? { approverId: 'u3', approverName: '王老师' }
    : { approverId: userStore.user!.id, approverName: userStore.user!.nickname };

  await api.createLeaveRequest({
    ...form,
    applicantId: userStore.user!.id,
    applicantName: userStore.user!.nickname,
    ...approver,
    studentName: form.studentName,
  });

  uni.showToast({ title: '提交成功', icon: 'success' });
  setTimeout(() => uni.navigateBack(), 1500);
}

loadStudents();
</script>

<style lang="scss" scoped>
.leave-page {
  min-height: 100vh;
  background: #F0F6FF;
  padding: 30rpx;
}

.student-picker {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 20rpx;
  border: 1rpx solid #e0e0e0;
  border-radius: 8rpx;
  font-size: 28rpx;
}

.picker-content {
  padding: 30rpx;
}

.picker-title {
  font-size: 32rpx;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20rpx;
}

.picker-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
  font-size: 28rpx;
}
</style>
