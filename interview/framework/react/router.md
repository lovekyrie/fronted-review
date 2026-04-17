### React Router
React Router是React的官方路由库，用于实现单页面应用的路由管理。

#### 1. 基本配置
##### 1.1 路由设置
```javascript
// App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users/:id" element={<User />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

##### 1.2 路由模式
```javascript
// 使用HashRouter
import { HashRouter } from 'react-router-dom';

function App() {
  return (
    <HashRouter>
      <Routes>
        {/* 路由配置 */}
      </Routes>
    </HashRouter>
  );
}

// 使用MemoryRouter（用于测试）
import { MemoryRouter } from 'react-router-dom';

function App() {
  return (
    <MemoryRouter>
      <Routes>
        {/* 路由配置 */}
      </Routes>
    </MemoryRouter>
  );
}
```

#### 2. 路由导航
##### 2.1 声明式导航
```javascript
// 使用Link组件
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/users/123">User</Link>
      <Link to="/search?q=react">Search</Link>
    </nav>
  );
}

// 使用NavLink组件
import { NavLink } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <NavLink
        to="/"
        className={({ isActive }) => isActive ? 'active' : ''}
      >
        Home
      </NavLink>
    </nav>
  );
}
```

##### 2.2 编程式导航
```javascript
// 使用useNavigate
import { useNavigate } from 'react-router-dom';

function LoginButton() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // 登录逻辑
    navigate('/dashboard');
  };

  return <button onClick={handleLogin}>Login</button>;
}

// 使用useLocation
import { useLocation } from 'react-router-dom';

function SearchResults() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q');

  return <div>Search results for: {query}</div>;
}
```

#### 3. 路由参数
##### 3.1 URL参数
```javascript
// 使用useParams
import { useParams } from 'react-router-dom';

function User() {
  const { id } = useParams();

  return <div>User ID: {id}</div>;
}

// 使用useSearchParams
import { useSearchParams } from 'react-router-dom';

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearch = (query) => {
    setSearchParams({ q: query });
  };

  return (
    <div>
      <input
        type="text"
        onChange={(e) => handleSearch(e.target.value)}
        value={searchParams.get('q') || ''}
      />
    </div>
  );
}
```

##### 3.2 路由状态
```javascript
// 使用state传递数据
import { useNavigate } from 'react-router-dom';

function UserList() {
  const navigate = useNavigate();

  const handleClick = (user) => {
    navigate(`/users/${user.id}`, {
      state: { user }
    });
  };

  return (
    <div>
      {users.map(user => (
        <div key={user.id} onClick={() => handleClick(user)}>
          {user.name}
        </div>
      ))}
    </div>
  );
}

// 在目标组件中获取state
import { useLocation } from 'react-router-dom';

function UserDetail() {
  const location = useLocation();
  const { user } = location.state;

  return <div>{user.name}</div>;
}
```

#### 4. 路由守卫
##### 4.1 基本守卫
```javascript
// 创建受保护的路由组件
function ProtectedRoute({ children }) {
  const isAuthenticated = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// 使用受保护的路由
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
```

##### 4.2 路由重定向
```javascript
// 使用Navigate组件
import { Navigate } from 'react-router-dom';

function RedirectComponent() {
  return <Navigate to="/new-path" replace />;
}

// 使用重定向路由
function App() {
  return (
    <Routes>
      <Route path="/old-path" element={<Navigate to="/new-path" replace />} />
    </Routes>
  );
}
```

#### 5. 最佳实践
1. 使用嵌套路由
2. 实现路由懒加载
3. 使用路由守卫
4. 处理404页面
5. 使用路由参数
6. 实现路由重定向
7. 使用路由状态
8. 优化路由性能
9. 保持路由简洁
10. 遵循路由规范

#### 6. 常见面试题
1. **React Router的使用场景**
   - 单页面应用
   - 多页面应用
   - 需要路由管理的应用
   - 需要URL参数的应用

2. **路由守卫的实现方式**
   - 使用ProtectedRoute组件
   - 使用路由重定向
   - 使用useNavigate
   - 使用useLocation

3. **如何优化路由性能**
   - 使用路由懒加载
   - 实现路由缓存
   - 优化路由参数
   - 使用路由状态 

#### 7. 高频疏漏补充（路由追问）

##### 7.1 BrowserRouter vs HashRouter
- `BrowserRouter`：URL 更自然，但服务端必须配置 fallback。
- `HashRouter`：不依赖服务端路由配置，适合静态托管场景。

##### 7.2 嵌套路由与 Outlet（React Router v6）
实际项目常用父路由布局 + `Outlet` 渲染子路由，能减少重复布局代码并清晰拆分权限边界。

##### 7.3 路由守卫常见坑
1. 未登录重定向要带回跳地址（`state.from`）。
2. 登录成功后要 replace 回跳，避免历史栈污染。
3. 权限更新后要处理“当前路由已无权限”的兜底跳转。

##### 7.4 路由级别性能优化
- 路由懒加载（`React.lazy` + `Suspense`）。
- 对高频列表页做状态保留（URL query / store / 缓存策略）。
- 避免在路由切换时重复请求同一份稳定数据。