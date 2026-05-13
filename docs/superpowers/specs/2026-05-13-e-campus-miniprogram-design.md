# 数字校园微信小程序 - 设计文档

## 概述

面向家长和老师的数字校园微信小程序，提供校园信息查看、家校沟通、请假管理、访校申请、心理校园预约、饭卡充值、班级值班排班等功能。

## 技术选型

| 项目 | 选择 | 说明 |
|------|------|------|
| 框架 | uni-app (Vue 3 + TypeScript) | 跨端能力，后期可扩展 H5/App |
| UI 库 | uView Plus 3.x | 80+ 组件，表单场景支持成熟 |
| 状态管理 | Pinia | Vue 3 官方推荐 |
| HTTP | uni.request + 拦截器 | 统一封装，token 注入 |
| 设计风格 | 蓝色专业风 | 主色 #4A90D9，理性可信 |
| 数据模式 | Mock + API 双模式 | 先 Mock 开发，预留 API 接口 |
| 账号体系 | 多角色合一 | 一个账号可同时是家长和老师，支持切换 |

## 导航结构

### 底部 Tab 栏（4 项）

| Tab | 名称 | 内容 |
|-----|------|------|
| 主页 | 首页 | 学校新闻轮播、活动公告、快捷功能入口 |
| 消息 | 消息 | 班级通知、孩子动态（家长专属）、系统消息 |
| 功能 | 功能中心 | 请假、访校、心理校园、饭卡充值、值班排班 |
| 我的 | 个人中心 | 用户信息、身份切换、历史记录、设置 |

### 独立页面

- **登录页**：微信授权登录 + 手机验证码登录，选择身份，绑定学生/班级

## 账号与身份体系

一个微信账号（User）可以拥有多个角色身份，支持一键切换：

- **家长**：关联 1-N 个学生。可查看孩子动态、为孩子请假、充值饭卡
- **老师**：关联 1-N 个任教班级。可替学生请假、充值饭卡
- **班主任**：老师身份的增强（is_head_teacher + head_class_id），额外拥有值班排班权限

### 登录流程

```
微信授权 / 手机验证码登录
  → 选择当前身份（家长/老师）
  → 家长：输入学生 ID 绑定
  → 老师：选择任教班级
  → 进入主页
```

### 身份切换

"我的"页面提供身份切换入口。已绑定的多个身份可一键切换，切换后页面数据按新身份重新加载。

## 数据模型

### 核心实体

- **User**: id, openid, nickname, avatar, phone, roles[]
- **Parent**: user_id, student_ids[]
- **Teacher**: user_id, class_ids[], is_head_teacher, head_class_id
- **Student**: id, name, class_id, parent_id, meal_balance
- **Class**: id, name, grade, head_teacher_id

### 业务实体

- **LeaveRequest**: id, student_id, applicant_id, type(事假/病假/其他), start_time, end_time, reason, status(待审批/已批准/已拒绝), approver_id
- **VisitRequest**: id, user_id, type(短期/长期), date/date_range, reason, status, qr_code_token, expire_time
- **Appointment**: id, user_id, type(校医/心理咨询), time_slot, description, status
- **DutySchedule**: id, class_id, week_start, daily_assignments[{date, parent_id, parent_name}]
- **News/Message**: id, type, title, content, target_role, target_class, created_at

## 功能权限矩阵

| 功能 | 家长 | 普通老师 | 班主任 |
|------|:---:|:-----:|:----:|
| 查看学校新闻/公告 | ✅ | ✅ | ✅ |
| 接收班级消息 | ✅ | ✅ | ✅ |
| 查看孩子动态 | ✅ | - | - |
| 请假申请 | ✅ | ✅ | ✅ |
| 审批请假 | - | ✅ | ✅ |
| 访校申请 | ✅ | ✅ | ✅ |
| 心理校园预约 | ✅ | ✅ | ✅ |
| 饭卡充值 | ✅ | ✅ | ✅ |
| 班级值班排班 | - | - | ✅ |

## 核心功能流程

### 1. 请假申请
- 家长：选择孩子 → 类型 → 日期 → 原因 → 提交 → 对应老师审批
- 老师替学生请假：选择班级 → 学生 → 类型 → 日期 → 原因 → 自动审批通过
- 状态流转：待审批 → 已批准 / 已拒绝

### 2. 访校申请
- 选择类型：短期（单次有效）/ 长期（多次有效，有有效期）
- 填写事由、日期/时段 → 提交 → 审批通过 → 生成访校二维码
- 进校时门卫扫码验证，长期码过期后自动失效

### 3. 心理校园
- 选择预约类型：校医 / 心理咨询
- 查看可预约时段 → 填写简要描述 → 提交确认
- 支持查看已预约记录和取消预约

### 4. 饭卡充值
- 家长为孩子充值，老师为任教班级学生充值
- 选择学生 → 查看余额 → 选择金额（固定档位 + 自定义）→ Mock 支付 → 到账
- 显示充值记录

### 5. 班级值班排班（仅班主任）
- 给**家长**排班（如校门口执勤、班级协助等），不是给学生排班
- 选择周 → 为每天分配值班家长 → 发布排班表
- 发布后全班家长可在消息中查看

## 项目结构

```
src/
├── pages/
│   ├── login/          登录页
│   ├── home/           主页 Tab
│   ├── messages/       消息 Tab
│   ├── features/       功能 Tab（入口页）
│   │   ├── leave/         请假申请 + 审批
│   │   ├── visit/         访校申请 + 二维码
│   │   ├── psychology/    心理校园预约
│   │   ├── meal/          饭卡充值
│   │   └── duty/          班级值班排班
│   └── profile/        我的 Tab
├── components/         通用组件
├── stores/             Pinia 状态 (user, message, app)
├── services/
│   ├── mock/           Mock 数据
│   └── api/            API 接口定义
├── utils/              工具函数
├── static/             静态资源
├── App.vue
├── main.ts
├── pages.json
├── uni.scss
└── manifest.json
```

## 边界与约束

- Mock 数据预设：1 所学校、3 个班级、若干学生/家长/老师账号
- 访校二维码：前端生成带 token 的二维码图片，Mock 模式下门卫扫码用模拟验证
- 饭卡充值：Mock 支付流程，点击确认即视为支付成功
- 消息推送：Mock 模式下使用本地数据，无真实推送
- 暂不涉及：后台管理系统、真实支付对接、实时通讯

## 身份切换规则

- 家长切换老师：主页和消息按老师身份展示（班级视角）
- 老师切换家长：消息页显示孩子动态，功能页按家长权限展示
- 班主任标记仅在老师身份下生效（值班排班入口仅班主任可见）
