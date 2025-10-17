# Postman Web i18n

> 为 Postman 网页版提供专业的国际化汉化支持

<p align="center">
  <!-- 构建完成后会自动显示 -->
  <!-- <img src="https://img.shields.io/github/actions/workflow/status/Ninthless/Postman-Web-i18n/auto-build-release.yml?label=构建状态" alt="Build Status"> -->
  <img src="https://img.shields.io/github/license/Ninthless/Postman-Web-i18n" alt="License">
  <img src="https://img.shields.io/badge/browser-Chrome%20%7C%20Edge-orange.svg" alt="Browser">
  <!-- <img src="https://img.shields.io/github/v/release/Ninthless/Postman-Web-i18n?label=最新版本" alt="Latest Release"> -->
</p>

## 特性

- **多语言支持** - 支持简体中文、繁体中文等多种语言
- **实时翻译** - 自动检测并翻译页面动态加载的内容
- **高度可配置** - 提供丰富的设置选项和自定义规则
- **易于维护** - 模块化的翻译文件结构，便于更新和贡献
- **美观界面** - 现代化的 UI 设计，提供良好的用户体验
- **热更新** - 无需刷新页面即可切换语言
- **自动发布** - 推送代码自动构建和发布，简化工作流程

## 截图

_待添加截图_

## 快速开始

### 安装

#### 从 Chrome Web Store 安装（推荐）

_即将上线_

#### 手动安装

1. 克隆或下载本项目

```bash
git clone https://github.com/Ninthless/Postman-Web-i18n.git
cd postman-web-i18n
```

2. 安装依赖

```bash
npm install
```

3. 构建插件

```bash
npm run build
```

4. 在浏览器中加载插件
   - 打开 Chrome/Edge 浏览器
   - 访问 `chrome://extensions/` 或 `edge://extensions/`
   - 开启"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择项目中的 `dist` 目录

### 使用

1. 打开 [Postman Web](https://web.postman.co/)
2. 插件会自动开始翻译页面
3. 点击浏览器工具栏中的插件图标可以：
   - 切换语言
   - 重新翻译页面
   - 访问高级设置

## 项目结构

```
postman-web-i18n/
├── src/
│   ├── content/              # 内容脚本
│   │   ├── i18n-loader.js    # 国际化加载器
│   │   ├── translator.js     # 页面翻译器
│   │   └── main.js          # 主入口
│   ├── background/           # 后台脚本
│   │   └── background.js
│   ├── popup/               # 弹出窗口
│   │   ├── popup.html
│   │   ├── popup.css
│   │   └── popup.js
│   ├── options/             # 设置页面
│   │   ├── options.html
│   │   ├── options.css
│   │   └── options.js
│   └── locales/             # 翻译文件
│       ├── zh-CN/           # 简体中文
│       │   ├── common.json
│       │   └── ui.json
│       ├── zh-TW/           # 繁体中文
│       └── en/              # 英文
├── scripts/                 # 构建和工具脚本
│   ├── build.js            # 构建脚本
│   ├── checkTranslations.js # 翻译检查
│   ├── exportTranslations.js # 导出翻译
│   └── importTranslations.js # 导入翻译
├── _locales/               # 扩展元数据翻译
├── manifest.json           # 插件清单
├── package.json
└── README.md
```

## 开发

### 开发模式

```bash
# 启动开发模式（监听文件变化自动构建）
npm run dev
```

### 构建

```bash
# 构建生产版本
npm run build
```

### 翻译管理

```bash
# 检查翻译完整性
npm run translate:check

# 导出翻译文件（用于编辑）
npm run translate:export

# 导入翻译文件
npm run translate:import
```

## 添加/更新翻译

### 翻译文件结构

翻译文件位于 `src/locales/` 目录下，按语言分类：

```
src/locales/
├── zh-CN/
│   ├── common.json    # 通用翻译
│   └── ui.json        # UI 翻译
├── zh-TW/
└── en/
```

### 添加新翻译

1. 在对应语言的 JSON 文件中添加翻译条目：

```json
{
  "category": {
    "key": "翻译文本"
  }
}
```

2. 在 `src/content/translator.js` 中添加翻译规则：

```javascript
{
  selector: 'text',           // 选择器类型: text, placeholder, title, aria-label
  match: /^Original Text$/i,  // 匹配原文本的正则表达式
  key: 'category.key'        // 对应的翻译键
}
```

3. 重新构建并测试

### 贡献翻译

欢迎提交 Pull Request 来改进翻译！请遵循以下步骤：

1. Fork 本项目
2. 创建您的特性分支 (`git checkout -b feature/improve-translation`)
3. 提交更改 (`git commit -m '改进翻译'`)
4. 推送到分支 (`git push origin feature/improve-translation`)
5. 创建 Pull Request

## 自定义翻译规则

您可以在设置页面添加自定义翻译规则：

```json
{
  "selector": "text",
  "match": "^Custom Text$",
  "key": "custom.translation.key"
}
```

也可以直接使用浏览器控制台：

```javascript
// 添加单个规则
window.postmanI18n.addRule({
  selector: 'text',
  match: /^Custom Text$/i,
  key: 'custom.key'
});

// 切换语言
window.postmanI18n.setLocale('zh-CN');

// 重新翻译页面
window.postmanI18n.retranslate();
```

## 配置选项

在设置页面可以配置：

- **界面语言** - 选择翻译语言
- **自动翻译** - 是否自动翻译新打开的页面
- **动态内容翻译** - 是否翻译动态加载的内容
- **调试模式** - 在控制台显示详细日志
- **自定义规则** - 添加自定义翻译规则

## 参与贡献

我们欢迎各种形式的贡献：

- 报告 Bug
- 提出新功能建议
- 改进文档
- 贡献翻译
- 提交代码

请查看 [贡献指南](CONTRIBUTING.md) 了解更多信息。

## 许可证

本项目采用 [MIT](LICENSE) 许可证。

## 致谢

- [Postman](https://www.postman.com/) - 提供优秀的 API 开发工具
- 所有贡献者

## 联系方式

- 项目主页: [https://github.com/Ninthless/Postman-Web-i18n](https://github.com/Ninthless/Postman-Web-i18n)
- 问题反馈: [Issues](https://github.com/Ninthless/Postman-Web-i18n/issues)

## 路线图

- [ ] 支持更多语言（日语、韩语等）
- [ ] 提供在线翻译编辑器
- [ ] 自动同步官方更新
- [ ] 支持 Firefox 浏览器
- [ ] 翻译导入导出工具优化
- [ ] AI 辅助翻译建议

---

**如果这个项目对您有帮助，请给个 Star 支持一下！**

