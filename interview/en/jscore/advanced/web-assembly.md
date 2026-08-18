# WebAssembly (Wasm)

## 1. What is WebAssembly

WebAssembly (Wasm) is a new encoding that can run directly in the browser. It is not a programming language, but a **binary instruction format**.

It is not meant to replace JavaScript. It complements JS: you write C, C++, Rust, or other low-level languages, compile to Wasm, and run in the browser at near-native speed.

## 2. Why is it fast?

1.  **Small size**: binary is smaller than JS text, so it loads faster.
2.  **Fast parse**: browsers parse binary much faster than JS source.
3.  **Already optimized**: JS goes through parsing → compiling → optimizing. Wasm is already compiled and optimized; the browser just instantiates it.
4.  **Static types**: no runtime type speculation or deoptimization.

## 3. Typical workflow

Usual steps:
1.  Write the heavy compute in C++ / Rust.
2.  Compile to a `.wasm` file.
3.  Load and run it from JS with the `WebAssembly` API.

```javascript
// Load a wasm file
WebAssembly.instantiateStreaming(fetch('simple.wasm'), importObject)
  .then(results => {
    // Call an exported wasm function
    results.instance.exports.exported_func();
  });
```

## 4. Good use cases

*   **Audio / video**: decode, spectrum analysis, noise reduction in realtime comms.
*   **Games**: port large 3D engines (Unity, Unreal Engine) to the web.
*   **Crypto**: heavy encrypt / decrypt work.
*   **AI inference**: one TensorFlow.js backend is Wasm.
