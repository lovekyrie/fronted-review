### Git工作流
Git是一个分布式版本控制系统，用于跟踪文件的变化并协调多人开发。

#### 1. 基本概念
##### 1.1 工作区、暂存区和版本库
```bash
# 查看工作区状态
git status

# 添加文件到暂存区
git add file.txt
git add .

# 提交到版本库
git commit -m "commit message"
```

##### 1.2 分支管理
```bash
# 创建分支
git branch feature-branch

# 切换分支
git checkout feature-branch
git switch feature-branch

# 创建并切换分支
git checkout -b feature-branch
git switch -c feature-branch

# 合并分支
git merge feature-branch

# 删除分支
git branch -d feature-branch
```

#### 2. 常用命令
##### 2.1 基本操作
```bash
# 初始化仓库
git init

# 克隆仓库
git clone repository-url

# 拉取更新
git pull origin main

# 推送更新
git push origin main

# 查看提交历史
git log
git log --oneline
git log --graph
```

##### 2.2 高级操作
```bash
# 暂存当前修改
git stash
git stash save "message"

# 恢复暂存
git stash pop
git stash apply

# 重置提交
git reset --soft HEAD^
git reset --mixed HEAD^
git reset --hard HEAD^

# 修改提交信息
git commit --amend
```

#### 3. 工作流模式
##### 3.1 Git Flow
```bash
# 主分支
main        # 主分支，用于生产环境
develop     # 开发分支，用于开发环境

# 功能分支
feature/*   # 功能分支，用于开发新功能
release/*   # 发布分支，用于准备发布
hotfix/*    # 热修复分支，用于修复生产环境bug
```

##### 3.2 GitHub Flow
```bash
# 主分支
main        # 主分支，用于生产环境

# 功能分支
feature/*   # 功能分支，用于开发新功能
bugfix/*    # 修复分支，用于修复bug
```

#### 4. 最佳实践
##### 4.1 提交规范
```bash
# 提交信息格式
<type>(<scope>): <subject>

# 类型说明
feat:     新功能
fix:      修复bug
docs:     文档更新
style:    代码格式
refactor: 重构
test:     测试
chore:    构建过程或辅助工具的变动
```

##### 4.2 分支管理
```bash
# 分支命名规范
feature/user-login
bugfix/login-error
hotfix/security-patch
release/v1.0.0

# 分支保护
main        # 禁止直接推送
develop     # 需要代码审查
feature/*   # 定期清理
```

#### 5. 协作流程
##### 5.1 代码审查
```bash
# 创建Pull Request
git checkout -b feature/new-feature
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature

# 代码审查
- 检查代码质量
- 运行测试
- 确认功能完整性
- 合并到主分支
```

##### 5.2 冲突解决
```bash
# 解决冲突
git pull origin main
# 解决冲突文件
git add .
git commit -m "fix: resolve conflicts"
git push origin feature-branch
```

#### 6. 常见面试题
1. **Git工作流的选择**
   - Git Flow vs GitHub Flow
   - 适用场景
   - 优缺点对比
   - 团队协作

2. **如何保证代码质量**
   - 代码审查
   - 自动化测试
   - 持续集成
   - 分支保护

3. **如何处理紧急情况**
   - 热修复流程
   - 回滚操作
   - 版本管理
   - 团队协作 