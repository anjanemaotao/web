// 农历日期计算工具
function LunarCalendar() {
  // 获取农历年的总天数
  function getLunarYearDays(year) {
    let sum = 348;
    for (let i = 0x8000; i > 0x8; i >>= 1) {
      sum += (LUNAR_INFO[year - 1900] & i) ? 1 : 0;
    }
    return sum + leapDays(year);
  }

  // 获取农历年闰月的天数
  function leapDays(year) {
    if (leapMonth(year)) {
      return (LUNAR_INFO[year - 1900] & 0x10000) ? 30 : 29;
    }
    return 0;
  }

  // 获取农历年闰月月份，没有返回0
  function leapMonth(year) {
    return LUNAR_INFO[year - 1900] & 0xf;
  }

  // 获取农历年月的总天数
  function monthDays(year, month) {
    return (LUNAR_INFO[year - 1900] & (0x10000 >> month)) ? 30 : 29;
  }

  // 获取阴历日期
  function getLunarDateBySolar(year, month, day) {
    try {
      // 输入参数检查
      if (year < 1900 || year > 2100) {
        throw new Error("年份超出范围，应在1900-2100之间");
      }
      
      // 计算与1900年1月31日相差的天数
      const baseDate = new Date(1900, 0, 31);
      const targetDate = new Date(year, month - 1, day);
      let offset = Math.floor((targetDate - baseDate) / 86400000);
      
      // 计算农历年份
      let lunarYear = 1900;
      for (let i = 1900; i < 2101 && offset > 0; i++) {
        const daysInLunarYear = getLunarYearDays(i);
        offset -= daysInLunarYear;
        lunarYear++;
      }
      
      if (offset < 0) {
        offset += getLunarYearDays(--lunarYear);
      }
      
      // 计算闰月
      const leap = leapMonth(lunarYear);
      let isLeap = false;
      
      // 计算农历月份
      let lunarMonth = 1;
      let daysInLunarMonth = 0;
      for (let i = 1; i < 13 && offset > 0; i++) {
        // 闰月
        if (leap > 0 && i === (leap + 1) && !isLeap) {
          --i;
          isLeap = true;
          daysInLunarMonth = leapDays(lunarYear);
        } else {
          daysInLunarMonth = monthDays(lunarYear, i);
        }
        
        // 解除闰月
        if (isLeap && i === (leap + 1)) {
          isLeap = false;
        }
        
        offset -= daysInLunarMonth;
        lunarMonth++;
      }
      
      // 如果恰好减完，月份需要减1
      if (offset === 0 && leap > 0 && lunarMonth === leap + 1) {
        if (isLeap) {
          isLeap = false;
        } else {
          isLeap = true;
          --lunarMonth;
        }
      }
      
      if (offset < 0) {
        offset += daysInLunarMonth;
        --lunarMonth;
      }
      
      // 计算农历日期
      const lunarDay = offset + 1;
      
      return {
        lunarYear,
        lunarMonth,
        lunarDay,
        isLeap
      };
    } catch (error) {
      console.error("计算农历日期出错:", error);
      reportError(error);
      return null;
    }
  }

  // 根据农历日期获取公历日期
  function getSolarDateByLunar(lunarYear, lunarMonth, lunarDay, isLeap) {
    try {
      // 参数检查
      if (lunarYear < 1900 || lunarYear > 2100) {
        throw new Error("农历年份超出范围，应在1900-2100之间");
      }
      
      // 计算农历年初到当前农历日期的天数
      let offset = 0;
      
      // 计算上一年到当年正月的天数
      for (let i = 1900; i < lunarYear; i++) {
        offset += getLunarYearDays(i);
      }
      
      // 计算正月初一到目标日期的天数
      const leap = leapMonth(lunarYear);
      
      // 处理闰月
      if (isLeap && leap !== lunarMonth) {
        throw new Error("该年没有闰" + lunarMonth + "月");
      }
      
      // 计算月份天数
      for (let i = 1; i < lunarMonth; i++) {
        // 处理闰月
        if (i === leap) {
          offset += leapDays(lunarYear);
        }
        offset += monthDays(lunarYear, i);
      }
      
      // 如果是闰月，需要加上前一个月的天数
      if (isLeap) {
        offset += monthDays(lunarYear, lunarMonth);
      }
      
      // 加上当月的天数
      offset += lunarDay - 1;
      
      // 计算阳历日期
      const baseDate = new Date(1900, 0, 31);
      const date = new Date(baseDate.getTime() + offset * 86400000);
      
      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      };
    } catch (error) {
      console.error("计算阳历日期出错:", error);
      reportError(error);
      return null;
    }
  }

  // 获取农历日期的中文表示
  function getLunarDateString(lunarDate) {
    if (!lunarDate) return "";
    
    const { lunarYear, lunarMonth, lunarDay, isLeap } = lunarDate;
    
    // 年份转换为天干地支
    const yearGan = CELESTIAL_STEMS[(lunarYear - 4) % 10];
    const yearZhi = TERRESTRIAL_BRANCHES[(lunarYear - 4) % 12];
    
    // 月份和日期转换为中文
    const monthStr = (isLeap ? "闰" : "") + LUNAR_MONTHS[lunarMonth - 1] + "月";
    const dayStr = LUNAR_DAYS[lunarDay - 1];
    
    return `${yearGan}${yearZhi}年 ${monthStr} ${dayStr}`;
  }

  // 获取时辰的天干地支
  function getHourGanZhi(dayGan, hour) {
    // 将小时转换为时辰地支
    let hourZhi = "";
    for (const [zhi, hours] of Object.entries(BRANCH_HOURS)) {
      if (hours.includes(hour) || (zhi === "子" && (hour === 23 || hour === 0))) {
        hourZhi = zhi;
        break;
      }
    }
    
    // 计算时辰天干
    const dayGanIndex = CELESTIAL_STEMS.indexOf(dayGan);
    const baseHourGanIndex = (dayGanIndex % 5) * 2;
    const hourZhiIndex = TERRESTRIAL_BRANCHES.indexOf(hourZhi);
    const hourGanIndex = (baseHourGanIndex + hourZhiIndex) % 10;
    const hourGan = CELESTIAL_STEMS[hourGanIndex];
    
    return {
      gan: hourGan,
      zhi: hourZhi,
      ganZhi: hourGan + hourZhi
    };
  }

  // 获取日柱的天干地支
  function getDayGanZhi(year, month, day) {
    // 计算距离1900年1月31日的天数
    const baseDate = new Date(1900, 0, 31);
    const targetDate = new Date(year, month - 1, day);
    const offset = Math.floor((targetDate - baseDate) / 86400000);
    
    // 1900年1月31日的天干地支为 "庚午"
    const ganIndex = (6 + offset) % 10;
    const zhiIndex = (6 + offset) % 12;
    
    return {
      gan: CELESTIAL_STEMS[ganIndex],
      zhi: TERRESTRIAL_BRANCHES[zhiIndex],
      ganZhi: CELESTIAL_STEMS[ganIndex] + TERRESTRIAL_BRANCHES[zhiIndex]
    };
  }

  // 获取月柱的天干地支
  function getMonthGanZhi(year, month) {
    // 计算月干支
    // 1900年1月为 "丙寅"月，月干支以节气为准
    // 这里简化处理，以公历月份计算
    const yearGanIndex = (year - 1900 + 36) % 10;
    const baseIndex = yearGanIndex % 5 * 2;
    
    // 月干支索引，正月（农历一月）对应寅月
    const monthZhiIndex = (month + 1) % 12;
    const monthGanIndex = (baseIndex + monthZhiIndex) % 10;
    
    return {
      gan: CELESTIAL_STEMS[monthGanIndex],
      zhi: TERRESTRIAL_BRANCHES[monthZhiIndex],
      ganZhi: CELESTIAL_STEMS[monthGanIndex] + TERRESTRIAL_BRANCHES[monthZhiIndex]
    };
  }

  // 获取年柱的天干地支
  function getYearGanZhi(year) {
    // 年干支，以立春为准
    // 这里简化处理，以公历年计算
    const offset = year - 1900 + 36; // 1900年为庚子年
    const ganIndex = offset % 10;
    const zhiIndex = offset % 12;
    
    return {
      gan: CELESTIAL_STEMS[ganIndex],
      zhi: TERRESTRIAL_BRANCHES[zhiIndex],
      ganZhi: CELESTIAL_STEMS[ganIndex] + TERRESTRIAL_BRANCHES[zhiIndex]
    };
  }

  return {
    getLunarDateBySolar,
    getSolarDateByLunar,
    getLunarDateString,
    getHourGanZhi,
    getDayGanZhi,
    getMonthGanZhi,
    getYearGanZhi
  };
}
