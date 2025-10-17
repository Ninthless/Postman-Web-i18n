# 项目结构说明

本文档详细说明 Postman Web i18n 项目的目录结构和文件组织。

## 目录结构

```
postman-web-i18n/
├── .github/                      # GitHub 配置
│   ├── ISSUE_TEMPLATE/          # Issue 模板
│   │   ├── bug_report.md        # Bug 报告模板
│   │   ├── feature_request.md   # 功能请求模板
│   │   └── translation_issue.md # 翻译问题模板
│   └── pull_request_template.md # PR 模板
│
├── docs/                        # 项目文档
│   ├── API.md                  # API 文档
│   ├── INSTALL.md              # 安装指南
│   ├── TRANSLATION_GUIDE.md    # 翻译指南
│   └── USAGE.md                # 使用指南
│
├── scripts/                     # 构建和工具脚本
│   ├── build.js                # 主构建脚本
│   ├── checkTranslations.js    # 翻译完整性检查
│   ├── exportTranslations.js   # 导出翻译文件
│   └── importTranslations.js   # 导入翻译文件
│
├── src/                        # 源代码目录
│   ├── background/             # 后台脚本
│   │   └── background.js       # Service Worker
│   │
│   ├── content/                # 内容脚本（注入页面）
│   │   ├── i18n-loader.js     # i18n 加载器
│   │   ├── translator.js      # 页面翻译器
│   │   └── main.js            # 主入口
│   │
│   ├── locales/                # 翻译资源文件
│   │   ├── zh-CN/             # 简体中文
│   │   │   ├── common.json    # 通用翻译
│   │   │   └── ui.json        # UI 翻译
│   │   ├── zh-TW/             # 繁体中文
│   │   │   ├── common.json
│   │   │   └── ui.json
│   │   └── en/                # 英文（回退语言）
│   │       ├── common.json
│   │       └── ui.json
│   │
│   ├── options/                # 设置页面
│   │   ├── options.html       # HTML
│   │   ├── options.css        # 样式
│   │   └── options.js         # 脚本
│   │
│   └── popup/                  # 弹出窗口
│       ├── popup.html         # HTML
│       ├── popup.css          # 样式
│       └── popup.js           # 脚本
│
├── _locales/                   # 扩展元数据翻译
│   ├── en/
│   │   └── messages.json
│   └── zh_CN/
│       └── messages.json
│
├── dist/                       # 构建输出目录（生成）
│   ├── background/
│   ├── content/
│   ├── locales/
│   ├── options/
│   ├── popup/
│   ├── icons/
│   ├── _locales/
│   └── manifest.json
│
├── translations-export/        # 翻译导出目录（生成）
├── translations-import/        # 翻译导入目录（用户创建）
│
├── .editorconfig              # 编辑器配置
├── .gitignore                 # Git 忽略文件
├── CHANGELOG.md               # 更新日志
├── CONTRIBUTING.md            # 贡献指南
├── LICENSE                    # 许可证
├── manifest.json              # 扩展清单文件
├── package.json               # NPM 配置
├── PROJECT_STRUCTURE.md       # 本文件
└── README.md                  # 项目说明
```

## 核心文件说明

### 配置文件

#### `manifest.json`
- **作用**：浏览器扩展的配置文件（Manifest V3）
- **包含**：权限、脚本、图标等配置
- **重要字段**：
  - `content_scripts`: 注入的内容脚本
  - `background`: 后台 Service Worker
  - `permissions`: 所需权限

#### `package.json`
- **作用**：Node.js 项目配置
- **包含**：依赖、脚本命令
- **重要脚本**：
  - `build`: 构建生产版本
  - `dev`: 开发模式
  - `translate:check`: 检查翻译

### 源代码

#### `src/content/i18n-loader.js`
- **作用**：国际化系统核心
- **功能**：
  - 加载翻译文件
  - 管理语言切换
  - 提供翻译 API
  - 自动检测浏览器语言

#### `src/content/translator.js`
- **作用**：页面翻译引擎
- **功能**：
  - 定义翻译规则
  - 翻译文本节点
  - 翻译 HTML 属性
  - 监听 DOM 变化

#### `src/content/main.js`
- **作用**：内容脚本入口
- **功能**：
  - 初始化 i18n 系统
  - 启动翻译器
  - 暴露全局 API

#### `src/background/background.js`
- **作用**：后台服务 Worker
- **功能**：
  - 处理扩展生命周期
  - 消息传递
  - 存储管理

### 翻译文件

#### `src/locales/{lang}/common.json`
通用翻译，包含：
- 应用级别的术语
- HTTP 相关术语
- 操作按钮
- 状态信息

#### `src/locales/{lang}/ui.json`
UI 翻译，包含：
- 侧边栏元素
- 集合相关
- 环境相关
- 工作空间相关
- 占位符文本

### 用户界面

