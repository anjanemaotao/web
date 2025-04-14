// 八字计算器
const lunar = require('../libs/lunar.js');

// 天干
const tianGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

// 地支
const diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 天干五行
const tianGanWuxing = {
  '甲': '木', '乙': '木', '丙': '火', '丁': '火',
  '戊': '土', '己': '土', '庚': '金', '辛': '金',
  '壬': '水', '癸': '水'
};

// 地支五行
const diZhiWuxing = {
  '寅': '木', '卯': '木', '巳': '火', '午': '火',
  '辰': '土', '戌': '土', '丑': '土', '未': '土',
  '申': '金', '酉': '金', '亥': '水', '子': '水'
};

// 地支藏干
const diZhiCangGan = {
  '子': ['癸'],
  '丑': ['己', '癸', '辛'],
  '寅': ['甲', '丙', '戊'],
  '卯': ['乙'],
  '辰': ['戊', '乙', '癸'],
  '巳': ['丙', '庚', '戊'],
  '午': ['丁', '己'],
  '未': ['己', '丁', '乙'],
  '申': ['庚', '壬', '戊'],
  '酉': ['辛'],
  '戌': ['戊', '辛', '丁'],
  '亥': ['壬', '甲']
};

// 阴阳属性
const yinYang = {
  '甲': '阳', '乙': '阴', '丙': '阳', '丁': '阴',
  '戊': '阳', '己': '阴', '庚': '阳', '辛': '阴',
  '壬': '阳', '癸': '阴',
  '子': '阳', '丑': '阴', '寅': '阳', '卯': '阴',
  '辰': '阳', '巳': '阴', '午': '阳', '未': '阴',
  '申': '阳', '酉': '阴', '戌': '阳', '亥': '阴'
};

// 特殊日期八字表 - 用于处理特定日期的计算
const specialDates = {
  // 格式: 'YYYY-MM-DD': { year: '干支', month: '干支', day: '干支', hours: { '时辰小时': '干支' } }
};

// 计算年柱
const calculateYearPillar = (year) => {
  const tianGanIndex = (year - 4) % 10;
  const diZhiIndex = (year - 4) % 12;
  return {
    gan: tianGan[tianGanIndex],
    zhi: diZhi[diZhiIndex],
    ganZhi: tianGan[tianGanIndex] + diZhi[diZhiIndex]
  };
};

// 计算月柱 - 使用lunar库的getMonthInGanZhi方法
const calculateMonthPillar = (lunarDate) => {
  try {
    // 使用lunar库获取月干支
    const lunarObj = lunar.Lunar.fromYmd(lunarDate.year, lunarDate.month, lunarDate.day);
    const monthGanZhi = lunarObj.getMonthInGanZhi();
    
    // 拆分月干支
    const gan = monthGanZhi.substring(0, 1);
    const zhi = monthGanZhi.substring(1);
    
    return {
      gan: gan,
      zhi: zhi,
      ganZhi: monthGanZhi
    };
  } catch (error) {
    console.error("计算月柱错误:", error);
    
    // 返回一个默认值，避免应用崩溃
    return {
      gan: '甲',
      zhi: '寅',
      ganZhi: '甲寅'
    };
  }
};

// 计算日柱
const calculateDayPillar = (lunarDate) => {
  // 使用lunar库计算日柱
  try {
    const lunarObj = lunar.Lunar.fromYmd(lunarDate.year, lunarDate.month, lunarDate.day);
    const dayGanZhi = lunarObj.getDayInGanZhi();
    const gan = dayGanZhi.substring(0, 1);
    const zhi = dayGanZhi.substring(1);
    return {
      gan,
      zhi,
      ganZhi: gan + zhi
    };
  } catch (error) {
    console.error("计算日柱错误:", error);
    return {
      gan: '甲',
      zhi: '子',
      ganZhi: '甲子'
    };
  }
};

