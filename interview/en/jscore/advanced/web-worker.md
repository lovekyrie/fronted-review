# Web Worker

## 1. Background: JS is single-threaded

JavaScript is **single-threaded**. Tasks queue up. A long job (heavy image work, sorting a huge array) blocks the main thread, so the UI janks and the page feels frozen.

**Web Worker** gives JS a second thread: the main thread creates a Worker and offloads work to it.

## 2. Basic usage

### Main thread
```javascript
// 1. Create a Worker
var worker = new Worker('work.js');

// 2. Send a message to the Worker
worker.postMessage('Hello World');
worker.postMessage({method: 'echo', args: ['Work']});

// 3. Receive messages from the Worker
worker.onmessage = function (event) {
  console.log('Received message ' + event.data);
  // Close it when you are done
  // worker.terminate();
}
```

### Worker thread (work.js)
```javascript
// 1. Listen for main-thread messages
self.addEventListener('message', function (e) {
  // 2. Do the work
  var data = e.data;
  
  // 3. Send a message back
  self.postMessage('You said: ' + data);
}, false);
```

## 3. Core limits (interview points)

A Worker is a new thread, but it is not a fully independent world:

1.  **Same origin**: the Worker script must be same-origin as the page.
2.  **No DOM**: the Worker global is not the page window. It **cannot read the page DOM**, and has no `document`, `window`, or `parent`.
3.  **Message passing only**: the two contexts do not share memory directly; they talk via `postMessage`.
4.  **No dialogs**: `alert()` / `confirm()` are blocked. `XMLHttpRequest` (AJAX) is allowed.
5.  **No local files**: a Worker cannot load `file://` scripts; they must come from the network.

## 4. Good use cases

*   **Heavy math**: sort / filter / analyze large collections.
*   **Image work**: Canvas pixel ops, filters, compression.
*   **Large uploads**: slice files and compute hashes in the background.
