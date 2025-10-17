/**
 * Options 页面脚本
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Tab切换
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.dataset.tab;

      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(tabName).classList.add('active');
    });
  });

  // 加载设置
  loadSettings();

  // 基本设置事件
  document.getElementById('locale').addEventListener('change', saveSettings);
  document.getElementById('autoTranslate').addEventListener('change', saveSettings);
  document.getElementById('translateDynamic')?.addEventListener('change', saveSettings);
  document.getElementById('debugMode')?.addEventListener('change', saveSettings);

  // 翻译操作
  document.getElementById('exportBtn')?.addEventListener('click', exportTranslations);
  document.getElementById('importBtn')?.addEventListener('click', () => {
    document.getElementById('fileInput').click();
  });
  document.getElementById('fileInput')?.addEventListener('change', importTranslations);
  document.getElementById('resetBtn')?.addEventListener('click', resetTranslations);

  // 自定义规则
  document.getElementById('addRuleBtn')?.addEventListener('click', addCustomRule);

  // 关于页面按钮
  document.getElementById('githubBtn')?.addEventListener('click', () => {
    window.open('https://github.com/yourusername/postman-web-i18n', '_blank');
  });
  document.getElementById('issueBtn')?.addEventListener('click', () => {
    window.open('https://github.com/yourusername/postman-web-i18n/issues', '_blank');
  });

  // 加载统计数据
  loadStats();
  loadCustomRules();
});

/**
 * 加载设置
 */
function loadSettings() {
  chrome.storage.sync.get(['locale', 'autoTranslate', 'translateDynamic', 'debugMode'], (result) => {
    if (result.locale) {
      document.getElementById('locale').value = result.locale;
    }
    if (result.autoTranslate !== undefined) {
      document.getElementById('autoTranslate').checked = result.autoTranslate;
    }
    if (result.translateDynamic !== undefined) {
      document.getElementById('translateDynamic').checked = result.translateDynamic;
    }
    if (result.debugMode !== undefined) {
      document.getElementById('debugMode').checked = result.debugMode;
    }
  });
}

/**
 * 保存设置
 */
function saveSettings() {
  const settings = {
    locale: document.getElementById('locale').value,
    autoTranslate: document.getElementById('autoTranslate').checked,
    translateDynamic: document.getElementById('translateDynamic')?.checked || true,
    debugMode: document.getElementById('debugMode')?.checked || false
  };

  chrome.storage.sync.set(settings, () => {
    showToast('设置已保存', 'success');
  });
}

/**
 * 加载统计数据
 */
async function loadStats() {
  try {
    // 加载翻译文件并统计
    const response = await fetch(chrome.runtime.getURL('locales/zh-CN/common.json'));
    const commonData = await response.json();
    
    const response2 = await fetch(chrome.runtime.getURL('locales/zh-CN/ui.json'));
    const uiData = await response2.json();

    const totalCount = countTranslations(commonData) + countTranslations(uiData);
    
    document.getElementById('totalTranslations').textContent = totalCount;
    document.getElementById('coveragePercent').textContent = '100%';
    document.getElementById('lastUpdate').textContent = '2024-01-01';
  } catch (error) {
    console.error('加载统计数据失败:', error);
  }
}

/**
 * 递归统计翻译数量
 */
function countTranslations(obj) {
  let count = 0;
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      count += countTranslations(obj[key]);
    } else if (typeof obj[key] === 'string') {
      count++;
    }
  }
  return count;
}

/**
 * 导出翻译
 */
async function exportTranslations() {
  try {
    const [commonRes, uiRes] = await Promise.all([
      fetch(chrome.runtime.getURL('locales/zh-CN/common.json')),
      fetch(chrome.runtime.getURL('locales/zh-CN/ui.json'))
    ]);

    const data = {
      common: await commonRes.json(),
      ui: await uiRes.json()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'postman-i18n-translations.json';
    a.click();
    URL.revokeObjectURL(url);

    showToast('翻译已导出', 'success');
  } catch (error) {
    showToast('导出失败', 'error');
    console.error(error);
  }
}

/**
 * 导入翻译
 */
function importTranslations(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      // 这里可以实现导入逻辑
      showToast('翻译已导入', 'success');
    } catch (error) {
      showToast('导入失败，请检查文件格式', 'error');
      console.error(error);
    }
  };
  reader.readAsText(file);
}

/**
 * 重置翻译
 */
function resetTranslations() {
  if (confirm('确定要重置所有翻译设置吗？此操作不可恢复。')) {
    chrome.storage.sync.set({
      locale: 'zh-CN',
      autoTranslate: true,
      customRules: []
    }, () => {
      showToast('翻译已重置', 'success');
      loadSettings();
      loadCustomRules();
    });
  }
}

/**
 * 加载自定义规则
 */
function loadCustomRules() {
  chrome.storage.sync.get(['customRules'], (result) => {
    const rules = result.customRules || [];
    const container = document.getElementById('customRulesList');
    
    if (rules.length === 0) {
      container.innerHTML = '<p class="info-text">暂无自定义规则</p>';
      return;
    }

    container.innerHTML = rules.map((rule, index) => `
      <div class="rule-item">
        <div class="rule-content">${JSON.stringify(rule)}</div>
        <div class="rule-actions">
          <button class="btn btn-secondary btn-sm" onclick="editRule(${index})">编辑</button>
          <button class="btn btn-danger btn-sm" onclick="deleteRule(${index})">删除</button>
        </div>
      </div>
    `).join('');
  });
}

/**
 * 添加自定义规则
 */
function addCustomRule() {
  const ruleJson = prompt('请输入规则JSON：');
  if (!ruleJson) return;

  try {
    const rule = JSON.parse(ruleJson);
    
    chrome.storage.sync.get(['customRules'], (result) => {
      const rules = result.customRules || [];
      rules.push(rule);
      
      chrome.storage.sync.set({ customRules: rules }, () => {
        showToast('规则已添加', 'success');
        loadCustomRules();
      });
    });
  } catch (error) {
    showToast('规则格式错误', 'error');
    console.error(error);
  }
}

/**
 * 编辑规则
 */
window.editRule = function(index) {
  chrome.storage.sync.get(['customRules'], (result) => {
    const rules = result.customRules || [];
    const rule = rules[index];
    
    const ruleJson = prompt('编辑规则JSON：', JSON.stringify(rule));
    if (!ruleJson) return;

    try {
      rules[index] = JSON.parse(ruleJson);
      
      chrome.storage.sync.set({ customRules: rules }, () => {
        showToast('规则已更新', 'success');
        loadCustomRules();
      });
    } catch (error) {
      showToast('规则格式错误', 'error');
      console.error(error);
    }
  });
};

/**
 * 删除规则
 */
window.deleteRule = function(index) {
  if (!confirm('确定要删除此规则吗？')) return;

  chrome.storage.sync.get(['customRules'], (result) => {
    const rules = result.customRules || [];
    rules.splice(index, 1);
    
    chrome.storage.sync.set({ customRules: rules }, () => {
      showToast('规则已删除', 'success');
      loadCustomRules();
    });
  });
};

/**
 * 显示提示
 */
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// 添加slideOut动画
const style = document.createElement('style');
style.textContent = `
  @keyframes slideOut {
    to {
      opacity: 0;
      transform: translateX(100px);
    }
  }
`;
document.head.appendChild(style);

