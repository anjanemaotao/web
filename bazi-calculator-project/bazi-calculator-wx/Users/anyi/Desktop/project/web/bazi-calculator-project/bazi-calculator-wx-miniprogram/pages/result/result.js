// pages/result/result.js
const app = getApp();

Page({
  data: {
    result: null,
    darkMode: false,
    language: 'zh-CN'
  },

  onLoad: function() {
    // 从全局数据获取八字计算结果
    const result = app.globalData.baziResult;
    if (!result) {
      wx.showToast({
        title: '未找到八字计算结果',
        icon: 'none',
        duration: 2000
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 2000);
      return;
    }
    
    // 设置主题和语言
    this.setData({
      result,
      darkMode: app.globalData.darkMode,
      language: app.globalData.language
    });
  },
  
  // 获取五行颜色
  getWuxingColor: function(wuxing) {
    const colors = {
      '木': '#4CAF50',
      '火': '#F44336',
      '土': '#FF9800',
      '金': '#FFD700',
      '水': '#2196F3'
    };
    return colors[wuxing] || '#999';
  },
  
  // 获取五行强度描述
  getWuxingStrength: function(count, total) {
    const percentage = (count / total) * 100;
    if (percentage >= 30) return '旺';
    if (percentage >= 20) return '强';
    if (percentage >= 15) return '平';
    if (percentage >= 10) return '弱';
    return '极弱';
  },
  
  // 获取十神含义
  getShiShenMeaning: function(shiShen) {
    const meanings = {
      '比肩': '兄弟姐妹、朋友、同事、竞争对手',
      '劫财': '兄弟姐妹、朋友、同事、竞争对手',
      '食神': '子女、学生、下属、艺术、才华',
      '伤官': '子女、学生、下属、创新、叛逆',
      '偏财': '财富、机遇、意外收获',
      '正财': '财富、正当收入、稳定',
      '偏印': '学习、知识、母亲、贵人',
      '正印': '学习、知识、母亲、贵人',
      '七杀': '上司、权威、压力、挑战',
      '正官': '上司、权威、规则、秩序'
    };
    return meanings[shiShen] || '未知';
  },
  
  // 获取藏干标签
  getHiddenLabel: function(key) {
    const labels = {
      'yearHidden': '年支藏干',
      'monthHidden': '月支藏干',
      'dayHidden': '日支藏干',
      'hourHidden': '时支藏干'
    };
    return labels[key] || key;
  },
  
  // 返回首页
  goBack: function() {
    wx.navigateBack();
  },
  
  // 分享结果
  shareResult: function() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  }
});