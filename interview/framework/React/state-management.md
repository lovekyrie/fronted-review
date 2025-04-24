### React 状态管理
React提供了多种状态管理方案，用于处理组件间的数据共享和状态同步。

#### 1. 组件内状态
##### 1.1 useState
```javascript
// 基本使用
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}

// 复杂状态
function Form() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        name="age"
        type="number"
        value={formData.age}
        onChange={handleChange}
      />
    </form>
  );
}
```

##### 1.2 useReducer
```javascript
// 定义reducer
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    default:
      return state;
  }
}

// 使用useReducer
function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <div>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
}
```

#### 2. Context API
##### 2.1 基本使用
```javascript
// 创建Context
const ThemeContext = React.createContext('light');

// 提供Context
function App() {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <ThemedButton />
    </ThemeContext.Provider>
  );
}

// 使用Context
function ThemedButton() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <button
      className={theme}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      Toggle Theme
    </button>
  );
}
```

##### 2.2 多层Context
```javascript
// 创建多个Context
const UserContext = React.createContext(null);
const ThemeContext = React.createContext('light');

// 提供多个Context
function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <Dashboard />
      </ThemeContext.Provider>
    </UserContext.Provider>
  );
}
```

#### 3. Redux
##### 3.1 基本配置
```javascript
// store/index.js
import { createStore } from 'redux';

const initialState = {
  count: 0
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

const store = createStore(reducer);
export default store;
```

##### 3.2 使用Redux
```javascript
// 组件中使用
import { useSelector, useDispatch } from 'react-redux';

function Counter() {
  const count = useSelector(state => state.count);
  const dispatch = useDispatch();

  return (
    <div>
      Count: {count}
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
    </div>
  );
}
```

#### 4. Redux Toolkit
##### 4.1 创建Slice
```javascript
// features/counterSlice.js
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0
  },
  reducers: {
    increment: state => {
      state.value += 1;
    },
    decrement: state => {
      state.value -= 1;
    }
  }
});

export const { increment, decrement } = counterSlice.actions;
export default counterSlice.reducer;
```

##### 4.2 配置Store
```javascript
// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counterSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer
  }
});
```

#### 5. 最佳实践
1. 合理选择状态管理方案
2. 避免状态冗余
3. 使用不可变更新
4. 合理使用Context
5. 使用Redux Toolkit
6. 保持状态可预测
7. 使用TypeScript
8. 注意性能优化
9. 保持代码简洁
10. 遵循状态管理规范

#### 6. 常见面试题
1. **状态管理方案的选择**
   - 组件内状态：useState, useReducer
   - 组件间状态：Context API
   - 全局状态：Redux, Redux Toolkit
   - 考虑项目规模和复杂度

2. **Redux vs Context API**
   - Redux适合大型应用
   - Context API适合小型应用
   - Redux有更好的开发工具
   - Context API更简单

3. **如何优化状态管理**
   - 避免不必要的状态
   - 使用不可变更新
   - 合理使用选择器
   - 使用Redux Toolkit 