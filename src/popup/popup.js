/**
 * Popup 页面脚本
 */

document.addEventListener('DOMContentLoaded', async () => {
  const languageSelect = document.getElementById('languageSelect');
  const retranslateBtn = document.getElementById('retranslateBtn');
  const optionsBtn = document.getElementById('optionsBtn');
  const feedbackLink = document.getElementById('feedbackLink');

  // 加载当前语言设置
  chrome.storage.sync.get(['locale'], (result) => {
    if (result.locale) {
      languageSelect.value = result.locale;
    }
  });

  // 语言切换
  languageSelect.addEventListener('change', async (e) => {
    const locale = e.target.value;
    
    // 保存设置
    chrome.storage.sync.set({ locale });

    // 通知内容脚本切换语言
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (tab && tab.url && (tab.url.includes('postman.com') || tab.url.includes('postman.co'))) {
      chrome.tabs.sendMessage(tab.id, {
        type: 'CHANGE_LOCALE',
        locale: locale
      });

      // 显示成功提示
      showNotification('语言已切换');
    }
  });

  // 重新翻译页面
  retranslateBtn.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (tab && tab.url && (tab.url.includes('postman.com') || tab.url.includes('postman.co'))) {
      chrome.tabs.sendMessage(tab.id, {
        type: 'RETRANSLATE'
      });

      showNotification('正在重新翻译...');
    } else {
      showNotification('请在Postman网页版上使用此功能', 'error');
    }
  });

  // 打开选项页面
  optionsBtn.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  // 反馈问题
  feedbackLink.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({
      url: 'https://github.com/yourusername/postman-web-i18n/issues'
    });
  });

  /**
   * 显示通知
   */
  function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      padding: 12px 20px;
      background: ${type === 'success' ? '#4caf50' : '#f44336'};
      color: white;
      border-radius: 6px;
      font-size: 13px;
      z-index: 1000;
      animation: slideDown 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideUp 0.3s ease-out';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 2000);
  }
});

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  @keyframes slideUp {
    from {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    to {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
    }
  }
`;
document.head.appendChild(style);

