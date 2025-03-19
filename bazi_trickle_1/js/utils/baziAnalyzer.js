// 八字分析工具
function BaziAnalyzer() {
  // 分析日主强弱
  function analyzeDayMasterStrength(bazi, elementDistribution) {
    try {
      const dayMaster = bazi.day.gan;
      const dayMasterElement = STEM_ELEMENTS[dayMaster];
      
      // 计算日主得分
      let score = 0;
      
      // 1. 根据月令旺衰调整得分
      const monthBranch = bazi.month.zhi;
      
      // 根据月支判断日主旺衰
      const seasonalScore = {
        木: { 亥: 3, 子: 2, 丑: 1, 寅: 5, 卯: 5, 辰: 3, 巳: -1, 午: -3, 未: -2, 申: -5, 酉: -5, 戌: -3 },
        火: { 亥: -5, 子: -5, 丑: -3, 寅: -1, 卯: 1, 辰: 3, 巳: 5, 午: 5, 未: 3, 申: -1, 酉: -3, 戌: -2 },
        土: { 亥: -3, 子: -3, 丑: 1, 寅: -2, 卯: -3, 辰: 2, 巳: 2, 午: 3, 未: 5, 申: 2, 酉: -1, 戌: 5 },
        金: { 亥: -3, 子: -1, 丑: 2, 寅: -5, 卯: -5, 辰: -3, 巳: -1, 午: -3, 未: -2, 申: 5, 酉: 5, 戌: 3 },
        水: { 亥: 5, 子: 5, 丑: 3, 寅: -1, 卯: -3, 辰: -2, 巳: -5, 午: -5, 未: -3, 申: -1, 酉: 1, 戌: 2 }
      };
      
      score += seasonalScore[dayMasterElement][monthBranch] || 0;
      
      // 2. 根据自己的五行在全局中的数量
      const selfElement = elementDistribution[dayMasterElement];
      
      // 计算总五行数量
      const totalElements = Object.values(elementDistribution).reduce((a, b) => a + b, 0);
      
      // 计算自己五行占比
      const selfRatio = selfElement / totalElements;
      
      if (selfRatio < 0.1) {
        score -= 5; // 极弱
      } else if (selfRatio < 0.15) {
        score -= 3; // 弱
      } else if (selfRatio < 0.2) {
        score -= 1; // 偏弱
      } else if (selfRatio > 0.4) {
        score += 5; // 极强
      } else if (selfRatio > 0.3) {
        score += 3; // 强
      } else if (selfRatio > 0.25) {
        score += 1; // 偏强
      }
      
      // 3. 根据生克关系调整得分
      const generateElement = ELEMENT_CYCLE["被生"][dayMasterElement]; // 生我
      const restrainElement = ELEMENT_CYCLE["被克"][dayMasterElement]; // 克我
      const generatedElement = ELEMENT_CYCLE["生"][dayMasterElement]; // 我生
      const restrainedElement = ELEMENT_CYCLE["克"][dayMasterElement]; // 我克
      
      // 生我得分
      score += elementDistribution[generateElement] * 0.5;
      
      // 克我减分
      score -= elementDistribution[restrainElement] * 0.8;
      
      // 我生负担
      score -= elementDistribution[generatedElement] * 0.3;
      
      // 我克增强
      score += elementDistribution[restrainedElement] * 0.2;
      
      // 根据得分判断日主强弱
      let strength = "";
      let suggestions = [];
      
      if (score >= 5) {
        strength = "日主过强";
        suggestions = PATTERN_REFERENCES["日主过强"];
      } else if (score <= -5) {
        strength = "日主过弱";
        suggestions = PATTERN_REFERENCES["日主过弱"];
      } else {
        strength = "日主中和";
        suggestions = PATTERN_REFERENCES["日主中和"];
      }
      
      return {
        dayMaster: dayMaster,
        dayMasterElement: dayMasterElement,
        strength: strength,
        score: score.toFixed(1),
        suggestions: suggestions
      };
    } catch (error) {
      console.error("日主强弱分析错误:", error);
      reportError(error);
      return {
        dayMaster: "",
        dayMasterElement: "",
        strength: "分析失败",
        score: 0,
        suggestions: []
      };
    }
  }
  
  // 分析喜用神
  function analyzeFavorableElements(dayMasterAnalysis, elementDistribution) {
    try {
      const dayMasterElement = dayMasterAnalysis.dayMasterElement;
      const strength = dayMasterAnalysis.strength;
      let favorableElements = [];
      let unfavorableElements = [];
      
      if (strength === "日主过强") {
        // 日主过强，喜官杀、财星
        favorableElements.push(ELEMENT_CYCLE["克"][dayMasterElement]); // 我克（官杀）
        favorableElements.push(ELEMENT_CYCLE["生"][dayMasterElement]); // 我生（财）
        
        // 忌印、比劫
        unfavorableElements.push(ELEMENT_CYCLE["被生"][dayMasterElement]); // 生我（印）
        unfavorableElements.push(dayMasterElement); // 同我（比劫）
      } else if (strength === "日主过弱") {
        // 日主过弱，喜印、比劫
        favorableElements.push(ELEMENT_CYCLE["被生"][dayMasterElement]); // 生我（印）
        favorableElements.push(dayMasterElement); // 同我（比劫）
        
        // 忌官杀、财星
        unfavorableElements.push(ELEMENT_CYCLE["克"][dayMasterElement]); // 我克（官杀）
        unfavorableElements.push(ELEMENT_CYCLE["生"][dayMasterElement]); // 我生（财）
      } else {
        // 日主中和，需要结合具体八字
        // 这里采用五行平衡原则，补弱抑强
        const elementsArray = Object.entries(elementDistribution).sort((a, b) => a[1] - b[1]);
        
        // 最少的两个五行为喜用
        favorableElements.push(elementsArray[0][0]);
        if (elementsArray[1][0] !== dayMasterElement) {
          favorableElements.push(elementsArray[1][0]);
        }
        
        // 最多的两个五行为忌神
        unfavorableElements.push(elementsArray[elementsArray.length - 1][0]);
        if (elementsArray[elementsArray.length - 2][0] !== dayMasterElement) {
          unfavorableElements.push(elementsArray[elementsArray.length - 2][0]);
        }
      }
      
      // 对喜用神进行排序，去重
      favorableElements = [...new Set(favorableElements)];
      unfavorableElements = [...new Set(unfavorableElements)];
      
      // 分析喜用神对应的十神
      const dayMaster = dayMasterAnalysis.dayMaster;
      const favorableGods = [];
      const unfavorableGods = [];
      
      // 遍历天干，找出对应的喜用神
      for (const stem of CELESTIAL_STEMS) {
        const element = STEM_ELEMENTS[stem];
        if (favorableElements.includes(element)) {
          favorableGods.push({
            god: TEN_GODS[dayMaster][stem],
            element: element
          });
        }
        if (unfavorableElements.includes(element)) {
          unfavorableGods.push({
            god: TEN_GODS[dayMaster][stem],
            element: element
          });
        }
      }
      
      return {
        favorableElements: favorableElements,
        unfavorableElements: unfavorableElements,
        favorableGods: [...new Map(favorableGods.map(item => [item.god, item])).values()],
        unfavorableGods: [...new Map(unfavorableGods.map(item => [item.god, item])).values()]
      };
    } catch (error) {
      console.error("喜用神分析错误:", error);
      reportError(error);
      return {
        favorableElements: [],
        unfavorableElements: [],
        favorableGods: [],
        unfavorableGods: []
      };
    }
  }
  
  // 分析五行格局
  function analyzeElementPattern(bazi, elementDistribution, dayMasterAnalysis) {
    try {
      const dayMasterElement = dayMasterAnalysis.dayMasterElement;
      const patterns = [];
      
      // 检查五行缺失
      const missingElements = [];
      for (const element in elementDistribution) {
        if (elementDistribution[element] < 0.5) {
          missingElements.push(element);
        }
      }
      
      if (missingElements.length > 0) {
        patterns.push(`五行缺${missingElements.join('、')}`);
      }
      
      // 检查五行偏旺
      const strongElements = [];
      for (const element in elementDistribution) {
        if (elementDistribution[element] > 3) {
          strongElements.push(element);
        }
      }
      
      if (strongElements.length > 0) {
        patterns.push(`${strongElements.join('、')}偏旺`);
      }
      
      // 分析特殊格局
      const branches = [bazi.year.zhi, bazi.month.zhi, bazi.day.zhi, bazi.hour.zhi];
      
      // 检查三会局
      for (const combination of THREE_COMBINATIONS) {
        const found = combination.filter(b => branches.includes(b));
        if (found.length >= 3) {
          const element = ["水", "木", "火", "金"][THREE_COMBINATIONS.indexOf(combination)];
          patterns.push(`${found.join('')}三会${element}局`);
        }
      }
      
      // 检查三合局
      for (const harmony of THREE_HARMONY) {
        const found = harmony.filter(b => branches.includes(b));
        if (found.length >= 3) {
          const element = ["火", "木", "水", "金"][THREE_HARMONY.indexOf(harmony)];
          patterns.push(`${found.join('')}三合${element}局`);
        }
      }
      
      // 根据日主强弱确定格局
      let mainPattern = "";
      if (dayMasterAnalysis.strength === "日主过强") {
        if (elementDistribution[ELEMENT_CYCLE["克"][dayMasterElement]] > 2) {
          mainPattern = "官杀格";
        } else if (elementDistribution[ELEMENT_CYCLE["生"][dayMasterElement]] > 2) {
          mainPattern = "财格";
        } else {
          mainPattern = "日主旺";
        }
      } else if (dayMasterAnalysis.strength === "日主过弱") {
        if (elementDistribution[ELEMENT_CYCLE["被生"][dayMasterElement]] > 2) {
          mainPattern = "印格";
        } else if (elementDistribution[dayMasterElement] > 2) {
          mainPattern = "比劫格";
        } else {
          mainPattern = "日主弱";
        }
      } else {
        mainPattern = "日主中和格";
      }
      
      patterns.unshift(mainPattern);
      
      return patterns;
    } catch (error) {
      console.error("五行格局分析错误:", error);
      reportError(error);
      return ["分析失败"];
    }
  }
  
  // 分析命格类型
  function analyzeFormatType(bazi, elementDistribution, dayMasterAnalysis) {
    try {
      const dayMasterElement = dayMasterAnalysis.dayMasterElement;
      const tenGods = {};
      const dayGan = bazi.day.gan;
      
      // 统计十神出现次数
      for (const stem of [bazi.year.gan, bazi.month.gan, bazi.hour.gan]) {
        const god = TEN_GODS[dayGan][stem];
        tenGods[god] = (tenGods[god] || 0) + 1;
      }
      
      // 地支藏干的十神
      [bazi.year.zhi, bazi.month.zhi, bazi.day.zhi, bazi.hour.zhi].forEach(zhi => {
        const hiddenStems = BRANCH_HIDDEN_STEMS[zhi];
        hiddenStems.forEach(stem => {
          const weight = BRANCH_HIDDEN_STEMS_WEIGHT[zhi][stem] / 100;
          const god = TEN_GODS[dayGan][stem];
          tenGods[god] = (tenGods[god] || 0) + weight;
        });
      });
      
      // 判断命格类型
      let formatType = "";
      
      // 伤官局: 伤官、食神旺
      if ((tenGods["伤官"] || 0) + (tenGods["食神"] || 0) >= 2) {
        formatType = "伤官局";
      }
      // 印中局: 偏印、正印旺
      else if ((tenGods["偏印"] || 0) + (tenGods["正印"] || 0) >= 2) {
        formatType = "印中局";
      }
      // 比肩局: 比肩、劫财旺
      else if ((tenGods["比肩"] || 0) + (tenGods["劫财"] || 0) >= 2) {
        formatType = "比肩局";
      }
      // 煞重局: 七杀旺
      else if ((tenGods["七杀"] || 0) >= 1.5) {
        formatType = "煞重局";
      }
      // 财旺局: 正财、偏财旺
      else if ((tenGods["正财"] || 0) + (tenGods["偏财"] || 0) >= 2) {
        formatType = "财旺局";
      }
      // 默认按照日主强弱判断
      else {
        if (dayMasterAnalysis.strength === "日主过强") {
          formatType = "比肩局";
        } else if (dayMasterAnalysis.strength === "日主过弱") {
          formatType = "印中局";
        } else {
          // 根据五行分布，选择最旺的五行对应的格局
          const maxElement = Object.entries(elementDistribution)
            .sort((a, b) => b[1] - a[1])[0][0];
          
          switch (maxElement) {
            case "木":
              formatType = "伤官局";
              break;
            case "火":
              formatType = "财旺局";
              break;
            case "土":
              formatType = "印中局";
              break;
            case "金":
              formatType = "煞重局";
              break;
            case "水":
              formatType = "比肩局";
              break;
            default:
              formatType = "印中局";
          }
        }
      }
      
      return {
        formatType,
        formatInfo: FORMAT_TYPES[formatType] || {}
      };
    } catch (error) {
      console.error("命格类型分析错误:", error);
      reportError(error);
      return {
        formatType: "未知",
        formatInfo: {}
      };
    }
  }
  
  // 综合分析八字
  function analyzeBazi(bazi) {
    try {
      const calculator = BaziCalculator();
      
      // 计算纳音
      const naYin = calculator.calculateNaYin(bazi);
      
      // 计算十神
      const tenGods = calculator.calculateTenGods(bazi);
      
      // 计算五行分布
      const elementDistribution = calculator.calculateElementDistribution(bazi);
      
      // 计算地支关系
      const branchRelations = calculator.calculateBranchRelations(bazi);
      
      // 分析日主强弱
      const dayMasterAnalysis = analyzeDayMasterStrength(bazi, elementDistribution);
      
      // 分析喜用神
      const favorableElements = analyzeFavorableElements(dayMasterAnalysis, elementDistribution);
      
      // 分析五行格局
      const patterns = analyzeElementPattern(bazi, elementDistribution, dayMasterAnalysis);
      
      // 分析命格类型
      const formatAnalysis = analyzeFormatType(bazi, elementDistribution, dayMasterAnalysis);
      
      return {
        bazi,
        naYin,
        tenGods,
        elementDistribution,
        branchRelations,
        dayMasterAnalysis,
        favorableElements,
        patterns,
        formatAnalysis
      };
    } catch (error) {
      console.error("八字综合分析错误:", error);
      reportError(error);
      return null;
    }
  }
  
  return {
    analyzeDayMasterStrength,
    analyzeFavorableElements,
    analyzeElementPattern,
    analyzeFormatType,
    analyzeBazi
  };
}
