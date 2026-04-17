### Vue Router
Vue Router是Vue.js的官方路由管理器，用于构建单页面应用。

#### 1. 基本配置
##### 1.1 路由配置
```javascript
// router/index.js
import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/Home.vue';
import About from '@/views/About.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/user/:id',
    name: 'User',
    component: () => import('@/views/User.vue'),
    props: true
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
```

##### 1.2 路由模式
```javascript
// 哈希模式
const router = new VueRouter({
  mode: 'hash',
  routes
});

// 历史模式
const router = new VueRouter({
  mode: 'history',
  routes
});

// 抽象模式
const router = new VueRouter({
  mode: 'abstract',
  routes
});
```

#### 2. 路由导航
##### 2.1 声明式导航
```html
<!-- 使用router-link -->
<template>
  <nav>
    <router-link to="/">Home</router-link>
    <router-link :to="{ name: 'User', params: { id: 123 }}">User</router-link>
    <router-link :to="{ path: '/about', query: { plan: 'private' }}">About</router-link>
  </nav>
</template>
```

##### 2.2 编程式导航
```javascript
// 基本导航
this.$router.push('/home');
this.$router.push({ name: 'User', params: { id: 123 }});
this.$router.push({ path: '/about', query: { plan: 'private' }});

// 替换当前路由
this.$router.replace('/home');

// 前进后退
this.$router.go(-1);
this.$router.back();
this.$router.forward();
```

#### 3. 路由守卫
##### 3.1 全局守卫
```javascript
// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 检查用户是否已登录
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

// 全局后置守卫
router.afterEach((to, from) => {
  // 处理页面标题
  document.title = to.meta.title || 'Default Title';
});
```

##### 3.2 路由独享守卫
```javascript
const routes = [
  {
    path: '/admin',
    component: Admin,
    beforeEnter: (to, from, next) => {
      if (isAdmin) {
        next();
      } else {
        next('/login');
      }
    }
  }
];
```

##### 3.3 组件内守卫
```javascript
export default {
  beforeRouteEnter(to, from, next) {
    // 在渲染该组件的对应路由被验证前调用
    next(vm => {
      // 通过vm访问组件实例
    });
  },
  beforeRouteUpdate(to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    next();
  },
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    next();
  }
};
```

#### 4. 路由元信息
##### 4.1 定义元信息
```javascript
const routes = [
  {
    path: '/admin',
    component: Admin,
    meta: {
      requiresAuth: true,
      title: 'Admin Page'
    }
  }
];
```

##### 4.2 使用元信息
```javascript
// 在导航守卫中使用
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    // 处理需要认证的路由
  }
  next();
});
```

#### 5. 最佳实践
1. 使用命名路由
2. 使用路由懒加载
3. 合理使用路由守卫
4. 使用路由元信息
5. 处理404页面
6. 使用路由过渡
7. 保持路由简洁
8. 使用路由参数
9. 处理路由错误
10. 优化路由性能

#### 6. 常见面试题
1. **Vue Router的导航方式**
   - 声明式导航（router-link）
   - 编程式导航（this.$router）
   - 导航守卫控制
   - 路由参数传递

2. **路由守卫的使用场景**
   - 权限控制
   - 页面标题设置
   - 数据预加载
   - 路由拦截

3. **如何优化路由性能**
   - 使用路由懒加载
   - 合理使用路由缓存
   - 避免不必要的路由跳转
   - 优化路由配置 

#### 7. 高频疏漏补充（路由追问）

##### 7.1 hash 与 history 如何选择
- `hash`：兼容性更好，服务端无需额外配置，URL 带 `#`。
- `history`：URL 更美观，但服务端要兜底到同一个 `index.html`。

面试加分表达：如果部署在 Nginx，`history` 模式需要配置 fallback，避免刷新 404。

##### 7.2 路由参数 vs query 参数
- `params`：更适合资源定位（如 `/user/:id`）。
- `query`：更适合筛选条件（如 `/list?page=2&keyword=vue`）。

##### 7.3 导航守卫最佳实践
1. 守卫里只做“准入判断”，避免做重逻辑请求。
2. 避免重复跳转导致死循环（例如登录页反复重定向）。
3. 权限校验要前后端协同，前端只负责体验层拦截。

##### 7.4 keep-alive 与路由缓存边界
- 适合列表页返回保留滚动位置和筛选条件。
- 不适合实时性强的页面（需要每次进入刷新数据）。