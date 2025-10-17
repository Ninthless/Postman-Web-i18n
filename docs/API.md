# API 文档

本文档介绍 Postman Web i18n 提供的 JavaScript API。

## 概述

插件在 Postman 页面注入了全局对象 `window.postmanI18n`，提供了丰富的 API 供开发者使用。

## 核心 API

### setLocale(locale)

设置当前语言。

**参数：**
- `locale` (string): 语言代码，如 `'zh-CN'`、`'zh-TW'`、`'en'`

**返回值：**
- Promise<void>

**示例：**
```javascript
await window.postmanI18n.setLocale('zh-CN');
```

---

### getLocale()

获取当前语言。

**返回值：**
- string: 当前语言代码

**示例：**
```javascript
const locale = window.postmanI18n.getLocale();
console.log(locale); // 'zh-CN'
```

---

### getSupportedLocales()

获取所有支持的语言。

**返回值：**
- Array<{code: string, name: string}>

**示例：**
```javascript
const locales = window.postmanI18n.getSupportedLocales();
console.log(locales);
// [
//   { code: 'zh-CN', name: '简体中文' },
//   { code: 'zh-TW', name: '繁體中文' },
//   { code: 'en', name: 'English' }
// ]
```

---

### translate(key, params?)

翻译指定的键。

**参数：**
- `key` (string): 翻译键，使用点号分隔，如 `'buttons.save'`
- `params` (object, 可选): 替换参数

**返回值：**
- string: 翻译后的文本

**示例：**
```javascript
// 简单翻译
window.postmanI18n.translate('buttons.save');
// 返回: "保存"

// 带参数的翻译
window.postmanI18n.translate('message.welcome', { name: '用户' });
// 如果翻译为 "欢迎，{name}！"
// 返回: "欢迎，用户！"
```

---

### getTranslations(prefix?)

获取翻译对象。

**参数：**
- `prefix` (string, 可选): 前缀路径，如 `'buttons'`

**返回值：**
- object: 翻译对象

**示例：**
```javascript
// 获取所有翻译
const all = window.postmanI18n.getTranslations();

// 获取特定分类
const buttons = window.postmanI18n.getTranslations('buttons');
console.log(buttons);
// { save: '保存', cancel: '取消', ... }
```

---

### retranslate()

重新翻译整个页面。

**返回值：**
- void

**示例：**
```javascript
window.postmanI18n.retranslate();
```

---

### addRule(rule)

添加自定义翻译规则。

**参数：**
- `rule` (object): 翻译规则对象
  - `selector` (string): 选择器类型 (`'text'`, `'placeholder'`, `'title'`, `'aria-label'`, `'button'`)
  - `match` (RegExp): 匹配正则表达式
  - `key` (string): 翻译键

**返回值：**
- void

**示例：**
```javascript
window.postmanI18n.addRule({
  selector: 'text',
  match: /^Custom Text$/i,
  key: 'custom.text'
});

// 重新翻译以应用新规则
window.postmanI18n.retranslate();
```

## 内部 API

这些 API 主要供内部使用，但也可以在高级场景中使用。

### i18n 对象

底层的 i18n 实例：`window.i18n`

#### i18n.loadModule(moduleName)

加载翻译模块。

**参数：**
- `moduleName` (string): 模块名称

**返回值：**
- Promise<void>

**示例：**
```javascript
await window.i18n.loadModule('custom');
```

---

#### i18n.t(key, params?)

翻译文本（与 `translate` 相同）。

**参数：**
- `key` (string): 翻译键
- `params` (object, 可选): 替换参数

**返回值：**
- string

---

### PageTranslator 对象

页面翻译器实例：`window.postmanTranslator`

#### translator.addRule(rule)

添加翻译规则。

#### translator.addRules(rules)

批量添加翻译规则。

**参数：**
- `rules` (Array<object>): 规则数组

**示例：**
```javascript
window.postmanTranslator.addRules([
  {
    selector: 'text',
    match: /^Text 1$/i,
    key: 'custom.text1'
  },
  {
    selector: 'text',
    match: /^Text 2$/i,
    key: 'custom.text2'
  }
]);
```

---

#### translator.startObserving()

开始监听 DOM 变化。

---

#### translator.stopObserving()

停止监听 DOM 变化。

## 事件

### i18n:locale-changed

语言切换事件。

**示例：**
```javascript
window.addEventListener('i18n:locale-changed', (event) => {
  console.log('语言已切换为:', event.detail.locale);
});
```

## Chrome Storage API

插件使用 Chrome Storage API 存储设置。

### 存储的数据

```javascript
{
  locale: 'zh-CN',              // 当前语言
  autoTranslate: true,          // 自动翻译
  translateDynamic: true,       // 翻译动态内容
  debugMode: false,             // 调试模式
  customRules: []               // 自定义规则
}
```

### 读取设置

```javascript
chrome.storage.sync.get(['locale'], (result) => {
  console.log('当前语言:', result.locale);
});
```

### 保存设置

```javascript
chrome.storage.sync.set({ locale: 'zh-CN' }, () => {
  console.log('语言已保存');
});
```

## 消息传递

### 发送消息到 Background

```javascript
chrome.runtime.sendMessage({
  type: 'GET_LOCALE'
}, (response) => {
  console.log('语言:', response.locale);
});
```

### 接收消息（Content Script）

```javascript
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'CHANGE_LOCALE') {
    window.postmanI18n.setLocale(request.locale);
  }
});
```

## 类型定义

### TranslationRule

```typescript
interface TranslationRule {
  selector: 'text' | 'placeholder' | 'title' | 'aria-label' | 'button';
  match: RegExp;
  key: string;
}
```

### Locale

```typescript
interface Locale {
  code: string;
  name: string;
}
```

### TranslationData

```typescript
interface TranslationData {
  [key: string]: string | TranslationData;
}
```

## 最佳实践

1. **使用 translate 方法获取翻译**
   ```javascript
   const text = window.postmanI18n.translate('key');
   ```

2. **监听语言变化**
   ```javascript
   window.addEventListener('i18n:locale-changed', (event) => {
     // 更新你的组件
   });
   ```

3. **添加规则后重新翻译**
   ```javascript
   window.postmanI18n.addRule(rule);
   window.postmanI18n.retranslate();
   ```

4. **批量操作使用内部 API**
   ```javascript
   window.postmanTranslator.addRules(multipleRules);
   window.postmanI18n.retranslate();
   ```

## 示例

### 完整的自定义翻译流程

```javascript
// 1. 添加翻译规则
window.postmanI18n.addRule({
  selector: 'text',
  match: /^My Custom Button$/i,
  key: 'custom.my_button'
});

// 2. 确保翻译文件中有对应的键值
// custom.my_button = "我的自定义按钮"

// 3. 重新翻译页面
window.postmanI18n.retranslate();

// 4. 监听语言变化
window.addEventListener('i18n:locale-changed', () => {
  console.log('语言已更新');
});
```

### 动态切换语言并获取翻译

```javascript
async function switchAndGetTranslation(locale, key) {
  await window.postmanI18n.setLocale(locale);
  return window.postmanI18n.translate(key);
}

// 使用
switchAndGetTranslation('zh-CN', 'buttons.save')
  .then(text => console.log(text)); // "保存"
```

