# 翻译指南

本指南帮助您为 Postman Web i18n 项目贡献翻译。

## 快速开始

### 1. 理解翻译文件结构

翻译文件位于 `src/locales/` 目录：

```
src/locales/
├── zh-CN/          # 简体中文
│   ├── common.json # 通用翻译
│   └── ui.json     # UI 翻译
├── zh-TW/          # 繁体中文
└── en/             # 英文（回退语言）
```

### 2. 翻译文件格式

JSON 格式，使用嵌套对象组织：

```json
{
  "category": {
    "subcategory": {
      "key": "翻译文本"
    }
  }
}
```

### 3. 添加翻译步骤

1. 在对应的 JSON 文件中添加翻译
2. 在 `translator.js` 中添加匹配规则
3. 测试翻译效果
4. 提交 Pull Request

## 翻译分类

### common.json - 通用翻译

包含应用级别的通用翻译：

- `app.*` - 应用相关
- `actions.*` - 操作按钮
- `http.*` - HTTP 相关
- `tabs.*` - 标签页
- `status.*` - 状态信息

**示例：**
```json
{
  "actions": {
    "save": "保存",
    "cancel": "取消",
    "delete": "删除"
  }
}
```

### ui.json - UI 翻译

包含界面元素的翻译：

- `sidebar.*` - 侧边栏
- `collection.*` - 集合相关
- `environment.*` - 环境相关
- `workspace.*` - 工作空间相关
- `buttons.*` - 按钮
- `placeholders.*` - 占位符

**示例：**
```json
{
  "sidebar": {
    "collections": "集合",
    "environments": "环境",
    "history": "历史记录"
  }
}
```

## 添加翻译规则

翻译规则定义在 `src/content/translator.js` 中。

### 规则格式

```javascript
{
  selector: 'text',           // 选择器类型
  match: /^Original Text$/i,  // 匹配规则
  key: 'category.key'        // 翻译键
}
```

### 选择器类型

1. **text** - 匹配文本内容
```javascript
{
  selector: 'text',
  match: /^Save$/i,
  key: 'actions.save'
}
```

2. **placeholder** - 匹配 placeholder 属性
```javascript
{
  selector: 'placeholder',
  match: /Enter URL/i,
  key: 'placeholders.enter_url'
}
```

3. **title** - 匹配 title 属性
```javascript
{
  selector: 'title',
  match: /Click to save/i,
  key: 'tooltips.save'
}
```

4. **aria-label** - 匹配 aria-label 属性
```javascript
{
  selector: 'aria-label',
  match: /Close dialog/i,
  key: 'aria.close_dialog'
}
```

5. **button** - 匹配按钮文本
```javascript
{
  selector: 'button',
  match: /^Send$/i,
  key: 'actions.send'
}
```

### 正则表达式技巧

1. **精确匹配**
```javascript
match: /^Save$/i  // 只匹配 "Save"
```

2. **包含匹配**
```javascript
match: /Save/i    // 匹配包含 "Save" 的文本
```

3. **可选文本**
```javascript
match: /^Save( All)?$/i  // 匹配 "Save" 或 "Save All"
```

4. **忽略大小写**
```javascript
match: /^save$/i  // i 标志表示忽略大小写
```

## 翻译原则

### 1. 准确性

- 准确传达原文含义
- 使用标准的技术术语
- 避免机器翻译的生硬表达

### 2. 一致性

- 术语翻译保持一致
- 语气和风格统一
- 同一概念不要使用多种翻译

**术语对照表：**

| 英文 | 中文 | 说明 |
|------|------|------|
| Collection | 集合 | 不翻译为"收藏" |
| Environment | 环境 | - |
| Workspace | 工作空间 | - |
| Request | 请求 | - |
| Response | 响应 | 不翻译为"回复" |
| Header | 请求头 | - |
| Body | 请求体 | - |
| Parameter | 参数 | - |
| Authorization | 授权 | - |
| Variable | 变量 | - |

