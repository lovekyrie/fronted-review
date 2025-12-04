# Web Assembly (Wasm)

## 1. 什么是 Web Assembly

WebAssembly（简称 Wasm）是一种新的编码方式，可以直接在浏览器中运行。它不是一种编程语言，而是一种**二进制指令格式**。

它的设计目标不是为了取代 JavaScript，而是作为 JavaScript 的补充。开发者可以使用 C、C++、Rust 等低级语言编写代码，然后编译成 Wasm 格式，在浏览器中以接近原生应用的速度运行。

## 2. 为什么快？

1.  **体积小**：二进制格式，比文本格式的 JS 文件更小，加载更快。
2.  **解析快**：浏览器解析二进制代码的速度远快于解析 JS 文本。
3.  **无需编译优化**：JS 引擎需要 parsing -> compiling -> optimizing，而 Wasm已经是编译优化过的二进制码，浏览器直接实例化即可运行。
4.  **类型确定**：Wasm 是静态类型的，不需要 JS 引擎在运行时进行类型推断和去优化（Deoptimization）。

## 3. 使用流程

通常流程是：
1.  使用 C++/Rust 编写核心计算逻辑。
2.  将代码编译为 `.wasm` 文件。
3.  在 JS 中通过 `WebAssembly` API 加载并运行。

```javascript
// 加载 wasm 文件
WebAssembly.instantiateStreaming(fetch('simple.wasm'), importObject)
  .then(results => {
    // 调用 wasm 中导出的函数
    results.instance.exports.exported_func();
  });
```

## 4. 适用场景

*   **音视频处理**：视频解码、音频频谱分析、即时通信中的降噪。
*   **游戏开发**：移植大型 3D 游戏引擎（如 Unity, Unreal Engine）到 Web 端。
*   **加密算法**：高强度的加解密运算。
*   **AI 推理**：TensorFlow.js 的后端引擎之一就是 Wasm。

