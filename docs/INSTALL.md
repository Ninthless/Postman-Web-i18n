# 安装指南

本指南将帮助您在浏览器中安装和使用 Postman Web i18n 插件。

## 系统要求

- **浏览器**：Chrome 88+ 或 Edge 88+
- **操作系统**：Windows、macOS、Linux
- **网络**：无需联网（插件完全离线运行）

## 安装方式

### 方式一：从 Chrome Web Store 安装（推荐）

_即将上线_

1. 访问 Chrome Web Store
2. 搜索 "Postman Web i18n"
3. 点击"添加至 Chrome"
4. 确认安装

### 方式二：从发布版本安装

1. 访问 [Releases 页面](https://github.com/yourusername/postman-web-i18n/releases)
2. 下载最新版本的 `.zip` 文件
3. 解压到本地目录
4. 在浏览器中加载（见下文"手动加载插件"）

### 方式三：从源码构建安装（开发者）

#### 前置要求

- Node.js 14+
- npm 或 yarn

#### 步骤

1. **克隆仓库**

```bash
git clone https://github.com/yourusername/postman-web-i18n.git
cd postman-web-i18n
```

2. **安装依赖**

```bash
npm install
```

3. **构建项目**

```bash
npm run build
```

构建完成后，`dist` 目录将包含所有插件文件。

4. **加载插件**

见下文"手动加载插件"部分。

## 手动加载插件

### Chrome 浏览器

1. 打开 Chrome 浏览器
2. 在地址栏输入 `chrome://extensions/` 并回车
3. 打开右上角的"开发者模式"开关
4. 点击"加载已解压的扩展程序"
5. 选择项目的 `dist` 目录（如果从源码构建）或解压后的目录
6. 插件安装完成！

### Edge 浏览器

1. 打开 Edge 浏览器
2. 在地址栏输入 `edge://extensions/` 并回车
3. 打开左下角的"开发人员模式"开关
4. 点击"加载解压缩的扩展"
5. 选择项目的 `dist` 目录（如果从源码构建）或解压后的目录
6. 插件安装完成！

## 验证安装

1. 安装后，浏览器工具栏会出现插件图标
2. 访问 [Postman Web](https://web.postman.co/)
3. 页面应自动翻译为中文（默认设置）
4. 点击插件图标，应能看到弹出窗口

## 配置插件

### 首次使用

1. 安装完成后会自动打开设置页面
2. 选择您偏好的语言（简体中文、繁体中文、英文）
3. 配置其他选项（可选）
4. 访问 Postman Web 开始使用

### 更改设置

**方法 1：通过弹出窗口**
- 点击插件图标
- 在弹出窗口中调整设置

**方法 2：通过设置页面**
- 右键点击插件图标
- 选择"选项"
- 在设置页面进行详细配置

## 常见安装问题

### 问题 1：插件无法加载

**错误信息**：`无效的扩展程序`

**解决方法**：
1. 确保选择的是 `dist` 目录，而不是项目根目录
2. 确保已运行 `npm run build`
3. 检查 `manifest.json` 是否在所选目录中

### 问题 2：插件图标不显示

**解决方法**：
1. 刷新扩展程序页面
2. 禁用后重新启用插件
3. 重启浏览器

### 问题 3：构建失败

**错误信息**：`npm ERR!` 或模块未找到

**解决方法**：
1. 确保 Node.js 版本 >= 14
2. 删除 `node_modules` 和 `package-lock.json`
3. 重新运行 `npm install`
4. 再次运行 `npm run build`

### 问题 4：插件在 Postman 上不工作

**解决方法**：
1. 确保访问的是 `https://web.postman.co/` 或 `https://*.postman.com/`
2. 刷新 Postman 页面
3. 打开浏览器控制台查看错误信息
4. 尝试点击插件图标的"重新翻译页面"按钮

### 问题 5：翻译不完整

**这是正常情况**，可能原因：
- 某些文本尚未添加翻译
- Postman 更新了界面文本
- 需要刷新页面

**解决方法**：
1. 点击"重新翻译页面"
2. 刷新 Postman 页面
3. 查看项目 Issues 了解已知问题
4. 向项目报告缺失的翻译

## 更新插件

### 从 Web Store 更新

如果从 Chrome Web Store 安装，插件会自动更新。

### 手动更新

1. 下载新版本
2. 解压到原目录（覆盖旧文件）
3. 在扩展程序页面点击"重新加载"图标
4. 刷新 Postman 页面

### 从源码更新

```bash
# 拉取最新代码
git pull origin main

# 安装新依赖（如果有）
npm install

# 重新构建
npm run build
```

然后在扩展程序页面重新加载插件。

## 卸载插件

### Chrome/Edge

1. 打开 `chrome://extensions/` 或 `edge://extensions/`
2. 找到 "Postman Web i18n"
3. 点击"移除"按钮
4. 确认卸载

### 清除数据

卸载后，插件的设置数据会自动删除。如需手动清除：

1. 在卸载前，打开浏览器开发者工具
2. 进入 Application > Storage > Chrome Storage
3. 删除与插件相关的数据

## 开发模式安装

如果您要参与开发：

```bash
# 克隆仓库
git clone https://github.com/yourusername/postman-web-i18n.git
cd postman-web-i18n

# 安装依赖
npm install

# 启动开发模式（自动重新构建）
npm run dev
```

在浏览器中加载 `dist` 目录后，每次文件更改都会自动重新构建。只需在扩展程序页面重新加载插件即可。

## 权限说明

插件需要以下权限：

- **storage** - 存储用户设置（语言偏好等）
- **访问 postman.com** - 在 Postman 网站注入翻译脚本

**隐私承诺**：
- 不收集任何个人信息
- 不发送任何网络请求
- 所有数据仅存储在本地
- 完全开源，代码可审查

## 下一步

- 查看 [使用指南](USAGE.md) 了解如何使用
- 查看 [翻译指南](TRANSLATION_GUIDE.md) 了解如何贡献翻译
- 访问 [API 文档](API.md) 了解开发者接口

## 获取帮助

如果遇到问题：

1. 查看 [常见问题](../README.md#常见问题)
2. 搜索 [Issues](https://github.com/yourusername/postman-web-i18n/issues)
3. 创建新的 Issue 寻求帮助

---

安装愉快！如有问题随时联系我们。

