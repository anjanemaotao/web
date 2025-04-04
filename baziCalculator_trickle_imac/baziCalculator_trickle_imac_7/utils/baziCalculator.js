function BaziCalculator() {
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
  
  // 计算月柱 - 使用lunar-javascript库的getMonthInGanZhi方法
  const calculateMonthPillar = (lunarDate) => {
    try {
      // 使用lunar-javascript库获取月干支
      const lunar = Lunar.fromYmd(lunarDate.year, lunarDate.month, lunarDate.day);
      const monthGanZhi = lunar.getMonthInGanZhi();
      
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
      reportError(error);
      
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
    // 使用lunar-javascript库计算日柱
    try {
      const lunar = Lunar.fromYmd(lunarDate.year, lunarDate.month, lunarDate.day);
      const dayGanZhi = lunar.getDayInGanZhi();
      const gan = dayGanZhi.substring(0, 1);
      const zhi = dayGanZhi.substring(1);
      return {
        gan,
        zhi,
        ganZhi: gan + zhi
      };
    } catch (error) {
      console.error("计算日柱错误:", error);
      reportError(error);
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
  
  // 计算八字
  const calculateBazi = (lunarDate) => {
    try {
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
      const yearPillar = calculateYearPillar(lunarDate.year);
      const monthPillar = calculateMonthPillar(lunarDate);
      const dayPillar = calculateDayPillar(lunarDate);
      const hourPillar = calculateHourPillar(dayPillar.gan, lunarDate.hour);
      
      return {
        yearPillar,
        monthPillar,
        dayPillar,
        hourPillar,
        bazi: `${yearPillar.ganZhi} ${monthPillar.ganZhi} ${dayPillar.ganZhi} ${hourPillar.ganZhi}`
      };
    } catch (error) {
      console.error("计算八字错误:", error);
      reportError(error);
      return null;
    }
  };
  
  // 获取干支的五行属性
  const getWuxing = (ganOrZhi) => {
    if (tianGanWuxing[ganOrZhi]) return tianGanWuxing[ganOrZhi];
    if (diZhiWuxing[ganOrZhi]) return diZhiWuxing[ganOrZhi];
    return null;
  };
  
  // 获取干支的阴阳属性
  const getYinYang = (ganOrZhi) => {
    return yinYang[ganOrZhi] || null;
  };
  
  // 获取地支的藏干
  const getCangGan = (zhi) => {
    return diZhiCangGan[zhi] || [];
  };
  
  // 将阳历日期转换为阴历日期
  const solarToLunar = (solarDate) => {
    try {
      const solar = Solar.fromYmd(solarDate.year, solarDate.month, solarDate.day);
      const lunar = solar.getLunar();
      return {
        year: lunar.getYear(),
        month: lunar.getMonth(),
        day: lunar.getDay(),
        hour: solarDate.hour
      };
    } catch (error) {
      console.error("阳历转阴历错误:", error);
      reportError(error);
      return null;
    }
  };
  
  // 将阴历日期转换为阳历日期
  const lunarToSolar = (lunarDate) => {
    try {
      const lunar = Lunar.fromYmd(lunarDate.year, lunarDate.month, lunarDate.day);
      const solar = lunar.getSolar();
      return {
        year: solar.getYear(),
        month: solar.getMonth(),
        day: solar.getDay(),
        hour: lunarDate.hour
      };
    } catch (error) {
      console.error("阴历转阳历错误:", error);
      reportError(error);
      return null;
    }
  };
  
  // 获取生肖
  const getChineseZodiac = (year) => {
    const zodiacList = ['rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'];
    return zodiacList[(year - 4) % 12];
  };
  
  // 计算虚岁
  const calculateVirtualAge = (lunarDate) => {
    try {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      // 虚岁 = 当前年 - 出生年 + 1
      return currentYear - lunarDate.year + 1;
    } catch (error) {
      console.error("计算虚岁错误:", error);
      reportError(error);
      return 0;
    }
  };
  
  // 获取节气信息
  const getSolarTermInfo = (lunarDate) => {
    try {
      // 转换为阳历日期
      const solarDate = lunarToSolar(lunarDate);
      if (!solarDate) return null;
      
      // 获取当年的所有节气
      const year = solarDate.year;
      const solarTerms = {};
      const termTimes = {};
      
      // 使用lunar-javascript库获取节气信息
      const solar = Solar.fromYmd(solarDate.year, solarDate.month, solarDate.day);
      const lunar = solar.getLunar();
      const jieQi = lunar.getJieQiTable();
      
      // 获取24节气
      const jieQiKeys = Object.keys(jieQi);
      for (let i = 0; i < jieQiKeys.length; i++) {
        const termName = jieQiKeys[i];
        const termSolar = jieQi[termName];
        
        solarTerms[termName] = {
          date: `${termSolar.getYear()}-${termSolar.getMonth()}-${termSolar.getDay()}`,
          timestamp: new Date(termSolar.getYear(), termSolar.getMonth() - 1, termSolar.getDay()).getTime()
        };
        
        termTimes[termName] = {
          date: `${termSolar.getYear()} 年 ${termSolar.getMonth().toString().padStart(2, '0')} 月 ${termSolar.getDay().toString().padStart(2, '0')} 日 ${termSolar.getHour().toString().padStart(2, '0')}:${termSolar.getMinute().toString().padStart(2, '0')}`,
          time: termSolar.getJulianDay()
        };
      }
      
      // 计算出生日期与各节气的天数差
      const birthTimestamp = new Date(solarDate.year, solarDate.month - 1, solarDate.day).getTime();
      
      // 找出最近的前一个节气和后一个节气
      let prevTerm = null;
      let nextTerm = null;
      let nextNextTerm = null;
      let daysToPrev = Infinity;
      let daysToNext = Infinity;
      
      for (const [termName, termInfo] of Object.entries(solarTerms)) {
        const dayDiff = Math.round((birthTimestamp - termInfo.timestamp) / (24 * 60 * 60 * 1000));
        
        if (dayDiff >= 0 && dayDiff < daysToPrev) {
          daysToPrev = dayDiff;
          prevTerm = termName;
        } else if (dayDiff < 0 && Math.abs(dayDiff) < daysToNext) {
          daysToNext = Math.abs(dayDiff);
          nextTerm = termName;
        }
      }
      
      // 找出下下个节气
      if (nextTerm) {
        const termNames = Object.keys(solarTerms);
        const nextTermIndex = termNames.indexOf(nextTerm);
        if (nextTermIndex < termNames.length - 1) {
          nextNextTerm = termNames[nextTermIndex + 1];
        } else {
          // 如果是最后一个节气，则下一个是下一年的第一个节气
          nextNextTerm = termNames[0];
        }
      }
      
      return {
        prevTerm,
        nextTerm,
        nextNextTerm,
        daysToPrev,
        daysToNext,
        termTimes
      };
    } catch (error) {
      console.error("获取节气信息错误:", error);
      reportError(error);
      return null;
    }
  };
  
  // 格式化阴历日期为中文格式
  const formatLunarDate = (lunarDate) => {
    try {
      const lunar = Lunar.fromYmd(lunarDate.year, lunarDate.month, lunarDate.day);
      
      // 获取中文年份
      const yearStr = lunarDate.year.toString();
      const chineseYear = yearStr.split('').map(digit => {
        const chineseDigits = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
        return chineseDigits[parseInt(digit)];
      }).join('');
      
      // 获取中文月份
      const chineseMonths = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
      const chineseMonth = `${chineseMonths[lunarDate.month - 1]}月`;
      
      // 获取中文日期
      const chineseDay = lunar.getDayInChinese();
      
      // 获取时辰
      let hourStr = '';
      if (lunarDate.hour >= 23 || lunarDate.hour < 1) hourStr = '子';
      else if (lunarDate.hour >= 1 && lunarDate.hour < 3) hourStr = '丑';
      else if (lunarDate.hour >= 3 && lunarDate.hour < 5) hourStr = '寅';
      else if (lunarDate.hour >= 5 && lunarDate.hour < 7) hourStr = '卯';
      else if (lunarDate.hour >= 7 && lunarDate.hour < 9) hourStr = '辰';
      else if (lunarDate.hour >= 9 && lunarDate.hour < 11) hourStr = '巳';
      else if (lunarDate.hour >= 11 && lunarDate.hour < 13) hourStr = '午';
      else if (lunarDate.hour >= 13 && lunarDate.hour < 15) hourStr = '未';
      else if (lunarDate.hour >= 15 && lunarDate.hour < 17) hourStr = '申';
      else if (lunarDate.hour >= 17 && lunarDate.hour < 19) hourStr = '酉';
      else if (lunarDate.hour >= 19 && lunarDate.hour < 21) hourStr = '戌';
      else hourStr = '亥';
      
      // 格式化小时
      const formattedHour = lunarDate.hour.toString().padStart(2, '0');
      
      return {
        fullChineseDate: `${chineseYear}年${chineseMonth}${chineseDay} ${formattedHour}:00 ${hourStr}时`,
        chineseYear,
        chineseMonth,
        chineseDay,
        hourStr
      };
    } catch (error) {
      console.error("格式化阴历日期错误:", error);
      reportError(error);
      return {
        fullChineseDate: '',
        chineseYear: '',
        chineseMonth: '',
        chineseDay: '',
        hourStr: ''
      };
    }
  };
  
  // 格式化阳历日期
  const formatSolarDate = (solarDate) => {
    try {
      if (!solarDate) return '';
      return `${solarDate.year} 年 ${solarDate.month} 月 ${solarDate.day} 日`;
    } catch (error) {
      console.error("格式化阳历日期错误:", error);
      reportError(error);
      return '';
    }
  };
  
  return {
    calculateBazi,
    getWuxing,
    getYinYang,
    getCangGan,
    solarToLunar,
    lunarToSolar,
    tianGan,
    diZhi,
    getChineseZodiac,
    calculateVirtualAge,
    getSolarTermInfo,
    formatLunarDate,
    formatSolarDate
  };
}
