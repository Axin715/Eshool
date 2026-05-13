// src/utils/request.ts
import type { ApiResponse } from '@/types';
import { STORAGE_KEYS } from './constants';

const BASE_URL = '';

interface RequestOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: Record<string, any>;
  showLoading?: boolean;
}

export function request<T = any>(options: RequestOptions): Promise<ApiResponse<T>> {
  const { url, method = 'GET', data = {}, showLoading = true } = options;

  if (showLoading) {
    uni.showLoading({ title: '加载中...', mask: true });
  }

  const token = uni.getStorageSync(STORAGE_KEYS.TOKEN) || '';

  return new Promise((resolve, reject) => {
    uni.request({
      url,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      success: (res) => {
        if (showLoading) uni.hideLoading();
        const response = res.data as ApiResponse<T>;
        if (response.code === 0) {
          resolve(response);
        } else {
          uni.showToast({ title: response.message || '请求失败', icon: 'none' });
          reject(response);
        }
      },
      fail: (err) => {
        if (showLoading) uni.hideLoading();
        uni.showToast({ title: '网络异常', icon: 'none' });
        reject(err);
      },
    });
  });
}
