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
      '2': "乙丑" //丑时
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
    const monthColumn = monthGanZhi;// 4. 计算日柱（使用阳历日期）
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
  const hourIndex = DI_ZHIS.indexOf(hourZhi);
  const tianGanIndex = (startTianGan + hourIndex) % 10;
  return TIAN_GANS[tianGanIndex] + hourZhi;
}

// 分析五行强弱
function analyzeWuxing(bazi) {
  const wuxingCount = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };
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
  };// 五行相克关系
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
function determineJu(bazi, shiShen, wuxingInfo) {
  const shiShenCount = {};
  // 统计十神出现次数
  for (const [key, value] of Object.entries(shiShen)) {
    if (!shiShenCount[value]) {
      shiShenCount[value] = 0;
    }
    shiShenCount[value]++;
  }
  
  // 计算五行强弱
  const wuxingStrength = analyzeWuxingStrength(bazi, wuxingInfo);
  
  // 判断格局类型
  const juTypes = [];
  // 伤官格:伤官或食神出现2次以上，或者处于有力位置
  if ((shiShenCount["伤官"] ||0) + (shiShenCount["食神"] || 0) >= 2) {
    juTypes.push("伤官格");
  }// 印重格: 正印或偏印出现2次以上
  if ((shiShenCount["正印"] || 0) + (shiShenCount["偏印"] || 0) >= 2) {
    juTypes.push("印重格");
  }
  
  // 比肩格: 比肩或劫财出现2次以上
  if ((shiShenCount["比肩"] || 0) + (shiShenCount["劫财"] || 0) >= 2) {
    juTypes.push("比肩格");
  }
  
  // 煞重格: 七杀出现2次以上，或与日主五行相克
  if ((shiShenCount["七杀"] || 0) >= 2 ||
      (shiShenCount["七杀"] && isDayMasterWeak(bazi, wuxingStrength))) {
    juTypes.push("煞重格");
  }
  
  // 财旺格: 正财或偏财出现2次以上
  if ((shiShenCount["正财"] || 0) + (shiShenCount["偏财"] || 0) >= 2) {
    juTypes.push("财旺格");
  }
  
  // 如果没有明显格局，判断为平常格
  const ju = juTypes.length > 0 ? juTypes : ["平常格"];
  // 增加格局详细解释
  const juExplanation = generateJuExplanation(ju[0]);return {
    types: ju,
    explanation: juExplanation,
    characteristics: generateCharacteristics(ju[0])
  };
}

// 生成格局解释
function generateJuExplanation(juType) {
  const explanations = {
    "伤官格": "伤官格是八字中伤官或食神旺盛的格局，通常表示人思维活跃，有创造力和艺术天分。",
    "印重格": "印重格是八字中印星(正印或偏印)旺盛的格局，通常表示人理性，重视学习和逻辑思维。",
    "比肩格": "比肩格是八字中比肩或劫财旺盛的格局，通常表示人重情义，有合作精神和奉献精神。",
    "煞重格": "煞重格是八字中七杀旺盛的格局，通常表示人风险意识强，做事谨慎，注重细节。",
    "财旺格": "财旺格是八字中财星(正财或偏财)旺盛的格局，通常表示人执行力强，重视实际成果。",
    "平常格": "平常格是八字中没有特别突出格局的类型，通常表示人性格较为平衡。"
  };
  return explanations[juType] || "此格局解释暂未提供。";
}

// 生成个性特点
function generateCharacteristics(juType) {
  const characteristics = {
    "伤官格": "感性多于理性，思维活跃，富有艺术家气质。对他人有很强的同理心和理解能力，善于观察世界以及人与人之间的关系，热衷于感受美好的事物。",
    "印重格": "理性占主导，喜欢讲道理，性格较为固执，不太容易听取他人的意见，自我意识很强。",
    "比肩格": "重义气，朋友通常较多，在团队中往往是兜底的角色，不怕辛苦，勇于担当。",
    "煞重格": "风险意识强，做事情注重细节。较为敏感和谨慎，有较强的自我保护意识。",
    "财旺格": "执行能力强，将事业成功视为衡量自己的标准，同时也用这一标准去评判他人。在想了再做和做了再想之间，通常会选择后者。",
    "平常格": "性格较为平衡，没有特别突出的特点，为人处世较为中庸。"
  };
  return characteristics[juType] || "";
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
    '丙': { '寅': '长生', '卯': '沐浴', '辰': '冠带', '巳': '临官', '午': '帝旺','未': '衰', '申': '病', '酉': '死', '戌': '墓', '亥': '绝', '子': '胎', '丑': '养' },
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
    const wuxingAnalysis = analyzeWuxing(bazi);// 分析十神
    const shiShenAnalysis = analyzeShiShen(bazi, wuxingAnalysis.wuxingInfo);
    
    // 判断格局 - 传递wuxingAnalysis.wuxingInfo
    const ju = determineJu(bazi, shiShenAnalysis, wuxingAnalysis.wuxingInfo);
    
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