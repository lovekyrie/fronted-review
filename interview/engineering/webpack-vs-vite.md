# Webpack vs Vite 深入

## 一、Webpack 构建流程

1. 读取配置与入口。
2. 从入口递归构建依赖图。
3. 使用 Loader 转换非 JS 资源。
4. 在生命周期钩子中执行 Plugin。
5. 输出 chunk / assets。

## 二、Loader 与 Plugin 区别

- **Loader**：面向模块内容转换（把 A 文件变成 JS 模块）。
- **Plugin**：面向构建过程扩展（在编译生命周期做增强）。

## 三、简易 Plugin / Loader 思路

### 简易 Plugin

```js
class BuildTimePlugin {
  apply(compiler) {
    compiler.hooks.done.tap('BuildTimePlugin', (stats) => {
      console.log('build done in ms:', stats.endTime - stats.startTime)
    })
  }
}
```

### 简易 Loader

```js
module.exports = function simpleLoader(source) {
  return source.replace('__BUILD_TIME__', JSON.stringify(Date.now()))
}
```

## 四、Tree Shaking 原理

- 基于 ES Module 静态依赖分析。
- 标记未使用导出，再在压缩阶段删除死代码。
- 生效条件：ESM、无副作用或正确声明 `sideEffects`。

## 五、Vite 为什么快

- 开发阶段：不先打整包，利用浏览器原生 ESM 按需加载。
- 依赖预构建：用 `esbuild` 把 CommonJS 转 ESM，提升启动与热更新速度。
- 生产构建：走 Rollup，保障产物质量与生态能力。

## 六、面试回答模板

先讲开发体验差异（启动/HMR），再讲底层机制差异（bundle vs ESM），最后讲迁移成本与适用场景。
