# 发布指南

本项目使用**自动化发布流程**，推送代码到 main 分支后自动构建和发布。

## 快速发布

只需三步，超级简单：

```bash
# 1. 提交你的更改
git add .
git commit -m "feat: 添加新功能"

# 2. 推送到 main 分支
git push origin main

# 3. 完成！GitHub Actions 会自动构建和发布
```

就这么简单！

## 自动化流程

推送到 main 分支后，GitHub Actions 会自动：

1. 检出代码
2. 安装依赖
3. 运行构建
4. 生成版本号（格式：`20240120-143022-fec728b`）
5. 创建 GitHub Release
6. 上传构建文件
7. 自动清理旧版本（保留最近 10 个 Release）

整个过程约 2-3 分钟。

**注意**：旧版本会被自动删除，包括对应的 Git 标签。

## 版本号规则

### 自动生成格式

```
20240120-143022-fec728b
│        │        └─ Git commit 短 hash（7位）
│        └─ 时间：14:30:22
└─ 日期：2024年01月20日
```

### 特点

- **唯一性** - 每个提交都有唯一标识
- **可追溯** - 可通过 commit hash 追溯代码
- **时间信息** - 清楚显示构建时间
- **自动化** - 无需手动管理版本号

## 开发流程

### 推荐工作流

```bash
# 1. 创建功能分支
git checkout -b feature/new-translation

# 2. 开发和提交
git add .
git commit -m "feat: 添加更多翻译"

# 3. 推送分支
git push origin feature/new-translation

# 4. 在 GitHub 创建 Pull Request

# 5. 等待 CI 检查通过

# 6. 合并到 main 分支 → 自动发布！
```

### 提交信息规范（可选但推荐）

```bash
feat: 添加新功能
fix: 修复 Bug
docs: 更新文档
style: 代码格式调整
refactor: 重构代码
perf: 性能优化
test: 添加测试
chore: 构建/工具变动
```

## 查看发布结果

### 方法 1: GitHub Releases

1. 访问仓库的 "Releases" 页面
2. 找到最新的 Release
3. 查看版本信息和下载链接

### 方法 2: GitHub Actions

1. 访问仓库的 "Actions" 页面
2. 点击最近的工作流运行
3. 查看详细的构建日志

## 回滚版本

如果最新版本有问题，可以：

### 方法 1: 下载旧版本

1. 在 "Releases" 页面找到之前的版本
2. 下载对应的 .zip 文件
3. 手动安装

### 方法 2: Git 回退

```bash
# 回退到上一个提交
git revert HEAD

# 推送回退
git push origin main

# 会自动构建回退后的版本
```

### 方法 3: 紧急修复

```bash
# 修复问题
git add .
git commit -m "fix: 紧急修复问题"

# 推送修复
git push origin main

# 自动发布修复版本
```

## 文档变更

修改文档（.md 文件、docs/ 目录）**不会触发**自动发布，可以放心修改：

```bash
# 这些变更不会触发发布
git commit -m "docs: 更新 README"
git commit -m "docs: 完善文档"
git commit -m "chore: 更新 LICENSE"
```

## 调试构建失败

如果自动构建失败：

### 1. 查看错误日志

在 GitHub Actions 页面查看详细错误信息

### 2. 本地测试

```bash
# 安装依赖
npm install

# 运行构建
npm run build

# 检查翻译
npm run check-translations
```

### 3. 修复并重新推送

```bash
git add .
git commit -m "fix: 修复构建问题"
git push origin main
```

## 常见场景

### 场景 1: 添加翻译

```bash
# 1. 编辑翻译文件
vim src/locales/zh-CN/common.json

# 2. 提交
git add .
git commit -m "feat: 添加导航菜单翻译"

# 3. 推送（自动发布）
git push origin main
```

### 场景 2: 修复 Bug

```bash
# 1. 修复代码
vim src/content/translator.js

# 2. 提交
git add .
git commit -m "fix: 修复动态内容翻译问题"

# 3. 推送（自动发布）
git push origin main
```

### 场景 3: 更新文档

```bash
# 1. 修改文档
vim README.md

# 2. 提交
git add .
git commit -m "docs: 更新安装说明"

# 3. 推送（不会触发发布）
git push origin main
```

## 高级配置

### 修改版本号格式

编辑 `.github/workflows/auto-build-release.yml`：

```yaml
# 只使用 commit hash
VERSION="${COMMIT_SHORT}"

# 使用日期 + hash
VERSION="${COMMIT_DATE}-${COMMIT_SHORT}"

# 自定义格式
VERSION="v1.0.0-${COMMIT_SHORT}"
```

### 保留更多历史版本

```yaml
# 默认保留 10 个，可以改成其他数字
keep_latest: 20
```

### 启用手动触发

```yaml
on:
  push:
    branches:
      - main
  workflow_dispatch:  # 添加手动触发
```

## 发布检查清单

推送到 main 分支前，确认：

- [ ] 代码在本地测试通过
- [ ] 运行 `npm run build` 成功
- [ ] 翻译文件检查通过
- [ ] 提交信息清晰明确
- [ ] 没有包含敏感信息

## 自动化的好处

- **简单** - 不需要手动管理版本号
- **快速** - 推送即发布，2-3 分钟完成
- **可靠** - 自动化流程，减少人为错误
- **可追溯** - 每个版本对应唯一的 commit
- **自动清理** - 不会积累太多旧版本

## 对比传统流程

### 传统流程
```bash
1. 修改代码
2. 更新 package.json 版本号
3. 更新 manifest.json 版本号
4. 更新 CHANGELOG.md
5. 提交代码
6. 创建 Git 标签
7. 推送标签
8. 等待构建
9. 验证发布
```

### 新流程
```bash
1. 修改代码
2. 提交并推送到 main
3. 完成！
```

---

享受简化的发布流程吧！如有问题，请提交 Issue。
