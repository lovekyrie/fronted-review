# CSS 进阶：BFC、CSS Modules、CSS-in-JS、Tailwind

## 一、BFC（块级格式化上下文）

### 常见触发方式

- `overflow: hidden/auto/scroll`
- `display: flow-root`
- `position: absolute/fixed`
- `float` 不为 `none`

### 作用

- 清除浮动影响。
- 阻止外边距重叠。
- 形成独立布局上下文，减少外部干扰。

## 二、CSS Modules vs CSS-in-JS vs Tailwind

### CSS Modules

- 编译期做类名隔离，心智成本低，适合中大型项目。

### CSS-in-JS（如 styled-components）

- 样式与组件强绑定，动态样式表达力强。
- 需关注运行时开销和 SSR 配置复杂度。

### Tailwind CSS

- 原子类方案，开发效率高、风格统一。
- 需团队统一规范，避免类名过长影响可读性。

## 三、面试表达建议

不要只比较语法，重点讲团队规模、组件复用、性能与维护成本的权衡。
