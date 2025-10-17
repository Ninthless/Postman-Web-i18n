# 贡献指南

感谢您考虑为 Postman Web i18n 项目做出贡献！

## 如何贡献

### 报告 Bug

如果您发现了 Bug，请创建一个 Issue 并包含以下信息：

- Bug 的详细描述
- 重现步骤
- 期望的行为
- 实际的行为
- 浏览器版本和操作系统
- 截图（如果可能）

### 提出新功能

如果您有新功能的想法：

1. 先检查是否已有相关的 Issue
2. 创建新的 Issue 详细描述您的想法
3. 等待维护者的反馈

### 贡献代码

1. **Fork 项目**

```bash
# Fork 后克隆到本地
git clone https://github.com/yourusername/postman-web-i18n.git
cd postman-web-i18n
```

2. **创建分支**

```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/your-bug-fix
```

3. **安装依赖**

```bash
npm install
```

4. **进行开发**

- 遵循项目的代码风格
- 添加必要的注释
- 确保代码可以正常运行

5. **测试您的更改**

```bash
# 构建项目
npm run build

# 检查翻译
npm run translate:check
```

6. **提交更改**

```bash
git add .
git commit -m "feat: 添加新功能描述"
# 或
git commit -m "fix: 修复bug描述"
```

提交信息格式：
- `feat:` 新功能
- `fix:` Bug 修复
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 重构
- `test:` 测试相关
- `chore:` 构建/工具相关

7. **推送到 GitHub**

```bash
git push origin feature/your-feature-name
```

8. **创建 Pull Request**

- 访问您的 Fork 仓库页面
- 点击 "New Pull Request"
- 填写 PR 描述，说明您的更改
- 等待审核

### 贡献翻译

翻译是最容易参与的贡献方式！

1. **找到翻译文件**

翻译文件位于 `src/locales/` 目录：
- `zh-CN/` - 简体中文
- `zh-TW/` - 繁体中文
- `en/` - 英文

2. **编辑翻译**

在对应的 JSON 文件中添加或修改翻译：

```json
{
  "category": {
    "new_item": "新翻译文本"
  }
}
```

3. **添加翻译规则**

在 `src/content/translator.js` 中添加匹配规则：

```javascript
{
  selector: 'text',
  match: /^Original Text$/i,
  key: 'category.new_item'
}
```

4. **测试翻译**

```bash
# 检查翻译完整性
npm run translate:check

# 构建并测试
npm run build
```

5. **提交 Pull Request**

### 代码规范

- 使用 2 空格缩进
- 使用有意义的变量和函数名
- 添加必要的注释（中文或英文）
- 保持代码简洁清晰

### 翻译规范

- 保持术语一致性
- 使用专业的技术术语
- 避免机器翻译的生硬表达
- 保持简洁，符合界面显示

### 提交规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

示例：
```
feat(translator): 添加新的翻译规则匹配算法

- 优化正则表达式匹配性能
- 支持模糊匹配
- 添加缓存机制

Closes #123
```

## 开发指南

### 项目架构

```
├── src/
│   ├── content/        # 内容脚本（注入到页面）
│   ├── background/     # 后台服务
│   ├── popup/         # 弹出窗口
│   ├── options/       # 设置页面
│   └── locales/       # 翻译文件
├── scripts/           # 构建和工具脚本
└── manifest.json      # 扩展清单
```

### 核心概念

1. **i18n Loader** - 加载和管理翻译资源
2. **Translator** - 翻译页面元素
3. **Translation Rules** - 定义文本匹配和替换规则

### 调试技巧

1. **开启调试模式**
   - 在设置页面启用"调试模式"
   - 查看控制台输出

2. **使用控制台 API**
```javascript
// 查看当前翻译
window.postmanI18n.getTranslations()

// 测试翻译键
window.postmanI18n.translate('key.path')

// 重新翻译
window.postmanI18n.retranslate()
```

3. **检查翻译规则**
   - 在 `src/content/translator.js` 中添加 console.log
   - 查看规则匹配情况

### 常见问题

**Q: 翻译没有生效？**
A: 检查翻译规则的正则表达式是否正确匹配原文本

**Q: 如何添加新语言？**
A: 在 `src/locales/` 下创建新的语言目录，并添加相应的翻译文件

**Q: 动态内容没有翻译？**
A: 确保 MutationObserver 正在运行，检查控制台是否有错误

## 行为准则

- 尊重所有贡献者
- 保持友好和建设性的讨论
- 接受建设性的批评
- 专注于对项目最有利的事情

## 获得帮助

如果您需要帮助：

- 查看 [文档](README.md)
- 搜索现有的 [Issues](https://github.com/yourusername/postman-web-i18n/issues)
- 创建新的 Issue 提问

## 致谢

感谢所有贡献者的付出！您的贡献让这个项目变得更好。

---

再次感谢您的贡献！

