### 模块化开发
模块化开发是将程序分解为独立的、可重用的模块的过程。

#### 1. 模块化规范
##### 1.1 CommonJS
Node.js使用的模块化规范。
```js
// math.js
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;

module.exports = {
  add,
  subtract
};

// main.js
const math = require('./math');
console.log(math.add(1, 2)); // 3
```

##### 1.2 AMD (Asynchronous Module Definition)
浏览器端使用的异步模块化规范。
```js
// math.js
define(['dependency'], function(dependency) {
  const add = (a, b) => a + b;
  const subtract = (a, b) => a - b;

  return {
    add,
    subtract
  };
});

// main.js
require(['math'], function(math) {
  console.log(math.add(1, 2)); // 3
});
```

##### 1.3 ES Modules (ESM)
ES6引入的模块化规范。
```js
// math.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;

// main.js
import { add, subtract } from './math.js';
console.log(add(1, 2)); // 3
```

#### 2. 模块化工具
##### 2.1 Webpack
```js
// webpack.config.js
module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
};
```

##### 2.2 Rollup
```js
// rollup.config.js
export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'es'
  },
  plugins: [
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**'
    })
  ]
};
```

##### 2.3 Vite
```js
// vite.config.js
export default {
  root: 'src',
  build: {
    outDir: '../dist'
  },
  server: {
    port: 3000
  }
};
```

#### 3. 模块化最佳实践
##### 3.1 模块划分
```js
// 按功能划分
src/
  components/
    Button.js
    Input.js
  utils/
    math.js
    string.js
  services/
    api.js
    auth.js
```

##### 3.2 依赖管理
```js
// package.json
{
  "name": "my-project",
  "version": "1.0.0",
  "dependencies": {
    "lodash": "^4.17.21",
    "react": "^17.0.2"
  },
  "devDependencies": {
    "webpack": "^5.0.0",
    "babel-loader": "^8.2.0"
  }
}
```

##### 3.3 模块导出
```js
// 默认导出
export default class User {
  constructor(name) {
    this.name = name;
  }
}

// 命名导出
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;

// 混合导出
export default class User {
  // ...
}
export const add = (a, b) => a + b;
```

#### 4. 模块化模式
##### 4.1 单例模式
```js
// singleton.js
let instance = null;

export default class Singleton {
  constructor() {
    if (instance) {
      return instance;
    }
    instance = this;
  }
}
```

##### 4.2 工厂模式
```js
// factory.js
export class ProductFactory {
  createProduct(type) {
    switch (type) {
      case 'A':
        return new ProductA();
      case 'B':
        return new ProductB();
      default:
        throw new Error('Invalid product type');
    }
  }
}
```

##### 4.3 观察者模式
```js
// observer.js
export class Subject {
  constructor() {
    this.observers = [];
  }

  attach(observer) {
    this.observers.push(observer);
  }

  notify() {
    this.observers.forEach(observer => observer.update());
  }
}
```

#### 5. 模块化测试
##### 5.1 单元测试
```js
// math.test.js
import { add, subtract } from './math';

describe('Math functions', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(add(1, 2)).toBe(3);
  });

  test('subtracts 2 from 3 to equal 1', () => {
    expect(subtract(3, 2)).toBe(1);
  });
});
```

##### 5.2 集成测试
```js
// api.test.js
import { fetchUser } from './api';

describe('API integration', () => {
  test('fetches user data', async () => {
    const user = await fetchUser(1);
    expect(user).toHaveProperty('name');
  });
});
```

#### 6. 最佳实践
1. 使用ES Modules作为主要模块化方案
2. 合理划分模块结构
3. 使用构建工具优化模块加载
4. 实现模块的按需加载
5. 使用TypeScript增强类型安全
6. 编写模块文档
7. 进行模块测试
8. 使用版本控制管理模块
9. 遵循模块化设计原则
10. 持续优化模块性能

#### 7. 常见面试题
1. **模块化规范的区别**
   - CommonJS: 同步加载，主要用于Node.js
   - AMD: 异步加载，主要用于浏览器
   - ES Modules: 静态导入导出，支持树摇

2. **模块化构建工具的选择**
   - Webpack: 功能全面，适合大型项目
   - Rollup: 适合库的打包
   - Vite: 开发体验好，适合现代项目

3. **模块化设计原则**
   - 高内聚，低耦合
   - 单一职责
   - 接口清晰
   - 依赖明确 