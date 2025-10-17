# GitHub Actions 工作流说明

本项目使用简化的自动化构建和发布流程。

## 工作流

### 1. 自动构建发布 (auto-build-release.yml)

**触发条件：**
- 推送到 `main` 分支时自动触发
- 忽略文档变更（.md 文件、docs/ 目录等）

**版本号规则：**
- 格式：`YYYYMMDD-HHMMSS-commit_hash`
- 示例：`20240120-143022-fec728b`

**自动执行：**
1. 安装依赖并构建项目
2. 创建 GitHub Release
3. 自动生成版本号（基于提交时间和 commit hash）
4. 上传构建的 .zip 文件
5. 自动清理旧版本（保留最近 10 个 Release）
6. 保留构建产物 90 天

**Release 内容：**
- 自动包含提交信息、提交者、提交时间
- 提供详细的安装说明
- 标签格式：`build-fec728b`

### 2. 代码检查 (ci.yml)

**触发条件：**
- Pull Request 到 `main` 分支
- 推送到 `develop` 分支

**检查项目：**
- 翻译文件完整性
- 构建是否成功
- 构建产物验证

## 使用方法

### 发布新版本（超级简单！）

只需要推送代码到 main 分支，GitHub Actions 会自动完成一切：

```bash
# 1. 提交你的更改
git add .
git commit -m "feat: 添加新功能"

# 2. 推送到 main 分支（会自动触发构建和发布）
git push origin main
```

就这么简单！🎉

### 查看构建结果

1. 推送后，访问 GitHub 仓库的 "Actions" 页面
2. 查看 "自动构建发布" 工作流运行状态
3. 构建完成后（约 2-3 分钟），在 "Releases" 页面查看新发布的版本
4. 下载对应的 .zip 文件即可使用

### 版本管理

- **无需手动管理版本号** - 系统自动生成
- **基于 commit hash** - 每个提交都有唯一标识
- **时间戳** - 便于识别构建时间
- **自动清理** - 只保留最近 10 个版本，避免堆积

### Pull Request 流程

1. 创建功能分支
   ```bash
   git checkout -b feature/new-translation
   ```

2. 进行开发和提交
   ```bash
   git add .
   git commit -m "feat: 添加新翻译"
   ```

3. 推送分支
   ```bash
   git push origin feature/new-translation
   ```

4. 在 GitHub 上创建 Pull Request
   - CI 会自动运行检查
   - 在 PR 页面查看检查结果
   - 可以下载构建预览（Artifacts）

5. 合并到 main 分支后，会自动发布新版本

## 版本号说明

### 格式解释

```
20240120-143022-fec728b
│        │        └─ Git commit 短 hash（7位）
│        └─ 时间：14:30:22
└─ 日期：2024年01月20日
```

### 优点

- ✅ **唯一性** - 每个提交都有唯一版本号
- ✅ **可追溯** - 通过 commit hash 追溯代码
- ✅ **时间信息** - 一眼看出构建时间
- ✅ **自动化** - 无需手动管理
- ✅ **简单** - 不需要记住语义化版本规则

## Release 标签规则

- 标签格式：`build-{commit_hash}`
- 示例：`build-fec728b`
- 自动创建，无需手动管理

## 常见问题

### Q: 我只是修改了文档，会触发发布吗？

**A:** 不会。工作流配置了忽略纯文档变更（.md 文件、docs/ 目录等）。

### Q: 如何回滚到之前的版本？

**A:** 
1. 在 "Releases" 页面找到对应版本
2. 下载该版本的 .zip 文件
3. 或者使用 git 回退代码后重新推送

### Q: 版本号太长了，可以改短吗？

**A:** 可以。编辑 `.github/workflows/auto-build-release.yml`，修改 `VERSION` 的生成规则。例如只使用 commit hash：
```yaml
VERSION="${COMMIT_SHORT}"
```

### Q: 能保留更多历史版本吗？

**A:** 可以。在 `auto-build-release.yml` 中修改：
```yaml
keep_latest: 20  # 改成你想保留的数量
```

**注意**：系统会自动删除超出数量的旧版本，包括对应的 Git 标签。

### Q: 构建失败怎么办？

**A:**
1. 查看 Actions 页面的错误日志
2. 在本地运行 `npm run build` 测试
3. 修复问题后重新推送

### Q: 可以手动触发构建吗？

**A:** 当前配置不支持手动触发。如需要，在工作流中添加：
```yaml
on:
  push:
    branches:
      - main
  workflow_dispatch:  # 添加这行
```

## 工作流文件

项目包含两个工作流文件：

- `.github/workflows/auto-build-release.yml` - 自动构建发布
- `.github/workflows/ci.yml` - PR 代码检查

## 徽章

在 README.md 中添加构建状态徽章：

```markdown
![自动构建](https://github.com/yourusername/postman-web-i18n/workflows/自动构建发布/badge.svg)
```

## 建议

- 🎯 **保持 main 分支稳定** - 确保推送到 main 的代码已测试
- 🔀 **使用 PR 开发** - 新功能在分支开发，通过 PR 合并
- 📝 **写好提交信息** - 提交信息会显示在 Release 中
- 🧪 **本地测试** - 推送前在本地运行 `npm run build` 测试

---

享受简化的自动化流程吧！有问题请提交 Issue。
