/**
 * 构建脚本
 * 将源文件复制到dist目录
 */

const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');

const isWatch = process.argv.includes('--watch');

const srcDir = path.join(__dirname, '../src');
const distDir = path.join(__dirname, '../dist');
const localesDir = path.join(srcDir, 'locales');
const manifestPath = path.join(__dirname, '../manifest.json');
const localesManifestDir = path.join(__dirname, '../_locales');

async function build() {
  try {
    console.log('开始构建...');

    // 清空dist目录
    await fs.emptyDir(distDir);

    // 复制manifest.json
    await fs.copy(manifestPath, path.join(distDir, 'manifest.json'));
    console.log('已复制 manifest.json');

    // 复制_locales目录（扩展元数据）
    if (await fs.pathExists(localesManifestDir)) {
      await fs.copy(localesManifestDir, path.join(distDir, '_locales'));
      console.log('已复制 _locales');
    }

    // 复制翻译文件到locales目录
    if (await fs.pathExists(localesDir)) {
      await fs.copy(localesDir, path.join(distDir, 'locales'));
      console.log('已复制翻译文件');
    }

    // 复制content scripts
    const contentSrcDir = path.join(srcDir, 'content');
    const contentDistDir = path.join(distDir, 'content');
    if (await fs.pathExists(contentSrcDir)) {
      await fs.copy(contentSrcDir, contentDistDir);
      console.log('已复制 content scripts');
    }

    // 复制background scripts
    const backgroundSrcDir = path.join(srcDir, 'background');
    const backgroundDistDir = path.join(distDir, 'background');
    if (await fs.pathExists(backgroundSrcDir)) {
      await fs.copy(backgroundSrcDir, backgroundDistDir);
      console.log('已复制 background scripts');
    }

    // 复制popup
    const popupSrcDir = path.join(srcDir, 'popup');
    const popupDistDir = path.join(distDir, 'popup');
    if (await fs.pathExists(popupSrcDir)) {
      await fs.copy(popupSrcDir, popupDistDir);
      console.log('已复制 popup');
    }

    // 复制options
    const optionsSrcDir = path.join(srcDir, 'options');
    const optionsDistDir = path.join(distDir, 'options');
    if (await fs.pathExists(optionsSrcDir)) {
      await fs.copy(optionsSrcDir, optionsDistDir);
      console.log('已复制 options');
    }

    // 创建icons目录（如果不存在）
    const iconsDistDir = path.join(distDir, 'icons');
    await fs.ensureDir(iconsDistDir);
    
    // 创建占位图标
    await createPlaceholderIcons(iconsDistDir);
    console.log('已创建图标');

    console.log('构建完成！');

    if (!isWatch) {
      // 创建压缩包
      await createZip();
    }
  } catch (error) {
    console.error('构建失败:', error);
    process.exit(1);
  }
}

/**
 * 生成图标
 */
async function createPlaceholderIcons(iconsDir) {
  const sourceIcon = path.join(__dirname, '../icons/icon.png');
  
  // 检查源图标是否存在
  if (!(await fs.pathExists(sourceIcon))) {
    console.log('未找到源图标，跳过图标生成');
    return;
  }

  // 尝试使用 sharp 库
  let sharp;
  try {
    sharp = require('sharp');
    console.log('使用 sharp 生成图标...');
    
    const sizes = [16, 48, 128];
    for (const size of sizes) {
      const outputPath = path.join(iconsDir, `icon${size}.png`);
      await sharp(sourceIcon)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toFile(outputPath);
    }
  } catch (e) {
    // 如果没有 sharp，直接复制图标
    console.log('使用复制方案生成图标...');
    const sizes = [16, 48, 128];
    for (const size of sizes) {
      const outputPath = path.join(iconsDir, `icon${size}.png`);
      await fs.copy(sourceIcon, outputPath);
    }
  }
}

/**
 * 创建ZIP压缩包
 */
async function createZip() {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(path.join(__dirname, '../postman-web-i18n.zip'));
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log(`已创建压缩包 (${(archive.pointer() / 1024).toFixed(2)} KB)`);
      resolve();
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(output);
    archive.directory(distDir, false);
    archive.finalize();
  });
}

/**
 * 监听文件变化
 */
async function watch() {
  const chokidar = require('chokidar');
  
  console.log('监听文件变化中...');

  const watcher = chokidar.watch([srcDir, manifestPath, localesManifestDir], {
    ignored: /(^|[\/\\])\../,
    persistent: true
  });

  watcher.on('change', async (filePath) => {
    console.log(`\n检测到文件变化: ${filePath}`);
    await build();
  });

  // 首次构建
  await build();
}

// 执行构建
if (isWatch) {
  watch();
} else {
  build();
}

