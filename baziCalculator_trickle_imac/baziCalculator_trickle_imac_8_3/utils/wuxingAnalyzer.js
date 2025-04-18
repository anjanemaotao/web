function WuxingAnalyzer() {
  // 五行
  const wuxing = ['金', '木', '水', '火', '土'];
  
  // 分析八字中的五行强弱
  const analyzeWuxing = (bazi) => {
    try {
      const { yearPillar, monthPillar, dayPillar, hourPillar } = bazi;
      const calculator = BaziCalculator();
      
      // 初始化五行计数
      const wuxingCount = {
        '木': 0,
        '火': 0,
        '土': 0,
        '金': 0,
        '水': 0
      };
      
      // 统计天干中的五行（每个天干3%，共12%）
      [yearPillar.gan, monthPillar.gan, dayPillar.gan, hourPillar.gan].forEach(gan => {
        const ganWuxing = calculator.getWuxing(gan);
        wuxingCount[ganWuxing] += 3;
      });
      
      // 统计地支中的五行
      // 月支40%
      const monthZhiWuxing = calculator.getWuxing(monthPillar.zhi);
      wuxingCount[monthZhiWuxing] += 40;
      
      // 年支、日支、时支各10%（共30%）
      [yearPillar.zhi, dayPillar.zhi, hourPillar.zhi].forEach(zhi => {
        const zhiWuxing = calculator.getWuxing(zhi);
        wuxingCount[zhiWuxing] += 10;
      });
      
      // 月支藏干分配8%（只计算中气和尾气）
      const monthCangGans = calculator.getCangGan(monthPillar.zhi);
      const monthZhiWuxingValue = calculator.getWuxing(monthPillar.zhi);
      const monthNonBenQiCount = monthCangGans.filter((gan, index) => 
        calculator.getWuxing(gan) !== monthZhiWuxingValue && index > 0
      ).length;
      
      if (monthNonBenQiCount > 0) {
        const monthWeight = 8 / monthNonBenQiCount; // 8% 平均分配给中气和尾气
        monthCangGans.forEach((gan, index) => {
          const ganWuxing = calculator.getWuxing(gan);
          if (ganWuxing !== monthZhiWuxingValue && index > 0) {
            wuxingCount[ganWuxing] += monthWeight;
          }
        });
      }
      
      // 其他地支藏干平均分配10%（只计算中气和尾气）
      [yearPillar.zhi, dayPillar.zhi, hourPillar.zhi].forEach(zhi => {
        const cangGans = calculator.getCangGan(zhi);
        const zhiWuxing = calculator.getWuxing(zhi);
        const nonBenQiCount = cangGans.filter((gan, index) => 
          calculator.getWuxing(gan) !== zhiWuxing && index > 0
        ).length;
        
        if (nonBenQiCount > 0) {
          const weight = 10 / (3 * nonBenQiCount); // 10%平均分配给所有非本气藏干
          cangGans.forEach((gan, index) => {
            const ganWuxing = calculator.getWuxing(gan);
            if (ganWuxing !== zhiWuxing && index > 0) {
              wuxingCount[ganWuxing] += weight;
            }
          });
        }
      });
      
      // 考虑月令旺相
      const monthZhi = monthPillar.zhi;
      let seasonalFactor = {};
      
      // 根据月令调整五行强度
      switch (monthZhi) {
        case '寅':
        case '卯':
          // 春季，木旺
          seasonalFactor = { '木': 1.5, '火': 1.2, '土': 0.8, '金': 0.6, '水': 1.0 };
          break;
        case '巳':
        case '午':
          // 夏季，火旺
          seasonalFactor = { '木': 1.0, '火': 1.5, '土': 1.2, '金': 0.6, '水': 0.8 };
          break;
        case '申':
        case '酉':
          // 秋季，金旺
          seasonalFactor = { '木': 0.6, '火': 0.8, '土': 1.0, '金': 1.5, '水': 1.2 };
          break;
        case '亥':
        case '子':
          // 冬季，水旺
          seasonalFactor = { '木': 1.2, '火': 0.6, '土': 0.8, '金': 1.0, '水': 1.5 };
          break;
        case '辰':
        case '戌':
        case '丑':
        case '未':
          // 土旺
          seasonalFactor = { '木': 0.8, '火': 1.0, '土': 1.5, '金': 1.2, '水': 0.6 };
          break;
        default:
          seasonalFactor = { '木': 1.0, '火': 1.0, '土': 1.0, '金': 1.0, '水': 1.0 };
      }
      
      // 应用季节因素
      Object.keys(wuxingCount).forEach(wx => {
        wuxingCount[wx] *= seasonalFactor[wx] || 1.0;
      });
      
      // 计算应用季节因素后的总分
      const totalCount = Object.values(wuxingCount).reduce((sum, count) => sum + count, 0);
      
      // 归一化处理，确保总分为100
      Object.keys(wuxingCount).forEach(wx => {
        wuxingCount[wx] = (wuxingCount[wx] / totalCount) * 100;
      });
      
      // 重新计算归一化后的总分（应该接近100）
      const normalizedTotal = Object.values(wuxingCount).reduce((sum, count) => sum + count, 0);
      
      // 计算五行的相对强度
      const wuxingStrength = {};
      
      Object.keys(wuxingCount).forEach(wx => {
        const percentage = (wuxingCount[wx] / totalCount) * 100;
        
        // 根据百分比判断强弱
        if (percentage >= 30) {
          wuxingStrength[wx] = 'strong';
        } else if (percentage <= 10) {
          wuxingStrength[wx] = 'weak';
        } else {
          wuxingStrength[wx] = 'neutral';
        }
      });
      
      return {
        count: wuxingCount,
        strength: wuxingStrength
      };
    } catch (error) {
      console.error("分析五行错误:", error);
      reportError(error);
      return {
        count: { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 },
        strength: { '木': 'neutral', '火': 'neutral', '土': 'neutral', '金': 'neutral', '水': 'neutral' }
      };
    }
  };
  
  return {
    analyzeWuxing,
    wuxing
  };
}
