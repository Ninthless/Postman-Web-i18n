# 图标文件说明

本目录应包含浏览器扩展所需的图标文件。

## 所需图标

请准备以下尺寸的图标：

- `icon16.png` - 16x16 像素
- `icon48.png` - 48x48 像素  
- `icon128.png` - 128x128 像素

## 设计建议

### 图标主题

建议图标包含以下元素：
- 地球仪符号（代表国际化）
- 文字/翻译符号
- 使用 Postman 的橙色调（#FF6C37）或紫色渐变

### 设计规范

1. **简洁清晰**
   - 在小尺寸下也要清晰可辨
   - 避免过多细节

2. **色彩**
   - 使用品牌色或对比色
   - 考虑浅色/深色主题兼容性

3. **格式**
   - PNG 格式，支持透明背景
   - 72 DPI
   - 24 位色深 + Alpha 通道

### 在线工具

可以使用以下工具创建图标：

- [Figma](https://www.figma.com/) - 专业设计工具
- [Canva](https://www.canva.com/) - 在线图形设计
- [Favicon.io](https://favicon.io/) - 快速生成图标
- [IconKitchen](https://icon.kitchen/) - 图标生成器

## 临时方案

在正式图标准备好之前，可以使用以下方法：

### 方法 1：使用占位图标

使用纯色占位图标（已在构建脚本中生成提示文件）。

### 方法 2：使用 SVG 转换

如果有 SVG 文件，可以使用以下工具转换：

```bash
# 使用 ImageMagick（需安装）
convert icon.svg -resize 16x16 icon16.png
convert icon.svg -resize 48x48 icon48.png
convert icon.svg -resize 128x128 icon128.png
```

### 方法 3：在线转换

访问 [CloudConvert](https://cloudconvert.com/) 转换图标格式和尺寸。

## 示例 SVG 模板

如果需要快速创建，可以使用以下 SVG 模板：

```svg
<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- 背景圆形 -->
  <circle cx="64" cy="64" r="60" fill="url(#grad)" />
  
  <!-- 地球仪图标 -->
  <circle cx="64" cy="64" r="35" fill="none" stroke="white" stroke-width="3" />
  <path d="M 64 29 Q 64 64 64 99" stroke="white" stroke-width="2" fill="none" />
  <path d="M 29 64 Q 64 64 99 64" stroke="white" stroke-width="2" fill="none" />
  
  <!-- 文字符号 -->
  <text x="64" y="74" font-family="Arial" font-size="24" fill="white" text-anchor="middle" font-weight="bold">中</text>
</svg>
```

将此保存为 `icon.svg`，然后转换为所需尺寸。

## 使用自己的图标

1. 将图标文件放入本目录
2. 确保文件名正确：
   - `icon16.png`
   - `icon48.png`
   - `icon128.png`
3. 重新构建项目：
   ```bash
   npm run build
   ```
4. 重新加载浏览器扩展

## 版权注意

- 确保使用的图标有适当的许可
- 如使用第三方图标，请注明出处
- 建议使用开源图标库或自行设计

## 开源图标资源

- [Material Icons](https://fonts.google.com/icons)
- [Font Awesome](https://fontawesome.com/)
- [Heroicons](https://heroicons.com/)
- [Feather Icons](https://feathericons.com/)

---

如有任何问题，请在项目 Issues 中反馈。