// 计算时柱
const calculateHourPillar = (dayGan, hour) => {
  // 将小时转换为时辰索引 (0-11)
  let hourIndex;
  
  // 根据传入的小时确定时辰索引
  if (hour >= 23 || hour < 1) hourIndex = 0; // 子时 23:00-01:00
  else if (hour >= 1 && hour < 3) hourIndex = 1; // 丑时 01:00-03:00
  else if (hour >= 3 && hour < 5) hourIndex = 2; // 寅时 03:00-05:00
  else if (hour >= 5 && hour < 7) hourIndex = 3; // 卯时 05:00-07:00
  else if (hour >= 7 && hour < 9) hourIndex = 4; // 辰时 07:00-09:00
  else if (hour >= 9 && hour < 11) hourIndex = 5; // 巳时 09:00-11:00
  else if (hour >= 11 && hour < 13) hourIndex = 6; // 午时 11:00-13:00
  else if (hour >= 13 && hour < 15) hourIndex = 7; // 未时 13:00-15:00
  else if (hour >= 15 && hour < 17) hourIndex = 8; // 申时 15:00-17:00
  else if (hour >= 17 && hour < 19) hourIndex = 9; // 酉时 17:00-19:00
  else if (hour >= 19 && hour < 21) hourIndex = 10; // 戌时 19:00-21:00
  else hourIndex = 11; // 亥时 21:00-23:00
  
  const hourZhi = diZhi[hourIndex];
  
  // 根据日干确定时干的起始索引
  let startIndex;
  if (['甲', '己'].includes(dayGan)) startIndex = 0; // 甲己日起甲子时
  else if (['乙', '庚'].includes(dayGan)) startIndex = 2; // 乙庚日起丙子时
  else if (['丙', '辛'].includes(dayGan)) startIndex = 4; // 丙辛日起戊子时
  else if (['丁', '壬'].includes(dayGan)) startIndex = 6; // 丁壬日起庚子时
  else startIndex = 8; // 戊癸日起壬子时
  
  const hourGanIndex = (startIndex + hourIndex) % 10;
  return {
    gan: tianGan[hourGanIndex],
    zhi: hourZhi,
    ganZhi: tianGan[hourGanIndex] + hourZhi
  };
};

// 获取阴历日期
const getLunarDate = (year, month, day) => {
  try {
    // 使用lunar库进行转换
    const lunarObj = lunar.Lunar.fromYmd(year, month, day);
    
    // 返回阴历日期对象
    return {
      year: lunarObj.getYear(),
      month: lunarObj.getMonth(),
      day: lunarObj.getDay(),
      hour: 0 // 默认时辰为0
    };
  } catch (error) {
    console.error('转换阴历日期出错:', error);
    // 返回原始日期作为备选
    return {
      year: year,
      month: month,
      day: day,
      hour: 0
    };
  }
};

// 计算八字
const calculateBazi = (lunarDate) => {
  // 参数验证 - 第一步：检查是否为对象
  if (!lunarDate || typeof lunarDate !== 'object') {
    console.error('calculateBazi函数需要一个包含year、month、day的对象参数，收到:', lunarDate);
    return { error: '参数错误：需要日期对象' };
  }
  
  // 参数验证 - 第二步：检查必要属性
  if (!lunarDate.year || !lunarDate.month || !lunarDate.day) {
    console.error('日期对象缺少必要属性:', lunarDate);
    return { error: '参数错误：日期对象缺少年、月或日' };
  }
  
  // 参数验证 - 第三步：检查属性类型和范围
  const year = parseInt(lunarDate.year, 10);
  const month = parseInt(lunarDate.month, 10);
  const day = parseInt(lunarDate.day, 10);
  const hour = parseInt(lunarDate.hour || 0, 10);
  
  if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hour)) {
    console.error('日期属性必须为数字:', lunarDate);
    return { error: '参数错误：日期属性必须为数字' };
  }
  
  if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 30) {
    console.error('日期属性超出有效范围:', lunarDate);
    return { error: '参数错误：日期超出有效范围' };
  }
  
  // 设置默认时辰
  lunarDate.hour = hour;
  
  try {
    console.log('baziCalculator.js - calculateBazi 函数被调用，参数:', lunarDate);
    
    // 检查是否为特殊日期
    const dateKey = `${lunarDate.year}-${lunarDate.month}-${lunarDate.day}`;
    if (specialDates[dateKey] && specialDates[dateKey].hours && specialDates[dateKey].hours[lunarDate.hour]) {
      const special = specialDates[dateKey];
      const hourGanZhi = special.hours[lunarDate.hour];
      
      // 拆分干支
      const yearGan = special.year.charAt(0);
      const yearZhi = special.year.charAt(1);
      const monthGan = special.month.charAt(0);
      const monthZhi = special.month.charAt(1);
      const dayGan = special.day.charAt(0);
      const dayZhi = special.day.charAt(1);
      const hourGan = hourGanZhi.charAt(0);
      const hourZhi = hourGanZhi.charAt(1);
      
      return {
        yearPillar: { gan: yearGan, zhi: yearZhi, ganZhi: special.year },
        monthPillar: { gan: monthGan, zhi: monthZhi, ganZhi: special.month },
        dayPillar: { gan: dayGan, zhi: dayZhi, ganZhi: special.day },
        hourPillar: { gan: hourGan, zhi: hourZhi, ganZhi: hourGanZhi },
        bazi: `${special.year} ${special.month} ${special.day} ${hourGanZhi}`
      };
    }
    
    // 正常计算
    console.log('计算年柱...');
    const yearPillar = calculateYearPillar(lunarDate.year);
    
    console.log('计算月柱...');
    const monthPillar = calculateMonthPillar(lunarDate);
    
    console.log('计算日柱...');
    const dayPillar = calculateDayPillar(lunarDate);
    
    console.log('计算时柱...');
    const hourPillar = calculateHourPillar(dayPillar.gan, lunarDate.hour);
    
    const result = {
      yearPillar,
      monthPillar,
      dayPillar,
      hourPillar,
      bazi: `${yearPillar.ganZhi} ${monthPillar.ganZhi} ${dayPillar.ganZhi} ${hourPillar.ganZhi}`
    };
    
    console.log('八字计算完成:', result);
    return result;
  } catch (error) {
    console.error("计算八字错误:", error);
    console.error("错误堆栈:", error.stack);
    return null;
  }
};

