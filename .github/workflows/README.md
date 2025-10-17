# GitHub Actions 工作流说明

本项目包含两个自动化工作流，用于持续集成和自动发布。

## 工作流列表

### 1. 持续集成 (ci.yml)

**触发条件：**
- 推送到 `main` 或 `develop` 分支
- 向 `main` 或 `develop` 分支提交 Pull Request

**主要功能：**
- 在多个 Node.js 版本（16.x, 18.x, 20.x）上测试构建
- 运行 ESLint 代码检查
- 检查翻译文件完整性
- 验证构建产物的完整性
- 检查 package.json 和 manifest.json 版本号一致性

**查看结果：**
在你的 GitHub 仓库页面，点击 "Actions" 标签可以查看工作流运行状态。

### 2. 构建和发布 (build-and-release.yml)

**触发条件：**
- 推送版本标签（如 `v1.0.0`）
- 手动触发（在 Actions 页面）

**主要功能：**
- 自动构建扩展程序
- 创建 GitHub Release
- 上传构建产物（.zip 文件）
- 自动生成发布说明

## 使用方法

### 发布新版本

按照以下步骤发布新版本：

#### 1. 更新版本号

首先，确保 `package.json` 和 `manifest.json` 中的版本号一致：

```json
// package.json
{
  "version": "1.0.1"
}

// manifest.json
{
  "version": "1.0.1"
}
```

#### 2. 更新 CHANGELOG.md

在 `CHANGELOG.md` 中添加本次更新的内容：

```markdown
## [1.0.1] - 2024-01-15

### 新增
- 添加了新的翻译项

### 修复
- 修复了某个 Bug

### 优化
- 优化了性能
```

#### 3. 提交更改

```bash
git add .
git commit -m "chore: 发布版本 v1.0.1"
git push origin main
```

#### 4. 创建并推送标签

```bash
# 创建标签
git tag v1.0.1

# 推送标签到远程仓库
git push origin v1.0.1
```

或者使用带注释的标签：

```bash
# 创建带注释的标签
git tag -a v1.0.1 -m "发布版本 1.0.1"

# 推送标签
git push origin v1.0.1
```

#### 5. 等待自动构建

推送标签后，GitHub Actions 会自动：
1. 检出代码
2. 安装依赖
3. 运行构建
4. 创建 Release
5. 上传 zip 文件

构建过程大约需要 2-5 分钟。

#### 6. 编辑 Release 说明（可选）

构建完成后，可以访问 GitHub 仓库的 "Releases" 页面：
- 查看自动生成的 Release
- 编辑 Release 说明，添加更多详细信息
- 如需要，可以上传额外的文件

### 手动触发构建

如果需要重新构建某个版本：

1. 访问 GitHub 仓库的 "Actions" 页面
2. 选择 "构建和发布" 工作流
3. 点击 "Run workflow" 按钮
4. 选择要构建的分支
5. 点击 "Run workflow" 确认

### 查看构建产物

每次构建成功后，构建产物会保存在两个地方：

1. **GitHub Release**（永久保存）
   - 访问仓库的 "Releases" 页面
   - 下载对应版本的 .zip 文件

2. **GitHub Artifacts**（保存 30 天）
   - 访问 "Actions" 页面
   - 点击对应的工作流运行记录
   - 在页面底部的 "Artifacts" 部分下载

## 常见问题

### Q: 为什么工作流没有触发？

**A:** 检查以下几点：
1. 确保推送了标签（`git push origin v1.0.0`）
2. 确认标签格式正确（`v*.*.*`）
3. 检查 GitHub Actions 是否已启用

### Q: 构建失败怎么办？

**A:** 
1. 访问 "Actions" 页面查看错误日志
2. 常见问题：
   - 依赖安装失败：检查 package.json
   - 构建失败：本地运行 `npm run build` 测试
   - 版本号不一致：确保 package.json 和 manifest.json 版本号相同

### Q: 如何删除错误的 Release？

**A:**
1. 访问 "Releases" 页面
2. 找到要删除的 Release
3. 点击 "Delete" 按钮
4. 同时删除对应的标签：
   ```bash
   # 删除本地标签
   git tag -d v1.0.0
   
   # 删除远程标签
   git push origin :refs/tags/v1.0.0
   ```

### Q: 可以在 Pull Request 中预览构建结果吗？

**A:** 可以！当你创建 PR 时，CI 工作流会自动运行，并在 PR 页面底部显示检查结果。构建成功后，可以在 "Checks" 标签的 "Artifacts" 部分下载构建产物。

## 工作流配置

如需修改工作流配置，编辑以下文件：
- `.github/workflows/ci.yml` - 持续集成配置
- `.github/workflows/build-and-release.yml` - 构建发布配置

修改后推送到仓库即可生效。

## 安全说明

- `GITHUB_TOKEN` 由 GitHub 自动提供，无需手动配置
- 工作流只能访问当前仓库的代码和设置
- 不会泄露任何敏感信息

## 徽章

可以在 README.md 中添加工作流状态徽章：

```markdown
![构建状态](https://github.com/yourusername/postman-web-i18n/workflows/持续集成/badge.svg)
![发布状态](https://github.com/yourusername/postman-web-i18n/workflows/构建和发布/badge.svg)
```

---

如有问题，请提交 Issue 或查看 [GitHub Actions 文档](https://docs.github.com/cn/actions)。

