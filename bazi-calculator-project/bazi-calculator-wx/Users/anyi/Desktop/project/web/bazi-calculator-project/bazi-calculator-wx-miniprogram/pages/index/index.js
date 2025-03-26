// pages/index/index.js
const app = getApp();
const { calculateFullBazi } = require('../../utils/baziCalculator');

Page({
  data: {
    isLunar: true,  // 默认使用农历
    years: [],
    months: [
      { value: 1, label: '一月' },
      { value: 2, label: '二月' },
      { value: 3, label: '三月' },
      { value: 4, label: '四月' },
      { value: 5, label: '五月' },
      { value: 6, label: '六月' },
      { value: 7, label: '七月' },
      { value: 8, label: '八月' },
      { value: 9, label: '九月' },
      { value: 10, label: '十月' },
      { value: 11, label: '十一月' },
      { value: 12, label: '十二月' }
    ],
    days: [],
    hours: [
      { value: 0, label: '子时(23:00-01:00)' },
      { value: 2, label: '丑时(01:00-03:00)' },
      { value: 4, label: '寅时(03:00-05:00)' },
      { value: 6, label: '卯时(05:00-07:00)' },
      { value: 8, label: '辰时(07:00-09:00)' },
      { value: 10, label: '巳时(09:00-11:00)' },
      { value: 12, label: '午时(11:00-13:00)' },
      { value: 14, label: '未时(13:00-15:00)' },
      { value: 16, label: '申时(15:00-17:00)' },
      { value: 18, label: '酉时(17:00-19:00)' },
      { value: 20, label: '戌时(19:00-21:00)' },
      { value: 22, label: '亥时(21:00-23:00)' }
    ],
    form: {
      lunarYear: new Date().getFullYear(),
      lunarMonth: 1,
      lunarDay: 1,
      hour: 12
    },
    loading: false,
    darkMode: app.globalData.darkMode,
    language: app.globalData.language
  },

  onLoad: function() {
    // 初始化年份选项（1900-2100）
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 1900; i <= 2100; i++) {
      years.push({ value: i, label: i + '年' });
    }
    this.setData({ years });
    
    // 设置默认年份为当前年份
    this.setData({
      'form.lunarYear': currentYear
    });
    
    // 更新当月天数
    this.updateDaysInMonth();
  },
  
  // 切换农历/阳历
  switchCalendarType: function(e) {
    const isLunar = e.currentTarget.dataset.type === 'lunar';
    this.setData({ isLunar });
    this.updateDaysInMonth();
  },
  
  // 年份变化
  bindYearChange: function(e) {
    this.setData({
      'form.lunarYear': parseInt(e.detail.value) + 1900
    });
    this.updateDaysInMonth();
  },
  
  // 月份变化
  bindMonthChange: function(e) {
    this.setData({
      'form.lunarMonth': parseInt(e.detail.value) + 1
    });
    this.updateDaysInMonth();
  },
  
  // 日期变化
  bindDayChange: function(e) {
    this.setData({
      'form.lunarDay': parseInt(e.detail.value) + 1
    });
  },
  
  // 时辰变化
  bindHourChange: function(e) {
    this.setData({
      'form.hour': this.data.hours[parseInt(e.detail.value)].value
    });
  },
  
  // 更新月份天数
  updateDaysInMonth: function() {
    const { lunarYear, lunarMonth } = this.data.form;
    let daysInMonth = 30; // 默认30天
    
    if (this.data.isLunar) {
      // 农历月份天数（简化处理，实际应该使用农历库计算）
      if ([1, 3, 5, 7, 8, 10, 12].includes(lunarMonth)) {
        daysInMonth = 30;
      } else if (lunarMonth === 2) {
        // 农历闰年2月29天，平年28天
        daysInMonth = 29;
      } else {
        daysInMonth = 29;
      }
    } else {
      // 阳历月份天数
      if ([1, 3, 5, 7, 8, 10, 12].includes(lunarMonth)) {
        daysInMonth = 31;
      } else if (lunarMonth === 2) {
        // 阳历闰年2月29天，平年28天
        const isLeapYear = (lunarYear % 4 === 0 && lunarYear % 100 !== 0) || (lunarYear % 400 === 0);
        daysInMonth = isLeapYear ? 29 : 28;
      } else {
        daysInMonth = 30;
      }
    }
    
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ value: i, label: i + '日' });
    }
    
    this.setData({ days });
    
    // 如果当前选择的日期超出了新的天数范围，则调整为最后一天
    if (this.data.form.lunarDay > daysInMonth) {
      this.setData({
        'form.lunarDay': daysInMonth
      });
    }
  },
  
  // 提交表单计算八字
  calculateBazi: function() {
    const { lunarYear, lunarMonth, lunarDay, hour } = this.data.form;
    
    this.setData({ loading: true });
    
    try {
      // 计算八字
      const result = calculateFullBazi(lunarYear, lunarMonth, lunarDay, hour);
      
      // 将结果存储到全局数据
      app.globalData.baziResult = result;
      
      // 跳转到结果页面
      wx.navigateTo({
        url: '/pages/result/result'
      });
    } catch (error) {
      wx.showToast({
        title: '计算出错：' + error.message,
        icon: 'none',
        duration: 2000
      });
    } finally {
      this.setData({ loading: false });
    }
  },
  
  // 重置表单
  resetForm: function() {
    this.setData({
      form: {
        lunarYear: new Date().getFullYear(),
        lunarMonth: 1,
        lunarDay: 1,
        hour: 12
      }
    });
    this.updateDaysInMonth();
  },
  
  // 切换主题
  toggleTheme: function() {
    const darkMode = !this.data.darkMode;
    this.setData({ darkMode });
    app.globalData.darkMode = darkMode;
    wx.setStorageSync('darkMode', darkMode);
  },
  
  // 切换语言
  changeLanguage: function(e) {
    const language = e.currentTarget.dataset.lang;
    this.setData({ language });
    app.globalData.language = language;
    wx.setStorageSync('language', language);
  }
});