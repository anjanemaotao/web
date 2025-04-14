function ShishenAnalyzer() {
  // 十神名称
  const shishenNames = {
    'zhengyin': '正印',
    'pianyin': '偏印',
    'shangguan': '伤官',
    'shishen': '食神',
    'zhengguan': '正官',
    'qisha': '七杀',
    'zhengcai': '正财',
    'piancai': '偏财',
    'bijian': '比肩',
    'jiecai': '劫财'
  };
  
  // 分析八字中的十神
  const analyzeShishen = (bazi) => {
    try {
      const { yearPillar, monthPillar, dayPillar, hourPillar } = bazi;
      const calculator = BaziCalculator();
      
      // 获取日主五行和阴阳
      const dayMasterWuxing = calculator.getWuxing(dayPillar.gan);
      const dayMasterYinYang = calculator.getYinYang(dayPillar.gan);
      
      // 分析每个天干的十神
      const tianganShishen = {};
      
      // 日干 (作为参照，没有十神属性)
      tianganShishen.dayGan = 'dayMaster';
      
      // 年干
      tianganShishen.yearGan = getShishen(yearPillar.gan, dayPillar.gan);
      
      // 月干
      tianganShishen.monthGan = getShishen(monthPillar.gan, dayPillar.gan);
      
      // 时干
      tianganShishen.hourGan = getShishen(hourPillar.gan, dayPillar.gan);
      
      // 分析地支藏干的十神
      const dizhiShishen = {};
      
      // 年支藏干
      dizhiShishen.yearZhi = calculator.getCangGan(yearPillar.zhi).map(gan => getShishen(gan, dayPillar.gan));
      
      // 月支藏干
      dizhiShishen.monthZhi = calculator.getCangGan(monthPillar.zhi).map(gan => getShishen(gan, dayPillar.gan));
      
      // 日支藏干
      dizhiShishen.dayZhi = calculator.getCangGan(dayPillar.zhi).map(gan => getShishen(gan, dayPillar.gan));
      
      // 时支藏干
      dizhiShishen.hourZhi = calculator.getCangGan(hourPillar.zhi).map(gan => getShishen(gan, dayPillar.gan));
      
      // 统计十神数量
      const shishenCount = countShishen(tianganShishen, dizhiShishen);
      
      return {
        tianganShishen,
        dizhiShishen,
        shishenCount
      };
    } catch (error) {
      console.error("分析十神错误:", error);
      reportError(error);
      return {
        tianganShishen: {},
        dizhiShishen: {},
        shishenCount: {}
      };
    }
  };
  
  // 获取十神
  const getShishen = (gan, dayMasterGan) => {
    try {
      const calculator = BaziCalculator();
      
      // 获取五行和阴阳属性
      const ganWuxing = calculator.getWuxing(gan);
      const ganYinYang = calculator.getYinYang(gan);
      const dayMasterWuxing = calculator.getWuxing(dayMasterGan);
      const dayMasterYinYang = calculator.getYinYang(dayMasterGan);
      
      // 判断十神类型
      
      // 同我者为比劫
      if (ganWuxing === dayMasterWuxing) {
        // 阴阳相同为比肩
        if (ganYinYang === dayMasterYinYang) {
          return 'bijian'; // 比肩
        } else {
          return 'jiecai'; // 劫财
        }
      }
      
      // 我生者为食伤
      if (isGenerating(dayMasterWuxing, ganWuxing)) {
        // 阴阳相同为食神
        if (ganYinYang === dayMasterYinYang) {
          return 'shishen'; // 食神
        } else {
          return 'shangguan'; // 伤官
        }
      }
      
      // 生我者为印绶
      if (isGenerating(ganWuxing, dayMasterWuxing)) {
        // 阴阳相同为偏印
        if (ganYinYang === dayMasterYinYang) {
          return 'pianyin'; // 偏印
        } else {
          return 'zhengyin'; // 正印
        }
      }
      
      // 克我者为官杀
      if (isControlling(ganWuxing, dayMasterWuxing)) {
        // 阴阳相同为七杀
        if (ganYinYang === dayMasterYinYang) {
          return 'qisha'; // 七杀
        } else {
          return 'zhengguan'; // 正官
        }
      }
      
      // 我克者为财星
      if (isControlling(dayMasterWuxing, ganWuxing)) {
        // 阴阳相同为偏财
        if (ganYinYang === dayMasterYinYang) {
          return 'piancai'; // 偏财
        } else {
          return 'zhengcai'; // 正财
        }
      }
      
      return null;
    } catch (error) {
      console.error("获取十神错误:", error);
      reportError(error);
      return null;
    }
  };
  
  // 统计十神数量
  const countShishen = (tianganShishen, dizhiShishen) => {
    try {
      const count = {
        'zhengyin': 0,
        'pianyin': 0,
        'shangguan': 0,
        'shishen': 0,
        'zhengguan': 0,
        'qisha': 0,
        'zhengcai': 0,
        'piancai': 0,
        'bijian': 0,
        'jiecai': 0
      };
      
      // 天干十神
      Object.entries(tianganShishen).forEach(([key, shishen]) => {
        if (key !== 'dayGan' && shishen) {
          count[shishen] += 1;
        }
      });
      
      // 地支藏干十神 (权重较低)
      Object.values(dizhiShishen).forEach(shishenArray => {
        shishenArray.forEach((shishen, index) => {
          if (shishen) {
            // 藏干权重递减
            count[shishen] += 0.5 / (index + 1);
          }
        });
      });
      
      return count;
    } catch (error) {
      console.error("统计十神数量错误:", error);
      reportError(error);
      return {};
    }
  };
  
  // 判断五行相生关系
  const isGenerating = (source, target) => {
    const generatingRelations = {
      '木': '火',
      '火': '土',
      '土': '金',
      '金': '水',
      '水': '木'
    };
    
    return generatingRelations[source] === target;
  };
  
  // 判断五行相克关系
  const isControlling = (source, target) => {
    const controllingRelations = {
      '木': '土',
      '土': '水',
      '水': '火',
      '火': '金',
      '金': '木'
    };
    
    return controllingRelations[source] === target;
  };
  
  return {
    analyzeShishen,
    getShishen,
    shishenNames
  };
}
