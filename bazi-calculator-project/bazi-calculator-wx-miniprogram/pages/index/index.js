// pages/index/index.js
const app = getApp();
const { calculateFullBazi } = require('../../utils/baziCalculator');

Page({
  data: {
    isLunar: true,
    hourIndex: 6, // 默认值在onLoad中重新初始化
    years: [],
    months: [],
    lunarMonths: [
      { value: 1, label: '正月' },
      { value: 2, label: '二月' },
      { value: 3, label: '三月' },
      { value: 4, label: '四月' },
      { value: 5, label: '五月' },
      { value: 6, label: '六月' },
      { value: 7, label: '七月' },
      { value: 8, label: '八月' },
      { value: 9, label: '九月' },
      { value: 10, label: '十月' },
      { value: 11, label: '冬月' },
      { value: 12, label: '腊月' }
    ],
    solarMonths: [
      { value: 1, label: '1月' },
      { value: 2, label: '2月' },
      { value: 3, label: '3月' },
      { value: 4, label: '4月' },
      { value: 5, label: '5月' },
      { value: 6, label: '6月' },
      { value: 7, label: '7月' },
      { value: 8, label: '8月' },
      { value: 9, label: '9月' },
      { value: 10, label: '10月' },
      { value: 11, label: '11月' },
      { value: 12, label: '12月' }
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
    this.setData({
      hourIndex: this.data.hours.findIndex(h => h.value === 12)
    });
    const years = [];
    const lunar = require('../../utils/lunar-javascript').Lunar;
    for (let i = 1900; i <= 2100; i++) {
      const zodiac = new lunar(i, 1, 1).getZodiac();
      years.push({ value: i, label: i + '年(' + zodiac + ')' });
    }
    this.setData({ years });
    
    // 设置默认年份为当前年份
    this.setData({
      'form.lunarYear': currentYear,
      months: this.data.isLunar ? this.data.lunarMonths : this.data.solarMonths,
      hourIndex: this.data.hours.findIndex(h => h.value === this.data.form.hour)
    });
    
    // 更新当月天数
    this.updateDaysInMonth();
  },
  
  // 切换农历/阳历
  switchCalendarType: function(e) {
    const isLunar = e.currentTarget.dataset.type === 'lunar';
    const { lunarYear, lunarMonth, lunarDay } = this.data.form;
    const lunar = require('../../utils/lunar-javascript');
    
    // 更新月份选项
    this.setData({
      months: isLunar ? this.data.lunarMonths : this.data.solarMonths
    });
    
    if (isLunar) {
      // 阳历转农历
      const solar = new lunar.Solar(lunarYear, lunarMonth, lunarDay);
      const lunarDate = solar.getLunar();
      this.setData({
        isLunar,
        'form.lunarYear': lunarDate.year,
        'form.lunarMonth': lunarDate.month,
        'form.lunarDay': lunarDate.day
      });
    } else {
      // 农历转阳历
      const lunarDate = new lunar.Lunar(lunarYear, lunarMonth, lunarDay);
      const solar = lunarDate.getSolar();
      this.setData({
        isLunar,
        'form.lunarYear': solar.getYear(),
        'form.lunarMonth': solar.getMonth(),
        'form.lunarDay': solar.getDay()
      });
    }
    
    // 更新月份显示格式
    this.setData({
      months: isLunar ? this.data.lunarMonths : this.data.solarMonths
    });
    
    // 更新日期显示格式
    this.updateDaysInMonth();
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
    const value = parseInt(e.detail.value);
    this.setData({
      hourIndex: value,
      'form.hour': this.data.hours[value].value
    });
  },
  
  // 更新月份天数
  updateDaysInMonth: function() {
    const { lunarYear, lunarMonth } = this.data.form;
    let daysInMonth = 30; // 默认30天
    const lunar = require('../../utils/lunar-javascript');
    
    if (this.data.isLunar) {
      // 使用农历库计算天数
      const lunarDate = new lunar.Lunar(lunarYear, lunarMonth, 1);
      daysInMonth = lunarDate.getDaysInMonth();
      
      // 生成农历日期选项
      const days = [];
      const lunarDays = [
        '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
        '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
        '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
      ];
      for (let i = 1; i <= daysInMonth; i++) {
        days.push({ value: i, label: lunarDays[i - 1] });
      }
      this.setData({ days });
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
      
      // 生成阳历日期选项
      const days = [];
      for (let i = 1; i <= daysInMonth; i++) {
        days.push({ value: i, label: i + '日' });
      }
      this.setData({ days });
    }
    
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
      },
      hourIndex: this.data.hours.findIndex(h => h.value === 12)
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
    
    // 更新显示文本
    this.updateDisplayText();
  },
  
  // 更新显示文本
  updateDisplayText: function() {
    const { language } = this.data;
    const isTraditional = language === 'zh-TW';
    
    // 更新年份显示
    const years = this.data.years.map(year => ({
      value: year.value,
      label: isTraditional ? 
        year.label.replace('年', '年').replace(/\((.*?)\)/, '($1)') :
        year.label
    }));
    
    // 更新月份显示
    const lunarMonths = [
      { value: 1, label: isTraditional ? '正月' : '正月' },
      { value: 2, label: isTraditional ? '貳月' : '二月' },
      { value: 3, label: isTraditional ? '參月' : '三月' },
      { value: 4, label: isTraditional ? '肆月' : '四月' },
      { value: 5, label: isTraditional ? '伍月' : '五月' },
      { value: 6, label: isTraditional ? '陸月' : '六月' },
      { value: 7, label: isTraditional ? '柒月' : '七月' },
      { value: 8, label: isTraditional ? '捌月' : '八月' },
      { value: 9, label: isTraditional ? '玖月' : '九月' },
      { value: 10, label: isTraditional ? '拾月' : '十月' },
      { value: 11, label: isTraditional ? '冬月' : '冬月' },
      { value: 12, label: isTraditional ? '臘月' : '腊月' }
    ];
    
    const solarMonths = this.data.solarMonths.map(month => ({
      value: month.value,
      label: isTraditional ? 
        month.label.replace('月', '月') :
        month.label
    }));
    
    this.setData({
      years,
      lunarMonths,
      solarMonths,
      months: this.data.isLunar ? lunarMonths : solarMonths
    });
  }
});