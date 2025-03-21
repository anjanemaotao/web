function LunarCalendar() {
  // 农历1900-2100的闰大小信息表
  const lunarInfo = [
    0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
    0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
    0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
    0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
    0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
    0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0,
    0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
    0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6,
    0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
    0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
    0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
    0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
    0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
    0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
    0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0
  ];

  // 天干
  const heavenlyStems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
  
  // 地支
  const earthlyBranches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
  
  // 地支对应时辰
  const branchToHour = {
    "子": "23-1",
    "丑": "1-3",
    "寅": "3-5",
    "卯": "5-7",
    "辰": "7-9",
    "巳": "9-11",
    "午": "11-13",
    "未": "13-15",
    "申": "15-17",
    "酉": "17-19",
    "戌": "19-21",
    "亥": "21-23"
  };

  // 农历年份信息
  function leapMonth(y) {
    return lunarInfo[y - 1900] & 0xf;
  }

  function leapDays(y) {
    if (leapMonth(y)) {
      return (lunarInfo[y - 1900] & 0x10000) ? 30 : 29;
    }
    return 0;
  }

  function monthDays(y, m) {
    return (lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29;
  }

  function yearDays(y) {
    let sum = 348;
    for (let i = 0x8000; i > 0x8; i >>= 1) {
      sum += (lunarInfo[y - 1900] & i) ? 1 : 0;
    }
    return sum + leapDays(y);
  }

  // 公历转农历
  function solarToLunar(year, month, day) {
    if (year < 1900 || year > 2100) {
      return {
        error: "年份超出范围，请输入1900-2100之间的年份"
      };
    }

    const solarDate = new Date(year, month - 1, day);
    let offset = (Date.UTC(solarDate.getFullYear(), solarDate.getMonth(), solarDate.getDate()) - Date.UTC(1900, 0, 31)) / 86400000;
    
    let i;
    for (i = 1900; i < 2101 && offset > 0; i++) {
      offset -= yearDays(i);
    }
    if (offset < 0) {
      offset += yearDays(--i);
    }
    
    const year_lunar = i;
    
    const leap = leapMonth(i);
    let isLeap = false;
    
    for (i = 1; i < 13 && offset > 0; i++) {
      let temp;
      if (leap > 0 && i === leap + 1 && !isLeap) {
        --i;
        isLeap = true;
        temp = leapDays(year_lunar);
      } else {
        temp = monthDays(year_lunar, i);
      }
      
      if (isLeap && i === leap + 1) {
        isLeap = false;
      }
      offset -= temp;
    }
    
    if (offset === 0 && leap > 0 && i === leap + 1) {
      if (isLeap) {
        isLeap = false;
      } else {
        isLeap = true;
        --i;
      }
    }
    
    if (offset < 0) {
      offset += temp;
      --i;
    }
    
    const month_lunar = i;
    const day_lunar = offset + 1;
    
    return {
      year: year_lunar,
      month: month_lunar,
      day: day_lunar,
      isLeap: isLeap
    };
  }

  // 农历转公历
  function lunarToSolar(year, month, day, isLeap) {
    if (year < 1900 || year > 2100) {
      return {
        error: "年份超出范围，请输入1900-2100之间的年份"
      };
    }
    
    let offset = 0;
    
    // 计算从1900年1月31日到农历某年正月初一的天数
    for (let i = 1900; i < year; i++) {
      offset += yearDays(i);
    }
    
    // 计算农历年份中，从正月初一到指定月份的天数
    let leap = leapMonth(year);
    if (isLeap && leap !== month) {
      return {
        error: "该年没有闰" + month + "月"
      };
    }
    
    if (isLeap) {
      month = month + 1;
    }
    
    for (let i = 1; i < month; i++) {
      if (i === leap && isLeap) {
        offset += leapDays(year);
      } else {
        offset += monthDays(year, i);
      }
    }
    
    // 加上当月的天数
    offset += parseInt(day, 10) - 1;
    
    // 1900年1月31日的公历
    const baseDate = new Date(1900, 0, 31);
    
    // 计算公历日期
    const date = new Date(baseDate.getTime() + offset * 24 * 3600 * 1000);
    
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    };
  }

  // 获取农历年的天干地支
  function cyclical(year) {
    const num = year - 1900 + 36;
    return {
      heavenlyStem: heavenlyStems[num % 10],
      earthlyBranch: earthlyBranches[num % 12]
    };
  }

  // 获取月份的天干地支
  function getMonthGanZhi(year, month) {
    // 月干公式: (年干序号 * 2 + 月序号) % 10
    // 年干序号从0开始，月序号从0开始
    const yearGanIndex = (year - 1900 + 36) % 10;
    // 寅月为正月，需要将农历月份转换为节气月
    const monthOffset = (month + 1) % 12;
    // 月干 = (年干 × 2 + 月数 - 1) % 10
    const monthGanIndex = (yearGanIndex * 2 + monthOffset - 1) % 10;
    // 月支 = (月数 + 2) % 12
    const monthZhiIndex = (monthOffset + 1) % 12;
    
    return {
      heavenlyStem: heavenlyStems[monthGanIndex],
      earthlyBranch: earthlyBranches[monthZhiIndex]
    };
  }

  // 获取日的天干地支
  function getDayGanZhi(year, month, day) {
    // 计算距离1900年1月31日的天数
    // 1900年1月31日是庚子日，天干索引为6，地支索引为0
    const date = new Date(year, month - 1, day);
    const baseDate = new Date(1900, 0, 31);
    const offset = Math.floor((date - baseDate) / 86400000);
    
    // 根据偏移量计算天干地支索引
    // 天干索引 = (偏移量 + 6) % 10，6是庚的索引
    // 地支索引 = (偏移量 + 0) % 12，0是子的索引
    // 注意：JavaScript的取模运算对负数的处理与我们需要的不同，所以需要特殊处理
    let stemIndex = (offset + 6) % 10;
    let branchIndex = (offset + 0) % 12;
    
    // 处理负数情况
    if (stemIndex < 0) stemIndex = stemIndex + 10;
    if (branchIndex < 0) branchIndex = branchIndex + 12;
    
    return {
      heavenlyStem: heavenlyStems[stemIndex],
      earthlyBranch: earthlyBranches[branchIndex]
    };
  }

  // 获取时辰的天干地支
  function getHourGanZhi(dayGan, hour) {
    // 日干对应的时辰干支起始序号
    // 甲己日起甲子，乙庚日起丙子，丙辛日起戊子，丁壬日起庚子，戊癸日起壬子
    const dayGanIndex = heavenlyStems.indexOf(dayGan);
    
    // 时辰地支序号 (0-11)
    let hourBranchIndex;
    if (hour >= 23 || hour < 1) {
      hourBranchIndex = 0; // 子时 (23-1点)
    } else if (hour >= 1 && hour < 3) {
      hourBranchIndex = 1; // 丑时 (1-3点)
    } else if (hour >= 3 && hour < 5) {
      hourBranchIndex = 2; // 寅时 (3-5点)
    } else if (hour >= 5 && hour < 7) {
      hourBranchIndex = 3; // 卯时 (5-7点)
    } else if (hour >= 7 && hour < 9) {
      hourBranchIndex = 4; // 辰时 (7-9点)
    } else if (hour >= 9 && hour < 11) {
      hourBranchIndex = 5; // 巳时 (9-11点)
    } else if (hour >= 11 && hour < 13) {
      hourBranchIndex = 6; // 午时 (11-13点)
    } else if (hour >= 13 && hour < 15) {
      hourBranchIndex = 7; // 未时 (13-15点)
    } else if (hour >= 15 && hour < 17) {
      hourBranchIndex = 8; // 申时 (15-17点)
    } else if (hour >= 17 && hour < 19) {
      hourBranchIndex = 9; // 酉时 (17-19点)
    } else if (hour >= 19 && hour < 21) {
      hourBranchIndex = 10; // 戌时 (19-21点)
    } else {
      hourBranchIndex = 11; // 亥时 (21-23点)
    }
    
    // 根据日干确定子时天干（按照口诀：甲己还加甲，乙庚丙作初；丙辛从戊起，丁壬庚子居；戊癸何方发，壬子是真途）
    let baseHourStem;
    if (dayGanIndex === 0 || dayGanIndex === 5) { // 甲己日
      baseHourStem = 0; // 甲
    } else if (dayGanIndex === 1 || dayGanIndex === 6) { // 乙庚日
      baseHourStem = 2; // 丙
    } else if (dayGanIndex === 2 || dayGanIndex === 7) { // 丙辛日
      baseHourStem = 4; // 戊
    } else if (dayGanIndex === 3 || dayGanIndex === 8) { // 丁壬日
      baseHourStem = 6; // 庚
    } else { // 戊癸日 (dayGanIndex === 4 || dayGanIndex === 9)
      baseHourStem = 8; // 壬
    }
    
    // 时辰天干 = (子时天干 + 时辰序号) % 10
    const hourStemIndex = (baseHourStem + hourBranchIndex) % 10;
    
    // 根据传统命理学规则计算时干
    // 甲己还加甲，乙庚丙作初；丙辛从戊起，丁壬庚子居；戊癸何方发，壬子是真途
    let hourStem = heavenlyStems[hourStemIndex];
    
    return {
      heavenlyStem: hourStem,
      earthlyBranch: earthlyBranches[hourBranchIndex]
    };
  }

  return {
    solarToLunar,
    lunarToSolar,
    cyclical,
    getMonthGanZhi,
    getDayGanZhi,
    getHourGanZhi,
    heavenlyStems,
    earthlyBranches,
    branchToHour
  };
}
