### React Basics

#### 1. JSX syntax
JSX is a syntax extension of JavaScript for writing HTML-like structures in JS.

##### 1.1 Basic syntax
```jsx
const name = "React";
const element = <span>Hello, {name}!</span>;

// Expression
<p>2 + 2 = {2 + 2}</p>
<p>Hello, {formatName(user)}!</p>
```

##### 1.2 Fragments
Avoid extra DOM nodes by using `<React.Fragment>` or the shorthand `<>...</>`.

```jsx
<React.Fragment>
  <h4>Hello!</h4>
  <p>Good to see you.</p>
</React.Fragment>

// Shorthand
<>
  <h4>Hello!</h4>
  <p>Good to see you.</p>
</>
```

##### 1.3 Differences from HTML

::: v-pre
| HTML | JSX | Notes |
|------|-----|------|
| `class` | `className` | Avoids clashing with the JS `class` keyword |
| `for` | `htmlFor` | Used for a label's `for` attribute |
| `onclick` | `onClick` | Event names are camelCased |
| `style="color: red"` | `style={{ color: 'red' }}` | Styles are objects |
| `innerHTML` | `dangerouslySetInnerHTML={{ __html: raw }}` | Renders raw HTML (guard against XSS) |
| `aria-*`, `data-*` | Unchanged | Not camelCased |
:::

```jsx
<div className="container" style={{ color: 'red', fontWeight: 'bold' }}>
  <label htmlFor="input-id">Label</label>
  <input id="input-id" />
  <div dangerouslySetInnerHTML={{ __html: rawHtml }} />
</div>
```

#### 2. Components and Props
##### 2.1 Function components
```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

##### 2.2 Composing components
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

##### 2.3 Props are read-only
A component must never mutate its own props; keep it a pure function.

#### 3. Lifecycle (class components vs Hooks)
##### 3.1 Class component lifecycle
```jsx
class LifecycleDemo extends Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  componentDidMount() {
    // After mount: API requests, subscriptions, DOM work
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Return false to skip rendering
    return true;
  }

  componentDidUpdate(prevProps, prevState) {
    // After update: run logic based on props/state changes
  }

  componentWillUnmount() {
    // Before unmount: clear timers, cancel requests, unbind events
  }

  render() {
    return <div>{this.state.count}</div>;
  }
}
```

##### 3.2 Hook equivalents
| Class component | Hooks equivalent |
|--------|------------|
| `componentDidMount` | `useEffect(() => {...}, [])` |
| `componentDidUpdate` | `useEffect(() => {...}, [deps])` |
| `componentWillUnmount` | `useEffect(() => { return () => {...} }, [])` |

#### 4. Event handling
##### 4.1 Preventing default behavior
```jsx
function handleClick(e) {
  e.preventDefault();
  alert('The link was clicked.');
}
<a href="#" onClick={handleClick}>Click me</a>
```

##### 4.2 Passing arguments
```jsx
<button onClick={() => setState(true)}>Turn ON</button>
<button onClick={(e) => deleteItem(id)}>Delete</button>
```

#### 5. Conditional rendering
```jsx
// Ternary
{isLoggedIn ? <UserGreeting /> : <GuestGreeting />}

// Logical AND &&
{unreadMessages.length > 0 && (
  <p>You have {unreadMessages.length} unread messages.</p>
)}

// Branching inside the component
function Greeting({ isLoggedIn }) {
  if (isLoggedIn) return <UserGreeting />;
  return <GuestGreeting />;
}
```

#### 6. Lists and Keys
##### 6.1 Basic usage
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

##### 6.2 Role of keys
- Help React identify which items changed so it can update the DOM efficiently.
- **Do not use index as a key** (reordering can cause incorrect reuse).
- Keys must be unique among siblings.

#### 7. Forms (controlled components)
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

#### 8. Lifting State Up
When several components need the same state, lift it to the nearest common parent.

```jsx
// Child receives state and updater via props
function TemperatureInput({ scale, temperature, onTemperatureChange }) {
  return (
    <input
      value={temperature}
      onChange={(e) => onTemperatureChange(e.target.value)}
    />
  );
}

// Parent owns the state, computes values, and passes them down
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

#### 9. Composition vs Inheritance
React recommends **composition** over inheritance, via `children` or custom slots.

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

// Usage
<Dialog title="Welcome" message="Thank you!">
  <input placeholder="Your name" />
  <button>Sign Up</button>
</Dialog>
```

#### 10. Pure components (React.memo)
Skip a child's re-render when its props have not changed, to improve performance.

```jsx
const Greeting = memo(function Greeting({ name }) {
  return <h3>Hello, {name}!</h3>;
});

// When the parent re-renders, Greeting skips render if name is unchanged
```
