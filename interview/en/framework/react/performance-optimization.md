### React Performance Optimization
React performance work spans rendering, state management, code splitting, and more.

#### 1. Rendering optimization
##### 1.1 Avoid unnecessary renders
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

##### 1.2 List rendering optimization
```javascript
// Use key
function List({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}

// Use a virtual list
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

#### 2. State optimization
##### 2.1 State management
```javascript
// Use useReducer for complex state
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

##### 2.2 State update optimization
```javascript
// Functional updates
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(prevCount => prevCount + 1)}>
      Count: {count}
    </button>
  );
}

// Batched updates
function BatchUpdate() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  function handleClick() {
    setCount(c => c + 1);
    setFlag(f => !f);
    // Automatically batched in React 18
  }
}
```

#### 3. Code splitting
##### 3.1 Route-based splitting
```javascript
// Use React.lazy
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

##### 3.2 Component splitting
```javascript
// Dynamically import a component
const DynamicComponent = React.lazy(() => import('./DynamicComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DynamicComponent />
    </Suspense>
  );
}
```

#### 4. Network optimization
##### 4.1 Data prefetching
```javascript
// Prefetch data with React Query
import { useQuery } from 'react-query';

function UserProfile({ userId }) {
  const { data, isLoading } = useQuery(['user', userId], () =>
    fetch(`/api/users/${userId}`).then(res => res.json())
  );

  if (isLoading) return <div>Loading...</div>;
  return <div>{data.name}</div>;
}
```

##### 4.2 Image optimization
```javascript
// Use lazy loading
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

#### 5. Best practices
1. Use React.memo to skip unnecessary renders
2. Cache with useMemo and useCallback
3. Use keys correctly
4. Use virtual lists
5. Split code
6. Optimize state management
7. Use batched updates
8. Optimize network requests
9. Use lazy loading
10. Keep the code simple

#### 6. Common interview questions
1. **React performance optimization techniques**
   - Avoid unnecessary renders
   - Use virtual lists
   - Split code
   - Optimize state management

2. **How to optimize list rendering**
   - Use keys
   - Use virtual lists
   - Avoid unnecessary renders
   - Use paginated loading

3. **How to optimize network requests**
   - Prefetch data
   - Cache data
   - Use lazy loading
   - Optimize image loading

## Daily practice reference

### Day 46: Essence of the trio

| API | What it caches | Essence |
|-----|----------|------|
| `useMemo(fn, deps)` | caches the **computed result** | if deps are unchanged, return the previous result |
| `useCallback(fn, deps)` | caches the **function reference** | equivalent to `useMemo(() => fn, deps)` |
| `React.memo(Comp)` | caches **component render** | skip re-render if props are shallow-equal |

### Day 46: Usage guidelines

**When you should use them:**
- Props (functions/objects) passed to a `memo` child need a stable reference.
- Expensive derived values (sorting, filtering a large array) use `useMemo`.
- Objects/functions used as `useEffect` dependencies need a stable reference.

**When you should not:**
- Simple math (`a + b`) does not need `useMemo`; caching itself has cost.
- If the component is cheap to render, memo’s comparison cost may be higher than just re-rendering.
- Wrapping everything in memo blindly increases complexity and hurts readability.

### Day 46: Four cases that need a stable reference

1. A callback passed to a `memo` child → `useCallback`
2. An object/array passed to a `memo` child → `useMemo`
3. A `useEffect` dependency that is an object/function → `useMemo` / `useCallback`
4. A third-party library (for example react-query’s queryKey) needs a stable reference → `useMemo`

### Day 46: React Compiler (future)

React Compiler will analyze components at compile time and insert optimizations equivalent to `useMemo / useCallback / memo`, so developers no longer write them by hand. It is still experimental; production projects still need to do it manually.

### Day 46: Anti-pattern: memo fails

```jsx
const Child = React.memo(({ config }) => {
  console.log('Child render')
  return <div>{config.name}</div>
})

function Parent() {
  const [count, setCount] = useState(0)
  // ❌ each render creates a new object; memo’s shallow compare is always false
  return <Child config={{ name: 'test' }} />
}
```

### Day 46: Correct pattern: stable references

```jsx
const Child = React.memo(({ config, onClick }) => {
  console.log('Child render')
  return <div onClick={onClick}>{config.name}</div>
})

function Parent() {
  const [count, setCount] = useState(0)
  // ✅ useMemo stabilizes the object reference
  const config = useMemo(() => ({ name: 'test' }), [])
  // ✅ useCallback stabilizes the function reference
  const onClick = useCallback(() => console.log('click'), [])
  return <Child config={config} onClick={onClick} />
}
```
