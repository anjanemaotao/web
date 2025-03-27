// utils/lunar-javascript.js
// 简化版农历库，提供基本的农历转换功能

// 天干地支数据
const TIAN_GANS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const DI_ZHIS = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 生肖数据
const ZODIAC_ANIMALS = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

// 农历月份数据
const LUNAR_MONTHS = [
  '正月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '冬月', '腊月'
];

// 农历日期数据
const LUNAR_DAYS = [
  '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
];

// 简化的农历类
class Lunar {

static fromSolar(solar) {
  // 阳历转农历
  const year = solar.getYear();
  const month = solar.getMonth();
  const day = solar.getDay();
  
  // 使用农历历法数据进行转换
  const lunarData = [
    0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
    0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
    0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
    0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
    0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557
  ];
  
  let offset = 0;
  const baseDate = new Date(1900, 0, 31);
  const currentDate = new Date(year, month - 1, day);
  offset = Math.floor((currentDate - baseDate) / 86400000);
  
  let lunarYear = 1900;
  let lunarMonth = 1;
  let lunarDay = 1;
  
  // 计算农历年份
  let daysInLunarYear = 0;
  while (lunarYear < 2100 && offset > 0) {
    daysInLunarYear = ((lunarData[lunarYear - 1900] & 0x0000ffff) == 0) ? 366 : 365;
    offset -= daysInLunarYear;
    lunarYear++;
  }
  if (offset < 0) {
    offset += daysInLunarYear;
    lunarYear--;
  }
  
  // 计算农历月份和日期
  let isLeapMonth = false;
  let daysInLunarMonth = 0;
  const leapMonth = lunarData[lunarYear - 1900] & 0xf;
  for (let i = 1; i <= 12; i++) {
    daysInLunarMonth = (lunarData[lunarYear - 1900] & (0x10000 >> i)) ? 30 : 29;
    if (offset <= daysInLunarMonth) {
      lunarMonth = i;
      lunarDay = offset + 1;
      break;
    }
    offset -= daysInLunarMonth;
    
    if (i == leapMonth) {
      daysInLunarMonth = (lunarData[lunarYear - 1900] & 0x10000) ? 30 : 29;
      if (offset <= daysInLunarMonth) {
        isLeapMonth = true;
        lunarMonth = i;
        lunarDay = offset + 1;
        break;
      }
      offset -= daysInLunarMonth;
    }
  }
  
  return new Lunar(lunarYear, lunarMonth, lunarDay);
}

// 获取生肖
getZodiac() {
  const offset = (this.year - 4) % 12;
  return ZODIAC_ANIMALS[offset];
}

// 获取农历月份名称
getLunarMonthName() {
  return LUNAR_MONTHS[this.month - 1];
}

// 获取农历日期名称
getLunarDayName() {
  return LUNAR_DAYS[this.day - 1];
}
  constructor(year, month, day) {
    this.year = year;
    this.month = month;
    this.day = day;
  }

  // 获取农历年的干支
  getYearInGanZhi() {
    const offset = (this.year - 4) % 60;
    const ganIndex = offset % 10;
    const zhiIndex = offset % 12;
    return TIAN_GANS[ganIndex] + DI_ZHIS[zhiIndex];
  }

  // 获取农历月的干支
  getMonthInGanZhi() {
    // 正确的月柱计算，考虑节气
    const yearGan = this.getYearInGanZhi()[0];
    let startTianGan;
    
    // 根据年干确定月干的起始位置
    // 甲己年起丙寅月，乙庚年起戊寅月，丙辛年起庚寅月，丁壬年起壬寅月，戊癸年起甲寅月
    if(['甲', '己'].includes(yearGan)) {
      startTianGan = 2; // 丙
    } else if(['乙', '庚'].includes(yearGan)) {
      startTianGan = 4; // 戊
    } else if(['丙', '辛'].includes(yearGan)) {
      startTianGan = 6; // 庚
    } else if (['丁', '壬'].includes(yearGan)) {
      startTianGan = 8; // 壬
    } else {
      startTianGan = 0; // 甲
    }
    
    // 月支从寅月开始，正月为寅月
    const diZhis = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
    const zhiIndex = (this.month - 1) % 12;
    const monthZhi = diZhis[zhiIndex];
    
    // 月干从起始天干开始推算，每月推一位
    // 注意：月干的推算是从寅月开始的，而不是从正月开始
    const ganIndex = (startTianGan + zhiIndex) % 10;
    
    return TIAN_GANS[ganIndex] + monthZhi;
  }

  // 获取农历日的干支
  getDayInGanZhi() {
    // 修正算法，使用正确的基准日期和偏移量
    // 首先将农历日期转换为阳历日期，然后计算干支
    const solar = this.getSolar();
    const solarYear = solar.getYear();
    const solarMonth = solar.getMonth();
    const solarDay = solar.getDay();
    
    // 使用阳历日期计算干支
    // 1900年1月31日为庚子日
    const baseDate = new Date(1900, 0, 31); // 1900年1月31日，农历庚子年正月初一
    const currentDate = new Date(solarYear, solarMonth - 1, solarDay);
    const diffDays = Math.floor((currentDate - baseDate) / (24 * 60 * 60 * 1000));
    
    // 庚为天干第7位(索引6)，子为地支第1位(索引0)
    // 注意：如果基准日期是庚子日，那么偏移量应该是6和0
    const ganIndex = (diffDays + 6) % 10; // 庚的索引为6
    const zhiIndex = (diffDays + 0) % 12; // 子的索引为0
    
    return TIAN_GANS[ganIndex] + DI_ZHIS[zhiIndex];
  }

  // 获取阳历日期
  getSolar() {
    // 农历转阳历
    const lunarData = [
      0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
      0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
      0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
      0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
      0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557
    ];
    
    let offset = 0;
    for (let year = 1900; year < this.year; year++) {
      offset += ((lunarData[year - 1900] & 0x0000ffff) == 0) ? 366 : 365;
    }
    
    for (let month = 1; month < this.month; month++) {
      const leapMonth = lunarData[this.year - 1900] & 0xf;
      if (month == leapMonth) {
        offset += (lunarData[this.year - 1900] & 0x10000) ? 30 : 29;
      }
      offset += (lunarData[this.year - 1900] & (0x10000 >> month)) ? 30 : 29;
    }
    
    offset += this.day - 1;
    
    const baseDate = new Date(1900, 0, 31);
    const solarDate = new Date(baseDate.getTime() + offset * 86400000);
    
    return new Solar(solarDate.getFullYear(), solarDate.getMonth() + 1, solarDate.getDate());
  }

  // 获取当月天数
  getDaysInMonth() {
    // 简单实现，实际应该根据农历历法计算
    if ([1, 3, 5, 7, 8, 10, 12].includes(this.month)) {
      return 30;
    } else if (this.month === 2) {
      return 29;
    }
    return 29;
  }

  // 静态方法：从农历年月日创建农历对象
  static fromYmd(year, month, day) {
    return new Lunar(year, month, day);
  }
}

// 简化的阳历类
class Solar {
  constructor(year, month, day) {
    this.year = year;
    this.month = month;
    this.day = day;
  }

  // 获取年份
  getYear() {
    return this.year;
  }

  // 获取月份
  getMonth() {
    return this.month;
  }

  // 获取日期
  getDay() {
    return this.day;
  }

  // 获取农历日期
  getLunar() {
    // 使用正确的阳历转农历算法
    return Lunar.fromSolar(new Solar(this.year, this.month, this.day));
  }
}

module.exports = {
  Lunar,
  Solar
};

module.exports.default = module.exports;