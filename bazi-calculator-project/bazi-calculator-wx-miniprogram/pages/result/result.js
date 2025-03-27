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
    
    // 重构数据结构处理
    const processedResult = {
      year: [result.year[0], result.year[1]],
      month: [result.month[0], result.month[1]],
      day: [result.day[0], result.day[1]],
      hour: [result.hour[0], result.hour[1]],
      wuxingAnalysis: result.wuxingAnalysis,
      shiShenAnalysis: result.shiShenAnalysis,
      ju: result.ju
    };

    this.setData({
      result: processedResult,
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
  
  // 切换语言
  changeLanguage: function(e) {
    const language = e.currentTarget.dataset.lang;
    this.setData({ language });
    app.globalData.language = language;
    wx.setStorageSync('language', language);
    
    // 更新显示文本
    this.updateDisplayText();
  },
  
  // 更新显示文本
  updateDisplayText: function() {
    const { language, result } = this.data;
    if (!result) return;
    
    const isTraditional = language === 'zh-TW';
    
    // 更新十神含义
    const meanings = {
      '比肩': isTraditional ? '兄弟姊妹、朋友、同事、競爭對手' : '兄弟姐妹、朋友、同事、竞争对手',
      '劫財': isTraditional ? '兄弟姊妹、朋友、同事、競爭對手' : '兄弟姐妹、朋友、同事、竞争对手',
      '食神': isTraditional ? '子女、學生、下屬、藝術、才華' : '子女、学生、下属、艺术、才华',
      '傷官': isTraditional ? '子女、學生、下屬、創新、叛逆' : '子女、学生、下属、创新、叛逆',
      '偏財': isTraditional ? '財富、機遇、意外收穫' : '财富、机遇、意外收获',
      '正財': isTraditional ? '財富、正當收入、穩定' : '财富、正当收入、稳定',
      '偏印': isTraditional ? '學習、知識、母親、貴人' : '学习、知识、母亲、贵人',
      '正印': isTraditional ? '學習、知識、母親、貴人' : '学习、知识、母亲、贵人',
      '七殺': isTraditional ? '上司、權威、壓力、挑戰' : '上司、权威、压力、挑战',
      '正官': isTraditional ? '上司、權威、規則、秩序' : '上司、权威、规则、秩序'
    };
    
    // 更新藏干标签
    const labels = {
      'yearHidden': isTraditional ? '年支藏干' : '年支藏干',
      'monthHidden': isTraditional ? '月支藏干' : '月支藏干',
      'dayHidden': isTraditional ? '日支藏干' : '日支藏干',
      'hourHidden': isTraditional ? '時支藏干' : '时支藏干'
    };
    
    // 更新五行强度描述
    const strengthLabels = {
      '旺': isTraditional ? '旺' : '旺',
      '强': isTraditional ? '強' : '强',
      '平': isTraditional ? '平' : '平',
      '弱': isTraditional ? '弱' : '弱',
      '极弱': isTraditional ? '極弱' : '极弱'
    };
    
    // 更新所有文本内容
    this.setData({
      'getShiShenMeaning': function(shiShen) {
        return meanings[shiShen] || (isTraditional ? '未知' : '未知');
      },
      'getHiddenLabel': function(key) {
        return labels[key] || key;
      },
      'getWuxingStrength': function(count, total) {
        const percentage = (count / total) * 100;
        if (percentage >= 30) return strengthLabels['旺'];
        if (percentage >= 20) return strengthLabels['强'];
        if (percentage >= 15) return strengthLabels['平'];
        if (percentage >= 10) return strengthLabels['弱'];
        return strengthLabels['极弱'];
      }
    });
  },
  

});