#### `src/popup/`
- **作用**：点击扩展图标显示的弹出窗口
- **功能**：
  - 快速切换语言
  - 重新翻译页面
  - 访问设置

#### `src/options/`
- **作用**：扩展的设置页面
- **功能**：
  - 详细配置选项
  - 翻译管理
  - 自定义规则
  - 关于信息

### 构建脚本

#### `scripts/build.js`
- **作用**：主构建脚本
- **功能**：
  - 复制文件到 dist
  - 创建 ZIP 包
  - 支持监听模式

#### `scripts/checkTranslations.js`
- **作用**：翻译质量检查
- **功能**：
  - 检查缺失的翻译
  - 检查重复的值
  - 统计翻译数量

#### `scripts/exportTranslations.js`
- **作用**：导出翻译
- **功能**：
  - 导出为 JSON
  - 导出为 CSV
  - 便于外部编辑

#### `scripts/importTranslations.js`
- **作用**：导入翻译
- **功能**：
  - 从 JSON 导入
  - 更新翻译文件

## 数据流

### 初始化流程

```
1. 用户访问 Postman Web
2. Content Script 注入
3. i18n-loader.js 初始化
   ├─ 从 Storage 读取语言设置
   ├─ 加载翻译文件
   └─ 创建全局 i18n 对象
4. translator.js 初始化
   ├─ 初始化翻译规则
   └─ 创建 PageTranslator 实例
5. main.js 启动
   ├─ 执行首次翻译
   ├─ 启动 MutationObserver
   └─ 暴露全局 API
```

### 翻译流程

```
1. 检测到文本节点/属性
2. 遍历翻译规则
3. 正则匹配原文本
4. 查找对应的翻译键
5. 从翻译对象获取译文
6. 替换原文本
7. 标记已翻译
```

### 语言切换流程

```
1. 用户选择新语言
2. 保存到 Storage
3. 触发 locale-changed 事件
4. 重新加载翻译文件
5. 清除翻译标记
6. 重新翻译页面
```

## 工作流程

### 开发流程

```bash
# 1. 启动开发模式
npm run dev

# 2. 在浏览器中加载 dist 目录

# 3. 修改源代码
# - 文件会自动重新构建

# 4. 在浏览器中重新加载扩展

# 5. 刷新 Postman 页面测试
```

### 添加翻译流程

```bash
# 1. 编辑翻译文件
vim src/locales/zh-CN/ui.json

# 2. 添加翻译规则
vim src/content/translator.js

# 3. 检查翻译
npm run translate:check

# 4. 构建测试
npm run build

# 5. 在浏览器中测试
```

### 发布流程

```bash
# 1. 更新版本号
vim package.json
vim manifest.json

# 2. 更新 CHANGELOG
vim CHANGELOG.md

# 3. 构建生产版本
npm run build

# 4. 创建 ZIP 包（自动）
# 输出: postman-web-i18n.zip

# 5. 创建 Git Tag
git tag v1.0.0
git push --tags

# 6. 创建 GitHub Release
# 上传 ZIP 文件
```

## 技术栈

- **核心**：原生 JavaScript（ES6+）
- **构建**：Node.js 脚本
- **存储**：Chrome Storage API
- **UI**：HTML5 + CSS3
- **图标**：PNG 格式

## 设计模式

- **单例模式**：i18n 加载器
- **观察者模式**：DOM 变化监听、事件系统
- **策略模式**：翻译规则匹配
- **工厂模式**：翻译对象创建

## 性能优化

1. **缓存机制**
   - 翻译结果缓存
   - 已翻译元素标记
   - WeakSet 避免内存泄漏

2. **懒加载**
   - 按需加载翻译模块
   - 异步文件加载

3. **高效 DOM 操作**
   - TreeWalker 遍历
   - 批量处理
   - MutationObserver 节流

## 扩展性

### 添加新语言

1. 在 `src/locales/` 创建新目录
2. 复制并翻译 JSON 文件
3. 在 i18n-loader.js 添加语言映射
4. 在 popup.html 和 options.html 添加选项

### 添加新模块

1. 创建新的 JSON 文件
2. 使用 i18n.loadModule() 加载
3. 添加对应的翻译规则

### 自定义翻译规则

用户可以通过：
- 设置页面添加规则
- 控制台 API 添加规则
- 编辑 customRules 存储

## 维护建议

1. **定期检查翻译**
   ```bash
   npm run translate:check
   ```

2. **关注 Postman 更新**
   - Postman 界面可能变化
   - 需要更新翻译规则

3. **收集用户反馈**
   - 通过 Issues 跟踪问题
   - 改进翻译质量

4. **版本管理**
   - 遵循语义化版本
   - 维护 CHANGELOG

## 相关资源

- [Chrome Extension 文档](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 迁移指南](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [i18n 最佳实践](https://developer.chrome.com/docs/extensions/reference/i18n/)

---

本文档持续更新中。如有疑问，请查看其他文档或提交 Issue。

