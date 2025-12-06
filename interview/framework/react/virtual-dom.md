### React 虚拟DOM
虚拟DOM是React的核心概念之一，用于提高DOM操作的效率。

#### 1. 虚拟DOM基础
##### 1.1 基本概念
```javascript
// 虚拟DOM对象结构
const virtualNode = {
  type: 'div',
  props: {
    className: 'container',
    children: [
      {
        type: 'h1',
        props: {
          children: 'Hello World'
        }
      }
    ]
  }
};
```

##### 1.2 创建虚拟DOM
```javascript
// 使用JSX
const element = (
  <div className="container">
    <h1>Hello World</h1>
  </div>
);

// 编译后的结果
const element = React.createElement(
  'div',
  { className: 'container' },
  React.createElement('h1', null, 'Hello World')
);
```

#### 2. Diff算法
##### 2.1 基本策略
```javascript
// 不同类型的元素
// 旧树
<div>
  <Counter />
</div>

// 新树
<span>
  <Counter />
</span>
// 完全重建

// 相同类型的元素
// 旧树
<div className="before" title="stuff" />
// 新树
<div className="after" title="stuff" />
// 只更新属性
```

##### 2.2 列表对比
```javascript
// 使用key优化列表渲染
const items = [
  { id: 1, text: 'Item 1' },
  { id: 2, text: 'Item 2' },
  { id: 3, text: 'Item 3' }
];

const list = (
  <ul>
    {items.map(item => (
      <li key={item.id}>{item.text}</li>
    ))}
  </ul>
);
```

#### 3. 渲染过程
##### 3.1 首次渲染
```javascript
// 创建虚拟DOM
const element = (
  <div className="container">
    <h1>Hello World</h1>
  </div>
);

// 渲染到DOM
ReactDOM.render(element, document.getElementById('root'));
```

##### 3.2 更新渲染
```javascript
// 状态更新触发重新渲染
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
```

#### 4. 性能优化
##### 4.1 避免不必要的渲染
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

##### 4.2 批量更新
```javascript
// React 18中的自动批处理
function App() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  function handleClick() {
    setCount(c => c + 1); // 不会触发重新渲染
    setFlag(f => !f);     // 不会触发重新渲染
    // 最后只会触发一次重新渲染
  }

  return (
    <div>
      <button onClick={handleClick}>Click me</button>
      <div>Count: {count}</div>
      <div>Flag: {flag.toString()}</div>
    </div>
  );
}
```

#### 5. 最佳实践
1. 合理使用key
2. 避免不必要的渲染
3. 使用React.memo
4. 使用useMemo和useCallback
5. 避免深层嵌套
6. 使用批量更新
7. 优化列表渲染
8. 使用代码分割
9. 保持组件简洁
10. 遵循React规范

#### 6. 常见面试题
1. **虚拟DOM的工作原理**
   - 创建虚拟DOM树
   - 对比新旧虚拟DOM
   - 计算最小更新
   - 更新真实DOM

2. **Diff算法的优化策略**
   - 不同类型元素
   - 相同类型元素
   - 列表对比
   - key的作用

3. **如何优化虚拟DOM性能**
   - 使用key
   - 避免不必要的渲染
   - 使用React.memo
   - 使用useMemo和useCallback 