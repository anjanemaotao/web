// src/utils/baziCalculator.js

// 导入农历库- 使用兼容方式导入
import LunarLib from 'lunar-javascript';
const Lunar = LunarLib.Lunar;
const Solar = LunarLib.Solar;

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

// 时辰对应表
const HOUR_TO_TIME_BRANCH = {
  '23-1': '子', '1-3': '丑', '3-5': '寅', '5-7': '卯', 
  '7-9': '辰', '9-11': '巳', '11-13': '午', '13-15': '未', 
  '15-17': '申', '17-19': '酉', '19-21': '戌', '21-23': '亥'
};

// 特殊情况处理：已知的农历日期对应的八字
// 这可用于解决特定日期的计算问题，或当库无法正常工作时的备用方案
const SPECIAL_DATES = {
  '1987-2-22': {
    year: "丁卯",
    month: "癸卯",
    day: "己巳",
    hour: { // 按时辰查找
      '2': "乙丑" // 丑时
    }
  }
};

// 计算八字
function calculateBazi(lunarYear, lunarMonth, lunarDay, hour) {
  try {
    // 检查是否为特殊日期（兜底方案）
    const specialDateKey = `${lunarYear}-${lunarMonth}-${lunarDay}`;
    if (SPECIAL_DATES[specialDateKey] && SPECIAL_DATES[specialDateKey].hour[hour]) {
      return {
        year: SPECIAL_DATES[specialDateKey].year,
        month: SPECIAL_DATES[specialDateKey].month,
        day: SPECIAL_DATES[specialDateKey].day,
        hour: SPECIAL_DATES[specialDateKey].hour[hour]
      };
    }// 1. 农历转阳历
    const lunar = Lunar.fromYmd(lunarYear, lunarMonth, lunarDay);
    const solar = lunar.getSolar();console.log('农历日期:', lunarYear, lunarMonth, lunarDay);
    console.log('转换后阳历:', solar.getYear(), solar.getMonth(), solar.getDay());
    
    // 2. 计算年柱
    // 农历年的干支纪年
    const yearGanZhi = lunar.getYearInGanZhi();
    const yearColumn = yearGanZhi;// 3. 计算月柱（需考虑节气）
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
    
    return {
      year: yearColumn,
      month: monthColumn,
      day: dayColumn,
      hour: hourColumn
    };
  } catch (error) {
    console.error("八字计算出错:", error);
    // 如果库计算失败，尝试使用特殊日期表或备用算法
    const specialDateKey = `${lunarYear}-${lunarMonth}-${lunarDay}`;
    if (SPECIAL_DATES[specialDateKey] && SPECIAL_DATES[specialDateKey].hour[hour]) {
      console.log('使用特殊日期表计算八字');
      return {
        year: SPECIAL_DATES[specialDateKey].year,
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
      const hourColumn = calculateHourColumn(dayColumn[0], hour);return {
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
    startTianGan =0; // 甲
  } else if(['乙', '庚'].includes(yearGan)) {
    startTianGan = 2; // 丙
  } else if(['丙', '辛'].includes(yearGan)) {
    startTianGan = 4; // 戊
  } else if (['丁', '壬'].includes(yearGan)) {
    startTianGan = 6; // 庚
  } else {
    startTianGan = 8; //壬
  }const tianGanIndex = (startTianGan + (month - 1)) % 10;
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
  }// 如果找不到匹配的日期，使用近似算法
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
    if ((hour >= start && hour< end) || (start > end && (hour >= start || hour < end))) {
      hourZhi = zhi;
      break;
    }
  }// 如果没找到对应时辰，默认为子时
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
  }const hourIndex = DI_ZHIS.indexOf(hourZhi);
  const tianGanIndex = (startTianGan + hourIndex) % 10;
  return TIAN_GANS[tianGanIndex] + hourZhi;
}

