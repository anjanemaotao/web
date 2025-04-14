// result.js
const baziCalculator = require('../../utils/baziCalculator');
const patternAnalyzer = require('../../utils/patternAnalyzer');
const wuxingAnalyzer = require('../../utils/wuxingAnalyzer');

Page({
  data: {
    activeTab: 'bazi', // 默认显示八字标签页
    bazi: null,
    lunarDate: null,
    solarDate: null,
    patterns: [],
    wuxingResult: null,
    shishenResult: null,
    shiergongResult: null,
    isLoading: true // 添加加载状态变量
  },

  onLoad: function(options) {
    // 显示加载中提示
    wx.showLoading({
      title: '八字计算中...',
      mask: true
    });
    
    // 减少延迟时间，提高响应速度
    setTimeout(() => {
      this.initializeData(options);
    }, 500);
  },

  initializeData: function(options) {
    try {
      // 从上一页获取出生日期信息
      const { year, month, day, hour, gender } = options;
      
      if (!year || !month || !day) {
        wx.showToast({
          title: '参数错误',
          icon: 'none'
        });
        return;
      }
      
      // 计算八字
      const bazi = baziCalculator.calculateBazi({
        year: parseInt(year),
        month: parseInt(month),
        day: parseInt(day),
        hour: parseInt(hour) || 0
      });
      
      // 获取阴历日期
      const lunarDate = baziCalculator.getLunarDate(parseInt(year), parseInt(month), parseInt(day));
      
      // 设置阳历日期
      const solarDate = {
        year: parseInt(year),
        month: parseInt(month),
        day: parseInt(day),
        hour: parseInt(hour) || 0
      };
      
      // 分析命局格局
      const patterns = patternAnalyzer.analyzePattern(bazi, gender);
      
      // 分析五行
      const wuxingResult = wuxingAnalyzer.analyzeWuxing(bazi);
      
      // 分析十神
      const shishenResult = this.analyzeShishen(bazi, gender);
      
      // 分析十二宫
      const shiergongResult = this.analyzeShiergong(bazi, gender);
      
      // 更新数据
      this.setData({
        bazi,
        lunarDate,
        solarDate,
        patterns,
        wuxingResult,
        shishenResult,
        shiergongResult,
        isLoading: false // 更新加载状态
      });
      
      // 隐藏加载提示
      wx.hideLoading();
    } catch (error) {
      console.error('计算八字出错:', error);
      // 隐藏加载提示
      wx.hideLoading();
      // 更新加载状态
      this.setData({
        isLoading: false
      });
      wx.showToast({
        title: '计算出错，请重试',
        icon: 'none'
      });
    }
  },
  
  // 切换标签页
  
  onShow: function() {
    // 从全局变量中获取参数
    const app = getApp();
    if (app.globalData && app.globalData.baziParams) {
      const params = app.globalData.baziParams;
      // 如果页面还没有初始化数据，则使用全局参数初始化
      if (!this.data.bazi) {
        this.initializeData(params);
      }
    }
  },
  switchTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab
    });
  },
  
  // 获取五行对应的CSS类名
  getWuxingClass: function(element) {
    const wuxing = baziCalculator.getWuxing(element);
    return wuxing.toLowerCase();
  },
  
  // 获取格局名称
  getPatternName: function(pattern) {
    const patternNames = {
      'yinzhong': '印重格',
      'shangguan': '伤官格',
      'bijian': '比肩格',
      'shazhong': '煞重格',
      'caiwang': '财旺格'
    };
    return patternNames[pattern] || pattern;
  },
  
  // 获取中文月份
  getChineseMonth: function(month) {
    const chineseMonths = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
    return chineseMonths[month - 1] + '月';
  },
  
  // 获取传统中文日期
  getTraditionalChineseDay: function(day) {
    const chineseDays = [
      '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
      '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
      '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
    ];
    return chineseDays[day - 1];
  },
  
  // 分析十神
  analyzeShishen: function(bazi, gender) {
    // 简单实现，实际应用中可能需要更复杂的逻辑
    const dayGan = bazi.dayPillar.gan;
    const shishen = {};
    
    // 天干对应的十神（以日干为主）
    const ganToShishen = {
      '甲': { '甲': '比肩', '乙': '劫财', '丙': '食神', '丁': '伤官', '戊': '偏财', '己': '正财', '庚': '七杀', '辛': '正官', '壬': '偏印', '癸': '正印' },
      '乙': { '甲': '劫财', '乙': '比肩', '丙': '伤官', '丁': '食神', '戊': '正财', '己': '偏财', '庚': '正官', '辛': '七杀', '壬': '正印', '癸': '偏印' },
      '丙': { '甲': '偏印', '乙': '正印', '丙': '比肩', '丁': '劫财', '戊': '食神', '己': '伤官', '庚': '偏财', '辛': '正财', '壬': '七杀', '癸': '正官' },
      '丁': { '甲': '正印', '乙': '偏印', '丙': '劫财', '丁': '比肩', '戊': '伤官', '己': '食神', '庚': '正财', '辛': '偏财', '壬': '正官', '癸': '七杀' },
      '戊': { '甲': '七杀', '乙': '正官', '丙': '偏印', '丁': '正印', '戊': '比肩', '己': '劫财', '庚': '食神', '辛': '伤官', '壬': '偏财', '癸': '正财' },
      '己': { '甲': '正官', '乙': '七杀', '丙': '正印', '丁': '偏印', '戊': '劫财', '己': '比肩', '庚': '伤官', '辛': '食神', '壬': '正财', '癸': '偏财' },
      '庚': { '甲': '偏财', '乙': '正财', '丙': '七杀', '丁': '正官', '戊': '偏印', '己': '正印', '庚': '比肩', '辛': '劫财', '壬': '食神', '癸': '伤官' },
      '辛': { '甲': '正财', '乙': '偏财', '丙': '正官', '丁': '七杀', '戊': '正印', '己': '偏印', '庚': '劫财', '辛': '比肩', '壬': '伤官', '癸': '食神' },
      '壬': { '甲': '食神', '乙': '伤官', '丙': '偏财', '丁': '正财', '戊': '七杀', '己': '正官', '庚': '偏印', '辛': '正印', '壬': '比肩', '癸': '劫财' },
      '癸': { '甲': '伤官', '乙': '食神', '丙': '正财', '丁': '偏财', '戊': '正官', '己': '七杀', '庚': '正印', '辛': '偏印', '壬': '劫财', '癸': '比肩' }
    };
    
    // 计算年柱、月柱、日柱、时柱的十神
    shishen.yearGan = ganToShishen[dayGan][bazi.yearPillar.gan];
    shishen.monthGan = ganToShishen[dayGan][bazi.monthPillar.gan];
    shishen.dayGan = '日主';
    shishen.hourGan = ganToShishen[dayGan][bazi.hourPillar.gan];
    
    // 计算十神强度
    const shishenCount = {
      '比肩': 0, '劫财': 0, '食神': 0, '伤官': 0, '偏财': 0,
      '正财': 0, '七杀': 0, '正官': 0, '偏印': 0, '正印': 0
    };
    
    // 统计十神出现次数
    [shishen.yearGan, shishen.monthGan, shishen.hourGan].forEach(s => {
      shishenCount[s] += 1;
    });
    
    return {
      shishen,
      count: shishenCount
    };
  },
  
  // 分析十二宫
  analyzeShiergong: function(bazi, gender) {
    // 简单实现，实际应用中可能需要更复杂的逻辑
    const shiergong = {
      '命宫': '代表先天体质、性格特点',
      '兄弟宫': '代表兄弟姐妹关系',
      '夫妻宫': '代表婚姻状况',
      '子女宫': '代表子女情况',
      '财帛宫': '代表财运',
      '疾厄宫': '代表健康状况',
      '迁移宫': '代表旅行、移居',
      '交友宫': '代表朋友、人际关系',
      '事业宫': '代表事业发展',
      '田宅宫': '代表房产、不动产',
      '福德宫': '代表精神生活、内心世界',
      '父母宫': '代表父母关系'
    };
    
    return shiergong;
  }
});