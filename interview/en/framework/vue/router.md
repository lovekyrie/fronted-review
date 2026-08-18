### Vue Router
Vue Router is the official routing manager for Vue.js, used to build single-page applications.

#### 1. Basic configuration
##### 1.1 Route configuration
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

##### 1.2 Routing modes
```javascript
// Hash mode
const router = new VueRouter({
  mode: 'hash',
  routes
});

// History mode
const router = new VueRouter({
  mode: 'history',
  routes
});

// Abstract mode
const router = new VueRouter({
  mode: 'abstract',
  routes
});
```

#### 2. Route navigation
##### 2.1 Declarative navigation
```html
<!-- Using router-link -->
<template>
  <nav>
    <router-link to="/">Home</router-link>
    <router-link :to="{ name: 'User', params: { id: 123 }}">User</router-link>
    <router-link :to="{ path: '/about', query: { plan: 'private' }}">About</router-link>
  </nav>
</template>
```

##### 2.2 Programmatic navigation
```javascript
// Basic navigation
this.$router.push('/home');
this.$router.push({ name: 'User', params: { id: 123 }});
this.$router.push({ path: '/about', query: { plan: 'private' }});

// Replace the current route
this.$router.replace('/home');

// Go forward and back
this.$router.go(-1);
this.$router.back();
this.$router.forward();
```

#### 3. Navigation guards
##### 3.1 Global guards
```javascript
// Global before guards
router.beforeEach((to, from, next) => {
  // Check whether the user is logged in
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

// Global after hooks
router.afterEach((to, from) => {
  // Handle the page title
  document.title = to.meta.title || 'Default Title';
});
```

##### 3.2 Per-route guards
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

##### 3.3 In-component guards
```javascript
export default {
  beforeRouteEnter(to, from, next) {
    // Called before the corresponding route that renders this component is confirmed
    next(vm => {
      // Access the component instance via vm
    });
  },
  beforeRouteUpdate(to, from, next) {
    // Called when the current route changes but this component is reused
    next();
  },
  beforeRouteLeave(to, from, next) {
    // Called when navigating away from the route that rendered this component
    next();
  }
};
```

#### 4. Route meta fields
##### 4.1 Defining meta
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

##### 4.2 Using meta
```javascript
// Use it in navigation guards
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    // Handle routes that require authentication
  }
  next();
});
```

#### 5. Best practices
1. Use named routes
2. Use route lazy loading
3. Use navigation guards appropriately
4. Use route meta fields
5. Handle 404 pages
6. Use route transitions
7. Keep routes simple
8. Use route params
9. Handle routing errors
10. Optimize routing performance

#### 6. Common interview questions
1. **Vue Router navigation methods**
   - Declarative navigation (`router-link`)
   - Programmatic navigation (`this.$router`)
   - Navigation guard control
   - Passing route params

2. **When to use navigation guards**
   - Access control
   - Setting the page title
   - Data prefetching
   - Route interception

3. **How to optimize routing performance**
   - Use route lazy loading
   - Use route cache appropriately
   - Avoid unnecessary navigations
   - Optimize route configuration

#### 7. High-frequency follow-ups (routing)

##### 7.1 Choosing between hash and history
- `hash`: better compatibility, no extra server config, URL includes `#`.
- `history`: cleaner URLs, but the server must fall back to the same `index.html`.

Interview bonus phrasing: if you deploy behind Nginx, `history` mode needs a fallback so a refresh does not 404.

##### 7.2 Route params vs query
- `params`: better for locating a resource (e.g. `/user/:id`).
- `query`: better for filters (e.g. `/list?page=2&keyword=vue`).

##### 7.3 Navigation guard best practices
1. Guards should only decide whether navigation is allowed; avoid heavy request logic.
2. Avoid redirect loops caused by repeated navigations (for example, the login page redirecting to itself).
3. Auth checks need frontend and backend together; the frontend only intercepts for UX.

##### 7.4 keep-alive and route cache boundaries
- Good for list pages that should keep scroll position and filters when you go back.
- Not good for highly real-time pages (you need a fresh fetch every time you enter).
