### React Router
React Router is the official routing library for React. It manages routing in single-page apps.

#### 1. Basic setup
##### 1.1 Route configuration
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

##### 1.2 Router modes
```javascript
// Use HashRouter
import { HashRouter } from 'react-router-dom';

function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Route config */}
      </Routes>
    </HashRouter>
  );
}

// Use MemoryRouter (for tests)
import { MemoryRouter } from 'react-router-dom';

function App() {
  return (
    <MemoryRouter>
      <Routes>
        {/* Route config */}
      </Routes>
    </MemoryRouter>
  );
}
```

#### 2. Navigation
##### 2.1 Declarative navigation
```javascript
// Use the Link component
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

// Use the NavLink component
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

##### 2.2 Programmatic navigation
```javascript
// Use useNavigate
import { useNavigate } from 'react-router-dom';

function LoginButton() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Login logic
    navigate('/dashboard');
  };

  return <button onClick={handleLogin}>Login</button>;
}

// Use useLocation
import { useLocation } from 'react-router-dom';

function SearchResults() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q');

  return <div>Search results for: {query}</div>;
}
```

#### 3. Route parameters
##### 3.1 URL parameters
```javascript
// Use useParams
import { useParams } from 'react-router-dom';

function User() {
  const { id } = useParams();

  return <div>User ID: {id}</div>;
}

// Use useSearchParams
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

##### 3.2 Route state
```javascript
// Pass data via state
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

// Read state in the destination component
import { useLocation } from 'react-router-dom';

function UserDetail() {
  const location = useLocation();
  const { user } = location.state;

  return <div>{user.name}</div>;
}
```

#### 4. Route guards
##### 4.1 Basic guards
```javascript
// Create a protected route component
function ProtectedRoute({ children }) {
  const isAuthenticated = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Use the protected route
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

##### 4.2 Redirects
```javascript
// Use the Navigate component
import { Navigate } from 'react-router-dom';

function RedirectComponent() {
  return <Navigate to="/new-path" replace />;
}

// Redirect with a Route
function App() {
  return (
    <Routes>
      <Route path="/old-path" element={<Navigate to="/new-path" replace />} />
    </Routes>
  );
}
```

#### 5. Best practices
1. Use nested routes
2. Lazy-load routes
3. Use route guards
4. Handle 404 pages
5. Use route params
6. Implement redirects
7. Use route state
8. Optimize routing performance
9. Keep routes simple
10. Follow routing conventions

#### 6. Common interview questions
1. **When to use React Router**
   - Single-page apps
   - Multi-page apps
   - Apps that need route management
   - Apps that need URL parameters

2. **How to implement route guards**
   - Use a ProtectedRoute component
   - Use redirects
   - Use useNavigate
   - Use useLocation

3. **How to optimize routing performance**
   - Lazy-load routes
   - Cache routes
   - Optimize route params
   - Use route state

#### 7. High-frequency gaps (routing follow-ups)

##### 7.1 BrowserRouter vs HashRouter
- `BrowserRouter`: URLs look more natural, but the server must configure a fallback.
- `HashRouter`: Does not depend on server routing config; fits static hosting.

##### 7.2 Nested routes and Outlet (React Router v6)
Real projects often use a parent layout route plus `Outlet` to render children. That cuts duplicated layout code and makes permission boundaries clearer.

##### 7.3 Common route-guard pitfalls
1. Redirects for unauthenticated users should carry a return URL (`state.from`).
2. After login, replace back to that URL so you do not pollute the history stack.
3. After permissions change, handle the fallback jump when the current route is no longer allowed.

##### 7.4 Route-level performance
- Lazy-load routes (`React.lazy` + `Suspense`).
- Preserve state on high-traffic list pages (URL query / store / cache).
- Avoid refetching the same stable data on every route change.
