/**
 * 导出翻译文件
 * 将翻译文件导出为易于编辑的格式
 */

const fs = require('fs-extra');
const path = require('path');

const localesDir = path.join(__dirname, '../src/locales');
const outputDir = path.join(__dirname, '../translations-export');

async function exportTranslations() {
  console.log('导出翻译文件...\n');

  try {
    // 清空输出目录
    await fs.emptyDir(outputDir);

    // 获取所有语言
    const languages = await fs.readdir(localesDir);

    for (const lang of languages) {
      const langDir = path.join(localesDir, lang);
      const stat = await fs.stat(langDir);
      
      if (!stat.isDirectory()) continue;

      console.log(`处理语言: ${lang}`);

      // 读取所有翻译文件
      const files = await fs.readdir(langDir);
      const allTranslations = {};

      for (const file of files) {
        if (!file.endsWith('.json')) continue;
        
        const filePath = path.join(langDir, file);
        const data = await fs.readJSON(filePath);
        const moduleName = path.basename(file, '.json');
        
        allTranslations[moduleName] = data;
      }

      // 导出为扁平化的CSV格式（便于在Excel中编辑）
      const csvContent = generateCSV(allTranslations, lang);
      const csvPath = path.join(outputDir, `${lang}.csv`);
      await fs.writeFile(csvPath, csvContent, 'utf-8');
      console.log(`  已导出: ${lang}.csv`);

      // 同时导出JSON格式
      const jsonPath = path.join(outputDir, `${lang}.json`);
      await fs.writeJSON(jsonPath, allTranslations, { spaces: 2 });
      console.log(`  已导出: ${lang}.json`);
    }

    console.log(`\n导出完成！文件保存在: ${outputDir}`);

  } catch (error) {
    console.error('导出失败:', error);
    process.exit(1);
  }
}

/**
 * 生成CSV内容
 */
function generateCSV(translations, lang) {
  const rows = [['Key', 'Value', 'Module']];

  function flattenObject(obj, prefix = '', module = '') {
    for (const key in obj) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        flattenObject(obj[key], fullKey, module || key);
      } else {
        const value = String(obj[key]).replace(/"/g, '""'); // 转义引号
        rows.push([fullKey, `"${value}"`, module]);
      }
    }
  }

  flattenObject(translations);

  return rows.map(row => row.join(',')).join('\n');
}

// 执行导出
exportTranslations();

