### Git核心原理与高级操作

#### 1. Git对象模型（必问原理）

Git 的核心是一个内容寻址文件系统，所有数据都存储在 `.git/objects/` 目录中。

```bash
# .git 目录结构
.git/
  objects/       # 对象存储（blob/tree/commit）
  refs/          # 引用（branch/tag）
  HEAD           # 当前分支指针
  index          # 暂存区（staging area）
```

**四种对象类型：**
```bash
# blob：存储文件内容（无文件名）
echo 'hello' | git hash-object --stdin -w
# → 8ab686eafeb9f447ab20ebf5aa31717fbe73b1c7

# tree：存储目录结构（文件名 + blob/tree 指针）
git cat-file -p HEAD^{tree}

# commit：存储快照 + 作者 + 消息 + 父提交指针
git cat-file -p HEAD

# ref：指向 commit 的指针（分支/tag）
cat .git/refs/heads/main
```

> **面试加分点**：能说清楚"文件名存在 tree 里，内容存在 blob 里"，而不是混为一谈。

---

#### 2. 工作区、暂存区、版本库的三层结构

```
工作区（Working Directory）
  ↓ git add
暂存区（Staging Area / Index）
  ↓ git commit
版本库（Repository / Objects）
```

```bash
# 暂存区细节：.git/index 文件（二进制）
git ls-files --stage  # 查看暂存区内容

# HEAD 是当前分支最新提交的引用
cat .git/HEAD
# → ref: refs/heads/main
```

---

#### 3. git reset 三种模式的深度对比

| 模式 | HEAD | 暂存区 | 工作区 | 典型场景 |
|------|------|--------|--------|----------|
| `--soft` | 回退到指定 commit | 保留 | 保留 | 合并多个 commit |
| `--mixed`（默认） | 回退 | 回退 | 保留 | 取消暂存，修改仍保留在工作区 |
| `--hard` | 回退 | 回退 | **回退（丢失）** | 紧急回滚到干净状态 |

```bash
# --hard 的危险：工作区会被完全覆盖，无法恢复
git reset --hard HEAD~3
git reset --hard 1a2b3c4

# 危险操作后的恢复（如果 reflog 还在）
git reflog
git reset --hard HEAD@{5}
```

> **面试高频追问**：为什么 `reset --hard` 危险？——因为它直接覆盖工作区，之前的修改如果没 commit 就彻底丢了。

---

#### 4. git rebase 的工作原理与风险

```bash
# rebase 把当前分支的提交"移植"到目标分支顶部
git rebase main

# 原理：找到分叉点，提取当前分支的新提交，在目标分支上重新应用
# 分叉点 = merge base = git merge-base main feature
```

**rebase 的风险（强烈建议掌握）：**
- **已推送的分支不要 rebase**：会改写历史，导致协作问题
- `-i` 交互式变基可以压缩、修改、删除提交，但只能用于未推送的分支

```bash
# 压缩最近的3个commit
git rebase -i HEAD~3
# 在编辑器中把第二个之后的 pick 改成 squash
```

> **面试模板**：rebase 是"变基"，把当前分支的提交在新的基础上重新生成，历史会变简洁但会改写 commit hash；merge 是"合并"，保留完整历史但会产生 merge commit。协作分支禁止 rebase，本地清理可以用。

---

#### 5. git stash 的内部实现

```bash
# 表面：暂存当前修改
git stash push -m "WIP: feature"

# 内部：创建两个 commit
# 1. WIP commit（基于 HEAD）
# 2. index commit（基于暂存区）
# 都存在 refs/stash 下
git cat-file -p stash@{0}  # 第一个是 WIP
git cat-file -p stash@{0}^2  # 第二个是 index commit
```

```bash
# stash 的恢复选项
git stash pop    # 恢复并删除 stash
git stash apply  # 恢复但保留 stash
git stash list   # 查看所有 stash
```

---

#### 6. 常见误操作与恢复

```bash
# 1. 误 git reset --hard
git reflog  # 找到之前的 HEAD 位置
git reset --hard HEAD@{1}

# 2. 误删分支
git branch -D feature
git checkout -b feature HEAD@{1}  # 从 reflog 恢复

# 3. 提交到错误分支
git commit -m "WIP"  # 在 main 提交了
git reset --soft HEAD~1  # 取消提交，保留修改
git checkout feature  # 切换到正确分支
git commit  # 重新提交

# 4. force push 覆盖了别人代码
git push --force-with-lease  # 比 --force 更安全，会检查远程是否有新提交
```

---

#### 7. Git Flow vs GitHub Flow 场景选择

| 模式 | 适用场景 | 分支策略 |
|------|----------|----------|
| **Git Flow** | 有固定发布周期（如两周一个版本）的团队 | main + develop + feature + release + hotfix |
| **GitHub Flow** | 持续发布（CD）、团队较小 | 仅有 main + feature，随时可以从 main 切出 |
| **Trunk-based** | 追求 trunk 持续就绪，快速集成 | 所有人在 main 开发，短命 feature |

> **面试追问**：为什么互联网公司多选 GitHub Flow 或 Trunk？——因为发布频繁，不需要长期维护多个版本，Git Flow 的 release/hotfix 分支管理成本高。

---

#### 8. 高级面试题

1. **Git 为什么比 SVN 快**
   - 本地持有完整仓库，不需要每次都访问服务器
   - 对象模型精简，commit/tree/blob 关系简单
   - 使用 zlib 压缩，内容存储紧凑

2. **`git merge` vs `git rebase` 何时选哪个**
   - 公共分支协作：用 merge（不改变历史）
   - 本地整理：用 rebase（让历史更清晰）
   - 黄金法则：已推送的分支绝对不要 rebase

3. **`git cherry-pick` 的原理**
   - 提取指定 commit 的 diff，在当前分支上重新应用
   - 会生成新的 commit hash（相同的变更，不同的历史）

---

#### 9. 面试回答模板

先讲对象模型（blob/tree/commit），再讲三层结构（工作区/暂存区/版本库），最后结合场景选择 reset/rebase/cherry-pick。遇到追问"误操作恢复"，立刻想到 reflog。 