# 快速开始指南

5分钟快速上手 Postman Web i18n 项目！

## 开发者快速开始

### 1. 克隆项目

```bash
git clone https://github.com/Ninthless/Postman-Web-i18n.git
cd postman-web-i18n
```

### 2. 安装依赖

```bash
npm install
```

### 3. 构建项目

```bash
npm run build
```

### 4. 加载到浏览器

**Chrome:**
1. 打开 `chrome://extensions/`
2. 开启"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择 `dist` 目录

**Edge:**
1. 打开 `edge://extensions/`
2. 开启"开发人员模式"
3. 点击"加载解压缩的扩展"
4. 选择 `dist` 目录

### 5. 测试

访问 https://web.postman.co/ 查看汉化效果！

## 用户快速开始

### 安装插件

1. 下载最新版本的 ZIP 文件
2. 解压到任意目录
3. 在浏览器中加载（见上文步骤 4）

### 使用插件

1. 访问 Postman Web
2. 页面自动翻译为中文
3. 点击插件图标可以切换语言

## 常用命令

```bash
# 开发模式（文件变化自动重新构建）
npm run dev

# 生产构建
npm run build

# 检查翻译完整性
npm run translate:check

# 导出翻译文件
npm run translate:export

# 导入翻译文件
npm run translate:import
```

## 添加翻译（3步）

### 1. 编辑翻译文件

```bash
# 编辑中文翻译
vim src/locales/zh-CN/ui.json
```

添加：
```json
{
  "new_category": {
    "new_item": "新翻译"
  }
}
```

### 2. 添加翻译规则

```bash
vim src/content/translator.js
```

在 `initTranslationRules()` 中添加：
```javascript
{
  selector: 'text',
  match: /^Original Text$/i,
  key: 'new_category.new_item'
}
```

### 3. 测试

```bash
npm run build
# 在浏览器中重新加载扩展
# 刷新 Postman 页面
```

## 项目结构（简化版）

```
postman-web-i18n/
├── src/
│   ├── content/          # 内容脚本（核心翻译逻辑）
│   ├── locales/          # 翻译文件（在这里添加翻译）
│   ├── popup/            # 弹出窗口
│   ├── options/          # 设置页面
│   └── background/       # 后台脚本
├── scripts/              # 构建脚本
├── dist/                 # 构建输出（加载到浏览器）
└── manifest.json         # 扩展配置
```

## 调试技巧

### 在控制台使用 API

```javascript
// 切换语言
window.postmanI18n.setLocale('zh-CN');

// 获取翻译
window.postmanI18n.translate('buttons.save');

// 重新翻译页面
window.postmanI18n.retranslate();

// 查看所有翻译
window.postmanI18n.getTranslations();
```

### 查看日志

1. 打开开发者工具（F12）
2. 在设置中启用"调试模式"
3. 查看以 `[Postman i18n]` 开头的日志

## 遇到问题？

### 翻译没生效
```bash
# 1. 检查翻译规则的正则是否正确
# 2. 重新构建
npm run build
# 3. 重新加载扩展
# 4. 刷新页面
```

### 构建失败
```bash
# 清理并重新安装
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 需要帮助
- 查看 [完整文档](README.md)
- 搜索 [Issues](https://github.com/yourusername/postman-web-i18n/issues)
- 提交新的 Issue

## 下一步

- 阅读 [完整 README](README.md)
- 查看 [翻译指南](docs/TRANSLATION_GUIDE.md)
- 浏览 [API 文档](docs/API.md)
- 了解 [贡献指南](CONTRIBUTING.md)

## 快速链接

- [项目结构详解](PROJECT_STRUCTURE.md)
- [安装指南](docs/INSTALL.md)
- [使用手册](docs/USAGE.md)
- [更新日志](CHANGELOG.md)

---

开始您的汉化之旅吧！

