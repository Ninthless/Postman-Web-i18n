# 开发指南 - 如何添加更多汉化

本指南详细说明如何为 Postman Web i18n 添加新的翻译内容。

## 快速开始

### 完整流程示例

假设我们要翻译 "Create Workspace" 按钮：

#### 1. 在翻译文件中添加翻译

编辑 `src/locales/zh-CN/ui.json`：

```json
{
  "workspace": {
    "create_workspace": "创建工作空间"
  }
}
```

#### 2. 在翻译器中添加规则

编辑 `src/content/translator.js`，在 `initTranslationRules()` 方法中添加：

```javascript
{
  selector: 'text',
  match: /^Create Workspace$/i,
  key: 'workspace.create_workspace'
}
```

#### 3. 重新构建并测试

```bash
npm run build
```

然后重新加载扩展，刷新 Postman 页面。

---

## 详细步骤

### 步骤 1：识别需要翻译的文本

#### 方法 A：直接观察
1. 访问 Postman 网页版
2. 找到英文文本
3. 记录**完整且准确**的文本（注意大小写、空格）

#### 方法 B：使用检查工具
1. 右键点击文本 → "检查"
2. 查看 HTML 结构
3. 确定文本位置（文本节点、属性等）

#### 方法 C：使用控制台
```javascript
// 查看当前翻译
window.postmanI18n.getTranslations()

// 测试翻译键
window.postmanI18n.translate('workspace.create_workspace')
```

### 步骤 2：选择合适的翻译文件

翻译文件位于 `src/locales/zh-CN/`：

- **common.json** - 通用术语
  - HTTP 方法
  - 基础操作（保存、取消等）
  - 状态信息

- **ui.json** - 界面元素
  - 侧边栏
  - 按钮
  - 菜单项
  - 占位符

### 步骤 3：添加翻译条目

使用**有意义的键名**和**嵌套结构**：

```json
{
  "category": {
    "subcategory": {
      "key_name": "翻译文本"
    }
  }
}
```

**示例：**

```json
// src/locales/zh-CN/ui.json
{
  "request": {
    "methods": {
      "get": "GET",
      "post": "POST"
    },
    "tabs": {
      "params": "参数",
      "headers": "请求头",
      "body": "请求体"
    }
  }
}
```

### 步骤 4：添加翻译规则

编辑 `src/content/translator.js`：

```javascript
initTranslationRules() {
  this.translationRules = [
    // ... 现有规则
    
    // 添加新规则
    {
      selector: 'text',           // 选择器类型
      match: /^Original Text$/i,  // 匹配模式
      key: 'category.key_name'    // 翻译键
    }
  ];
}
```

#### 选择器类型

- **text** - 文本内容
  ```javascript
  { selector: 'text', match: /^Save$/i, key: 'actions.save' }
  ```

- **placeholder** - 输入框占位符
  ```javascript
  { selector: 'placeholder', match: /Enter URL/i, key: 'placeholders.enter_url' }
  ```

- **title** - 鼠标悬停提示
  ```javascript
  { selector: 'title', match: /Click to save/i, key: 'tooltips.save' }
  ```

- **aria-label** - 无障碍标签
  ```javascript
  { selector: 'aria-label', match: /Close/i, key: 'actions.close' }
  ```

- **button** - 按钮文本
  ```javascript
  { selector: 'button', match: /^Submit$/i, key: 'actions.submit' }
  ```

#### 正则表达式技巧

```javascript
// 精确匹配
match: /^Save$/i              // 只匹配 "Save"

// 包含匹配
match: /Save/i                // 匹配包含 "Save" 的文本

// 可选文本
match: /^Save( All)?$/i       // 匹配 "Save" 或 "Save All"

// 多个选项
match: /^(Create|New)$/i      // 匹配 "Create" 或 "New"

// 忽略大小写（推荐）
match: /^save$/i              // i 标志

// 包含特殊字符需要转义
match: /^Save \(Ctrl\+S\)$/i  // 匹配 "Save (Ctrl+S)"
```

### 步骤 5：构建和测试

#### 开发模式（推荐）

```bash
# 启动监听模式
npm run dev
```

文件修改后自动重新构建，只需：
1. 在扩展页面重新加载扩展
2. 刷新 Postman 页面

#### 手动构建

```bash
npm run build
```

#### 测试翻译

1. **在浏览器中测试**
   - 重新加载扩展
   - 刷新 Postman 页面
   - 查看翻译是否生效

2. **使用控制台调试**
   ```javascript
   // 检查翻译是否加载
   window.postmanI18n.translate('your.key.name')
   
   // 重新翻译页面
   window.postmanI18n.retranslate()
   
   // 查看所有翻译
   window.postmanI18n.getTranslations()
   ```

3. **启用调试模式**
   - 打开扩展设置页面
   - 勾选"调试模式"
   - 查看控制台日志

---

## 常见场景

### 场景 1：翻译侧边栏菜单

```javascript
// 1. 添加翻译 (src/locales/zh-CN/ui.json)
{
  "sidebar": {
    "collections": "集合",
    "environments": "环境"
  }
}

// 2. 添加规则 (src/content/translator.js)
{
  selector: 'text',
  match: /^Collections$/i,
  key: 'sidebar.collections'
},
{
  selector: 'text',
  match: /^Environments$/i,
  key: 'sidebar.environments'
}
```

### 场景 2：翻译按钮

