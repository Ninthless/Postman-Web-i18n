/**
 * 主入口文件
 * 初始化并启动翻译系统
 */

(async function() {
  'use strict';

  console.log('[Postman i18n] 插件加载中...');

  // 等待i18n系统初始化
  if (window.i18n) {
    await window.i18n.init();

    // 创建并启动翻译器
    const translator = new PageTranslator(window.i18n);
    
    // 等待页面加载完成后再启动翻译
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        translator.start();
      });
    } else {
      translator.start();
    }

    // 暴露到全局，方便调试和扩展
    window.postmanTranslator = translator;

    // 添加一些便捷方法到控制台
    window.postmanI18n = {
      // 切换语言
      setLocale: (locale) => window.i18n.setLocale(locale),
      
      // 获取当前语言
      getLocale: () => window.i18n.getCurrentLocale(),
      
      // 获取支持的语言列表
      getSupportedLocales: () => window.i18n.getSupportedLocales(),
      
      // 手动翻译
      translate: (key, params) => window.i18n.t(key, params),
      
      // 重新翻译页面
      retranslate: () => {
        translator.translatedElements = new WeakSet();
        translator.translatePage();
      },
      
      // 添加自定义翻译规则
      addRule: (rule) => translator.addRule(rule),
      
      // 获取所有翻译
      getTranslations: (prefix) => window.i18n.getTranslations(prefix)
    };

    console.log('[Postman i18n] 插件已启动');
    console.log('[Postman i18n] 使用 window.postmanI18n 访问API');
  } else {
    console.error('[Postman i18n] i18n加载器未找到');
  }
})();

