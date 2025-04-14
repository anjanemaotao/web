function ShierGongAnalyzer() {
  // 十二宫名称
  const shierGongNames = [
    'changsheng', // 长生
    'muyu',      // 沐浴
    'guandai',   // 冠带
    'linguan',   // 临官
    'diwang',    // 帝旺
    'shuai',     // 衰
    'bing',      // 病
    'si',        // 死
    'mu',        // 墓
    'jue',       // 绝
    'tai',       // 胎
    'yang'       // 养
  ];
  
  // 十二宫起始位置
  const shierGongStartPositions = {
    '甲': '亥', '乙': '午',
    '丙': '寅', '丁': '酉',
    '戊': '寅', '己': '酉',
    '庚': '巳', '辛': '子',
    '壬': '申', '癸': '卯'
  };
  
  // 分析八字中的十二宫
  const analyzeShierGong = (bazi) => {
    try {
      const { yearPillar, monthPillar, dayPillar, hourPillar } = bazi;
      const calculator = BaziCalculator();
      
      // 获取日主天干
      const dayMasterGan = dayPillar.gan;
      
      // 获取十二宫起始地支
      const startZhi = shierGongStartPositions[dayMasterGan];
      
      // 获取各柱地支的十二宫状态
      const shierGongStates = {
        yearZhi: getShierGongState(yearPillar.zhi, dayMasterGan),
        monthZhi: getShierGongState(monthPillar.zhi, dayMasterGan),
        dayZhi: getShierGongState(dayPillar.zhi, dayMasterGan),
        hourZhi: getShierGongState(hourPillar.zhi, dayMasterGan)
      };
      
      // 判断命局中最强的十二宫状态
      const dominantState = getDominantState(shierGongStates, monthPillar.zhi);
      
      return {
        shierGongStates,
        dominantState
      };
    } catch (error) {
      console.error("分析十二宫错误:", error);
      reportError(error);
      return {
        shierGongStates: {},
        dominantState: null
      };
    }
  };
  
  // 获取地支的十二宫状态
  const getShierGongState = (zhi, dayMasterGan) => {
    try {
      // 获取十二宫起始地支
      const startZhi = shierGongStartPositions[dayMasterGan];
      
      // 地支顺序
      const diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
      
      // 阳干顺行，阴干逆行
      const calculator = BaziCalculator();
      const dayMasterYinYang = calculator.getYinYang(dayMasterGan);
      const isYang = dayMasterYinYang === '阳';
      
      // 计算起始地支在地支列表中的索引
      const startIndex = diZhi.indexOf(startZhi);
      if (startIndex === -1) return null;
      
      // 计算目标地支在地支列表中的索引
      const targetIndex = diZhi.indexOf(zhi);
      if (targetIndex === -1) return null;
      
      // 计算偏移量
      let offset;
      if (isYang) {
        // 阳干顺行
        offset = (targetIndex - startIndex + 12) % 12;
      } else {
        // 阴干逆行
        offset = (startIndex - targetIndex + 12) % 12;
      }
      
      // 返回对应的十二宫状态
      return shierGongNames[offset];
    } catch (error) {
      console.error("获取十二宫状态错误:", error);
      reportError(error);
      return null;
    }
  };
  
  // 判断命局中最强的十二宫状态
  const getDominantState = (shierGongStates, monthZhi) => {
    try {
      // 月令地支的十二宫状态最为重要
      return shierGongStates.monthZhi;
    } catch (error) {
      console.error("获取主导十二宫状态错误:", error);
      reportError(error);
      return null;
    }
  };
  
  // 获取十二宫状态的解释
  const getShierGongExplanation = (state) => {
    const explanations = {
      'changsheng': '长生代表新的开始，充满活力和潜力，如同初生的婴儿。',
      'muyu': '沐浴是净化阶段，有不稳定性，容易受外界影响。',
      'guandai': '冠带象征成长和准备，如同穿戴整齐准备出门。',
      'linguan': '临官表示事业有成，能够获得收获和地位。',
      'diwang': '帝旺是鼎盛状态，力量达到巅峰。',
      'shuai': '衰表示开始走下坡路，力量减弱。',
      'bing': '病代表不健康状态，容易出现问题。',
      'si': '死象征结束和消亡，一个阶段的终结。',
      'mu': '墓代表收藏和收敛，进入积累阶段。',
      'jue': '绝表示断绝，缺乏生机，处于低谷。',
      'tai': '胎有孕育和希望的意思，新生命的起点。',
      'yang': '养代表滋养和培育，为新的循环做准备。'
    };
    
    return explanations[state] || '';
  };
  
  // 获取十二宫状态的强弱判断
  const getShierGongStrength = (state) => {
    const strengths = {
      'changsheng': 'strong',
      'muyu': 'neutral',
      'guandai': 'neutral',
      'linguan': 'strong',
      'diwang': 'strong',
      'shuai': 'neutral',
      'bing': 'weak',
      'si': 'weak',
      'mu': 'weak',
      'jue': 'weak',
      'tai': 'neutral',
      'yang': 'neutral'
    };
    
    return strengths[state] || 'neutral';
  };
  
  return {
    analyzeShierGong,
    getShierGongState,
    getShierGongExplanation,
    getShierGongStrength,
    shierGongNames
  };
}
