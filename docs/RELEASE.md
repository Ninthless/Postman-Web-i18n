# 发布指南

本文档说明如何发布 Postman Web i18n 的新版本。

## 发布前准备

### 1. 确认更改

确保所有计划的功能和修复都已完成并合并到 `main` 分支。

```bash
git checkout main
git pull origin main
```

### 2. 本地测试

在发布前，务必在本地进行完整测试：

```bash
# 安装依赖
npm install

# 运行代码检查
npm run lint

# 检查翻译文件
npm run check-translations

# 运行构建
npm run build

# 手动测试扩展功能
```

### 3. 更新文档

确保以下文档都已更新：

- `CHANGELOG.md` - 添加新版本的更新内容
- `README.md` - 更新版本号和功能描述（如需要）
- 其他相关文档

## 发布流程

### 步骤 1: 更新版本号

同时更新以下两个文件中的版本号：

**package.json:**
```json
{
  "version": "1.1.0"
}
```

**manifest.json:**
```json
{
  "version": "1.1.0"
}
```

版本号格式遵循[语义化版本](https://semver.org/lang/zh-CN/)：
- **主版本号**（MAJOR）：不兼容的 API 修改
- **次版本号**（MINOR）：向下兼容的功能性新增
- **修订号**（PATCH）：向下兼容的问题修正

### 步骤 2: 更新 CHANGELOG

在 `CHANGELOG.md` 中添加新版本的更新内容：

```markdown
## [1.1.0] - 2024-01-20

### 新增
- 新增 XXX 功能
- 添加 YYY 翻译

### 修复
- 修复 AAA 问题
- 解决 BBB 错误

### 优化
- 优化 CCC 性能
- 改进 DDD 体验

### 变更
- 调整 EEE 行为
```

### 步骤 3: 提交更改

```bash
# 添加所有更改
git add .

# 提交（使用约定式提交格式）
git commit -m "chore: 发布版本 v1.1.0"

# 推送到远程仓库
git push origin main
```

### 步骤 4: 创建标签

```bash
# 创建带注释的标签
git tag -a v1.1.0 -m "Release version 1.1.0"

# 推送标签（这将触发自动发布流程）
git push origin v1.1.0
```

### 步骤 5: 等待自动构建

推送标签后，GitHub Actions 会自动执行以下操作：

1. 检出代码
2. 安装依赖
3. 运行构建
4. 创建 GitHub Release
5. 上传构建产物

你可以在 GitHub 仓库的 "Actions" 页面查看构建进度，整个过程通常需要 2-5 分钟。

### 步骤 6: 验证发布

构建完成后：

1. 访问 GitHub 仓库的 "Releases" 页面
2. 确认新的 Release 已创建
3. 检查发布说明是否正确
4. 下载 .zip 文件进行测试
5. 验证扩展功能正常

### 步骤 7: 完善 Release 说明（可选）

如需要，可以编辑 Release 说明：

1. 在 "Releases" 页面找到新创建的 Release
2. 点击编辑按钮
3. 添加更详细的说明、截图或链接
4. 如果这是预发布版本，勾选 "This is a pre-release"
5. 保存更改

## 紧急修复发布

如果需要紧急发布修复版本：

### 快速流程

```bash
# 1. 创建修复分支
git checkout -b hotfix/1.0.1

# 2. 修复问题并提交
git add .
git commit -m "fix: 修复紧急问题"

# 3. 更新版本号
# 编辑 package.json 和 manifest.json

# 4. 更新 CHANGELOG
# 添加修复说明到 CHANGELOG.md

# 5. 提交版本更改
git add .
git commit -m "chore: 发布 v1.0.1"

# 6. 合并到主分支
git checkout main
git merge hotfix/1.0.1

# 7. 推送并创建标签
git push origin main
git tag -a v1.0.1 -m "Hotfix version 1.0.1"
git push origin v1.0.1

# 8. 删除修复分支
git branch -d hotfix/1.0.1
```

## 发布后工作

### 1. 通知用户

在以下渠道通知用户新版本发布：

- GitHub Release 页面
- 项目 README（如需要）
- 相关社区或论坛

### 2. 监控反馈

发布后，密切关注：

- GitHub Issues 中的问题报告
- 用户反馈和建议
- 可能的 Bug 报告

### 3. 准备下一个版本

在 `CHANGELOG.md` 中添加 `[未发布]` 部分，为下一个版本做准备：

```markdown
## [未发布]

### 计划功能
- 待添加的功能...
```

## 版本管理策略

### 分支管理

- `main` - 稳定的生产版本
- `develop` - 开发分支
- `feature/*` - 功能分支
- `hotfix/*` - 紧急修复分支

### 发布周期

建议的发布周期：

- **主版本**：重大更新，不定期
- **次版本**：功能更新，每月一次
- **修订版本**：Bug 修复，按需发布

### 版本示例

```
v1.0.0 -> v1.0.1 (Bug 修复)
v1.0.1 -> v1.1.0 (新功能)
v1.1.0 -> v1.1.1 (Bug 修复)
v1.1.1 -> v2.0.0 (重大更新)
```

## 回滚版本

如果发布的版本有严重问题，可以回滚：

### 方法 1: 发布新的修复版本（推荐）

```bash
# 修复问题并发布新版本
git checkout main
# ... 修复问题 ...
git commit -m "fix: 修复严重问题"
# 发布 v1.1.1
```

### 方法 2: 删除有问题的 Release

```bash
# 1. 在 GitHub 上删除 Release

# 2. 删除本地标签
git tag -d v1.1.0

# 3. 删除远程标签
git push origin :refs/tags/v1.1.0

# 4. 回退提交（如需要）
git revert <commit-hash>
git push origin main
```

## 自动化检查

在发布前，CI 工作流会自动检查：

- 代码风格（ESLint）
- 翻译文件完整性
- 构建成功与否
- 版本号一致性

如果检查失败，请修复问题后再发布。

## 常见问题

### Q: 忘记更新 CHANGELOG 怎么办？

**A:** 可以编辑 GitHub Release 的说明，或者创建一个新的提交补充 CHANGELOG。

### Q: 版本号错了怎么办？

**A:** 如果还没有推送标签，可以删除本地标签重新创建。如果已经推送，建议发布一个新的正确版本。

### Q: 构建失败怎么办？

**A:** 
1. 查看 Actions 页面的错误日志
2. 在本地复现问题
3. 修复问题后重新推送标签

### Q: 可以手动上传构建文件吗？

**A:** 可以，但不推荐。如果自动构建失败，建议修复构建脚本后重新触发自动构建。

## 发布清单

使用此清单确保发布流程完整：

- [ ] 所有计划的功能和修复都已完成
- [ ] 代码已通过所有测试
- [ ] 已更新 package.json 版本号
- [ ] 已更新 manifest.json 版本号
- [ ] 已更新 CHANGELOG.md
- [ ] 已更新相关文档
- [ ] 已在本地测试构建
- [ ] 已提交所有更改
- [ ] 已创建并推送版本标签
- [ ] 已验证自动构建成功
- [ ] 已测试发布的扩展程序
- [ ] 已通知用户（如适用）

---

遵循本指南，可以确保每次发布都是顺利和高质量的。如有问题，请查看 [GitHub Actions 文档](https://docs.github.com/cn/actions) 或提交 Issue。

