### 包管理工具
包管理工具是前端开发中用于管理项目依赖的重要工具，主要包括npm、yarn和pnpm。

#### 1. npm
##### 1.1 基本概念
```bash
# 初始化项目
npm init
npm init -y

# 安装依赖
npm install package-name
npm i package-name
npm i package-name@version
npm i package-name --save-dev

# 卸载依赖
npm uninstall package-name
npm remove package-name

# 更新依赖
npm update package-name
npm update
```

##### 1.2 配置文件
```json
// package.json
{
  "name": "project-name",
  "version": "1.0.0",
  "description": "Project description",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "jest": "^29.0.0"
  }
}
```

#### 2. Yarn
##### 2.1 基本命令
```bash
# 初始化项目
yarn init
yarn init -y

# 安装依赖
yarn add package-name
yarn add package-name@version
yarn add package-name --dev

# 卸载依赖
yarn remove package-name

# 更新依赖
yarn upgrade package-name
yarn upgrade
```

##### 2.2 特性
```bash
# 并行安装
yarn install --parallel

# 离线模式
yarn install --offline

# 生产模式
yarn install --production

# 清理缓存
yarn cache clean
```

#### 3. pnpm
##### 3.1 基本命令
```bash
# 初始化项目
pnpm init
pnpm init -y

# 安装依赖
pnpm add package-name
pnpm add package-name@version
pnpm add -D package-name

# 卸载依赖
pnpm remove package-name

# 更新依赖
pnpm update package-name
pnpm update
```

##### 3.2 特性
```bash
# 使用硬链接
pnpm install --shamefully-hoist

# 离线模式
pnpm install --offline

# 生产模式
pnpm install --prod

# 清理存储
pnpm store prune
```

#### 4. 依赖管理
##### 4.1 版本控制
```json
// package.json
{
  "dependencies": {
    "package-name": "^1.2.3",  // 兼容版本
    "package-name": "~1.2.3",  // 补丁版本
    "package-name": "1.2.3",   // 精确版本
    "package-name": "*",       // 最新版本
    "package-name": ">1.2.3",  // 大于版本
    "package-name": ">=1.2.3", // 大于等于版本
    "package-name": "<1.2.3",  // 小于版本
    "package-name": "<=1.2.3"  // 小于等于版本
  }
}
```

##### 4.2 依赖类型
```json
// package.json
{
  "dependencies": {
    // 生产环境依赖
    "react": "^18.2.0"
  },
  "devDependencies": {
    // 开发环境依赖
    "typescript": "^5.0.0"
  },
  "peerDependencies": {
    // 对等依赖
    "react": "^18.2.0"
  },
  "optionalDependencies": {
    // 可选依赖
    "package-name": "^1.0.0"
  }
}
```

#### 5. 最佳实践
1. 使用锁文件
2. 定期更新依赖
3. 使用语义化版本
4. 管理依赖类型
5. 使用私有仓库
6. 配置镜像源
7. 使用工作空间
8. 管理依赖冲突
9. 使用脚本命令
10. 保持依赖整洁

#### 6. 常见面试题
1. **npm、yarn和pnpm的区别**
   - 安装速度
   - 依赖管理
   - 磁盘空间
   - 特性对比

2. **如何解决依赖冲突**
   - 版本锁定
   - 依赖升级
   - 冲突解决
   - 兼容性处理

3. **如何优化包管理**
   - 使用缓存
   - 配置镜像
   - 清理无用依赖
   - 使用工作空间 