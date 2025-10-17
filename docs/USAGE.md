# 使用指南

本文档详细介绍如何使用 Postman Web i18n 浏览器插件。

## 安装后首次使用

1. 安装插件后会自动打开设置页面
2. 选择您偏好的语言（默认为简体中文）
3. 访问 [Postman Web](https://web.postman.co/)
4. 页面会自动翻译为您选择的语言

## 基本功能

### 切换语言

**方法 1：通过弹出窗口**
1. 点击浏览器工具栏中的插件图标
2. 在下拉菜单中选择语言
3. 页面会立即切换到新语言

**方法 2：通过设置页面**
1. 右键点击插件图标，选择"选项"
2. 在"基本设置"标签页选择语言
3. 设置会自动保存并应用

**方法 3：通过控制台**
```javascript
// 切换到简体中文
window.postmanI18n.setLocale('zh-CN');

// 切换到繁体中文
window.postmanI18n.setLocale('zh-TW');

// 切换到英文
window.postmanI18n.setLocale('en');
```

### 重新翻译页面

如果某些内容没有正确翻译：

1. 点击插件图标
2. 点击"重新翻译页面"按钮

或使用控制台：
```javascript
window.postmanI18n.retranslate();
```

### 查看翻译状态

在控制台查看当前设置：
```javascript
// 获取当前语言
window.postmanI18n.getLocale();

// 获取所有支持的语言
window.postmanI18n.getSupportedLocales();

// 获取所有翻译
window.postmanI18n.getTranslations();

// 获取特定分类的翻译
window.postmanI18n.getTranslations('buttons');
```

## 高级功能

### 自定义翻译规则

在设置页面的"自定义规则"标签页可以添加自定义翻译规则。

规则格式：
```json
{
  "selector": "text",
  "match": "^Original Text$",
  "key": "translation.key"
}
```

参数说明：
- `selector`: 选择器类型
  - `text`: 匹配文本内容
  - `placeholder`: 匹配 placeholder 属性
  - `title`: 匹配 title 属性
  - `aria-label`: 匹配 aria-label 属性
  - `button`: 匹配按钮文本
- `match`: 正则表达式（字符串格式）
- `key`: 翻译文件中对应的键

示例：
```json
{
  "selector": "text",
  "match": "^My Custom Text$",
  "key": "custom.my_text"
}
```

### 导入/导出翻译

**导出翻译**
1. 进入设置页面的"翻译管理"标签
2. 点击"导出翻译"按钮
3. 翻译文件会下载为 JSON 格式

**导入翻译**
1. 准备 JSON 格式的翻译文件
2. 在"翻译管理"标签点击"导入翻译"
3. 选择文件并确认

### 调试模式

开启调试模式可以在控制台看到详细的翻译日志：

1. 进入设置页面
2. 在"基本设置"中勾选"调试模式"
3. 打开浏览器控制台
4. 查看以 `[Postman i18n]` 开头的日志

## 控制台 API

插件在 Postman 页面提供了全局 API：

### 翻译相关

```javascript
// 获取翻译文本
window.postmanI18n.translate('buttons.save');
// 输出: "保存"

// 带参数的翻译
window.postmanI18n.translate('message.hello', { name: '张三' });
// 如果翻译为 "你好，{name}！"
// 输出: "你好，张三！"
```

### 语言管理

```javascript
// 获取当前语言
window.postmanI18n.getLocale();

// 设置语言
window.postmanI18n.setLocale('zh-CN');

// 获取支持的语言
window.postmanI18n.getSupportedLocales();
```

### 翻译规则

```javascript
// 添加单个规则
window.postmanI18n.addRule({
  selector: 'text',
  match: /^Custom$/i,
  key: 'custom.key'
});

// 重新翻译
window.postmanI18n.retranslate();
```

## 常见问题

### 某些文本没有翻译

**原因：**
- 该文本还未添加翻译
- 翻译规则未匹配到该文本

**解决方法：**
1. 检查是否已有该文本的翻译
2. 添加自定义翻译规则
3. 向项目提交翻译贡献

### 翻译后布局错乱

**原因：**
- 翻译文本过长导致布局溢出

**解决方法：**
- 使用更简洁的翻译
- 向项目反馈问题

### 动态加载的内容未翻译

**原因：**
- 未开启"翻译动态加载的内容"

**解决方法：**
1. 进入设置页面
2. 确保"翻译动态加载的内容"已勾选
3. 如果问题仍存在，尝试重新翻译页面

### 切换语言后需要刷新页面

这是正常行为。某些情况下需要刷新页面才能完全应用新语言。

## 性能优化

- 插件使用了高效的 MutationObserver 监听 DOM 变化
- 翻译结果会缓存，避免重复翻译
- 已翻译的元素会被标记，避免重复处理

## 隐私说明

本插件：
- 完全离线运行
- 不收集任何用户数据
- 不发送任何网络请求
- 仅在 Postman 网站生效
- 使用浏览器本地存储保存设置

## 技巧和窍门

1. **快速切换语言**：为插件图标设置快捷键（在浏览器扩展设置中）

2. **批量翻译测试**：使用控制台 API 快速测试翻译效果

3. **贡献翻译**：发现翻译问题？在 GitHub 提交 Issue 或 PR

4. **自定义翻译**：对于特定需求，使用自定义规则功能

## 获取帮助

- 查看 [README](../README.md)
- 查看 [常见问题](FAQ.md)
- 提交 [Issue](https://github.com/yourusername/postman-web-i18n/issues)

