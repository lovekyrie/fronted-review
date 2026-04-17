# 权限管理体系：路由、按钮、SSO 与扫码登录

## 一、权限模型

推荐把权限拆成三层：

- **用户身份**：是否登录、token 是否有效。
- **角色权限**：管理员、运营、访客等角色。
- **资源权限**：页面、按钮、接口操作级别权限。

> 面试中要强调：前端权限用于体验控制，真正安全边界在后端鉴权。

## 二、前端路由鉴权

### 基本流程

1. 路由前置守卫判断是否有登录态。
2. 无登录态 -> 跳登录页并带上回跳地址。
3. 有登录态但无页面权限 -> 跳 403。
4. 首次进入可动态拉取权限并生成可访问路由。

```ts
router.beforeEach(async (to) => {
  if (!hasToken() && to.meta.requiresAuth) {
    return `/login?redirect=${encodeURIComponent(to.fullPath)}`
  }
  if (!permissionStore.ready) await permissionStore.bootstrap()
  if (to.meta.permission && !permissionStore.has(to.meta.permission)) return '/403'
})
```

## 三、按钮级权限控制

- 通过指令/组件封装权限判断，避免每个页面写重复逻辑。
- 按钮控制分两种：**隐藏**（看不到）和 **禁用**（看得到不可点）。
- 对关键操作必须以后端接口权限为准（前端只能减少误操作）。

## 四、单点登录（SSO）原理

### 核心目标

一次登录，多系统共享登录态。

### 常见实现

- 统一认证中心（CAS / OAuth2 / OIDC）。
- 子系统跳认证中心，认证成功后带 code/token 回跳。
- 前端通常只处理重定向与 token 存储更新。

## 五、扫码登录原理

1. PC 端请求生成二维码，拿到 `sceneId`。
2. 移动端扫码后确认登录，服务端绑定 `sceneId` 与用户身份。
3. PC 端通过轮询或 WebSocket 监听状态变化。
4. 确认成功后下发登录凭证，PC 完成登录。

### 安全要点

- 二维码短时效（如 60 秒）。
- 一次性使用，使用后立即失效。
- 登录确认要有设备信息提示，防止误授权。
