/**
 * 导入翻译文件
 * 从导出的格式导入翻译更新
 */

const fs = require('fs-extra');
const path = require('path');

const importDir = path.join(__dirname, '../translations-import');
const localesDir = path.join(__dirname, '../src/locales');

async function importTranslations() {
  console.log('导入翻译文件...\n');

  try {
    // 检查导入目录是否存在
    if (!(await fs.pathExists(importDir))) {
      console.log('导入目录不存在，请创建 translations-import 目录并放入翻译文件');
      return;
    }

    const files = await fs.readdir(importDir);

    for (const file of files) {
      if (!file.endsWith('.json')) continue;

      const lang = path.basename(file, '.json');
      const filePath = path.join(importDir, file);

      console.log(`导入语言: ${lang}`);

      // 读取导入的翻译
      const translations = await fs.readJSON(filePath);

      // 为每个模块写入文件
      for (const moduleName in translations) {
        const moduleData = translations[moduleName];
        const outputPath = path.join(localesDir, lang, `${moduleName}.json`);

        // 确保目录存在
        await fs.ensureDir(path.dirname(outputPath));

        // 写入文件
        await fs.writeJSON(outputPath, moduleData, { spaces: 2 });
        console.log(`  已更新: ${lang}/${moduleName}.json`);
      }
    }

    console.log('\n导入完成！');

  } catch (error) {
    console.error('导入失败:', error);
    process.exit(1);
  }
}

// 执行导入
importTranslations();

