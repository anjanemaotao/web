function ElementUtils() {
  // 五行颜色映射
  const elementColors = {
    "木": "element-wood",
    "火": "element-fire",
    "土": "element-earth",
    "金": "element-metal",
    "水": "element-water"
  };

  // 五行背景颜色映射
  const elementBgColors = {
    "木": "bg-element-wood",
    "火": "bg-element-fire",
    "土": "bg-element-earth",
    "金": "bg-element-metal",
    "水": "bg-element-water"
  };

  // 五行图标映射
  const elementIcons = {
    "木": "fa-solid fa-tree",
    "火": "fa-solid fa-fire",
    "土": "fa-solid fa-mountain",
    "金": "fa-solid fa-coins",
    "水": "fa-solid fa-water"
  };

  // 五行描述
  const elementDescriptions = {
    "木": "代表生长、发展、扩张，性质温和，对应春季，方位为东方",
    "火": "代表热情、活力、光明，性质炎热，对应夏季，方位为南方",
    "土": "代表稳定、包容、中和，性质厚重，对应季末，方位为中央",
    "金": "代表收敛、坚硬、决断，性质清凉，对应秋季，方位为西方",
    "水": "代表智慧、流动、适应，性质寒冷，对应冬季，方位为北方"
  };

  // 五行性格特点
  const elementPersonalities = {
    "木": "性格仁慈、有创造力，善于规划，追求成长与进步",
    "火": "性格热情、活力充沛，善于社交，追求表现与认可",
    "土": "性格稳重、踏实，善于思考，追求安稳与平衡",
    "金": "性格果断、精确，善于执行，追求完美与效率",
    "水": "性格聪明、灵活，善于适应，追求智慧与深度"
  };

  // 五行相生关系解释
  const elementGenerationExplanations = {
    "木生火": "木性温暖，能助火燃烧，如同木柴生火",
    "火生土": "火焚烧后产生灰烬，滋养土壤，如同火灰生土",
    "土生金": "金属矿藏蕴藏于土中，如同土中生金",
    "金生水": "金属在寒冷时凝结成露水，如同金上生水",
    "水生木": "水滋润树木使其生长，如同水浇木长"
  };

  // 五行相克关系解释
  const elementRestraintExplanations = {
    "木克土": "树木根部深入土中，吸取养分，如同木克土",
    "土克水": "土能阻挡水流，筑堤防水，如同土克水",
    "水克火": "水能熄灭火焰，如同水克火",
    "火克金": "火能熔化金属，如同火克金",
    "金克木": "金属工具能砍伐树木，如同金克木"
  };

  // 根据五行获取颜色类名
  function getElementColorClass(element) {
    return elementColors[element] || "";
  }

  // 根据五行获取背景颜色类名
  function getElementBgColorClass(element) {
    return elementBgColors[element] || "";
  }

  // 根据五行获取图标类名
  function getElementIconClass(element) {
    return elementIcons[element] || "";
  }

  // 根据五行获取描述
  function getElementDescription(element) {
    return elementDescriptions[element] || "";
  }

  // 根据五行获取性格特点
  function getElementPersonality(element) {
    return elementPersonalities[element] || "";
  }

  // 分析五行强弱
  function analyzeElementStrength(elementCounts, dayElement) {
    const total = Object.values(elementCounts).reduce((sum, count) => sum + count, 0);
    const average = total / 5;
    
    const result = {};
    for (const element in elementCounts) {
      const strength = elementCounts[element] / average;
      result[element] = {
        count: elementCounts[element],
        percentage: (elementCounts[element] / total * 100).toFixed(1),
        strength: strength,
        status: strength > 1.2 ? "旺" : strength < 0.8 ? "弱" : "中"
      };
    }
    
    return result;
  }

  // 分析日主五行状态
  function analyzeDayMasterStatus(elementStrength, dayElement) {
    const strength = elementStrength[dayElement].strength;
    let status = "";
    let advice = "";
    
    if (strength > 1.5) {
      status = "偏强";
      advice = "需要泄秀或者被克制的五行来平衡";
    } else if (strength > 1.2) {
      status = "旺盛";
      advice = "需要适度的泄秀或者被克制";
    } else if (strength > 0.8) {
      status = "平衡";
      advice = "五行较为均衡，可以根据具体情况微调";
    } else if (strength > 0.5) {
      status = "偏弱";
      advice = "需要生扶或者克制克我的五行";
    } else {
      status = "过弱";
      advice = "急需生扶或者克制克我的五行来增强";
    }
    
    return { status, advice };
  }

  return {
    getElementColorClass,
    getElementBgColorClass,
    getElementIconClass,
    getElementDescription,
    getElementPersonality,
    analyzeElementStrength,
    analyzeDayMasterStatus,
    elementDescriptions,
    elementPersonalities,
    elementGenerationExplanations,
    elementRestraintExplanations
  };
}
