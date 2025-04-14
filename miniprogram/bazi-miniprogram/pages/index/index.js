// index.js
const app = getApp();

Page({
  data: {
    calendarType: 'lunar', // 'lunar' 阴历 or 'solar' 阳历
    lunarDate: {
      year: new Date().getFullYear(),
      month: 1,
      day: 1,
      hour: 0
    },
    solarDate: null,
    displayLunarDate: null, // 用于显示的阴历日期（阳历模式下）
    loading: false,
    yearOptions: [],
    monthOptions: [],
    dayOptions: [],
    hourOptions: [],
    currentYear: new Date().getFullYear() // 添加当前年份变量用于页脚显示
  },
  
  onLoad() {
    // 生成年份选项
    this.generateYearOptions();
    // 生成月份选项
    this.generateMonthOptions();
    // 生成日期选项
    this.generateDayOptions();
    // 生成时辰选项
    this.generateHourOptions();
  },
  
  // 生成年份选项
  generateYearOptions() {
    const yearOptions = [];
    const currentYear = new Date().getFullYear();
    for (let year = 1900; year <= currentYear; year++) {
      const zodiac = this.getChineseZodiac(year);
      yearOptions.push({
        value: year,
        label: `${year} 年(${zodiac})`
      });
    }
    this.setData({
      yearOptions: yearOptions
    });
  },
  
  // 生成月份选项
  generateMonthOptions() {
    const options = [];
    for (let month = 1; month <= 12; month++) {
      if (this.data.calendarType === 'lunar') {
        options.push({
          value: month,
          label: this.getChineseMonth(month)
        });
      } else {
        options.push({
          value: month,
          label: `${month} 月`
        });
      }
    }
    this.setData({
      monthOptions: options
    });
  },
  
  // 生成日期选项
  generateDayOptions() {
    const options = [];
    let maxDay = 31; // 默认值
    
    // 计算实际天数
    if (this.data.calendarType === 'lunar') {
      // 阴历月份天数计算 (使用lunar库)
      try {
        // 这里需要引入lunar库计算农历月天数
        // 暂时使用默认值30天
        maxDay = 30;
      } catch (error) {
        console.error("计算阴历月天数错误:", error);
        maxDay = 30; // 默认30天
      }
    } else {
      // 阳历月份天数计算
      const daysInMonth = new Date(this.data.lunarDate.year, this.data.lunarDate.month, 0).getDate();
      maxDay = daysInMonth;
    }
    
    for (let day = 1; day <= maxDay; day++) {
      if (this.data.calendarType === 'lunar') {
        options.push({
          value: day,
          label: this.getTraditionalChineseDay(day)
        });
      } else {
        options.push({
          value: day,
          label: `${day} 日`
        });
      }
    }
    this.setData({
      dayOptions: options
    });
  },
  
  // 生成时辰选项
  generateHourOptions() {
    const hourOptions = [23, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21];
    const hourRanges = [
      "23:00-01:00", // 子时
      "01:00-03:00", // 丑时
      "03:00-05:00", // 寅时
      "05:00-07:00", // 卯时
      "07:00-09:00", // 辰时
      "09:00-11:00", // 巳时
      "11:00-13:00", // 午时
      "13:00-15:00", // 未时
      "15:00-17:00", // 申时
      "17:00-19:00", // 酉时
      "19:00-21:00", // 戌时
      "21:00-23:00"  // 亥时
    ];
    
    const diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    
    const options = hourOptions.map((hour, index) => ({
      value: hour,
      label: `${hourRanges[index]} (${diZhi[index]})`
    }));
    
    // 计算当前小时对应的索引
    const hourIndex = options.findIndex(item => item.value === this.data.lunarDate.hour);
    
    this.setData({
      hourOptions: options,
      hourIndex: hourIndex >= 0 ? hourIndex : 0 // 如果找不到匹配项，默认选择第一项
    });
  },
  
  // 处理日期类型切换
  handleCalendarTypeChange(e) {
    const type = e.currentTarget.dataset.type;
    if (type === this.data.calendarType) return;
    
    this.setData({
      calendarType: type
    });
    
    // 当切换日期类型时，保持日期一致
    if (type === 'lunar' && this.data.solarDate) {
      // 阳历转阴历
      // 这里需要引入lunar库进行转换
      // 暂时使用默认值
      this.setData({
        displayLunarDate: null // 阴历模式不需要额外显示
      });
    } else if (type === 'solar' && this.data.lunarDate) {
      // 阴历转阳历
      // 这里需要引入lunar库进行转换
      // 暂时使用默认值
      this.setData({
        displayLunarDate: this.data.lunarDate // 保存原始阴历日期用于显示
      });
    }
    
    // 更新月份和日期选项
    this.generateMonthOptions();
    this.generateDayOptions();
  },
  
  // 处理输入变化
  handleInputChange(e) {
    const { field } = e.currentTarget.dataset;
    const value = parseInt(e.detail.value, 10);
    
    // 更新当前使用的日期
    const newDate = { ...this.data.lunarDate };
    newDate[field] = value;
    
    // 如果是时辰变更，更新hourIndex
    let updateData = { lunarDate: newDate };
    if (field === 'hour') {
      const hourIndex = this.data.hourOptions.findIndex(item => item.value === value);
      updateData.hourIndex = hourIndex >= 0 ? hourIndex : 0;
    }
    
    this.setData(updateData);
    
    // 如果是阳历模式，更新对应的阴历日期显示
    if (this.data.calendarType === 'solar') {
      this.setData({
        solarDate: newDate
      });
      
      // 同时更新对应的阴历日期显示
      try {
        // 这里需要引入lunar库进行转换
        // 暂时使用默认值
        this.setData({
          displayLunarDate: newDate // 更新显示用的阴历日期
        });
      } catch (error) {
        console.error("阳历转阴历错误:", error);
      }
    } else {
      // 阴历模式，更新对应的阳历日期显示
      try {
        // 这里需要引入lunar库进行转换
        // 暂时使用默认值
        this.setData({
          solarDate: newDate
        });
      } catch (error) {
        console.error("阴历转阳历错误:", error);
      }
    }
    
    // 更新日期选项
    if (field === 'year' || field === 'month') {
      this.generateDayOptions();
    }
  },
  
  // 处理计算按钮点击
  handleCalculate() {
    console.log('推算八字按钮被点击');
    
    // 设置loading状态
    this.setData({
      loading: true
    });
    
    // 确保日期数据有效
    if (!this.data.lunarDate || !this.data.lunarDate.year) {
      console.error('日期数据无效:', this.data.lunarDate);
      wx.showToast({
        title: '日期数据无效，请重新选择',
        icon: 'none',
        duration: 2000
      });
      this.setData({ loading: false });
      return;
    }
    
    try {
      console.log('准备计算八字，输入数据:', this.data.lunarDate);
      
      // 使用全局方法计算八字
      const { year, month, day, hour } = this.data.lunarDate;
      const result = app.calculateBazi({ year, month, day, hour: hour || 0 });
      console.log('八字计算结果:', result);
      
      // 检查是否有错误
      if (result && result.error) {
        console.error('八字计算错误:', result.error);
        wx.showToast({
          title: result.error,
          icon: 'none',
          duration: 2000
        });
        this.setData({ loading: false });
        return;
      }
      
      if (result) {
        // 计算成功，将参数保存到全局变量，因为switchTab不能直接传参
        app.globalData = app.globalData || {};
        app.globalData.baziParams = {
          year: this.data.lunarDate.year,
          month: this.data.lunarDate.month,
          day: this.data.lunarDate.day,
          hour: this.data.lunarDate.hour,
          gender: 1
        };
        console.log('参数已保存到全局变量，准备跳转到结果页面');
        
        // 使用switchTab跳转到结果页面（不能带参数）
        wx.switchTab({
          url: '/pages/result/result',
          success: function() {
            console.log('跳转成功');
          },
          fail: function(err) {
            console.error('跳转失败:', err);
            wx.showToast({
              title: '页面跳转失败，请重试',
              icon: 'none',
              duration: 2000
            });
          }
        });
      } else {
        // 计算失败，显示错误提示
        console.error('计算八字返回空结果');
        wx.showToast({
          title: '计算八字失败，请重试',
          icon: 'none',
          duration: 2000
        });
      }
    } catch (error) {
      console.error('计算八字出错:', error);
      wx.showToast({
        title: '计算八字出错，请重试',
        icon: 'none',
        duration: 2000
      });
    } finally {
      // 无论成功失败都重置loading状态
      this.setData({
        loading: false
      });
    }
  },
  
  // 获取生肖
  getChineseZodiac(year) {
    const zodiac = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
    return zodiac[(year - 4) % 12];
  },
  
  // 获取农历月份名称
  getChineseMonth(month) {
    const chineseMonths = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月'];
    return chineseMonths[month - 1];
  },
  
  // 获取农历日期名称
  getTraditionalChineseDay(day) {
    const chineseDays = [
      '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
      '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
      '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
    ];
    return chineseDays[day - 1];
  }
});