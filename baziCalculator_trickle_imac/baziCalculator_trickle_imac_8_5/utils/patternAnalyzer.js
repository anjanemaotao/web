function PatternAnalyzer() {
  // 格局对照表: 根据月支和日干的组合确定格局
  // 直接使用自定义知识中提供的JSON数据
  const patternTable = {
    "子": {
      "甲": "印重局",
      "乙": "印重局",
      "丙": "煞重局",
      "丁": "煞重局",
      "戊": "财旺局",
      "己": "财旺局",
      "庚": "伤官局",
      "辛": "伤官局",
      "壬": "命旺局",
      "癸": "命旺局"
    },
    "丑": {
      "甲": "财旺局",
      "乙": "财旺局",
      "丙": "伤官局",
      "丁": "伤官局",
      "戊": "命旺局",
      "己": "命旺局",
      "庚": "印重局",
      "辛": "印重局",
      "壬": "煞重局",
      "癸": "煞重局"
    },
    "寅": {
      "甲": "命旺局",
      "乙": "命旺局",
      "丙": "印重局",
      "丁": "印重局",
      "戊": "煞重局",
      "己": "煞重局",
      "庚": "财旺局",
      "辛": "财旺局",
      "壬": "伤官局",
      "癸": "伤官局"
    },
    "卯": {
      "甲": "命旺局",
      "乙": "命旺局",
      "丙": "印重局",
      "丁": "印重局",
      "戊": "煞重局",
      "己": "煞重局",
      "庚": "财旺局",
      "辛": "财旺局",
      "壬": "伤官局",
      "癸": "伤官局"
    },
    "辰": {
      "甲": "财旺局",
      "乙": "财旺局",
      "丙": "伤官局",
      "丁": "伤官局",
      "戊": "命旺局",
      "己": "命旺局",
      "庚": "印重局",
      "辛": "印重局",
      "壬": "煞重局",
      "癸": "煞重局"
    },
    "巳": {
      "甲": "伤官局",
      "乙": "伤官局",
      "丙": "命旺局",
      "丁": "命旺局",
      "戊": "印重局",
      "己": "印重局",
      "庚": "煞重局",
      "辛": "煞重局",
      "壬": "财旺局",
      "癸": "财旺局"
    },
    "午": {
      "甲": "伤官局",
      "乙": "伤官局",
      "丙": "命旺局",
      "丁": "命旺局",
      "戊": "印重局",
      "己": "印重局",
      "庚": "煞重局",
      "辛": "煞重局",
      "壬": "财旺局",
      "癸": "财旺局"
    },
    "未": {
      "甲": "财旺局",
      "乙": "财旺局",
      "丙": "伤官局",
      "丁": "伤官局",
      "戊": "命旺局",
      "己": "命旺局",
      "庚": "印重局",
      "辛": "印重局",
      "壬": "煞重局",
      "癸": "煞重局"
    },
    "申": {
      "甲": "煞重局",
      "乙": "煞重局",
      "丙": "财旺局",
      "丁": "财旺局",
      "戊": "伤官局",
      "己": "伤官局",
      "庚": "命旺局",
      "辛": "命旺局",
      "壬": "印重局",
      "癸": "印重局"
    },
    "酉": {
      "甲": "煞重局",
      "乙": "煞重局",
      "丙": "财旺局",
      "丁": "财旺局",
      "戊": "伤官局",
      "己": "伤官局",
      "庚": "命旺局",
      "辛": "命旺局",
      "壬": "印重局",
      "癸": "印重局"
    },
    "戌": {
      "甲": "财旺局",
      "乙": "财旺局",
      "丙": "伤官局",
      "丁": "伤官局",
      "戊": "命旺局",
      "己": "命旺局",
      "庚": "印重局",
      "辛": "印重局",
      "壬": "煞重局",
      "癸": "煞重局"
    },
    "亥": {
      "甲": "印重局",
      "乙": "印重局",
      "丙": "煞重局",
      "丁": "煞重局",
      "戊": "财旺局",
      "己": "财旺局",
      "庚": "伤官局",
      "辛": "伤官局",
      "壬": "命旺局",
      "癸": "命旺局"
    }
  };
  
  // 格局名称映射 - 中文到英文代码
  const patternNameMap = {
    "印重局": "yinzhong",
    "伤官局": "shangguan",
    "命旺局": "bijian",
    "煞重局": "shazhong",
    "财旺局": "caiwang"
  };
  
  // 分析八字的格局 - 基于月支和日干
  const analyzePattern = (bazi) => {
    try {
      if (!bazi || !bazi.dayPillar || !bazi.monthPillar) {
        console.error("分析格局错误: 八字数据不完整");
        return [];
      }
      
      const dayGan = bazi.dayPillar.gan; // 日干
      const monthZhi = bazi.monthPillar.zhi; // 月支
      
      console.log(`分析格局: 月支=${monthZhi}, 日干=${dayGan}`);
      
      // 通过查表确定格局 - 先检查月支，再检查日干
      if (patternTable[monthZhi] && patternTable[monthZhi][dayGan]) {
        const chinesePattern = patternTable[monthZhi][dayGan];
        const pattern = patternNameMap[chinesePattern];
        
        console.log(`匹配到格局: ${chinesePattern} -> ${pattern}`);
        
        if (pattern) {
          return [pattern]; // 返回单一格局
        }
      }
      
      console.log("未匹配到格局");
      // 如果没有找到对应的格局，返回空数组
      return [];
    } catch (error) {
      console.error("分析格局错误:", error);
      reportError(error);
      return [];
    }
  };
  
  // 以下为旧的分析方法，保留但不再使用
  // 判断是否为伤官局
  const isShangguanJu = (bazi) => {
    try {
      const { yearPillar, monthPillar, dayPillar, hourPillar } = bazi;
      const calculator = BaziCalculator();
      
      // 获取日主五行
      const dayMasterWuxing = calculator.getWuxing(dayPillar.gan);
      
      // 伤官是日主所生且阴阳不同的五行
      const dayMasterYinYang = calculator.getYinYang(dayPillar.gan);
      
      // 统计伤官的数量
      let shangguanCount = 0;
      
      // 检查所有天干
      [yearPillar.gan, monthPillar.gan, hourPillar.gan].forEach(gan => {
        const ganWuxing = calculator.getWuxing(gan);
        const ganYinYang = calculator.getYinYang(gan);
        
        // 判断是否是伤官: 日主所生且阴阳不同
        if (isGenerating(dayMasterWuxing, ganWuxing) && dayMasterYinYang !== ganYinYang) {
          shangguanCount++;
        }
      });
      
      // 检查所有地支的藏干
      [yearPillar.zhi, monthPillar.zhi, dayPillar.zhi, hourPillar.zhi].forEach(zhi => {
        const cangGans = calculator.getCangGan(zhi);
        cangGans.forEach(gan => {
          const ganWuxing = calculator.getWuxing(gan);
          const ganYinYang = calculator.getYinYang(gan);
          
          // 判断是否是伤官: 日主所生且阴阳不同
          if (isGenerating(dayMasterWuxing, ganWuxing) && dayMasterYinYang !== ganYinYang) {
            shangguanCount += 0.5; // 藏干的权重小一些
          }
        });
      });
      
      return shangguanCount >= 2; // 伤官数量达到阈值判定为伤官局
    } catch (error) {
      console.error("判断伤官局错误:", error);
      reportError(error);
      return false;
    }
  };
  
  // 判断是否为印重局
  const isYinzhongJu = (bazi) => {
    try {
      const { yearPillar, monthPillar, dayPillar, hourPillar } = bazi;
      const calculator = BaziCalculator();
      
      // 获取日主五行
      const dayMasterWuxing = calculator.getWuxing(dayPillar.gan);
      
      // 印星是生日主的五行
      // 正印: 生日主且阴阳不同
      // 偏印: 生日主且阴阳相同
      
      // 统计印星的数量
      let yinCount = 0;
      
      // 检查所有天干
      [yearPillar.gan, monthPillar.gan, hourPillar.gan].forEach(gan => {
        const ganWuxing = calculator.getWuxing(gan);
        
        // 判断是否是印星: 生日主的五行
        if (isGenerating(ganWuxing, dayMasterWuxing)) {
          yinCount++;
        }
      });
      
      // 检查所有地支的藏干
      [yearPillar.zhi, monthPillar.zhi, dayPillar.zhi, hourPillar.zhi].forEach(zhi => {
        const cangGans = calculator.getCangGan(zhi);
        cangGans.forEach(gan => {
          const ganWuxing = calculator.getWuxing(gan);
          
          // 判断是否是印星: 生日主的五行
          if (isGenerating(ganWuxing, dayMasterWuxing)) {
            yinCount += 0.5; // 藏干的权重小一些
          }
        });
      });
      
      return yinCount >= 2; // 印星数量达到阈值判定为印重局
    } catch (error) {
      console.error("判断印重局错误:", error);
      reportError(error);
      return false;
    }
  };
  
  // 判断是否为命旺局
  const isBijianJu = (bazi) => {
    try {
      const { yearPillar, monthPillar, dayPillar, hourPillar } = bazi;
      const calculator = BaziCalculator();
      
      // 获取日主五行
      const dayMasterWuxing = calculator.getWuxing(dayPillar.gan);
      
      // 比肩是与日主同样五行的天干
      // 比肩: 与日主五行相同且阴阳相同
      // 劫财: 与日主五行相同且阴阳不同
      
      // 统计比肩的数量
      let bijianCount = 0;
      
      // 检查所有天干
      [yearPillar.gan, monthPillar.gan, hourPillar.gan].forEach(gan => {
        const ganWuxing = calculator.getWuxing(gan);
        
        // 判断是否是比肩: 与日主五行相同
        if (ganWuxing === dayMasterWuxing) {
          bijianCount++;
        }
      });
      
      // 检查所有地支的藏干
      [yearPillar.zhi, monthPillar.zhi, dayPillar.zhi, hourPillar.zhi].forEach(zhi => {
        const cangGans = calculator.getCangGan(zhi);
        cangGans.forEach(gan => {
          const ganWuxing = calculator.getWuxing(gan);
          
          // 判断是否是比肩: 与日主五行相同
          if (ganWuxing === dayMasterWuxing) {
            bijianCount += 0.5; // 藏干的权重小一些
          }
        });
      });
      
      return bijianCount >= 2; // 比肩数量达到阈值判定为命旺局
    } catch (error) {
      console.error("判断命旺局错误:", error);
      reportError(error);
      return false;
    }
  };
  
  // 判断是否为煞重局
  const isShazhongJu = (bazi) => {
    try {
      const { yearPillar, monthPillar, dayPillar, hourPillar } = bazi;
      const calculator = BaziCalculator();
      
      // 获取日主五行
      const dayMasterWuxing = calculator.getWuxing(dayPillar.gan);
      
      // 七杀是克日主的五行
      // 正官: 克日主且阴阳不同
      // 七杀: 克日主且阴阳相同
      
      // 统计七杀的数量
      let shaCount = 0;
      
      // 检查所有天干
      [yearPillar.gan, monthPillar.gan, hourPillar.gan].forEach(gan => {
        const ganWuxing = calculator.getWuxing(gan);
        
        // 判断是否是七杀: 克日主的五行
        if (isControlling(ganWuxing, dayMasterWuxing)) {
          shaCount++;
        }
      });
      
      // 检查所有地支的藏干
      [yearPillar.zhi, monthPillar.zhi, dayPillar.zhi, hourPillar.zhi].forEach(zhi => {
        const cangGans = calculator.getCangGan(zhi);
        cangGans.forEach(gan => {
          const ganWuxing = calculator.getWuxing(gan);
          
          // 判断是否是七杀: 克日主的五行
          if (isControlling(ganWuxing, dayMasterWuxing)) {
            shaCount += 0.5; // 藏干的权重小一些
          }
        });
      });
      
      return shaCount >= 2; // 七杀数量达到阈值判定为煞重局
    } catch (error) {
      console.error("判断煞重局错误:", error);
      reportError(error);
      return false;
    }
  };
  
  // 判断是否为财旺局
  const isCaiwangJu = (bazi) => {
    try {
      const { yearPillar, monthPillar, dayPillar, hourPillar } = bazi;
      const calculator = BaziCalculator();
      
      // 获取日主五行
      const dayMasterWuxing = calculator.getWuxing(dayPillar.gan);
      
      // 财星是被日主所克的五行
      // 正财: 被日主所克且阴阳不同
      // 偏财: 被日主所克且阴阳相同
      
      // 统计财星的数量
      let caiCount = 0;
      
      // 检查所有天干
      [yearPillar.gan, monthPillar.gan, hourPillar.gan].forEach(gan => {
        const ganWuxing = calculator.getWuxing(gan);
        
        // 判断是否是财星: 被日主所克的五行
        if (isControlling(dayMasterWuxing, ganWuxing)) {
          caiCount++;
        }
      });
      
      // 检查所有地支的藏干
      [yearPillar.zhi, monthPillar.zhi, dayPillar.zhi, hourPillar.zhi].forEach(zhi => {
        const cangGans = calculator.getCangGan(zhi);
        cangGans.forEach(gan => {
          const ganWuxing = calculator.getWuxing(gan);
          
          // 判断是否是财星: 被日主所克的五行
          if (isControlling(dayMasterWuxing, ganWuxing)) {
            caiCount += 0.5; // 藏干的权重小一些
          }
        });
      });
      
      return caiCount >= 2; // 财星数量达到阈值判定为财旺局
    } catch (error) {
      console.error("判断财旺局错误:", error);
      reportError(error);
      return false;
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
    analyzePattern,
    isShangguanJu,
    isYinzhongJu,
    isBijianJu,
    isShazhongJu,
    isCaiwangJu
  };
}
