// app.js
App({
  globalData: {
    userInfo: null,
    darkMode: false,
    language: 'zh-CN' // 默认语言
  },
  onLaunch: function() {
    // 获取本地存储的主题设置
    const darkMode = wx.getStorageSync('darkMode') || false;
    this.globalData.darkMode = darkMode;
    
    // 获取本地存储的语言设置
    const language = wx.getStorageSync('language') || 'zh-CN';
    this.globalData.language = language;
  }
})