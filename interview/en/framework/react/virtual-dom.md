### React Virtual DOM
The Virtual DOM is one of React's core ideas. It makes DOM updates more efficient.

#### 1. Virtual DOM basics
##### 1.1 Core idea
```javascript
// Virtual DOM node shape
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

##### 1.2 Creating Virtual DOM
```javascript
// Using JSX
const element = (
  <div className="container">
    <h1>Hello World</h1>
  </div>
);

// Compiled result
const element = React.createElement(
  'div',
  { className: 'container' },
  React.createElement('h1', null, 'Hello World')
);
```

#### 2. Diff algorithm
##### 2.1 Basic strategy
```javascript
// Elements of different types
// Old tree
<div>
  <Counter />
</div>

// New tree
<span>
  <Counter />
</span>
// Full rebuild

// Elements of the same type
// Old tree
<div className="before" title="stuff" />
// New tree
<div className="after" title="stuff" />
// Update attributes only
```

##### 2.2 List comparison
```javascript
// Use key to optimize list rendering
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

#### 3. Rendering process
##### 3.1 First render
```javascript
// Create Virtual DOM
const element = (
  <div className="container">
    <h1>Hello World</h1>
  </div>
);

// Render to the DOM
ReactDOM.render(element, document.getElementById('root'));
```

##### 3.2 Update render
```javascript
// State updates trigger a re-render
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

#### 4. Performance optimization
##### 4.1 Avoid unnecessary renders
```javascript
// Use React.memo
const MemoizedComponent = React.memo(function MyComponent(props) {
  return <div>{props.name}</div>;
});

// Use useMemo
function ExpensiveComponent({ data }) {
  const processedData = useMemo(() => {
    return expensiveOperation(data);
  }, [data]);

  return <div>{processedData}</div>;
}

// Use useCallback
function ParentComponent() {
  const handleClick = useCallback(() => {
    console.log('Button clicked');
  }, []);

  return <ChildComponent onClick={handleClick} />;
}
```

##### 4.2 Batched updates
```javascript
// Automatic batching in React 18
function App() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  function handleClick() {
    setCount(c => c + 1); // Does not trigger a re-render by itself
    setFlag(f => !f);     // Does not trigger a re-render by itself
    // Only one re-render runs at the end
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

#### 5. Best practices
1. Use keys correctly
2. Avoid unnecessary renders
3. Use React.memo
4. Use useMemo and useCallback
5. Avoid deep nesting
6. Use batched updates
7. Optimize list rendering
8. Use code splitting
9. Keep components small
10. Follow React conventions

#### 6. Common interview questions
1. **How the Virtual DOM works**
   - Create a Virtual DOM tree
   - Diff the old and new Virtual DOM
   - Compute the minimal update
   - Patch the real DOM

2. **Diff algorithm optimizations**
   - Elements of different types
   - Elements of the same type
   - List comparison
   - Role of keys

3. **How to optimize Virtual DOM performance**
   - Use keys
   - Avoid unnecessary renders
   - Use React.memo
   - Use useMemo and useCallback
