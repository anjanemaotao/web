// shishenAnalyzer.js - 十神分析模块
const baziCalculator = require('./baziCalculator');

// 十神分析器
const ShishenAnalyzer = () => {
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
  const analyzeShishen = (bazi, gender) => {
    try {
      const { yearPillar, monthPillar, dayPillar, hourPillar } = bazi;
      
      // 获取日主五行和阴阳
      const dayMasterWuxing = baziCalculator.getWuxing(dayPillar.gan);
      const dayMasterYinYang = baziCalculator.getYinYang(dayPillar.gan);
      
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
      dizhiShishen.yearZhi = baziCalculator.getCangGan(yearPillar.zhi).map(gan => getShishen(gan, dayPillar.gan));
      
      // 月支藏干
      dizhiShishen.monthZhi = baziCalculator.getCangGan(monthPillar.zhi).map(gan => getShishen(gan, dayPillar.gan));
      
      // 日支藏干
      dizhiShishen.dayZhi = baziCalculator.getCangGan(dayPillar.zhi).map(gan => getShishen(gan, dayPillar.gan));
      
      // 时支藏干
      dizhiShishen.hourZhi = baziCalculator.getCangGan(hourPillar.zhi).map(gan => getShishen(gan, dayPillar.gan));
      
      // 统计十神数量
      const shishenCount = countShishen(tianganShishen, dizhiShishen);
      
      // 根据性别调整十神解读
      const genderAdjustedAnalysis = getGenderAdjustedAnalysis(shishenCount, gender);
      
      return {
        tianganShishen,
        dizhiShishen,
        shishenCount,
        genderAdjustedAnalysis
      };
    } catch (error) {
      console.error("分析十神错误:", error);
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
      // 获取五行和阴阳属性
      const ganWuxing = baziCalculator.getWuxing(gan);
      const ganYinYang = baziCalculator.getYinYang(gan);
      const dayMasterWuxing = baziCalculator.getWuxing(dayMasterGan);
      const dayMasterYinYang = baziCalculator.getYinYang(dayMasterGan);
      
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
      return {};
    }
  };
  
  // 根据性别调整十神解读
  const getGenderAdjustedAnalysis = (shishenCount, gender) => {
    // 根据性别不同，十神的意义有所调整
    const analysis = {};
    
    // 计算总分
    let total = 0;
    Object.values(shishenCount).forEach(count => {
      total += count;
    });
    
    // 计算各十神百分比
    Object.entries(shishenCount).forEach(([shishen, count]) => {
      const percentage = total > 0 ? (count / total * 100).toFixed(1) : 0;
      analysis[shishen] = {
        count,
        percentage: parseFloat(percentage),
        name: shishenNames[shishen],
        description: getShishenDescription(shishen, gender)
      };
    });
    
    return analysis;
  };
  
  // 获取十神描述
  const getShishenDescription = (shishen, gender) => {
    // 根据性别和十神类型返回不同的描述
    const descriptions = {
      'male': {
        'bijian': '同性竞争，兄弟，朋友，同事',
        'jiecai': '异性竞争，姐妹，女性朋友',
        'shishen': '学业，才华，智慧，子女',
        'shangguan': '创造力，破坏力，叛逆，子女',
        'zhengyin': '母亲，师长，贵人，学习',
        'pianyin': '长辈，学习，文凭，资源',
        'zhengguan': '权威，规则，事业，领导',
        'qisha': '压力，挑战，竞争，敌人',
        'zhengcai': '妻子，财富，收入，资产',
        'piancai': '偏财，意外之财，女性缘'
      },
      'female': {
        'bijian': '同性竞争，姐妹，女性朋友',
        'jiecai': '异性竞争，兄弟，男性朋友',
        'shishen': '学业，才华，智慧，子女',
        'shangguan': '创造力，破坏力，叛逆，子女',
        'zhengyin': '父亲，师长，贵人，学习',
        'pianyin': '长辈，学习，文凭，资源',
        'zhengguan': '丈夫，婚姻，责任，规则',
        'qisha': '男性缘，异性关系，压力',
        'zhengcai': '财富，收入，资产，事业',
        'piancai': '偏财，意外之财，事业'
      }
    };
    
    return descriptions[gender] && descriptions[gender][shishen] 
      ? descriptions[gender][shishen] 
      : '暂无描述';
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
    getShishenName: (shishen) => shishenNames[shishen] || '未知'
  };
};

module.exports = ShishenAnalyzer();