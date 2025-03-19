// 八字计算工具
function BaziCalculator() {
  const lunarCalendar = LunarCalendar();
  
  // 计算八字
  function calculateBazi(year, month, day, hour) {
    try {
      // 计算农历日期
      const lunarDate = lunarCalendar.getLunarDateBySolar(year, month, day);
      if (!lunarDate) {
        throw new Error("农历日期计算失败");
      }
      
      // 计算年柱
      const yearGanZhi = lunarCalendar.getYearGanZhi(year);
      
      // 计算月柱
      const monthGanZhi = lunarCalendar.getMonthGanZhi(year, month);
      
      // 计算日柱
      const dayGanZhi = lunarCalendar.getDayGanZhi(year, month, day);
      
      // 计算时柱
      const hourGanZhi = lunarCalendar.getHourGanZhi(dayGanZhi.gan, hour);
      
      // 组装八字
      const bazi = {
        year: yearGanZhi,
        month: monthGanZhi,
        day: dayGanZhi,
        hour: hourGanZhi,
        lunarDate: lunarDate,
        solarDate: { year, month, day, hour }
      };
      
      return bazi;
    } catch (error) {
      console.error("八字计算错误:", error);
      reportError(error);
      return null;
    }
  }
  
  // 计算纳音五行
  function calculateNaYin(bazi) {
    try {
      const naYin = {
        year: NA_YIN[bazi.year.ganZhi] || "",
        month: NA_YIN[bazi.month.ganZhi] || "",
        day: NA_YIN[bazi.day.ganZhi] || "",
        hour: NA_YIN[bazi.hour.ganZhi] || ""
      };
      
      return naYin;
    } catch (error) {
      console.error("纳音五行计算错误:", error);
      reportError(error);
      return {};
    }
  }
  
  // 计算十神
  function calculateTenGods(bazi) {
    try {
      const dayGan = bazi.day.gan;
      const tenGods = {};
      
      // 年柱天干十神
      tenGods.yearGan = TEN_GODS[dayGan][bazi.year.gan];
      
      // 月柱天干十神
      tenGods.monthGan = TEN_GODS[dayGan][bazi.month.gan];
      
      // 时柱天干十神
      tenGods.hourGan = TEN_GODS[dayGan][bazi.hour.gan];
      
      // 地支藏干的十神
      tenGods.yearZhi = {};
      BRANCH_HIDDEN_STEMS[bazi.year.zhi].forEach(stem => {
        tenGods.yearZhi[stem] = TEN_GODS[dayGan][stem];
      });
      
      tenGods.monthZhi = {};
      BRANCH_HIDDEN_STEMS[bazi.month.zhi].forEach(stem => {
        tenGods.monthZhi[stem] = TEN_GODS[dayGan][stem];
      });
      
      tenGods.dayZhi = {};
      BRANCH_HIDDEN_STEMS[bazi.day.zhi].forEach(stem => {
        tenGods.dayZhi[stem] = TEN_GODS[dayGan][stem];
      });
      
      tenGods.hourZhi = {};
      BRANCH_HIDDEN_STEMS[bazi.hour.zhi].forEach(stem => {
        tenGods.hourZhi[stem] = TEN_GODS[dayGan][stem];
      });
      
      return tenGods;
    } catch (error) {
      console.error("十神计算错误:", error);
      reportError(error);
      return {};
    }
  }
  
  // 计算五行分布
  function calculateElementDistribution(bazi) {
    try {
      const elements = {
        木: 0,
        火: 0,
        土: 0,
        金: 0,
        水: 0
      };
      
      // 天干五行
      elements[STEM_ELEMENTS[bazi.year.gan]] += 1;
      elements[STEM_ELEMENTS[bazi.month.gan]] += 1;
      elements[STEM_ELEMENTS[bazi.day.gan]] += 1;
      elements[STEM_ELEMENTS[bazi.hour.gan]] += 1;
      
      // 地支藏干五行（考虑权重）
      function addHiddenStemElements(branch, weight = 1) {
        const hiddenStems = BRANCH_HIDDEN_STEMS[branch];
        hiddenStems.forEach(stem => {
          const stemWeight = BRANCH_HIDDEN_STEMS_WEIGHT[branch][stem] / 100 * weight;
          elements[STEM_ELEMENTS[stem]] += stemWeight;
        });
      }
      
      addHiddenStemElements(bazi.year.zhi);
      addHiddenStemElements(bazi.month.zhi);
      addHiddenStemElements(bazi.day.zhi);
      addHiddenStemElements(bazi.hour.zhi);
      
      return elements;
    } catch (error) {
      console.error("五行分布计算错误:", error);
      reportError(error);
      return { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
    }
  }
  
  // 计算地支刑冲合害
  function calculateBranchRelations(bazi) {
    try {
      const branches = [bazi.year.zhi, bazi.month.zhi, bazi.day.zhi, bazi.hour.zhi];
      const relations = {
        conflicts: [], // 六冲
        harmonies: [], // 三合
        combinations: [], // 三会
        harms: [] // 六害
      };
      
      // 检查六冲
      for (const conflict of SIX_CONFLICTS) {
        const [b1, b2] = conflict;
        const positions = [];
        
        branches.forEach((branch, index) => {
          if (branch === b1 || branch === b2) {
            positions.push(["年", "月", "日", "时"][index]);
          }
        });
        
        if (positions.length >= 2) {
          relations.conflicts.push({
            branches: conflict,
            positions: positions
          });
        }
      }
      
      // 检查三合
      for (const harmony of THREE_HARMONY) {
        const found = harmony.filter(b => branches.includes(b));
        if (found.length >= 2) {
          const positions = [];
          found.forEach(branch => {
            branches.forEach((b, index) => {
              if (b === branch) {
                positions.push(["年", "月", "日", "时"][index]);
              }
            });
          });
          
          relations.harmonies.push({
            branches: found,
            positions: positions,
            element: ["火", "木", "水", "金"][THREE_HARMONY.indexOf(harmony)]
          });
        }
      }
      
      // 检查三会
      for (const combination of THREE_COMBINATIONS) {
        const found = combination.filter(b => branches.includes(b));
        if (found.length >= 2) {
          const positions = [];
          found.forEach(branch => {
            branches.forEach((b, index) => {
              if (b === branch) {
                positions.push(["年", "月", "日", "时"][index]);
              }
            });
          });
          
          relations.combinations.push({
            branches: found,
            positions: positions,
            element: ["水", "木", "火", "金"][THREE_COMBINATIONS.indexOf(combination)]
          });
        }
      }
      
      // 检查六害
      for (const harm of SIX_HARMS) {
        const [b1, b2] = harm;
        const positions = [];
        
        branches.forEach((branch, index) => {
          if (branch === b1 || branch === b2) {
            positions.push(["年", "月", "日", "时"][index]);
          }
        });
        
        if (positions.length >= 2) {
          relations.harms.push({
            branches: harm,
            positions: positions
          });
        }
      }
      
      return relations;
    } catch (error) {
      console.error("地支关系计算错误:", error);
      reportError(error);
      return { conflicts: [], harmonies: [], combinations: [], harms: [] };
    }
  }
  
  return {
    calculateBazi,
    calculateNaYin,
    calculateTenGods,
    calculateElementDistribution,
    calculateBranchRelations
  };
}