// 阴历转阳历
const lunarToSolar = (lunarDate) => {
  try {
    console.log('baziCalculator.js - lunarToSolar 函数被调用，参数:', lunarDate);
    
    // 验证输入数据
    if (!lunarDate || typeof lunarDate !== 'object') {
      console.error('无效的阴历日期对象:', lunarDate);
      return null;
    }
    
    if (!lunarDate.year || !lunarDate.month || !lunarDate.day) {
      console.error('阴历日期对象缺少必要属性:', lunarDate);
      return null;
    }
    
    // 确保参数为数字类型
    const year = parseInt(lunarDate.year, 10);
    const month = parseInt(lunarDate.month, 10);
    const day = parseInt(lunarDate.day, 10);
    
    console.log(`尝试转换阴历日期: ${year}年${month}月${day}日`);
    
    const lunarObj = lunar.Lunar.fromYmd(year, month, day);
    const solar = lunarObj.getSolar();
    
    const result = {
      year: solar.getYear(),
      month: solar.getMonth(),
      day: solar.getDay(),
      hour: lunarDate.hour
    };
    
    console.log('转换结果 (阳历):', result);
    return result;
  } catch (error) {
    console.error("阴历转阳历错误:", error);
    console.error("错误堆栈:", error.stack);
    return null;
  }
};

// 阳历转阴历
const solarToLunar = (solarDate) => {
  try {
    const solarObj = lunar.Solar.fromYmd(solarDate.year, solarDate.month, solarDate.day);
    const lunarObj = solarObj.getLunar();
    
    return {
      year: lunarObj.getYear(),
      month: lunarObj.getMonth(),
      day: lunarObj.getDay(),
      hour: solarDate.hour
    };
  } catch (error) {
    console.error("阳历转阴历错误:", error);
    return null;
  }
};

// 获取干支的五行属性
const getWuxing = (ganOrZhi) => {
  if (tianGanWuxing[ganOrZhi]) {
    return tianGanWuxing[ganOrZhi];
  } else if (diZhiWuxing[ganOrZhi]) {
    return diZhiWuxing[ganOrZhi];
  }
  return null;
};

// 获取干支的阴阳属性
const getYinYang = (ganOrZhi) => {
  return yinYang[ganOrZhi] || null;
};

// 获取地支藏干
const getCangGan = (zhi) => {
  return diZhiCangGan[zhi] || [];
};

module.exports = {
  calculateBazi,
  lunarToSolar,
  solarToLunar,
  getWuxing,
  getYinYang,
  getCangGan,
  getLunarDate,
  tianGan,
  diZhi,
  tianGanWuxing,
  diZhiWuxing,
  diZhiCangGan,
  yinYang
};