### 3. 简洁性

- 保持翻译简洁
- 考虑界面空间限制
- 避免过长的翻译

**示例：**
```json
// 好的翻译
"send": "发送"
"save_as": "另存为"

// 避免冗长
"send": "发送请求"  // 太长
"save_as": "另存为其他文件"  // 太冗长
```

### 4. 本地化

- 符合目标语言习惯
- 考虑文化差异
- 避免直译

**示例：**
```json
// 符合中文习惯
"no_items": "暂无内容"

// 生硬的直译
"no_items": "没有项目"
```

## 特殊情况处理

### 1. 参数化翻译

支持在翻译中使用参数：

```json
{
  "message": {
    "welcome": "欢迎，{name}！",
    "items_count": "共 {count} 项"
  }
}
```

使用：
```javascript
window.postmanI18n.translate('message.welcome', { name: '张三' });
// 输出: "欢迎，张三！"
```

### 2. 复数形式

目前不支持自动复数，需要根据上下文决定：

```json
{
  "items": "项",
  "items_plural": "项"  // 中文复数相同
}
```

### 3. 专有名词

某些专有名词保持英文：

```json
{
  "http_methods": {
    "GET": "GET",    // 保持英文
    "POST": "POST",
    "PUT": "PUT"
  }
}
```

### 4. 缩写

尽量避免使用缩写，除非是广为人知的：

```json
{
  "url": "URL",     // 常见缩写
  "api": "API",     // 常见缩写
  "okay": "确定"     // 不使用 "OK"
}
```

## 测试翻译

### 1. 本地测试

```bash
# 构建项目
npm run build

# 在浏览器中加载插件
# 访问 Postman Web 测试
```

### 2. 检查翻译完整性

```bash
npm run translate:check
```

### 3. 使用控制台测试

```javascript
// 测试单个翻译
window.postmanI18n.translate('buttons.save');

// 查看所有翻译
window.postmanI18n.getTranslations();

// 切换语言测试
window.postmanI18n.setLocale('zh-CN');
window.postmanI18n.retranslate();
```

## 工作流程

### 完整的翻译流程

1. **找到需要翻译的文本**
   - 在 Postman Web 上找到英文文本
   - 记录准确的英文表达

2. **添加翻译**
   ```json
   // src/locales/zh-CN/ui.json
   {
     "new_category": {
       "new_item": "新翻译"
     }
   }
   ```

3. **添加规则**
   ```javascript
   // src/content/translator.js
   {
     selector: 'text',
     match: /^Original Text$/i,
     key: 'new_category.new_item'
   }
   ```

4. **测试**
   ```bash
   npm run build
   # 在浏览器中测试
   ```

5. **提交**
   ```bash
   git add .
   git commit -m "feat: 添加XX翻译"
   git push
   ```

## 常见问题

### 翻译未生效

1. 检查翻译键是否正确
2. 检查正则表达式是否匹配
3. 清除浏览器缓存重新加载
4. 检查控制台错误信息

### 正则表达式不匹配

```javascript
// 调试技巧：在控制台测试正则
const text = "Save";
const pattern = /^Save$/i;
console.log(pattern.test(text)); // 应该为 true
```

### 翻译文本过长

- 使用更简洁的表达
- 考虑使用缩写（如果合适）
- 向开发团队反馈界面问题

## 贡献者指南

1. Fork 项目
2. 创建翻译分支
3. 添加/修改翻译
4. 测试翻译效果
5. 提交 Pull Request

详见 [贡献指南](../CONTRIBUTING.md)

## 资源

- [项目主页](https://github.com/Ninthless/Postman-Web-i18n)
- [问题反馈](https://github.com/Ninthless/Postman-Web-i18n/issues)
- [Postman 官方文档](https://learning.postman.com/)

## 获取帮助

如有疑问，可以：

- 查看现有的翻译示例
- 在 Issue 中提问
- 参考 API 文档

感谢您为项目贡献翻译！

