/**
 * 发布辅助脚本
 * 帮助简化版本发布流程
 */

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function error(message) {
  log(`错误: ${message}`, 'red');
  process.exit(1);
}

function success(message) {
  log(`成功: ${message}`, 'green');
}

function warning(message) {
  log(`警告: ${message}`, 'yellow');
}

function info(message) {
  log(`信息: ${message}`, 'blue');
}

/**
 * 执行命令
 */
function exec(command, silent = false) {
  try {
    const output = execSync(command, { encoding: 'utf-8' });
    if (!silent) {
      console.log(output);
    }
    return output;
  } catch (err) {
    error(`命令执行失败: ${command}\n${err.message}`);
  }
}

/**
 * 检查版本号格式
 */
function isValidVersion(version) {
  return /^\d+\.\d+\.\d+$/.test(version);
}

/**
 * 比较版本号
 */
function compareVersions(v1, v2) {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  
  for (let i = 0; i < 3; i++) {
    if (parts1[i] > parts2[i]) return 1;
    if (parts1[i] < parts2[i]) return -1;
  }
  return 0;
}

/**
 * 获取当前版本
 */
function getCurrentVersion() {
  const packageJson = require('../package.json');
  return packageJson.version;
}

/**
 * 检查工作目录状态
 */
function checkWorkingDirectory() {
  info('检查工作目录状态...');
  
  const status = exec('git status --porcelain', true);
  
  if (status.trim()) {
    warning('工作目录有未提交的更改');
    console.log(status);
    return false;
  }
  
  success('工作目录干净');
  return true;
}

/**
 * 检查当前分支
 */
function checkBranch() {
  info('检查当前分支...');
  
  const branch = exec('git branch --show-current', true).trim();
  
  if (branch !== 'main') {
    warning(`当前在 ${branch} 分支，建议在 main 分支发布`);
    return false;
  }
  
  success('当前在 main 分支');
  return true;
}

/**
 * 更新版本号
 */
async function updateVersion(newVersion) {
  info(`更新版本号到 ${newVersion}...`);
  
  // 更新 package.json
  const packageJsonPath = path.join(__dirname, '../package.json');
  const packageJson = await fs.readJSON(packageJsonPath);
  packageJson.version = newVersion;
  await fs.writeJSON(packageJsonPath, packageJson, { spaces: 2 });
  
  // 更新 manifest.json
  const manifestPath = path.join(__dirname, '../manifest.json');
  const manifest = await fs.readJSON(manifestPath);
  manifest.version = newVersion;
  await fs.writeJSON(manifestPath, manifest, { spaces: 2 });
  
  success('版本号已更新');
}

/**
 * 运行测试
 */
function runTests() {
  info('运行构建测试...');
  
  try {
    exec('npm run build');
    success('构建测试通过');
    return true;
  } catch (err) {
    error('构建测试失败');
    return false;
  }
}

/**
 * 主流程
 */
async function main() {
  console.log('\n');
  log('='.repeat(50), 'bright');
  log('Postman Web i18n 发布助手', 'bright');
  log('='.repeat(50), 'bright');
  console.log('\n');
  
  // 获取命令行参数
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    log('使用方法:', 'yellow');
    console.log('  npm run release <版本号>');
    console.log('  npm run release patch   # 修订版本 (1.0.0 -> 1.0.1)');
    console.log('  npm run release minor   # 次版本 (1.0.0 -> 1.1.0)');
    console.log('  npm run release major   # 主版本 (1.0.0 -> 2.0.0)');
    console.log('\n示例:');
    console.log('  npm run release 1.2.3');
    console.log('  npm run release patch');
    process.exit(0);
  }
  
  // 获取当前版本
  const currentVersion = getCurrentVersion();
  info(`当前版本: ${currentVersion}`);
  
  // 计算新版本
  let newVersion;
  const versionArg = args[0];
  
  if (versionArg === 'patch' || versionArg === 'minor' || versionArg === 'major') {
    const parts = currentVersion.split('.').map(Number);
    
    if (versionArg === 'patch') {
      parts[2]++;
    } else if (versionArg === 'minor') {
      parts[1]++;
      parts[2] = 0;
    } else if (versionArg === 'major') {
      parts[0]++;
      parts[1] = 0;
      parts[2] = 0;
    }
    
    newVersion = parts.join('.');
  } else {
    newVersion = versionArg;
  }
  
  // 验证版本号
  if (!isValidVersion(newVersion)) {
    error('无效的版本号格式，应为: x.y.z');
  }
  
  // 检查版本号是否增加
  if (compareVersions(newVersion, currentVersion) <= 0) {
    error(`新版本号 (${newVersion}) 必须大于当前版本 (${currentVersion})`);
  }
  
  info(`新版本: ${newVersion}`);
  
  // 执行检查
  console.log('\n');
  log('执行发布前检查...', 'bright');
  console.log('\n');
  
  const isClean = checkWorkingDirectory();
  const isMainBranch = checkBranch();
  
  if (!isClean) {
    error('请先提交或暂存所有更改');
  }
  
  if (!isMainBranch) {
    warning('建议切换到 main 分支发布');
    // 继续执行，不强制退出
  }
  
  // 更新版本号
  console.log('\n');
  await updateVersion(newVersion);
  
  // 运行构建测试
  console.log('\n');
  if (!runTests()) {
    error('构建测试失败，请修复问题后重试');
  }
  
  // 提示下一步操作
  console.log('\n');
  log('='.repeat(50), 'bright');
  success('准备工作完成！');
  log('='.repeat(50), 'bright');
  console.log('\n');
  
  log('接下来的步骤:', 'yellow');
  console.log('\n1. 更新 CHANGELOG.md，添加版本更新说明');
  console.log('\n2. 提交更改:');
  console.log(`   git add .`);
  console.log(`   git commit -m "chore: 发布版本 v${newVersion}"`);
  console.log(`   git push origin main`);
  console.log('\n3. 创建并推送标签:');
  console.log(`   git tag -a v${newVersion} -m "Release version ${newVersion}"`);
  console.log(`   git push origin v${newVersion}`);
  console.log('\n4. 等待 GitHub Actions 自动构建和发布');
  console.log('\n5. 访问 GitHub Releases 页面验证发布');
  console.log('\n');
}

// 执行主流程
main().catch(err => {
  error(`发布失败: ${err.message}`);
});

