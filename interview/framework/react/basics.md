### React 基础概念

#### 1. JSX 语法
JSX 是 JavaScript 的语法扩展，用于在 JS 中编写 HTML 结构。

##### 1.1 基本语法
```jsx
const name = "React";
const element = <span>Hello, {name}!</span>;

// 表达式
<p>2 + 2 = {2 + 2}</p>
<p>Hello, {formatName(user)}!</p>
```

##### 1.2 Fragments（片段）
避免多余 DOM 节点，使用 `<React.Fragment>` 或简写 `<>...</>`。

```jsx
<React.Fragment>
  <h4>Hello!</h4>
  <p>Good to see you.</p>
</React.Fragment>

// 简写
<>
  <h4>Hello!</h4>
  <p>Good to see you.</p>
</>
```

##### 1.3 与 HTML 的差异

::: v-pre
| HTML | JSX | 说明 |
|------|-----|------|
| `class` | `className` | 避免与 JS 的 class 关键字冲突 |
| `for` | `htmlFor` | 用于 label 的 for 属性 |
| `onclick` | `onClick` | 事件名驼峰化 |
| `style="color: red"` | `style={{ color: 'red' }}` | 样式为对象 |
| `innerHTML` | `dangerouslySetInnerHTML={{ __html: raw }}` | 渲染原始 HTML（需防 XSS） |
| `aria-*`、`data-*` | 保持不变 | 不驼峰化 |
:::

```jsx
<div className="container" style={{ color: 'red', fontWeight: 'bold' }}>
  <label htmlFor="input-id">Label</label>
  <input id="input-id" />
  <div dangerouslySetInnerHTML={{ __html: rawHtml }} />
</div>
```

#### 2. 组件与 Props
##### 2.1 函数组件
```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

##### 2.2 组合组件
```jsx
function App() {
  return (
    <div>
      <Welcome name="Sara" />
      <Welcome name="Cahal" />
    </div>
  );
}
```

##### 2.3 Props 只读
组件决不能修改自身的 props，保持纯函数特性。

#### 3. 生命周期（类组件 vs Hooks）
##### 3.1 类组件生命周期
```jsx
class LifecycleDemo extends Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  componentDidMount() {
    // 挂载后：API 请求、订阅、DOM 操作
  }

  shouldComponentUpdate(nextProps, nextState) {
    // 返回 false 可阻止渲染
    return true;
  }

  componentDidUpdate(prevProps, prevState) {
    // 更新后：根据 props/state 变化执行逻辑
  }

  componentWillUnmount() {
    // 卸载前：清理定时器、取消请求、解绑事件
  }

  render() {
    return <div>{this.state.count}</div>;
  }
}
```

##### 3.2 函数组件对应关系
| 类组件 | Hooks 等价 |
|--------|------------|
| `componentDidMount` | `useEffect(() => {...}, [])` |
| `componentDidUpdate` | `useEffect(() => {...}, [deps])` |
| `componentWillUnmount` | `useEffect(() => { return () => {...} }, [])` |

#### 4. 事件处理
##### 4.1 阻止默认行为
```jsx
function handleClick(e) {
  e.preventDefault();
  alert('The link was clicked.');
}
<a href="#" onClick={handleClick}>Click me</a>
```

##### 4.2 传递参数
```jsx
<button onClick={() => setState(true)}>Turn ON</button>
<button onClick={(e) => deleteItem(id)}>Delete</button>
```

#### 5. 条件渲染
```jsx
// 三元运算符
{isLoggedIn ? <UserGreeting /> : <GuestGreeting />}

// 逻辑与 &&
{unreadMessages.length > 0 && (
  <p>You have {unreadMessages.length} unread messages.</p>
)}

// 组件内判断
function Greeting({ isLoggedIn }) {
  if (isLoggedIn) return <UserGreeting />;
  return <GuestGreeting />;
}
```

#### 6. 列表与 Keys
##### 6.1 基本用法
```jsx
const todos = [
  { id: 1, text: 'Learn React' },
  { id: 2, text: 'Build an App' },
];

<ul>
  {todos.map((todo) => (
    <li key={todo.id}>{todo.text}</li>
  ))}
</ul>
```

##### 6.2 Key 的作用
- 帮助 React 识别哪些元素发生了变化，以高效更新 DOM。
- **不要用 index 作为 key**（列表会重排时会导致错误复用）。
- key 在兄弟节点间必须唯一。

#### 7. 表单（受控组件）
```jsx
function FormDemo() {
  const [formData, setFormData] = useState({
    name: '',
    flavor: 'coconut',
    isGoing: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={formData.name} onChange={handleChange} />
      <select name="flavor" value={formData.flavor} onChange={handleChange}>
        <option value="coconut">Coconut</option>
      </select>
      <input name="isGoing" type="checkbox" checked={formData.isGoing} onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  );
}
```

#### 8. 状态提升（Lifting State Up）
当多个组件需要共享状态时，将状态提升到最近的公共父组件。

```jsx
// 子组件通过 props 接收状态和更新函数
function TemperatureInput({ scale, temperature, onTemperatureChange }) {
  return (
    <input
      value={temperature}
      onChange={(e) => onTemperatureChange(e.target.value)}
    />
  );
}

// 父组件持有状态，统一计算并下传
function Calculator() {
  const [temperature, setTemperature] = useState('');
  const [scale, setScale] = useState('c');
  const celsius = scale === 'f' ? toCelsius(temperature) : temperature;
  const fahrenheit = scale === 'c' ? toFahrenheit(temperature) : temperature;

  return (
    <>
      <TemperatureInput scale="c" temperature={celsius} onTemperatureChange={...} />
      <TemperatureInput scale="f" temperature={fahrenheit} onTemperatureChange={...} />
    </>
  );
}
```

#### 9. 组合 vs 继承
React 推荐使用**组合**而非继承，通过 `children` 或自定义 slots 实现。

```jsx
function FancyBorder({ color, children }) {
  return (
    <div className={`border-4 border-${color} p-4`}>
      {children}
    </div>
  );
}

function Dialog({ title, message, children }) {
  return (
    <FancyBorder color="blue">
      <h1>{title}</h1>
      <p>{message}</p>
      {children}
    </FancyBorder>
  );
}

// 使用
<Dialog title="Welcome" message="Thank you!">
  <input placeholder="Your name" />
  <button>Sign Up</button>
</Dialog>
```

#### 10. 纯组件（React.memo）
当 props 未变化时，跳过子组件渲染以优化性能。

```jsx
const Greeting = memo(function Greeting({ name }) {
  return <h3>Hello, {name}!</h3>;
});

// 父组件更新时，若 name 未变，Greeting 不会重新渲染
```
