# 推送到 GitHub 准备清单

## 项目已准备就绪！

你的项目已经配置好了简化的自动发布流程。以下是推送到 GitHub 的步骤：

## 推送前检查

### 1. 基本检查

- [x] LICENSE 文件存在（MIT 协议）
- [x] .gitignore 配置正确
- [x] README.md 完整且专业
- [x] 构建测试通过
- [x] GitHub Actions 工作流已配置

### 2. 文件状态

**准备推送的重要文件：**
- 源代码（src/）
- 构建脚本（scripts/）
- 配置文件（manifest.json, package.json）
- 文档（docs/, README.md, 等）
- GitHub 工作流（.github/workflows/）
- 翻译文件（src/locales/）

**会被忽略的文件：**
- node_modules/（依赖包）
- dist/（构建产物）
- *.zip（压缩包）
- 其他临时文件

### 3. 需要修改的信息

在推送前，请将 README.md 中的占位符替换为你的实际信息：

```markdown
将 `yourusername` 替换为你的 GitHub 用户名
```

## 推送步骤

### 第一步：初始化 Git 仓库

```bash
# 初始化 Git 仓库
git init

# 配置你的 Git 信息（如果还没配置）
git config user.name "你的名字"
git config user.email "你的邮箱"
```

### 第二步：添加所有文件

```bash
# 添加所有文件到暂存区
git add .

# 查看将要提交的文件
git status
```

### 第三步：创建初始提交

```bash
# 创建第一次提交
git commit -m "feat: 初始化 Postman Web i18n 项目"
```

### 第四步：在 GitHub 创建仓库

1. 访问 https://github.com/new
2. 仓库名称：`postman-web-i18n`（或你喜欢的名字）
3. 描述：`Postman网页版国际化汉化浏览器插件`
4. 选择 **Public**（公开）
5. **不要**勾选 "Initialize this repository with a README"
6. 点击 "Create repository"

### 第五步：关联远程仓库并推送

```bash
# 关联远程仓库（将 yourusername 替换为你的 GitHub 用户名）
git remote add origin https://github.com/Ninthless/Postman-Web-i18n.git

# 设置主分支名称为 main
git branch -M main

# 推送代码到 GitHub
git push -u origin main
```

## 推送后会发生什么

### 1. 自动构建（约 2-3 分钟）

推送后，GitHub Actions 会自动：
- 安装依赖
- 运行构建
- 创建 Release
- 生成版本号（格式：`20240120-143022-fec728b`）
- 上传构建的 .zip 文件
- 自动清理旧版本（保留最近 10 个）

### 2. 查看结果

**查看构建状态：**
- 访问：`https://github.com/yourusername/postman-web-i18n/actions`

**查看发布：**
- 访问：`https://github.com/yourusername/postman-web-i18n/releases`

**下载安装包：**
- 在 Releases 页面下载 `postman-web-i18n-*.zip`

## 后续开发流程

### 日常提交

```bash
# 1. 修改代码
vim src/locales/zh-CN/common.json

# 2. 添加到暂存区
git add .

# 3. 提交
git commit -m "feat: 添加新翻译"

# 4. 推送（会自动触发构建和发布）
git push origin main
```

### 使用分支开发（推荐）

```bash
# 1. 创建功能分支
git checkout -b feature/new-translation

# 2. 开发和提交
git add .
git commit -m "feat: 添加导航菜单翻译"

# 3. 推送分支
git push origin feature/new-translation

# 4. 在 GitHub 创建 Pull Request

# 5. 合并到 main 后自动发布
```

## 版本管理

### 自动版本号

每次推送到 main 分支，都会自动生成版本号：

```
20240120-143022-fec728b
│        │        └─ Git commit hash
│        └─ 时间
└─ 日期
```

### 无需手动管理

- 不需要修改 package.json 版本号
- 不需要创建 Git 标签
- 不需要手动上传文件
- 全自动！

## 配置说明

### GitHub Actions 工作流

项目包含两个工作流：

1. **auto-build-release.yml** - 自动构建发布
   - 触发：推送到 main 分支
   - 作用：构建并发布新版本

2. **ci.yml** - 代码检查
   - 触发：Pull Request 或推送到 develop 分支
   - 作用：检查代码质量和构建

### 修改 README 徽章

推送后，记得更新 README.md 中的用户名：

```markdown
将所有 `yourusername` 替换为你的 GitHub 用户名
```

## 常见问题

### Q: 推送后没有触发构建？

**A:** 检查：
1. 是否推送到了 main 分支
2. 查看 Actions 页面是否有错误
3. 检查工作流文件是否正确上传

### Q: 构建失败怎么办？

**A:**
1. 查看 Actions 页面的错误日志
2. 在本地运行 `npm run build` 测试
3. 修复问题后重新推送

### Q: 如何添加合作者？

**A:**
1. 仓库 Settings → Collaborators
2. 点击 "Add people"
3. 输入 GitHub 用户名邀请

### Q: 如何设置仓库主页？

**A:**
1. 仓库 Settings → Pages
2. 选择 "Deploy from a branch"
3. 选择 main 分支的 /docs 或 /root
4. 保存设置

## 完成！

现在你可以：

1. 推送代码到 GitHub
2. 自动构建和发布
3. 邀请贡献者
4. 接收 Pull Request
5. 持续改进项目

---

准备好了吗？开始推送吧！

```bash
git init
git add .
git commit -m "feat: 初始化 Postman Web i18n 项目"
git remote add origin https://github.com/Ninthless/Postman-Web-i18n.git
git branch -M main
git push -u origin main
```

祝你的项目成功！如有问题，随时查看文档或提交 Issue。