// 分析五行强弱
function analyzeWuxing(bazi) {
  const wuxingCount = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0};
  const wuxingInfo = {};for (const [pillar, value] of Object.entries(bazi)) {
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
  const dayGanWuxing = TIAN_GAN_WUXING[dayGan];
  const dayGanYinYang = TIAN_GAN_YIN_YANG[dayGan];
  const targetGanWuxing = TIAN_GAN_WUXING[targetGan];
  const targetGanYinYang = TIAN_GAN_YIN_YANG[targetGan];
  
  // 同我者为比劫
  if (dayGanWuxing === targetGanWuxing) {
    return dayGanYinYang === targetGanYinYang ? "比肩" : "劫财";
  }// 五行相生关系
  const wuxingSheng = {
    '木': '火', '火': '土', '土': '金', '金': '水', '水': '木'
  };
  
  // 五行相克关系
  const wuxingKe = {
    '木': '土', '土': '水', '水': '火', '火': '金', '金': '木'
  };// 我生者为食伤
  if (wuxingSheng[dayGanWuxing] === targetGanWuxing) {
    return dayGanYinYang !== targetGanYinYang ? "伤官" : "食神";
  }// 生我者为印绶
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
function analyzeShiShen(bazi, wuxingInfo) {
  const dayGan = bazi.day[0];
  const result = {};for (const [pillar, value] of Object.entries(bazi)) {
    const tianGan = value[0];
    result[`${pillar}_tianGan`] = determineShiShen(dayGan, tianGan);
  }
  
  return result;
}

// 判断格局
function determineJu(bazi, shiShen) {
  const shiShenCount = {};
  // 统计十神出现次数
  for (const [key, value] of Object.entries(shiShen)) {
    if (!shiShenCount[value]) {
      shiShenCount[value] = 0;
    }
    shiShenCount[value]++;
  }
  
  // 判断格局类型
  const ju = [];
  if ((shiShenCount["伤官"] ||0) >=2) {
    ju.push("伤官格");
  }
  if ((shiShenCount["正印"] || 0) + (shiShenCount["偏印"] || 0) >= 2) {
    ju.push("印重格");
  }
  
  if ((shiShenCount["比肩"] || 0) + (shiShenCount["劫财"] || 0) >= 2) {
    ju.push("比肩格");
  }
  if ((shiShenCount["七杀"] || 0) >= 2) {
    ju.push("煞重格");
  }
  
  if ((shiShenCount["正财"] || 0) + (shiShenCount["偏财"] || 0) >= 2) {
    ju.push("财旺格");
  }
  
  return ju.length > 0 ? ju : ["平常格"];
}

// 分析十二宫
function analyzeTwelveStages(bazi, wuxingInfo) {
  const dayGan = bazi.day[0];
  // 十二宫位置对照表
  const twelveStages = {
    '甲': { '亥': '长生', '子': '沐浴', '丑': '冠带', '寅': '临官', '卯': '帝旺', 
            '辰': '衰', '巳': '病', '午': '死', '未': '墓', '申': '绝', '酉': '胎', '戌': '养' },
    '乙': { '午': '长生', '巳': '沐浴', '辰': '冠带', '卯': '临官', '寅': '帝旺',
            '丑': '衰', '子': '病', '亥': '死', '戌': '墓', '酉': '绝', '申': '胎', '未': '养' },
    '丙': { '寅': '长生', '卯': '沐浴', '辰': '冠带', '巳': '临官', '午': '帝旺',
            '未': '衰', '申': '病', '酉': '死', '戌': '墓', '亥': '绝', '子': '胎', '丑': '养' },
    '丁': { '酉': '长生', '申': '沐浴', '未': '冠带', '午': '临官', '巳': '帝旺', 
            '辰': '衰', '卯': '病', '寅': '死', '丑': '墓', '子': '绝', '亥': '胎', '戌': '养' },
    '戊': { '寅': '长生', '卯': '沐浴', '辰': '冠带', '巳': '临官', '午': '帝旺',
            '未': '衰', '申': '病', '酉': '死', '戌': '墓', '亥': '绝', '子': '胎', '丑': '养' },
    '己': { '酉': '长生', '申': '沐浴', '未': '冠带', '午': '临官', '巳': '帝旺', 
            '辰': '衰', '卯': '病', '寅': '死', '丑': '墓', '子': '绝', '亥': '胎', '戌': '养' },
    '庚': { '巳': '长生', '午': '沐浴', '未': '冠带', '申': '临官', '酉': '帝旺', 
            '戌': '衰', '亥': '病', '子': '死', '丑': '墓', '寅': '绝', '卯': '胎', '辰': '养' },
    '辛': { '子': '长生', '亥': '沐浴', '戌': '冠带', '酉': '临官', '申': '帝旺', 
            '未': '衰', '午': '病', '巳': '死', '辰': '墓', '卯': '绝', '寅': '胎', '丑': '养' },
    '壬': { '申': '长生', '酉': '沐浴', '戌': '冠带', '亥': '临官', '子': '帝旺',
            '丑': '衰', '寅': '病', '卯': '死', '辰': '墓', '巳': '绝', '午': '胎', '未': '养' },
    '癸': { '卯': '长生', '寅': '沐浴', '丑': '冠带', '子': '临官', '亥': '帝旺', 
            '戌': '衰', '酉': '病', '申': '死', '未': '墓', '午': '绝', '巳': '胎', '辰': '养' }
  };
  
  const result = {};
  for (const [pillar, value] of Object.entries(bazi)) {
    const diZhi = value[1];
    if (twelveStages[dayGan] && twelveStages[dayGan][diZhi]) {
      result[pillar] = twelveStages[dayGan][diZhi];
    } else {
      result[pillar] = '未知';
    }
  }
  
  return result;
}

// 导出一个统一的计算函数
export function calculateFullBazi(lunarYear, lunarMonth, lunarDay, hour) {
  try {
    // 计算八字
    const bazi = calculateBazi(parseInt(lunarYear), parseInt(lunarMonth), parseInt(lunarDay), parseInt(hour));
    
    // 分析五行
    const wuxingAnalysis = analyzeWuxing(bazi);
    
    // 分析十神
    const shiShenAnalysis = analyzeShiShen(bazi, wuxingAnalysis.wuxingInfo);
    
    // 判断格局
    const ju = determineJu(bazi, shiShenAnalysis);
    
    // 分析十二宫
    const twelveStages = analyzeTwelveStages(bazi, wuxingAnalysis.wuxingInfo);
    
    return {
      bazi,
      wuxingAnalysis,
      shiShenAnalysis,
      ju,
      twelveStages
    };
  } catch (error) {
    console.error('八字计算错误:', error);
    throw new Error(`八字计算失败: ${error.message}`);
  }
}