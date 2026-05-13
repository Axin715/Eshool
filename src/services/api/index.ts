// src/services/api/index.ts
// 真实 API 接口定义 - 与 Mock API 保持相同接口签名
// 后期切换到真实后端时，只需修改导入源

import { mockApi } from '@/services/mock';

// 直接导出 mockApi，后期替换为真实 API
export const api = mockApi;
