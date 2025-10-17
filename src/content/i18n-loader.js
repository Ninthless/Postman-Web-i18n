/**
 * i18n 加载器
 * 负责加载和管理翻译资源
 */

class I18nLoader {
  constructor() {
    this.currentLocale = 'zh-CN';
    this.fallbackLocale = 'en';
    this.translations = {};
    this.loadedModules = new Set();
  }

  /**
   * 初始化i18n系统
   */
  async init() {
    // 从存储中获取用户设置的语言
    const locale = await this.getStoredLocale();
    if (locale) {
      this.currentLocale = locale;
    } else {
      // 自动检测浏览器语言
      this.currentLocale = this.detectBrowserLocale();
    }

    // 加载核心翻译模块
    await this.loadModule('common');
    await this.loadModule('ui');

    console.log(`[Postman i18n] 已初始化，当前语言: ${this.currentLocale}`);
  }

  /**
   * 检测浏览器语言
   */
  detectBrowserLocale() {
    const lang = navigator.language || navigator.userLanguage;
    
    // 语言映射
    const localeMap = {
      'zh': 'zh-CN',
      'zh-CN': 'zh-CN',
      'zh-TW': 'zh-TW',
      'zh-HK': 'zh-TW',
      'en': 'en',
      'en-US': 'en',
      'en-GB': 'en'
    };

    return localeMap[lang] || localeMap[lang.split('-')[0]] || this.fallbackLocale;
  }

  /**
   * 从存储中获取语言设置
   */
  async getStoredLocale() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(['locale'], (result) => {
        resolve(result.locale);
      });
    });
  }

  /**
   * 设置当前语言
   */
  async setLocale(locale) {
    this.currentLocale = locale;
    
    // 保存到存储
    chrome.storage.sync.set({ locale });

    // 重新加载所有已加载的模块
    const modules = Array.from(this.loadedModules);
    this.translations = {};
    this.loadedModules.clear();

    for (const module of modules) {
      await this.loadModule(module);
    }

    // 触发语言变更事件
    window.dispatchEvent(new CustomEvent('i18n:locale-changed', {
      detail: { locale }
    }));
  }

  /**
   * 加载翻译模块
   */
  async loadModule(moduleName) {
    if (this.loadedModules.has(moduleName)) {
      return;
    }

    try {
      // 尝试加载当前语言
      const url = chrome.runtime.getURL(`locales/${this.currentLocale}/${moduleName}.json`);
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        this.mergeTranslations(data);
        this.loadedModules.add(moduleName);
      } else if (this.currentLocale !== this.fallbackLocale) {
        // 如果当前语言加载失败，尝试加载fallback语言
        const fallbackUrl = chrome.runtime.getURL(`locales/${this.fallbackLocale}/${moduleName}.json`);
        const fallbackResponse = await fetch(fallbackUrl);
        
        if (fallbackResponse.ok) {
          const data = await fallbackResponse.json();
          this.mergeTranslations(data);
          this.loadedModules.add(moduleName);
        }
      }
    } catch (error) {
      console.warn(`[Postman i18n] 加载翻译模块失败: ${moduleName}`, error);
    }
  }

  /**
   * 合并翻译数据
   */
  mergeTranslations(data) {
    this.translations = this.deepMerge(this.translations, data);
  }

  /**
   * 深度合并对象
   */
  deepMerge(target, source) {
    const output = { ...target };
    
    if (this.isObject(target) && this.isObject(source)) {
      Object.keys(source).forEach(key => {
        if (this.isObject(source[key])) {
          if (!(key in target)) {
            output[key] = source[key];
          } else {
            output[key] = this.deepMerge(target[key], source[key]);
          }
        } else {
          output[key] = source[key];
        }
      });
    }
    
    return output;
  }

  /**
   * 判断是否为对象
   */
  isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
  }

  /**
   * 获取翻译文本
   * @param {string} key - 翻译键，支持点号分隔的路径，如 'app.name'
   * @param {object} params - 替换参数
   * @returns {string} 翻译后的文本
   */
  t(key, params = {}) {
    const keys = key.split('.');
    let value = this.translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // 如果找不到翻译，返回键名
        return key;
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    // 替换参数
    return this.interpolate(value, params);
  }

  /**
   * 插值替换
   */
  interpolate(text, params) {
    return text.replace(/\{(\w+)\}/g, (match, key) => {
      return params.hasOwnProperty(key) ? params[key] : match;
    });
  }

  /**
   * 批量获取翻译
   */
  getTranslations(prefix = '') {
    if (!prefix) {
      return this.translations;
    }

    const keys = prefix.split('.');
    let value = this.translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return {};
      }
    }

    return value;
  }

  /**
   * 获取当前语言
   */
  getCurrentLocale() {
    return this.currentLocale;
  }

  /**
   * 获取所有支持的语言
   */
  getSupportedLocales() {
    return [
      { code: 'zh-CN', name: '简体中文' },
      { code: 'zh-TW', name: '繁體中文' },
      { code: 'en', name: 'English' }
    ];
  }
}

// 创建全局实例
window.i18n = new I18nLoader();

