/**
 * 图标生成脚本
 * 将源图标调整为多个尺寸
 */

const fs = require('fs-extra');
const path = require('path');

const sourceIcon = path.join(__dirname, '../icons/icon.png');
const iconsDir = path.join(__dirname, '../dist/icons');

async function generateIcons() {
  console.log('开始生成图标...\n');

  try {
    // 检查源文件是否存在
    if (!await fs.pathExists(sourceIcon)) {
      console.error('源图标文件不存在:', sourceIcon);
      console.log('\n请将图标文件放在 dist/icons/ 目录下');
      return;
    }

    // 尝试使用 sharp 库（需要安装）
    let sharp;
    try {
      sharp = require('sharp');
    } catch (e) {
      console.log('未找到 sharp 库，将复制原图标作为临时方案');
      console.log('要获得最佳效果，请安装 sharp: npm install --save-dev sharp\n');
      
      // 临时方案：直接复制图标
      await copyIconsTemporary();
      return;
    }

    // 使用 sharp 调整尺寸
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
      
      console.log(`已生成 icon${size}.png`);
    }

    console.log('\n图标生成完成！');

  } catch (error) {
    console.error('生成图标失败:', error.message);
    console.log('\n尝试使用临时方案...');
    await copyIconsTemporary();
  }
}

/**
 * 临时方案：复制原图标
 */
async function copyIconsTemporary() {
  const sizes = [16, 48, 128];
  
  for (const size of sizes) {
    const outputPath = path.join(iconsDir, `icon${size}.png`);
    await fs.copy(sourceIcon, outputPath);
    console.log(`已复制 icon${size}.png (临时方案)`);
  }
  
  console.log('\n图标已复制完成（临时方案）');
  console.log('注意：图标尺寸未调整，建议安装 sharp 以获得最佳效果');
  console.log('   运行: npm install --save-dev sharp');
  console.log('   然后重新运行: node scripts/generateIcons.js');
}

// 执行
generateIcons();

