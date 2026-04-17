### React Hooks
Hooks是React 16.8引入的新特性，允许在函数组件中使用状态和其他React特性。

#### 1. 基础Hooks
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

// 函数式更新
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(prevCount => prevCount + 1)}>
      Count: {count}
    </button>
  );
}

// 多个状态
function Form() {
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);

  return (
    <form>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        type="number"
        value={age}
        onChange={e => setAge(Number(e.target.value))}
        placeholder="Age"
      />
    </form>
  );
}
```

##### 1.2 useEffect
```javascript
// 基本使用
function Example() {
  const [count, setCount] = useState(0);

  // 组件挂载和更新时执行
  useEffect(() => {
    document.title = `Count: ${count}`;
  });

  // 仅在挂载时执行
  useEffect(() => {
    console.log('Component mounted');
  }, []);

  // 依赖项变化时执行
  useEffect(() => {
    console.log(`Count changed to ${count}`);
  }, [count]);

  // 清理函数
  useEffect(() => {
    const subscription = someAPI.subscribe();
    return () => {
      subscription.unsubscribe();
    };
  }, []);
}
```

##### 1.3 useContext
```javascript
// 创建Context
const ThemeContext = React.createContext('light');

// 提供Context
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <ThemedButton />
    </ThemeContext.Provider>
  );
}

// 使用Context
function ThemedButton() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Themed Button</button>;
}
```

#### 2. 额外Hooks
##### 2.1 useReducer
```javascript
// 定义reducer
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
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
    </div>
  );
}
```

##### 2.2 useCallback
```javascript
// 缓存回调函数
function ParentComponent() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []); // 依赖项为空数组，回调函数不会改变

  return <ChildComponent onClick={handleClick} />;
}
```

##### 2.3 useMemo
```javascript
// 缓存计算结果
function ExpensiveComponent({ data }) {
  const processedData = useMemo(() => {
    return expensiveOperation(data);
  }, [data]); // 仅在data变化时重新计算

  return <div>{processedData}</div>;
}
```

##### 2.4 useRef
```javascript
// 存储不触发重新渲染的可变值
function TextInput() {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <>
      <input ref={inputRef} />
      <button onClick={focusInput}>聚焦</button>
    </>
  );
}

// 存储上一次的值（模拟 componentDidUpdate 跳过首次）
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
```

#### 3. 自定义Hooks
##### 3.1 基本使用
```javascript
// 创建自定义Hook
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

// 使用自定义Hook
function ResponsiveComponent() {
  const { width, height } = useWindowSize();
  return (
    <div>
      Window size: {width} x {height}
    </div>
  );
}
```

##### 3.2 常见自定义Hooks
```javascript
// 使用localStorage
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = value => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

// 使用fetch
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        setData(json);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}
```

#### 4. 最佳实践
1. 只在顶层使用Hooks
2. 只在React函数组件中使用Hooks
3. 使用useEffect处理副作用
4. 使用useCallback缓存回调
5. 使用useMemo缓存计算结果
6. 合理使用依赖数组
7. 创建可复用的自定义Hooks
8. 避免过度使用Hooks
9. 保持Hooks的纯粹性
10. 遵循Hooks的命名规范

#### 5. 常见面试题
1. **Hooks的优势**
   - 更好的代码组织
   - 更好的逻辑复用
   - 更好的类型推导
   - 更好的测试性

2. **useEffect的使用场景**
   - 数据获取
   - 订阅事件
   - 手动修改DOM
   - 设置定时器

3. **如何优化Hooks性能**
   - 使用useCallback
   - 使用useMemo
   - 合理使用依赖数组
   - 避免不必要的渲染 