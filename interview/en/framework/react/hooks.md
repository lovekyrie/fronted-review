### React Hooks
Hooks are a React 16.8 feature that lets you use state and other React features in function components.

#### 1. Basic Hooks
##### 1.1 useState
```javascript
// Basic usage
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

// Functional updates
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(prevCount => prevCount + 1)}>
      Count: {count}
    </button>
  );
}

// Multiple pieces of state
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
// Basic usage
function Example() {
  const [count, setCount] = useState(0);

  // Runs on mount and update
  useEffect(() => {
    document.title = `Count: ${count}`;
  });

  // Runs only on mount
  useEffect(() => {
    console.log('Component mounted');
  }, []);

  // Runs when a dependency changes
  useEffect(() => {
    console.log(`Count changed to ${count}`);
  }, [count]);

  // Cleanup function
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
// Create Context
const ThemeContext = React.createContext('light');

// Provide Context
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <ThemedButton />
    </ThemeContext.Provider>
  );
}

// Consume Context
function ThemedButton() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Themed Button</button>;
}
```

#### 2. Additional Hooks
##### 2.1 useReducer
```javascript
// Define the reducer
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

// Use useReducer
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
// Memoize a callback
function ParentComponent() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []); // Empty deps: the callback identity stays stable

  return <ChildComponent onClick={handleClick} />;
}
```

##### 2.3 useMemo
```javascript
// Memoize a computed value
function ExpensiveComponent({ data }) {
  const processedData = useMemo(() => {
    return expensiveOperation(data);
  }, [data]); // Recompute only when data changes

  return <div>{processedData}</div>;
}
```

##### 2.4 useRef
```javascript
// Store a mutable value that does not trigger a re-render
function TextInput() {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <>
      <input ref={inputRef} />
      <button onClick={focusInput}>Focus</button>
    </>
  );
}

// Store the previous value (skip the first render, like componentDidUpdate)
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
```

#### 3. Custom Hooks
##### 3.1 Basic usage
```javascript
// Create a custom Hook
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

// Use the custom Hook
function ResponsiveComponent() {
  const { width, height } = useWindowSize();
  return (
    <div>
      Window size: {width} x {height}
    </div>
  );
}
```

##### 3.2 Common custom Hooks
```javascript
// Use localStorage
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

// Use fetch
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

#### 4. Best practices
1. Only call Hooks at the top level
2. Only call Hooks from React function components
3. Handle side effects with useEffect
4. Memoize callbacks with useCallback
5. Memoize computed values with useMemo
6. Use the dependency array carefully
7. Create reusable custom Hooks
8. Avoid overusing Hooks
9. Keep Hooks pure
10. Follow Hook naming conventions

#### 5. Common interview questions
1. **Advantages of Hooks**
   - Better code organization
   - Better logic reuse
   - Better type inference
   - Better testability

2. **useEffect use cases**
   - Data fetching
   - Event subscriptions
   - Manually updating the DOM
   - Setting timers

3. **How to optimize Hook performance**
   - Use useCallback
   - Use useMemo
   - Use the dependency array carefully
   - Avoid unnecessary re-renders

#### 6. High-frequency gaps (common interview follow-ups)

##### 6.1 useEffect timing and cleanup order
- Effects run after the first render.
- When a dependency changes: run the previous effect's cleanup first, then run the new effect.
- On unmount, run the last cleanup.

```javascript
useEffect(() => {
  const timer = setInterval(() => console.log('tick'), 1000);
  return () => clearInterval(timer); // Runs on dependency change and on unmount
}, []);
```

##### 6.2 Stale closures
When an effect/callback captures stale state, you can get a "value never updates" bug.

Common fixes:
1. Complete the dependency array.
2. Use functional updates (`setState(prev => ...)`).
3. Keep the latest value in `useRef` (when needed).

##### 6.3 More useMemo / useCallback is not always better
- They have their own maintenance and comparison cost.
- Use them only when a child actually needs a stable reference, or when the computation is truly expensive.

##### 6.4 React 18 Strict Mode runs effects twice (development)
In development, React simulates mount -> unmount -> remount to surface unsafe side effects.  
In interviews, stress that this is a development-only behavior, not a production bug.
