/**
 * Background Service Worker
 * 处理后台任务和消息传递
 */

// 安装事件
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('[Postman i18n] 插件已安装');
    
    // 设置默认语言
    chrome.storage.sync.set({
      locale: 'zh-CN',
      autoTranslate: true,
      customRules: []
    });

    // 打开欢迎页面
    chrome.tabs.create({
      url: chrome.runtime.getURL('options/options.html')
    });
  } else if (details.reason === 'update') {
    console.log('[Postman i18n] 插件已更新');
  }
});

// 监听来自内容脚本的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_LOCALE') {
    chrome.storage.sync.get(['locale'], (result) => {
      sendResponse({ locale: result.locale || 'zh-CN' });
    });
    return true; // 保持消息通道开启
  }

  if (request.type === 'GET_SETTINGS') {
    chrome.storage.sync.get(['locale', 'autoTranslate', 'customRules'], (result) => {
      sendResponse(result);
    });
    return true;
  }

  if (request.type === 'SAVE_SETTINGS') {
    chrome.storage.sync.set(request.settings, () => {
      sendResponse({ success: true });
    });
    return true;
  }

  if (request.type === 'LOG') {
    console.log('[Postman i18n]', request.message);
  }
});

// 监听标签页更新
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    if (tab.url.includes('postman.com') || tab.url.includes('postman.co')) {
      // 页面加载完成，可以进行初始化操作
      chrome.tabs.sendMessage(tabId, {
        type: 'PAGE_LOADED'
      }).catch(() => {
        // 忽略错误，可能是内容脚本还未加载
      });
    }
  }
});

// 监听存储变化
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync') {
    console.log('[Postman i18n] 设置已更新:', changes);
    
    // 通知所有Postman标签页设置已更新
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        if (tab.url && (tab.url.includes('postman.com') || tab.url.includes('postman.co'))) {
          chrome.tabs.sendMessage(tab.id, {
            type: 'SETTINGS_CHANGED',
            changes: changes
          }).catch(() => {
            // 忽略错误
          });
        }
      });
    });
  }
});

console.log('[Postman i18n] Background service worker已启动');

