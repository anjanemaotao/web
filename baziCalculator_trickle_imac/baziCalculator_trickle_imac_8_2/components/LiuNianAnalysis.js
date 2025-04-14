function LiuNianAnalysis({ bazi }) {
  try {
    const { t } = React.useContext(I18nContext);
    
    if (!bazi) {
      return (
        <div className="analysis-item" data-name="liunian-analysis-empty">
          <div className="analysis-title">{t('liunianTitle') || '流年大运分析'}</div>
          <div className="analysis-content">-</div>
        </div>
      );
    }
    
    const calculator = BaziCalculator();
    const { yearPillar, dayPillar } = bazi;
    
    // 获取当前年份
    const currentYear = new Date().getFullYear();
    
    // 计算未来30年的流年
    const futureYears = [];
    for (let i = 0; i <= 30; i++) {
      const year = currentYear + i;
      const yearGanZhi = calculateYearGanZhi(year);
      
      // 分析与命主八字的关系
      const analysis = analyzeLiuNian(yearGanZhi, bazi, year);
      
      futureYears.push({
        year,
        ganZhi: yearGanZhi,
        analysis
      });
    }
    
    // 计算大运
    const daYun = calculateDaYun(bazi);
    
    // 控制展示流年的数量
    const [showAllYears, setShowAllYears] = React.useState(false);
    const displayYears = showAllYears ? futureYears : futureYears.slice(0, 10);
    
    return (
      <div className="analysis-item slide-in" data-name="liunian-analysis">
        <div className="analysis-title">{t('liunianTitle') || '流年大运分析'}</div>
        <div className="analysis-content">
          <h4 className="font-semibold mb-3">大运分析</h4>
          <div className="mb-4 p-3 bg-gray-50 rounded-md" data-name="dayun-analysis">
            <p>当前所在大运：<span className="font-medium">{daYun.current.ganZhi}</span></p>
            <p className="mt-2">大运特点：{daYun.current.description}</p>
            <p className="mt-2">下一大运：<span className="font-medium">{daYun.next.ganZhi}</span>，始于 {daYun.next.startYear} 年</p>
          </div>
          
          <h4 className="font-semibold mb-3">近期流年分析</h4>
          <div className="liuyun-grid" data-name="liunian-grid">
            {futureYears.slice(0, 6).map((yearData, index) => (
              <div key={index} className="liuyun-card" data-name={`liunian-card-${yearData.year}`}>
                <div className="liuyun-card-year">{yearData.year}年</div>
                <div className="liuyun-card-ganzhi">
                  <span className={`wuxing-${getWuxingClass(yearData.ganZhi.charAt(0))}`}>{yearData.ganZhi.charAt(0)}</span>
                  <span className={`wuxing-${getWuxingClass(yearData.ganZhi.charAt(1))}`}>{yearData.ganZhi.charAt(1)}</span>
                </div>
                <div className="text-sm">{getYearQuality(yearData.analysis.quality)}</div>
              </div>
            ))}
          </div>
          
          <h4 className="font-semibold mt-4 mb-3">未来三十年流年详解</h4>
          <div className="liuyun-timeline" data-name="liunian-timeline">
            {displayYears.map((yearData, index) => (
              <div key={index} className="liuyun-item" data-name={`liunian-item-${yearData.year}`}>
                <div className="liuyun-year">{yearData.year}年</div>
                <div className="liuyun-content">
                  <div className="liuyun-ganzhi">
                    流年干支：
                    <span className={`wuxing-${getWuxingClass(yearData.ganZhi.charAt(0))}`}>{yearData.ganZhi.charAt(0)}</span>
                    <span className={`wuxing-${getWuxingClass(yearData.ganZhi.charAt(1))}`}>{yearData.ganZhi.charAt(1)}</span>
                  </div>
                  <div className="liuyun-description">
                    <p>{yearData.analysis.description}</p>
                    <p className="mt-1">五行关系：{yearData.analysis.wuxingRelation}</p>
                    <p className="mt-1">宜忌：{yearData.analysis.advice}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {!showAllYears && (
            <div className="text-center mt-4">
              <button 
                className="btn" 
                onClick={() => setShowAllYears(true)}
                data-name="show-more-years"
              >
                查看更多流年
              </button>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('LiuNianAnalysis component error:', error);
    reportError(error);
    return null;
  }
}

// 计算年干支 - 修复后的函数，不再调用不存在的方法
function calculateYearGanZhi(year) {
  try {
    // 使用天干地支的循环特性计算年干支
    const tianGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    
    // 计算天干索引：(年份 - 4) % 10
    const tianGanIndex = (year - 4) % 10;
    // 计算地支索引：(年份 - 4) % 12
    const diZhiIndex = (year - 4) % 12;
    
    // 组合天干地支
    const gan = tianGan[tianGanIndex];
    const zhi = diZhi[diZhiIndex];
    
    return gan + zhi;
  } catch (error) {
    console.error("计算年干支错误:", error);
    reportError(error);
    return "甲子"; // 返回默认值避免应用崩溃
  }
}

// 分析流年与命局的关系
function analyzeLiuNian(yearGanZhi, bazi, year) {
  const calculator = BaziCalculator();
  const yearGan = yearGanZhi.charAt(0);
  const yearZhi = yearGanZhi.charAt(1);
  
  const dayGan = bazi.dayPillar.gan; // 日主天干
  
  // 获取五行属性
  const yearGanWuxing = calculator.getWuxing(yearGan);
  const yearZhiWuxing = calculator.getWuxing(yearZhi);
  const dayGanWuxing = calculator.getWuxing(dayGan);
  
  // 分析五行关系
  let wuxingRelation = '';
  let quality = 'neutral'; // 默认为中性
  let description = '';
  let advice = '';
  
  // 判断流年干与日主的五行关系
  if (isGenerating(yearGanWuxing, dayGanWuxing)) {
    // 流年干生日主
    wuxingRelation = `流年天干(${yearGan})${yearGanWuxing}生日主(${dayGan})${dayGanWuxing}，为助力之年`;
    quality = 'good';
    description = `${year}年对您较为有利，流年天干五行生助日主，有贵人扶持，事业可得发展，适合主动进取。`;
    advice = `宜：主动拓展，争取机会，扩大人脉。忌：固步自封，错失良机。`;
  } else if (isGenerating(dayGanWuxing, yearGanWuxing)) {
    // 日主生流年干
    wuxingRelation = `日主(${dayGan})${dayGanWuxing}生流年天干(${yearGan})${yearGanWuxing}，为耗泄之年`;
    quality = 'challenging';
    description = `${year}年需要注意资源消耗，流年五行被日主所生，易有耗财、耗力情况，需节制开支，量力而行。`;
    advice = `宜：节约资源，稳健发展，量力而行。忌：大手大脚，铺张浪费。`;
  } else if (isControlling(yearGanWuxing, dayGanWuxing)) {
    // 流年干克日主
    wuxingRelation = `流年天干(${yearGan})${yearGanWuxing}克日主(${dayGan})${dayGanWuxing}，为压力之年`;
    quality = 'bad';
    description = `${year}年可能面临一些压力和挑战，流年天干五行克制日主，需谨慎行事，避免冲动决策。`;
    advice = `宜：稳重行事，避险保守，加强健康管理。忌：冒进冒险，逞强好胜。`;
  } else if (isControlling(dayGanWuxing, yearGanWuxing)) {
    // 日主克流年干
    wuxingRelation = `日主(${dayGan})${dayGanWuxing}克流年天干(${yearGan})${yearGanWuxing}，为主导之年`;
    quality = 'good';
    description = `${year}年您可能较为主动，能够掌握主动权，适合推进自己的计划和想法，但也需防止过于强势。`;
    advice = `宜：主动出击，实施计划，展现才能。忌：过于强势，得罪贵人。`;
  } else if (yearGanWuxing === dayGanWuxing) {
    // 流年干与日主五行相同
    wuxingRelation = `流年天干(${yearGan})与日主(${dayGan})五行相同，为比和之年`;
    quality = 'neutral';
    description = `${year}年与您的八字五行较为协调，可能会遇到志同道合的人或机会，但也可能面临一些竞争。`;
    advice = `宜：合作共赢，扩展人脉，寻找机会。忌：过度竞争，孤军奋战。`;
  }
  
  // 考虑地支影响，增加更多变化
  // 地支与日主的关系也会影响流年
  if (yearZhi === '寅' || yearZhi === '卯') {
    description += ' 木气当旺，适合开始新项目，拓展人际关系。';
  } else if (yearZhi === '巳' || yearZhi === '午') {
    description += ' 火气当旺，适合展示才能，提升知名度。';
  } else if (yearZhi === '申' || yearZhi === '酉') {
    description += ' 金气当旺，适合收获成果，巩固成就。';
  } else if (yearZhi === '亥' || yearZhi === '子') {
    description += ' 水气当旺，适合学习充电，深入思考。';
  } else if (yearZhi === '辰' || yearZhi === '戌' || yearZhi === '丑' || yearZhi === '未') {
    description += ' 土气当旺，适合稳固基础，注重实际。';
  }

  return {
    wuxingRelation,
    quality,
    description,
    advice
  };
}

// 计算大运
function calculateDaYun(bazi) {
  // 实际应用中，应根据性别、出生年月等详细计算大运
  // 这里简化处理
  const currentYear = new Date().getFullYear();
  
  // 假设当前大运
  const currentDaYun = {
    ganZhi: '戊午',
    startYear: currentYear - 5,
    endYear: currentYear + 5,
    description: '戊土为中正之土，午火为太阳当午，此大运五行土火旺盛，有助于事业发展和人际关系拓展，但也需注意健康方面的调养。'
  };
  
  // 下一大运
  const nextDaYun = {
    ganZhi: '己未',
    startYear: currentYear + 5,
    endYear: currentYear + 15,
    description: '己土阴柔，未土湿润，此大运五行偏向阴柔，适合稳健发展，注重内在修养和家庭建设，事业上可能会有稳步提升。'
  };
  
  return {
    current: currentDaYun,
    next: nextDaYun
  };
}

// 判断五行相生关系
function isGenerating(source, target) {
  const generatingRelations = {
    '木': '火',
    '火': '土',
    '土': '金',
    '金': '水',
    '水': '木'
  };
  
  return generatingRelations[source] === target;
}

// 判断五行相克关系
function isControlling(source, target) {
  const controllingRelations = {
    '木': '土',
    '土': '水',
    '水': '火',
    '火': '金',
    '金': '木'
  };
  
  return controllingRelations[source] === target;
}

// 获取流年质量评估
function getYearQuality(quality) {
  switch (quality) {
    case 'good':
      return '吉利之年';
    case 'bad':
      return '谨慎之年';
    case 'challenging':
      return '消耗之年';
    default:
      return '平稳之年';
  }
}

// 获取五行对应的CSS类名
function getWuxingClass(ganOrZhi) {
  const calculator = BaziCalculator();
  const wuxing = calculator.getWuxing(ganOrZhi);
  
  switch (wuxing) {
    case '木': return 'wood';
    case '火': return 'fire';
    case '土': return 'earth';
    case '金': return 'metal';
    case '水': return 'water';
    default: return '';
  }
}
