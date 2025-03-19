function BaziCalculator() {
  const lunarCalendar = LunarCalendar();
  
  // 五行属性对照表
  const fiveElements = {
    "甲": "木", "乙": "木",
    "丙": "火", "丁": "火",
    "戊": "土", "己": "土",
    "庚": "金", "辛": "金",
    "壬": "水", "癸": "水",
    "寅": "木", "卯": "木",
    "巳": "火", "午": "火",
    "辰": "土", "丑": "土", "未": "土", "戌": "土",
    "申": "金", "酉": "金",
    "亥": "水", "子": "水"
  };
  
  // 天干地支十神对照表
  const tenGods = {
    "甲": { "甲": "比肩", "乙": "劫财", "丙": "食神", "丁": "伤官", "戊": "偏财", "己": "正财", "庚": "七杀", "辛": "正官", "壬": "偏印", "癸": "正印" },
    "乙": { "甲": "劫财", "乙": "比肩", "丙": "伤官", "丁": "食神", "戊": "正财", "己": "偏财", "庚": "正官", "辛": "七杀", "壬": "正印", "癸": "偏印" },
    "丙": { "甲": "偏印", "乙": "正印", "丙": "比肩", "丁": "劫财", "戊": "食神", "己": "伤官", "庚": "偏财", "辛": "正财", "壬": "七杀", "癸": "正官" },
    "丁": { "甲": "正印", "乙": "偏印", "丙": "劫财", "丁": "比肩", "戊": "伤官", "己": "食神", "庚": "正财", "辛": "偏财", "壬": "正官", "癸": "七杀" },
    "戊": { "甲": "七杀", "乙": "正官", "丙": "偏印", "丁": "正印", "戊": "比肩", "己": "劫财", "庚": "食神", "辛": "伤官", "壬": "偏财", "癸": "正财" },
    "己": { "甲": "正官", "乙": "七杀", "丙": "正印", "丁": "偏印", "戊": "劫财", "己": "比肩", "庚": "伤官", "辛": "食神", "壬": "正财", "癸": "偏财" },
    "庚": { "甲": "偏财", "乙": "正财", "丙": "七杀", "丁": "正官", "戊": "偏印", "己": "正印", "庚": "比肩", "辛": "劫财", "壬": "食神", "癸": "伤官" },
    "辛": { "甲": "正财", "乙": "偏财", "丙": "正官", "丁": "七杀", "戊": "正印", "己": "偏印", "庚": "劫财", "辛": "比肩", "壬": "伤官", "癸": "食神" },
    "壬": { "甲": "食神", "乙": "伤官", "丙": "偏财", "丁": "正财", "戊": "七杀", "己": "正官", "庚": "偏印", "辛": "正印", "壬": "比肩", "癸": "劫财" },
    "癸": { "甲": "伤官", "乙": "食神", "丙": "正财", "丁": "偏财", "戊": "正官", "己": "七杀", "庚": "正印", "辛": "偏印", "壬": "劫财", "癸": "比肩" }
  };
  
  // 纳音五行对照表
  const nayin = {
    "甲子": "海中金", "乙丑": "海中金",
    "丙寅": "炉中火", "丁卯": "炉中火",
    "戊辰": "大林木", "己巳": "大林木",
    "庚午": "路旁土", "辛未": "路旁土",
    "壬申": "剑锋金", "癸酉": "剑锋金",
    "甲戌": "山头火", "乙亥": "山头火",
    "丙子": "涧下水", "丁丑": "涧下水",
    "戊寅": "城头土", "己卯": "城头土",
    "庚辰": "白蜡金", "辛巳": "白蜡金",
    "壬午": "杨柳木", "癸未": "杨柳木",
    "甲申": "泉中水", "乙酉": "泉中水",
    "丙戌": "屋上土", "丁亥": "屋上土",
    "戊子": "霹雳火", "己丑": "霹雳火",
    "庚寅": "松柏木", "辛卯": "松柏木",
    "壬辰": "长流水", "癸巳": "长流水",
    "甲午": "砂中金", "乙未": "砂中金",
    "丙申": "山下火", "丁酉": "山下火",
    "戊戌": "平地木", "己亥": "平地木",
    "庚子": "壁上土", "辛丑": "壁上土",
    "壬寅": "金箔金", "癸卯": "金箔金",
    "甲辰": "覆灯火", "乙巳": "覆灯火",
    "丙午": "天河水", "丁未": "天河水",
    "戊申": "大驿土", "己酉": "大驿土",
    "庚戌": "钗环金", "辛亥": "钗环金",
    "壬子": "桑柘木", "癸丑": "桑柘木",
    "甲寅": "大溪水", "乙卯": "大溪水",
    "丙辰": "沙中土", "丁巳": "沙中土",
    "戊午": "天上火", "己未": "天上火",
    "庚申": "石榴木", "辛酉": "石榴木",
    "壬戌": "大海水", "癸亥": "大海水"
  };
  
  // 地支藏干表
  const branchHiddenStems = {
    "子": ["癸"],
    "丑": ["己", "癸", "辛"],
    "寅": ["甲", "丙", "戊"],
    "卯": ["乙"],
    "辰": ["戊", "乙", "癸"],
    "巳": ["丙", "庚", "戊"],
    "午": ["丁", "己"],
    "未": ["己", "丁", "乙"],
    "申": ["庚", "壬", "戊"],
    "酉": ["辛"],
    "戌": ["戊", "辛", "丁"],
    "亥": ["壬", "甲"]
  };
  
  // 五行相生相克
  const elementRelations = {
    "木": { "生": "火", "克": "土", "被生": "水", "被克": "金" },
    "火": { "生": "土", "克": "金", "被生": "木", "被克": "水" },
    "土": { "生": "金", "克": "水", "被生": "火", "被克": "木" },
    "金": { "生": "水", "克": "木", "被生": "土", "被克": "火" },
    "水": { "生": "木", "克": "火", "被生": "金", "被克": "土" }
  };
  
  // 计算八字
  function calculateBazi(lunarYear, lunarMonth, lunarDay, hour) {
    try {
      // 年柱
      const yearGanZhi = lunarCalendar.cyclical(lunarYear);
      const yearStem = yearGanZhi.heavenlyStem;
      const yearBranch = yearGanZhi.earthlyBranch;
      
      // 月柱
      const monthGanZhi = lunarCalendar.getMonthGanZhi(lunarYear, lunarMonth);
      const monthStem = monthGanZhi.heavenlyStem;
      const monthBranch = monthGanZhi.earthlyBranch;
      
      // 日柱
      // 需要先转换为公历日期
      const solarDate = lunarCalendar.lunarToSolar(lunarYear, lunarMonth, lunarDay, false);
      const dayGanZhi = lunarCalendar.getDayGanZhi(solarDate.year, solarDate.month, solarDate.day);
      const dayStem = dayGanZhi.heavenlyStem;
      const dayBranch = dayGanZhi.earthlyBranch;
      
      // 时柱
      const hourGanZhi = lunarCalendar.getHourGanZhi(dayStem, hour);
      const hourStem = hourGanZhi.heavenlyStem;
      const hourBranch = hourGanZhi.earthlyBranch;
      
      // 纳音
      const yearNayin = nayin[yearStem + yearBranch];
      const monthNayin = nayin[monthStem + monthBranch];
      const dayNayin = nayin[dayStem + dayBranch];
      const hourNayin = nayin[hourStem + hourBranch];
      
      // 天干五行
      const yearStemElement = fiveElements[yearStem];
      const monthStemElement = fiveElements[monthStem];
      const dayStemElement = fiveElements[dayStem];
      const hourStemElement = fiveElements[hourStem];
      
      // 地支五行
      const yearBranchElement = fiveElements[yearBranch];
      const monthBranchElement = fiveElements[monthBranch];
      const dayBranchElement = fiveElements[dayBranch];
      const hourBranchElement = fiveElements[hourBranch];
      
      // 地支藏干
      const yearHiddenStems = branchHiddenStems[yearBranch];
      const monthHiddenStems = branchHiddenStems[monthBranch];
      const dayHiddenStems = branchHiddenStems[dayBranch];
      const hourHiddenStems = branchHiddenStems[hourBranch];
      
      // 十神
      const yearGod = tenGods[dayStem][yearStem];
      const monthGod = tenGods[dayStem][monthStem];
      const dayGod = "日主";
      const hourGod = tenGods[dayStem][hourStem];
      
      // 计算五行统计
      const elementCounts = countElements(
        yearStem, yearBranch, monthStem, monthBranch,
        dayStem, dayBranch, hourStem, hourBranch
      );
      
      // 计算大运
      const luckyPeriods = calculateLuckyPeriods(
        yearStem, yearBranch, monthStem, monthBranch, 
        dayStem, dayBranch, solarDate.year, solarDate.month, solarDate.day
      );
      
      return {
        year: {
          stem: yearStem,
          branch: yearBranch,
          stemElement: yearStemElement,
          branchElement: yearBranchElement,
          nayin: yearNayin,
          hiddenStems: yearHiddenStems,
          god: yearGod
        },
        month: {
          stem: monthStem,
          branch: monthBranch,
          stemElement: monthStemElement,
          branchElement: monthBranchElement,
          nayin: monthNayin,
          hiddenStems: monthHiddenStems,
          god: monthGod
        },
        day: {
          stem: dayStem,
          branch: dayBranch,
          stemElement: dayStemElement,
          branchElement: dayBranchElement,
          nayin: dayNayin,
          hiddenStems: dayHiddenStems,
          god: dayGod
        },
        hour: {
          stem: hourStem,
          branch: hourBranch,
          stemElement: hourStemElement,
          branchElement: hourBranchElement,
          nayin: hourNayin,
          hiddenStems: hourHiddenStems,
          god: hourGod
        },
        elementCounts,
        luckyPeriods
      };
    } catch (error) {
      console.error("八字计算错误:", error);
      return null;
    }
  }
  
  // 计算五行统计
  function countElements(yearStem, yearBranch, monthStem, monthBranch, dayStem, dayBranch, hourStem, hourBranch) {
    const counts = {
      "木": 0,
      "火": 0,
      "土": 0,
      "金": 0,
      "水": 0
    };
    
    // 天干五行
    counts[fiveElements[yearStem]] += 1;
    counts[fiveElements[monthStem]] += 1;
    counts[fiveElements[dayStem]] += 1;
    counts[fiveElements[hourStem]] += 1;
    
    // 地支五行
    counts[fiveElements[yearBranch]] += 0.5;
    counts[fiveElements[monthBranch]] += 0.5;
    counts[fiveElements[dayBranch]] += 0.5;
    counts[fiveElements[hourBranch]] += 0.5;
    
    // 地支藏干五行
    branchHiddenStems[yearBranch].forEach(stem => {
      counts[fiveElements[stem]] += 0.5 / branchHiddenStems[yearBranch].length;
    });
    
    branchHiddenStems[monthBranch].forEach(stem => {
      counts[fiveElements[stem]] += 0.5 / branchHiddenStems[monthBranch].length;
    });
    
    branchHiddenStems[dayBranch].forEach(stem => {
      counts[fiveElements[stem]] += 0.5 / branchHiddenStems[dayBranch].length;
    });
    
    branchHiddenStems[hourBranch].forEach(stem => {
      counts[fiveElements[stem]] += 0.5 / branchHiddenStems[hourBranch].length;
    });
    
    return counts;
  }
  
  // 计算大运
  function calculateLuckyPeriods(yearStem, yearBranch, monthStem, monthBranch, dayStem, dayBranch, solarYear, solarMonth, solarDay) {
    const periods = [];
    
    // 确定大运顺逆
    const gender = true; // 默认阳男阴女顺排，阴男阳女逆排
    const yearStemIndex = lunarCalendar.heavenlyStems.indexOf(yearStem);
    const isYangYear = yearStemIndex % 2 === 0; // 阳年
    
    // 大运起始干支
    let stemIndex = lunarCalendar.heavenlyStems.indexOf(monthStem);
    let branchIndex = lunarCalendar.earthlyBranches.indexOf(monthBranch);
    
    // 根据顺逆调整方向
    const direction = (isYangYear && gender) || (!isYangYear && !gender) ? 1 : -1;
    
    // 计算起运时间（虚岁）
    const startAge = 1; // 默认从1岁开始
    
    // 生成10个大运
    for (let i = 0; i < 10; i++) {
      stemIndex = (stemIndex + direction + 10) % 10;
      branchIndex = (branchIndex + direction + 12) % 12;
      
      const stem = lunarCalendar.heavenlyStems[stemIndex];
      const branch = lunarCalendar.earthlyBranches[branchIndex];
      
      periods.push({
        stem,
        branch,
        stemElement: fiveElements[stem],
        branchElement: fiveElements[branch],
        nayin: nayin[stem + branch],
        age: startAge + i * 10,
        year: solarYear + startAge + i * 10 - 1
      });
    }
    
    return periods;
  }
  
  return {
    calculateBazi,
    fiveElements,
    tenGods,
    nayin,
    branchHiddenStems,
    elementRelations
  };
}
