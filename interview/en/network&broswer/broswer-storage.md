### Browser Storage
Browsers provide several storage mechanisms for saving data on the client.

#### 1. Cookie
##### 1.1 Basic Concepts
```javascript
// Set a cookie
document.cookie = "name=value; expires=Fri, 31 Dec 2023 23:59:59 GMT; path=/; domain=example.com; secure; HttpOnly";

// Read cookies
const cookies = document.cookie.split(';').map(cookie => cookie.trim());

// Delete a cookie
document.cookie = "name=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
```

##### 1.2 Attributes
```javascript
// Cookie attributes
{
  name: "sessionId",
  value: "abc123",
  expires: "2023-12-31T23:59:59Z",
  path: "/",
  domain: "example.com",
  secure: true,
  HttpOnly: true,
  SameSite: "Strict"
}
```

#### 2. LocalStorage
##### 2.1 Basic Operations
```javascript
// Store data
localStorage.setItem('user', JSON.stringify({
  name: 'John',
  age: 30
}));

// Read data
const user = JSON.parse(localStorage.getItem('user'));

// Delete data
localStorage.removeItem('user');

// Clear all data
localStorage.clear();
```

##### 2.2 Event Listeners
```javascript
// Listen for storage changes
window.addEventListener('storage', (event) => {
  console.log('Key:', event.key);
  console.log('Old value:', event.oldValue);
  console.log('New value:', event.newValue);
  console.log('Storage area:', event.storageArea);
});
```

#### 3. SessionStorage
##### 3.1 Basic Operations
```javascript
// Store data
sessionStorage.setItem('token', 'abc123');

// Read data
const token = sessionStorage.getItem('token');

// Delete data
sessionStorage.removeItem('token');

// Clear all data
sessionStorage.clear();
```

##### 3.2 Characteristics
```javascript
// Session-scoped storage
sessionStorage.setItem('sessionId', 'xyz789');

// Data persists after page refresh
// Data is cleared when the tab is closed
```

#### 4. IndexedDB
##### 4.1 Basic Operations
```javascript
// Open the database
const request = indexedDB.open('MyDatabase', 1);

// Create an object store
request.onupgradeneeded = (event) => {
  const db = event.target.result;
  const store = db.createObjectStore('users', { keyPath: 'id' });
  store.createIndex('name', 'name', { unique: false });
};

// Add data
const transaction = db.transaction(['users'], 'readwrite');
const store = transaction.objectStore('users');
store.add({ id: 1, name: 'John' });

// Read data
const request = store.get(1);
request.onsuccess = (event) => {
  const user = event.target.result;
  console.log(user);
};
```

##### 4.2 Advanced Operations
```javascript
// Iterate with a cursor
const request = store.openCursor();
request.onsuccess = (event) => {
  const cursor = event.target.result;
  if (cursor) {
    console.log(cursor.value);
    cursor.continue();
  }
};

// Query with an index
const index = store.index('name');
const request = index.get('John');
```

#### 5. Cache API
##### 5.1 Basic Operations
```javascript
// Open a cache
caches.open('my-cache').then(cache => {
  // Add resources to the cache
  cache.add('/index.html');
  cache.addAll(['/style.css', '/script.js']);
});

// Get a resource from the cache
caches.match('/index.html').then(response => {
  if (response) {
    return response;
  }
  return fetch('/index.html');
});
```

##### 5.2 Caching Strategies
```javascript
// Cache-first strategy
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  return fetch(request);
}

// Network-first strategy
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open('my-cache');
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}
```

#### 6. Best Practices
1. Choose the right storage mechanism
2. Watch storage limits
3. Handle storage exceptions
4. Implement data sync
5. Consider security
6. Optimize performance
7. Handle compatibility
8. Implement data backup
9. Manage storage space
10. Implement data migration

#### 7. Common Interview Questions
1. **Differences among storage mechanisms**
   - Capacity
   - Lifetime
   - Scope
   - Use cases

2. **How to choose a storage mechanism**
   - Data size
   - Persistence needs
   - Security requirements
   - Performance considerations

3. **How to handle storage limits**
   - Data compression
   - Sharded storage
   - Periodic cleanup
   - Priority management

#### 8. High-Frequency Gaps (Storage Follow-ups)

##### 8.1 Quick Storage Selection
1. Cookie: small size, can be sent with requests; suitable for session identifiers (can set HttpOnly).
2. localStorage: simple persistent KV; suitable for user preferences and non-sensitive cache.
3. sessionStorage: session-level cache; cleared when the tab is closed.
4. IndexedDB: first choice for structured large data and offline scenarios.

##### 8.2 Security Boundary (High Frequency)
- Any storage readable by JS (localStorage/sessionStorage) can be affected by XSS.
- For auth, prefer backend-coordinated HttpOnly + Secure + SameSite cookies.
- Frontend local storage is better for “low-sensitivity data” and “cache that can be lost”.

##### 8.3 Capacity and Performance
- localStorage is a synchronous API; frequent reads/writes block the main thread.
- IndexedDB is asynchronous and has larger capacity; suitable for offline data and large-object cache.
- You can use a two-level strategy: “in-memory cache + persistent cache”.

##### 8.4 Multi-tab Sync
- The `storage` event can sync localStorage changes (same origin, different tabs).
- For more complex real-time sync, use `BroadcastChannel`.
