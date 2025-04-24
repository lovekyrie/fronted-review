### 构建工具
构建工具是现代前端开发中不可或缺的工具，主要用于代码转换、打包、优化等任务。

#### 1. Webpack
##### 1.1 基本概念
```javascript
// webpack.config.js
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
};
```

##### 1.2 核心概念
```javascript
// 入口配置
module.exports = {
  entry: {
    app: './src/app.js',
    vendor: './src/vendor.js'
  }
};

// 输出配置
module.exports = {
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  }
};

// 模块配置
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource'
      }
    ]
  }
};
```

#### 2. Vite
##### 2.1 基本配置
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    minify: 'terser'
  }
});
```

##### 2.2 特性配置
```javascript
// 开发服务器配置
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});

// 构建优化配置
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['./src/utils']
        }
      }
    }
  }
});
```

#### 3. 常用功能
##### 3.1 代码分割
```javascript
// Webpack动态导入
import('./module').then(module => {
  module.default();
});

// Vite动态导入
const module = await import('./module.js');
```

##### 3.2 资源处理
```javascript
// Webpack资源处理
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          }
        ]
      }
    ]
  }
};

// Vite资源处理
import.meta.glob('/src/components/*.vue');
```

#### 4. 优化策略
##### 4.1 构建优化
```javascript
// Webpack优化
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        }
      }
    }
  }
};

// Vite优化
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
});
```

##### 4.2 开发优化
```javascript
// Webpack开发优化
module.exports = {
  devServer: {
    hot: true,
    historyApiFallback: true
  }
};

// Vite开发优化
export default defineConfig({
  server: {
    hmr: true,
    watch: {
      usePolling: true
    }
  }
});
```

#### 5. 最佳实践
1. 合理配置入口和输出
2. 使用代码分割
3. 优化资源加载
4. 配置开发环境
5. 使用缓存策略
6. 优化构建速度
7. 处理静态资源
8. 配置环境变量
9. 使用插件扩展功能
10. 保持配置文件清晰

#### 6. 常见面试题
1. **Webpack和Vite的区别**
   - 构建速度
   - 开发体验
   - 配置复杂度
   - 适用场景

2. **如何优化构建性能**
   - 使用缓存
   - 代码分割
   - 并行处理
   - 按需加载

3. **如何处理静态资源**
   - 图片优化
   - 字体处理
   - CSS处理
   - 文件复制 