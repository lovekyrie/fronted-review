### React State Management
React offers several state-management options for sharing data and keeping state in sync across components.

#### 1. Local component state
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

// Complex state
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
// Define the reducer
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

// Use useReducer
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
##### 2.1 Basic usage
```javascript
// Create Context
const ThemeContext = React.createContext('light');

// Provide Context
function App() {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <ThemedButton />
    </ThemeContext.Provider>
  );
}

// Consume Context
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

##### 2.2 Nested Contexts
```javascript
// Create multiple Contexts
const UserContext = React.createContext(null);
const ThemeContext = React.createContext('light');

// Provide multiple Contexts
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
##### 3.1 Basic setup
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

##### 3.2 Using Redux
```javascript
// Use in a component
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
##### 4.1 Creating a Slice
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

##### 4.2 Configuring the Store
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

#### 5. Best practices
1. Choose the right state-management approach
2. Avoid redundant state
3. Use immutable updates
4. Use Context reasonably
5. Prefer Redux Toolkit
6. Keep state predictable
7. Use TypeScript
8. Watch performance
9. Keep the code simple
10. Follow state-management conventions

#### 6. Common interview questions
1. **Choosing a state-management approach**
   - Local state: useState, useReducer
   - Cross-component state: Context API
   - Global state: Redux, Redux Toolkit
   - Factor in project size and complexity

2. **Redux vs Context API**
   - Redux fits large apps
   - Context API fits small apps
   - Redux has better DevTools
   - Context API is simpler

3. **How to optimize state management**
   - Avoid unnecessary state
   - Use immutable updates
   - Use selectors carefully
   - Use Redux Toolkit

#### 7. High-frequency gaps (state-management follow-ups)

##### 7.1 Quick pick (useState / Context / Redux)
- `useState/useReducer`: local and component-scoped state.
- `Context`: pass data across levels, but watch the re-render scope on frequent updates.
- `Redux Toolkit`: complex global state, traceable debugging, more stable for mid-to-large teams.

##### 7.2 Why Redux Toolkit is preferred
1. `createSlice` cuts boilerplate.
2. Immer is built in, so the syntax is more natural.
3. It is the official recommended path, with solid ecosystem docs.

##### 7.3 How to avoid Context re-rendering everything
- Split into multiple Contexts (by domain).
- Stabilize the provider value (`useMemo`).
- Sink frequently updated state, or switch to a dedicated store.

##### 7.4 Practical principles
1. Single source of truth — do not duplicate the same data in multiple places.
2. Derive values with selectors; do not store them directly.
3. Standardize async flows (loading/error/success) to reduce messy state.
