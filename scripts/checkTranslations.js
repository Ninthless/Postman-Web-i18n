/**
 * 检查翻译文件
 * 检查翻译文件的完整性和一致性
 */

const fs = require('fs-extra');
const path = require('path');

const localesDir = path.join(__dirname, '../src/locales');

async function checkTranslations() {
  console.log('检查翻译文件...\n');

  try {
    // 获取所有语言目录
    const languages = await fs.readdir(localesDir);
    
    const translations = {};
    const allKeys = new Set();

    // 加载所有翻译文件
    for (const lang of languages) {
      const langDir = path.join(localesDir, lang);
      const stat = await fs.stat(langDir);
      
      if (!stat.isDirectory()) continue;

      translations[lang] = {};
      
      const files = await fs.readdir(langDir);
      
      for (const file of files) {
        if (!file.endsWith('.json')) continue;
        
        const filePath = path.join(langDir, file);
        const data = await fs.readJSON(filePath);
        const moduleName = path.basename(file, '.json');
        
        translations[lang][moduleName] = data;
        
        // 收集所有键
        collectKeys(data, moduleName, allKeys);
      }
    }

    // 检查每种语言的翻译完整性
    let hasIssues = false;

    for (const lang of Object.keys(translations)) {
      console.log(`\n语言: ${lang}`);
      
      const missingKeys = [];
      
      for (const key of allKeys) {
        if (!hasKey(translations[lang], key)) {
          missingKeys.push(key);
        }
      }

      if (missingKeys.length > 0) {
        hasIssues = true;
        console.log(`  缺失 ${missingKeys.length} 个翻译:`);
        missingKeys.slice(0, 10).forEach(key => {
          console.log(`     - ${key}`);
        });
        if (missingKeys.length > 10) {
          console.log(`     ... 还有 ${missingKeys.length - 10} 个`);
        }
      } else {
        console.log(`  翻译完整`);
      }

      // 统计翻译数量
      const totalKeys = countKeys(translations[lang]);
      console.log(`  总计: ${totalKeys} 个翻译`);
    }

    // 检查重复的键
    console.log('\n检查重复键...');
    const duplicates = findDuplicateValues(translations);
    
    if (duplicates.length > 0) {
      hasIssues = true;
      console.log(`  发现 ${duplicates.length} 组重复值:`);
      duplicates.slice(0, 5).forEach(({ value, keys }) => {
        console.log(`     值: "${value}"`);
        console.log(`     键: ${keys.join(', ')}`);
      });
    } else {
      console.log('  未发现重复');
    }

    console.log('\n' + '='.repeat(50));
    
    if (hasIssues) {
      console.log('检查完成，发现一些问题需要处理');
      process.exit(1);
    } else {
      console.log('检查完成，翻译文件良好！');
    }

  } catch (error) {
    console.error('检查失败:', error);
    process.exit(1);
  }
}

/**
 * 收集所有键
 */
function collectKeys(obj, prefix, keysSet) {
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      collectKeys(obj[key], fullKey, keysSet);
    } else {
      keysSet.add(fullKey);
    }
  }
}

/**
 * 检查是否有键
 */
function hasKey(obj, keyPath) {
  const keys = keyPath.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return false;
    }
  }
  
  return current !== undefined;
}

/**
 * 统计键数量
 */
function countKeys(obj) {
  let count = 0;
  
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      count += countKeys(obj[key]);
    } else {
      count++;
    }
  }
  
  return count;
}

/**
 * 查找重复的值
 */
function findDuplicateValues(translations) {
  const valueMap = new Map();
  
  for (const lang in translations) {
    collectValues(translations[lang], '', valueMap);
  }
  
  const duplicates = [];
  
  for (const [value, keys] of valueMap.entries()) {
    if (keys.length > 1 && value.length > 3) {
      duplicates.push({ value, keys });
    }
  }
  
  return duplicates;
}

/**
 * 收集所有值
 */
function collectValues(obj, prefix, valueMap) {
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      collectValues(obj[key], fullKey, valueMap);
    } else if (typeof obj[key] === 'string') {
      const value = obj[key];
      if (!valueMap.has(value)) {
        valueMap.set(value, []);
      }
      valueMap.get(value).push(fullKey);
    }
  }
}

// 执行检查
checkTranslations();

