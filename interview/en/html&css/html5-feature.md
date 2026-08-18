### HTML5 Features
HTML5 introduced many new elements, attributes, and APIs, making web development more powerful and flexible.

#### 1. Semantic tags
##### 1.1 Document structure tags
```html
<header>Header area</header>
<nav>Navigation area</nav>
<main>Main content area</main>
<article>Article content</article>
<section>Section</section>
<aside>Sidebar</aside>
<footer>Footer area</footer>
```

##### 1.2 Text semantic tags
```html
<mark>Highlighted text</mark>
<time>Time</time>
<figure>
  <img src="image.jpg" alt="Image">
  <figcaption>Image caption</figcaption>
</figure>
<details>
  <summary>Collapsible content</summary>
  <p>Detailed content</p>
</details>
```

#### 2. Form enhancements
##### 2.1 New input types
```html
<input type="email" placeholder="Email">
<input type="url" placeholder="URL">
<input type="number" min="0" max="100">
<input type="range" min="0" max="100">
<input type="date">
<input type="time">
<input type="color">
<input type="search" placeholder="Search">
```

##### 2.2 Form attributes
```html
<input type="text" required>
<input type="text" pattern="[A-Za-z]{3}">
<input type="text" placeholder="Please enter">
<input type="text" autofocus>
<input type="text" autocomplete="on">
<input type="text" list="suggestions">
<datalist id="suggestions">
  <option value="Suggestion 1">
  <option value="Suggestion 2">
</datalist>
```

#### 3. Multimedia
##### 3.1 Audio
```html
<audio controls>
  <source src="audio.mp3" type="audio/mpeg">
  <source src="audio.ogg" type="audio/ogg">
  Your browser does not support audio playback
</audio>
```

##### 3.2 Video
```html
<video controls width="320" height="240">
  <source src="video.mp4" type="video/mp4">
  <source src="video.webm" type="video/webm">
  Your browser does not support video playback
</video>
```

#### 4. Canvas
```html
<canvas id="myCanvas" width="200" height="200"></canvas>
<script>
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Draw a rectangle
ctx.fillStyle = 'red';
ctx.fillRect(10, 10, 100, 100);

// Draw a circle
ctx.beginPath();
ctx.arc(150, 150, 50, 0, Math.PI * 2);
ctx.fillStyle = 'blue';
ctx.fill();
</script>
```

#### 5. SVG
```html
<svg width="200" height="200">
  <circle cx="100" cy="100" r="50" fill="red"/>
  <rect x="50" y="50" width="100" height="100" fill="blue"/>
  <line x1="0" y1="0" x2="200" y2="200" stroke="black"/>
</svg>
```

#### 6. Web Storage
##### 6.1 localStorage
```javascript
// Store data
localStorage.setItem('username', 'John');
localStorage.setItem('age', '30');

// Get data
const username = localStorage.getItem('username');
const age = localStorage.getItem('age');

// Remove data
localStorage.removeItem('username');

// Clear all data
localStorage.clear();
```

##### 6.2 sessionStorage
```javascript
// Store data
sessionStorage.setItem('token', 'abc123');

// Get data
const token = sessionStorage.getItem('token');

// Remove data
sessionStorage.removeItem('token');
```

#### 7. Web Workers
```javascript
// main.js
const worker = new Worker('worker.js');
worker.postMessage('Start computation');
worker.onmessage = function(e) {
  console.log('Computation result:', e.data);
};

// worker.js
self.onmessage = function(e) {
  const result = heavyComputation();
  self.postMessage(result);
};
```

#### 8. WebSocket
```javascript
const socket = new WebSocket('ws://example.com/socket');

socket.onopen = function() {
  console.log('Connection established');
  socket.send('Hello Server!');
};

socket.onmessage = function(e) {
  console.log('Message received:', e.data);
};

socket.onclose = function() {
  console.log('Connection closed');
};
```

#### 9. Drag and Drop API
```html
<div draggable="true" id="draggable">Draggable element</div>
<div id="droppable">Drop zone</div>

<script>
const draggable = document.getElementById('draggable');
const droppable = document.getElementById('droppable');

draggable.ondragstart = function(e) {
  e.dataTransfer.setData('text', e.target.id);
};

droppable.ondragover = function(e) {
  e.preventDefault();
};

droppable.ondrop = function(e) {
  e.preventDefault();
  const data = e.dataTransfer.getData('text');
  e.target.appendChild(document.getElementById(data));
};
</script>
```

#### 10. Geolocation
```javascript
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function(position) {
      console.log('Latitude:', position.coords.latitude);
      console.log('Longitude:', position.coords.longitude);
    },
    function(error) {
      console.error('Failed to get location:', error.message);
    }
  );
}
```

#### 11. Best practices
1. Use semantic tags to improve readability
2. Use new form types and attributes to enhance UX
3. Use Canvas and SVG for graphics
4. Use Web Storage to store data
5. Use Web Workers for heavy computation
6. Use WebSocket for real-time communication
7. Use the Drag and Drop API for interactive features
8. Use Geolocation to get location information
9. Use multimedia tags to play audio and video
10. Use new APIs to enhance functionality

#### 12. Common interview questions
1. **What are the new features in HTML5?**
   - Semantic tags
   - Form enhancements
   - Multimedia support
   - Canvas and SVG
   - Web Storage
   - Web Workers
   - WebSocket
   - Drag and Drop API
   - Geolocation

2. **Differences between localStorage and sessionStorage**
   - localStorage data persists permanently
   - sessionStorage data is cleared when the session ends
   - Different storage capacity
   - Different scope

3. **Differences between Canvas and SVG**
   - Canvas is a bitmap; SVG is a vector graphic
   - Canvas is suited for games and animations
   - SVG is suited for icons and charts
   - Canvas has better performance
   - SVG can scale without losing quality
