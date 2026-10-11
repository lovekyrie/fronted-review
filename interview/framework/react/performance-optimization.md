### React 性能优化
React性能优化涉及多个方面，包括渲染优化、状态管理、代码分割等。

#### 1. 渲染优化
##### 1.1 避免不必要的渲染
```javascript
// 使用React.memo
const MemoizedComponent = React.memo(function MyComponent(props) {
  return <div>{props.name}</div>;
});

// 使用useMemo
function ExpensiveComponent({ data }) {
  const processedData = useMemo(() => {
    return expensiveOperation(data);
  }, [data]);

  return <div>{processedData}</div>;
}

// 使用useCallback
function ParentComponent() {
  const handleClick = useCallback(() => {
    console.log('Button clicked');
  }, []);

  return <ChildComponent onClick={handleClick} />;
}
```

##### 1.2 列表渲染优化
```javascript
// 使用key
function List({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}

// 使用虚拟列表
import { FixedSizeList } from 'react-window';

function VirtualList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {items[index].name}
    </div>
  );

  return (
    <FixedSizeList
      height={400}
      width={300}
      itemCount={items.length}
      itemSize={50}
    >
      {Row}
    </FixedSizeList>
  );
}
```

#### 2. 状态优化
##### 2.1 状态管理
```javascript
// 使用useReducer管理复杂状态
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

##### 2.2 状态更新优化
```javascript
// 使用函数式更新
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(prevCount => prevCount + 1)}>
      Count: {count}
    </button>
  );
}

// 批量更新
function BatchUpdate() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  function handleClick() {
    setCount(c => c + 1);
    setFlag(f => !f);
    // React 18中会自动批处理
  }
}
```

#### 3. 代码分割
##### 3.1 路由分割
```javascript
// 使用React.lazy
import React, { Suspense } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

const Home = React.lazy(() => import('./routes/Home'));
const About = React.lazy(() => import('./routes/About'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
}
```

##### 3.2 组件分割
```javascript
// 动态导入组件
const DynamicComponent = React.lazy(() => import('./DynamicComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DynamicComponent />
    </Suspense>
  );
}
```

#### 4. 网络优化
##### 4.1 数据预加载
```javascript
// 使用React Query预加载数据
import { useQuery } from 'react-query';

function UserProfile({ userId }) {
  const { data, isLoading } = useQuery(['user', userId], () =>
    fetch(`/api/users/${userId}`).then(res => res.json())
  );

  if (isLoading) return <div>Loading...</div>;
  return <div>{data.name}</div>;
}
```

##### 4.2 图片优化
```javascript
// 使用懒加载
import { LazyLoadImage } from 'react-lazy-load-image-component';

function ImageGallery({ images }) {
  return (
    <div>
      {images.map(image => (
        <LazyLoadImage
          key={image.id}
          src={image.src}
          alt={image.alt}
          effect="blur"
        />
      ))}
    </div>
  );
}
```

#### 5. 最佳实践
1. 使用React.memo避免不必要的渲染
2. 使用useMemo和useCallback缓存
3. 合理使用key
4. 使用虚拟列表
5. 实现代码分割
6. 优化状态管理
7. 使用批量更新
8. 优化网络请求
9. 使用懒加载
10. 保持代码简洁

#### 6. 常见面试题
1. **React性能优化方法**
   - 避免不必要的渲染
   - 使用虚拟列表
   - 实现代码分割
   - 优化状态管理

2. **如何优化列表渲染**
   - 使用key
   - 使用虚拟列表
   - 避免不必要的渲染
   - 使用分页加载

3. **如何优化网络请求**
   - 使用数据预加载
   - 实现数据缓存
   - 使用懒加载
   - 优化图片加载

## 每日练习参考

### Day 46：三件套本质

| API | 缓存什么 | 本质 |
|-----|----------|------|
| `useMemo(fn, deps)` | 缓存**计算结果** | deps 不变则返回上次结果 |
| `useCallback(fn, deps)` | 缓存**函数引用** | 等价于 `useMemo(() => fn, deps)` |
| `React.memo(Comp)` | 缓存**组件渲染** | props 浅比较不变则跳过 re-render |

### Day 46：使用准则

**该用的场景：**
- 传给 `memo` 子组件的 props（函数/对象）需要稳定引用。
- 计算量大的派生值（排序、过滤大数组）用 `useMemo`。
- 作为 `useEffect` 依赖的对象/函数需要稳定引用。

**不该用的场景：**
- 简单运算（`a + b`）不需要 `useMemo`，缓存本身有开销。
- 组件渲染很轻的情况，`memo` 的比较成本可能高于直接 re-render。
- 到处无脑包 memo 会增加代码复杂度，降低可读性。

### Day 46：引用稳定的 4 类需求

1. 传给 `memo` 子组件的 callback → `useCallback`
2. 传给 `memo` 子组件的对象/数组 → `useMemo`
3. `useEffect` 的依赖是对象/函数 → `useMemo` / `useCallback`
4. 第三方库（如 react-query 的 queryKey）需要稳定引用 → `useMemo`

### Day 46：React Compiler（未来）

React Compiler 会在编译阶段自动分析组件，插入等价于 `useMemo / useCallback / memo` 的优化，开发者不再需要手写。目前实验阶段，生产项目仍需手动。

### Day 46：反例：memo 失效

```jsx
const Child = React.memo(({ config }) => {
  console.log('Child render')
  return <div>{config.name}</div>
})

function Parent() {
  const [count, setCount] = useState(0)
  // ❌ 每次 render 创建新对象，memo 的浅比较永远是 false
  return <Child config={{ name: 'test' }} />
}
```

### Day 46：正例：稳定引用

```jsx
const Child = React.memo(({ config, onClick }) => {
  console.log('Child render')
  return <div onClick={onClick}>{config.name}</div>
})

function Parent() {
  const [count, setCount] = useState(0)
  // ✅ useMemo 稳定对象引用
  const config = useMemo(() => ({ name: 'test' }), [])
  // ✅ useCallback 稳定函数引用
  const onClick = useCallback(() => console.log('click'), [])
  return <Child config={config} onClick={onClick} />
}
```
