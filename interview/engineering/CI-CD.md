### CI/CD
CI/CD（持续集成/持续部署）是现代软件开发中自动化构建、测试和部署的实践。

#### 1. 持续集成 (CI)
##### 1.1 基本概念
```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
    - name: Install dependencies
      run: npm install
    - name: Run tests
      run: npm test
    - name: Build
      run: npm run build
```

##### 1.2 自动化测试
```yaml
# 单元测试
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Run unit tests
      run: npm run test:unit

# 集成测试
jobs:
  integration:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Run integration tests
      run: npm run test:integration

# E2E测试
jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Run E2E tests
      run: npm run test:e2e
```

#### 2. 持续部署 (CD)
##### 2.1 部署配置
```yaml
# .github/workflows/cd.yml
name: CD

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy to production
      run: |
        echo "Deploying to production..."
        # 部署脚本
```

##### 2.2 环境配置
```yaml
# 环境变量
env:
  NODE_ENV: production
  API_URL: https://api.example.com

# 密钥管理
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Deploy
      env:
        AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
        AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

#### 3. 工具和平台
##### 3.1 GitHub Actions
```yaml
# 工作流配置
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Build
      run: npm run build
    - name: Deploy
      run: npm run deploy
```

##### 3.2 Jenkins
```groovy
// Jenkinsfile
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }
        stage('Test') {
            steps {
                sh 'npm run test'
            }
        }
        stage('Deploy') {
            steps {
                sh 'npm run deploy'
            }
        }
    }
}
```

#### 4. 最佳实践
##### 4.1 自动化流程
```yaml
# 完整的CI/CD流程
name: Full Pipeline

on:
  push:
    branches: [ main, develop ]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Lint
      run: npm run lint

  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Test
      run: npm run test

  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Build
      run: npm run build

  deploy:
    runs-on: ubuntu-latest
    needs: [lint, test, build]
    steps:
    - uses: actions/checkout@v2
    - name: Deploy
      run: npm run deploy
```

##### 4.2 监控和通知
```yaml
# 部署通知
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Deploy
      run: npm run deploy
    - name: Notify
      run: |
        curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
          -H 'Content-type: application/json' \
          -d '{"text":"Deployment completed successfully!"}'
```

#### 5. 常见面试题
1. **CI/CD的优势**
   - 自动化流程
   - 快速反馈
   - 质量保证
   - 部署效率

2. **如何保证部署质量**
   - 自动化测试
   - 环境隔离
   - 回滚机制
   - 监控告警

3. **如何处理部署失败**
   - 错误处理
   - 日志分析
   - 回滚策略
   - 团队协作 