```javascript
// 1. 添加翻译
{
  "buttons": {
    "save": "保存",
    "cancel": "取消"
  }
}

// 2. 添加规则
{
  selector: 'button',
  match: /^Save$/i,
  key: 'buttons.save'
}
```

### 场景 3：翻译输入框占位符

```javascript
// 1. 添加翻译
{
  "placeholders": {
    "search": "搜索",
    "enter_url": "输入请求 URL"
  }
}

// 2. 添加规则
{
  selector: 'placeholder',
  match: /Search/i,
  key: 'placeholders.search'
},
{
  selector: 'placeholder',
  match: /Enter request URL/i,
  key: 'placeholders.enter_url'
}
```

### 场景 4：翻译带参数的文本

```javascript
// 1. 添加翻译（使用 {参数名} 语法）
{
  "messages": {
    "items_count": "共 {count} 项",
    "welcome": "欢迎，{name}！"
  }
}

// 2. 使用时传递参数
window.postmanI18n.translate('messages.items_count', { count: 5 })
// 输出: "共 5 项"
```

---

## 实用工具

### 1. 检查翻译完整性

```bash
npm run translate:check
```

输出：
- 缺失的翻译
- 重复的翻译
- 翻译统计

### 2. 导出翻译

```bash
npm run translate:export
```

生成 `translations-export/` 目录，包含：
- JSON 格式
- CSV 格式（可在 Excel 中编辑）

### 3. 导入翻译

```bash
# 1. 将翻译文件放入 translations-import/
# 2. 运行导入
npm run translate:import
```

---

## 翻译规范

### 术语一致性

| 英文 | 中文 | 说明 |
|------|------|------|
| Collection | 集合 | 不翻译为"收藏" |
| Environment | 环境 | - |
| Workspace | 工作空间 | - |
| Request | 请求 | - |
| Response | 响应 | 不翻译为"回复" |
| Variable | 变量 | - |
| Authorization | 授权 | - |

### 翻译原则

1. **准确** - 忠实原意
2. **简洁** - 考虑界面空间
3. **一致** - 同一术语统一翻译
4. **本地化** - 符合中文习惯

### 示例

```json
// 好的翻译
"save": "保存"
"save_as": "另存为"
"new_collection": "新建集合"

// 避免
"save": "保存文件"  // 太冗长
"new_collection": "新的集合"  // 不简洁
```

---

## 调试技巧

### 翻译未生效

**可能原因：**
1. 正则表达式不匹配
2. 翻译键路径错误
3. 未重新构建

**解决方法：**

```javascript
// 1. 测试正则表达式
const text = "Save";
const pattern = /^Save$/i;
console.log(pattern.test(text)); // 应该为 true

// 2. 检查翻译键
window.postmanI18n.translate('buttons.save')
// 如果返回 'buttons.save' 说明键不存在

// 3. 查看已加载的翻译
window.postmanI18n.getTranslations('buttons')
```

### 查看日志

1. 开启调试模式（扩展设置）
2. 打开控制台（F12）
3. 查看 `[Postman i18n]` 开头的日志

### 强制重新翻译

```javascript
// 清除缓存并重新翻译
window.postmanI18n.retranslate()
```

---

## 高级技巧

### 1. 批量添加规则

```javascript
const newRules = [
  { selector: 'text', match: /^Text 1$/i, key: 'category.text1' },
  { selector: 'text', match: /^Text 2$/i, key: 'category.text2' },
  { selector: 'text', match: /^Text 3$/i, key: 'category.text3' }
];

window.postmanTranslator.addRules(newRules);
window.postmanI18n.retranslate();
```

### 2. 动态添加翻译

```javascript
// 在控制台临时测试翻译
window.postmanI18n.addRule({
  selector: 'text',
  match: /^Test Text$/i,
  key: 'test.text'
});
window.postmanI18n.retranslate();
```

### 3. 监听语言变化

```javascript
window.addEventListener('i18n:locale-changed', (event) => {
  console.log('语言已切换为:', event.detail.locale);
  // 执行自定义操作
});
```

---

## 提交贡献

完成翻译后：

1. **测试翻译**
   ```bash
   npm run translate:check
   npm run build
   ```

2. **提交代码**
   ```bash
   git add src/locales/ src/content/translator.js
   git commit -m "feat: 添加XXX翻译"
   ```

3. **创建 Pull Request**
   - 说明添加了哪些翻译
   - 附上截图（如果可能）

---

## 🔗 相关资源

- [翻译指南](TRANSLATION_GUIDE.md)
- [API 文档](API.md)
- [项目结构](../PROJECT_STRUCTURE.md)

---

## ❓ 常见问题

**Q: 如何找到 Postman 页面上的所有英文文本？**

A: 可以使用以下脚本：

```javascript
// 在 Postman 页面控制台运行
const walker = document.createTreeWalker(
  document.body,
  NodeFilter.SHOW_TEXT,
  null
);

const texts = new Set();
let node;
while (node = walker.nextNode()) {
  const text = node.textContent.trim();
  if (text && /[a-zA-Z]/.test(text)) {
    texts.add(text);
  }
}

console.log([...texts].sort());
```

**Q: 正则表达式总是不匹配怎么办？**

A: 在控制台测试：

```javascript
const text = document.querySelector('选择器').textContent;
console.log('原文:', text);
console.log('匹配结果:', /^your pattern$/i.test(text));
```

**Q: 如何翻译动态加载的内容？**

A: 插件默认使用 MutationObserver 监听，确保"翻译动态加载的内容"选项已开启。

---

祝你汉化愉快！如有问题，欢迎提交 Issue。

