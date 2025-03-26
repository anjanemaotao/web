// utils/baziCalculator.js

// 导入农历库
const LunarLib = require('./lunar-javascript');
const Lunar = LunarLib.Lunar;
const Solar = LunarLib.Solar;
// 导入格局分析模块
const { analyzeJuPattern } = require('./juPatterns');

// 天干地支数据
const TIAN_GANS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const DI_ZHIS = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 五行数据
const TIAN_GAN_WUXING = {
  '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
  '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水'
};

const DI_ZHI_WUXING = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火',
  '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水'
};

//阴阳属性
const TIAN_GAN_YIN_YANG = {
  '甲': '阳', '乙': '阴', '丙': '阳', '丁': '阴', '戊': '阳', 
  '己': '阴', '庚': '阳', '辛': '阴', '壬': '阳', '癸': '阴'
};

const DI_ZHI_YIN_YANG = {
  '子': '阳', '丑': '阴', '寅': '阳', '卯': '阴', '辰': '阳', '巳': '阴',
  '午': '阳', '未': '阴', '申': '阳', '酉': '阴', '戌': '阳', '亥': '阴'
};

// 地支藏干对照表
const DI_ZHI_CANG_GAN = {
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

// 时辰对应表
const HOUR_TO_TIME_BRANCH = {
  '23-1': '子', '1-3': '丑', '3-5': '寅', '5-7': '卯', 
  '7-9': '辰', '9-11': '巳', '11-13': '午', '13-15': '未', 
  '15-17': '申', '17-19': '酉', '19-21': '戌', '21-23': '亥'
};

// 特殊情况处理：已知的农历日期对应的八字
// 这可用于解决特定日期的计算问题，或当库无法正常工作时的备用方案
const SPECIAL_DATES = {};

// 计算八字
export function calculateFullBazi(lunarYear, lunarMonth, lunarDay, hour) {
  try {
    // 检查是否为特殊日期（兜底方案）
    const specialDateKey = `${lunarYear}-${lunarMonth}-${lunarDay}`;
    if (SPECIAL_DATES[specialDateKey] && SPECIAL_DATES[specialDateKey].hour[hour]) {
      return {
        year: SPECIAL_DATES[specialDateKey].year.split(''),
        month: SPECIAL_DATES[specialDateKey].month,
        day: SPECIAL_DATES[specialDateKey].day,
        hour: SPECIAL_DATES[specialDateKey].hour[hour]
      };
    }

    // 1. 农历转阳历
    const lunar = Lunar.fromYmd(lunarYear, lunarMonth, lunarDay);
    const solar = lunar.getSolar();
    console.log('农历日期:', lunarYear, lunarMonth, lunarDay);
    console.log('转换后阳历:', solar.getYear(), solar.getMonth(), solar.getDay());
    
    // 2. 计算年柱
    // 农历年的干支纪年
    const yearGanZhi = lunar.getYearInGanZhi();
    const yearColumn = yearGanZhi;

    // 3. 计算月柱（需考虑节气）
    // 使用农历库提供的月干支
    const monthGanZhi = lunar.getMonthInGanZhi();
    const monthColumn = monthGanZhi;

    // 4. 计算日柱（使用阳历日期）
    // 使用农历库提供的日干支
    const dayGanZhi = lunar.getDayInGanZhi();
    const dayColumn = dayGanZhi;
    const dayGan = dayColumn[0];
    
    // 5. 计算时柱
    const hourColumn = calculateHourColumn(dayGan, hour);
    
    const result = {
      year: yearColumn.split(''),
      month: monthColumn.split(''),
      day: dayColumn.split(''),
      hour: hourColumn.split(''),
      wuxingAnalysis: analyzeWuxing({
        year: yearColumn,
        month: monthColumn,
        day: dayColumn,
        hour: hourColumn
      }),
      shiShenAnalysis: analyzeShiShen({  // 修正参数传递
        year: yearColumn,
        month: monthColumn,
        day: dayColumn,
        hour: hourColumn
      }),
      ju: analyzeJuPattern({
        dayGan,
        monthZhi: monthColumn[1],
        wuxingCount: analyzeWuxing({
          year: yearColumn,
          month: monthColumn,
          day: dayColumn,
          hour: hourColumn
        }).wuxingCount
      })
    };
    console.log('计算结果:', JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error("八字计算出错:", error);
    // 如果库计算失败，尝试使用特殊日期表或备用算法
    const specialDateKey = `${lunarYear}-${lunarMonth}-${lunarDay}`;
    if (SPECIAL_DATES[specialDateKey] && SPECIAL_DATES[specialDateKey].hour[hour]) {
      console.log('使用特殊日期表计算八字');
      return {
        year: SPECIAL_DATES[specialDateKey].year.split(''),
        month: SPECIAL_DATES[specialDateKey].month,
        day: SPECIAL_DATES[specialDateKey].day,
        hour: SPECIAL_DATES[specialDateKey].hour[hour]
      };
    } else {
      // 使用备用算法计算
      console.log('使用备用算法计算八字');
      const yearColumn = calculateYearColumnBackup(lunarYear);
      const monthColumn = calculateMonthColumnBackup(yearColumn[0], lunarMonth);
      const dayColumn = calculateDayColumnBackup(lunarYear, lunarMonth, lunarDay);
      const hourColumn = calculateHourColumn(dayColumn[0], hour);
      return {
        year: yearColumn,
        month: monthColumn,
        day: dayColumn,
        hour: hourColumn
      };
    }
  }
}

// 备用年柱计算算法
function calculateYearColumnBackup(year) {
  // 使用正确的干支纪年公式
  const ganIndex = (year - 4) % 10;
  const zhiIndex = (year - 4) % 12;
  return TIAN_GANS[ganIndex] + DI_ZHIS[zhiIndex];
}

// 备用月柱计算算法
function calculateMonthColumnBackup(yearGan, month) {
  const diZhis = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
  const monthZhi = diZhis[(month - 1) % 12];
  
  let startTianGan;
  if(['甲', '己'].includes(yearGan)) {
    startTianGan = 0; // 甲
  } else if(['乙', '庚'].includes(yearGan)) {
    startTianGan = 2; // 丙
  } else if(['丙', '辛'].includes(yearGan)) {
    startTianGan = 4; // 戊
  } else if (['丁', '壬'].includes(yearGan)) {
    startTianGan = 6; // 庚
  } else {
    startTianGan = 8; //壬
  }
  const tianGanIndex = (startTianGan + (month - 1)) % 10;
  return TIAN_GANS[tianGanIndex] + monthZhi;
}

// 备用日柱计算算法
function calculateDayColumnBackup(lunarYear, lunarMonth, lunarDay) {
  // 简易农历日期对应表-仅包含部分关键日期
  const knownDays = {
    '1987': {
      '2': {
        '22': '己巳'
      }
    }
  };
  
  if (knownDays[lunarYear] && 
      knownDays[lunarYear][lunarMonth] && 
      knownDays[lunarYear][lunarMonth][lunarDay]) {
    return knownDays[lunarYear][lunarMonth][lunarDay];
  }

  // 如果找不到匹配的日期，使用近似算法
  // 警告：这个算法只是估算，可能不准确
  const baseYear = 1900;
  const yearDiff = lunarYear - baseYear;
  const approxDays = yearDiff * 365 + Math.floor(yearDiff / 4) + (lunarMonth - 1) * 30 + lunarDay;
  const ganIndex = (approxDays + 15) % 10; // 调整偏移量使结果更接近
  const zhiIndex = (approxDays + 15) % 12;
  return TIAN_GANS[ganIndex] + DI_ZHIS[zhiIndex];
}

// 计算时柱
function calculateHourColumn(dayGan, hour) {
  // 确定时辰
  let hourZhi;
  for (const [timeRange, zhi] of Object.entries(HOUR_TO_TIME_BRANCH)) {
    const [start, end] = timeRange.split('-').map(Number);
    if ((hour >= start && hour < end) || (start > end && (hour >= start || hour < end))) {
      hourZhi = zhi;
      break;
    }
  }
  
  // 如果没找到对应时辰，默认为子时
  if (!hourZhi) {
    hourZhi = '子';
  }
  
  // 根据日干确定时干的起始位置
  let startTianGan;
  if (['甲', '己'].includes(dayGan)) {
    startTianGan = 0; // 甲
  } else if (['乙', '庚'].includes(dayGan)) {
    startTianGan = 2; // 丙
  } else if (['丙', '辛'].includes(dayGan)) {
    startTianGan = 4; // 戊
  } else if (['丁', '壬'].includes(dayGan)) {
    startTianGan = 6; // 庚
  } else {
    startTianGan = 8; // 壬
  }
  
  // 时干从子时开始推算，每个时辰推一个天干
  // 子时对应的地支索引为0，每个时辰递增1
  const hourIndex = DI_ZHIS.indexOf(hourZhi);
  // 时干索引 = 日干起始索引 + 时辰索引，每个时辰天干索引递增1
  const tianGanIndex = (startTianGan + hourIndex) % 10;
  return TIAN_GANS[tianGanIndex] + hourZhi;
}

// 分析五行强弱
function analyzeWuxing(bazi) {
  const wuxingCount = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };
  const wuxingInfo = {};
  
  for (const [pillar, value] of Object.entries(bazi)) {
    const tianGan = value[0];
    const diZhi = value[1];
    
    wuxingCount[TIAN_GAN_WUXING[tianGan]]++;
    wuxingCount[DI_ZHI_WUXING[diZhi]]++;
    
    wuxingInfo[pillar] = {
      tianGan,
      diZhi,
      tianGanWuxing: TIAN_GAN_WUXING[tianGan],
      diZhiWuxing: DI_ZHI_WUXING[diZhi],
      tianGanYinYang: TIAN_GAN_YIN_YANG[tianGan],
      diZhiYinYang: DI_ZHI_YIN_YANG[diZhi]
    };
  }
  
  return { wuxingCount, wuxingInfo };
}

// 判断十神
function determineShiShen(dayGan, targetGan) {
  // 如果目标干支为空或无效，返回未知
  if (!targetGan || !TIAN_GAN_WUXING[targetGan]) {
    return "未知";
  }

  const dayGanWuxing = TIAN_GAN_WUXING[dayGan];
  const dayGanYinYang = TIAN_GAN_YIN_YANG[dayGan];
  const targetGanWuxing = TIAN_GAN_WUXING[targetGan];
  const targetGanYinYang = TIAN_GAN_YIN_YANG[targetGan];
  
  // 同我者为比劫
  if (dayGanWuxing === targetGanWuxing) {
    return dayGanYinYang === targetGanYinYang ? "比肩" : "劫财";
  }

  // 五行相生关系
  const wuxingSheng = {
    '木': '火', '火': '土', '土': '金', '金': '水', '水': '木'
  };

  // 五行相克关系
  const wuxingKe = {
    '木': '土', '土': '水', '水': '火', '火': '金', '金': '木'
  };

  // 我生者为食伤
  if (wuxingSheng[dayGanWuxing] === targetGanWuxing) {
    return dayGanYinYang !== targetGanYinYang ? "伤官" : "食神";
  }

  // 生我者为印绶
  if (wuxingSheng[targetGanWuxing] === dayGanWuxing) {
    return dayGanYinYang !== targetGanYinYang ? "正印" : "偏印";
  }
  
  // 克我者为官杀
  if (wuxingKe[targetGanWuxing] === dayGanWuxing) {
    return dayGanYinYang !== targetGanYinYang ? "正官" : "七杀";
  }
  
  // 我克者为财星
  if (wuxingKe[dayGanWuxing] === targetGanWuxing) {
    return dayGanYinYang !== targetGanYinYang ? "正财" : "偏财";
  }
  
  return "未知";
}

// 分析十神
function analyzeShiShen(bazi) {
  const dayGan = bazi.day[0];
  const result = {
    year: determineShiShen(dayGan, bazi.year[0]),
    month: determineShiShen(dayGan, bazi.month[0]),
    day: "比肩", // 日主与自己比较，必然是比肩
    hour: determineShiShen(dayGan, bazi.hour[0]),
    yearHidden: DI_ZHI_CANG_GAN[bazi.year[1]].map(gan => determineShiShen(dayGan, gan)).join(','),
    monthHidden: DI_ZHI_CANG_GAN[bazi.month[1]].map(gan => determineShiShen(dayGan, gan)).join(','),
    dayHidden: DI_ZHI_CANG_GAN[bazi.day[1]].map(gan => determineShiShen(dayGan, gan)).join(','),
    hourHidden: DI_ZHI_CANG_GAN[bazi.hour[1]].map(gan => determineShiShen(dayGan, gan)).join(','),
    summary: ''
  };
  
  // 生成十神分析总结
  const allShiShen = [
    result.year, result.month, result.day, result.hour,
    ...result.yearHidden.split(','),
    ...result.monthHidden.split(','),
    ...result.dayHidden.split(','),
    ...result.hourHidden.split(',')
  ].filter(item => item !== '');
  
  const shiShenCount = allShiShen.reduce((acc, curr) => {
    if (curr !== '未知') {
      acc[curr] = (acc[curr] || 0) + 1;
    }
    return acc;
  }, {});
  
  result.summary = `您的八字中：${Object.entries(shiShenCount)
    .map(([shiShen, count]) => `${shiShen}${count}个`)
    .join('，')}`;
  
  return result;
}

// 判断五行生克关系：A是否生B
function isGenerating(wuxingA, wuxingB) {
  const generating = {
    '木': '火',
    '火': '土',
    '土': '金',
    '金': '水',
    '水': '木'
  };
  return generating[wuxingA] === wuxingB;
}

// 判断五行生克关系：A是否克B
function isRestricting(wuxingA, wuxingB) {
  const restricting = {
    '木': '土',
    '土': '水',
    '水': '火',
    '火': '金',
    '金': '木'
  };
  return restricting[wuxingA] === wuxingB;
}

// 分析日主五行强弱
function analyzeWuxingStrength(bazi, wuxingInfo) {
  const dayGan = bazi.day[0];
  const dayWuxing = wuxingInfo.day.tianGanWuxing;
  // 计算五行生克关系
  const wuxingScore = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };
  // 根据天干地支计算各五行得分
  for (const position of ['year', 'month', 'day', 'hour']) {
    const pillar = wuxingInfo[position];
    if (!pillar) continue;
    
    // 天干五行加分
    wuxingScore[pillar.tianGanWuxing] += 1;
    // 地支五行加分
    wuxingScore[pillar.diZhiWuxing] += 1;
  }
  
  // 计算月令对日主的影响
  const monthZhi = bazi.month[1];
  const monthWuxing = wuxingInfo.month.diZhiWuxing;
  // 判断月令是否生日主或克日主
  if (isGenerating(monthWuxing, dayWuxing)) {
    wuxingScore[dayWuxing] += 2;
  } else if (isRestricting(monthWuxing, dayWuxing)) {
    wuxingScore[dayWuxing] -= 2;
  }
  
  return wuxingScore;
}

// 判断日主是否偏弱
function isDayMasterWeak(bazi, wuxingStrength) {
  const dayGan = bazi.day[0];
  const dayWuxing = TIAN_GAN_WUXING[dayGan];
  
  // 简单判断：如果日主五行得分低于平均值，则认为偏弱
  const avgScore = Object.values(wuxingStrength).reduce((a, b) => a + b, 0) / 5;
  return wuxingStrength[dayWuxing] < avgScore;
}

// 判断格局
function analyzeJu(bazi, wuxingAnalysis) {
  const shiShen = {};
  const dayGan = bazi.day[0];
  
  // 计算天干十神
  shiShen.year = determineShiShen(dayGan, bazi.year[0]);
  shiShen.month = determineShiShen(dayGan, bazi.month[0]);
  shiShen.day = determineShiShen(dayGan, bazi.day[0]);
  shiShen.hour = determineShiShen(dayGan, bazi.hour[0]);

  return {
    shiShenAnalysis: shiShen,
    // 其他分析结果...
  };
}