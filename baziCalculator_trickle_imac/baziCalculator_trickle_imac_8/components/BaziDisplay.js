function BaziDisplay({ bazi }) {
  try {
    const { t } = React.useContext(I18nContext);
    
    if (!bazi) return null;
    
    const { yearPillar, monthPillar, dayPillar, hourPillar } = bazi;
    const calculator = BaziCalculator();
    
    // 获取天干地支的五行和阴阳属性
    const getPillarAttributes = (pillar) => {
      return {
        ganWuxing: calculator.getWuxing(pillar.gan),
        zhiWuxing: calculator.getWuxing(pillar.zhi),
        ganYinYang: calculator.getYinYang(pillar.gan),
        zhiYinYang: calculator.getYinYang(pillar.zhi),
        zhiCangGan: calculator.getCangGan(pillar.zhi)
      };
    };
    
    const yearAttributes = getPillarAttributes(yearPillar);
    const monthAttributes = getPillarAttributes(monthPillar);
    const dayAttributes = getPillarAttributes(dayPillar);
    const hourAttributes = getPillarAttributes(hourPillar);
    
    return (
      <div className="bazi-display staggered-fade-in" data-name="bazi-display">
        <div className="bazi-pillar bazi-pillar-animation pillar-year" data-name="year-pillar">
          <div className="pillar-name">{t('yearPillar')}</div>
          <div className="pillar-content">
            <div className="gan-zhi-container">
              <div className={`wuxing-${getWuxingClass(yearPillar.gan)}`}>
                {yearPillar.gan}
                <sup className="wuxing-notation">{t(yearAttributes.ganWuxing)}</sup>
                <span className="yinyang-tag">{yearAttributes.ganYinYang}</span>
              </div>
              <div className={`wuxing-${getWuxingClass(yearPillar.zhi)}`}>
                {yearPillar.zhi}
                <sup className="wuxing-notation">{t(yearAttributes.zhiWuxing)}</sup>
                <span className="yinyang-tag">{yearAttributes.zhiYinYang}</span>
              </div>
            </div>
            <div className="cang-gan-display">
              <span className="cang-gan-label">藏干:</span>
              {yearAttributes.zhiCangGan.map((gan, index) => (
                <span 
                  key={index} 
                  className={`cang-gan-item wuxing-${getWuxingClass(gan)}`}
                >
                  {gan}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bazi-pillar bazi-pillar-animation pillar-month" data-name="month-pillar">
          <div className="pillar-name">{t('monthPillar')}</div>
          <div className="pillar-content">
            <div className="gan-zhi-container">
              <div className={`wuxing-${getWuxingClass(monthPillar.gan)}`}>
                {monthPillar.gan}
                <sup className="wuxing-notation">{t(monthAttributes.ganWuxing)}</sup>
                <span className="yinyang-tag">{monthAttributes.ganYinYang}</span>
              </div>
              <div className={`wuxing-${getWuxingClass(monthPillar.zhi)}`}>
                {monthPillar.zhi}
                <sup className="wuxing-notation">{t(monthAttributes.zhiWuxing)}</sup>
                <span className="yinyang-tag">{monthAttributes.zhiYinYang}</span>
              </div>
            </div>
            <div className="cang-gan-display">
              <span className="cang-gan-label">藏干:</span>
              {monthAttributes.zhiCangGan.map((gan, index) => (
                <span 
                  key={index} 
                  className={`cang-gan-item wuxing-${getWuxingClass(gan)}`}
                >
                  {gan}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bazi-pillar bazi-pillar-animation pillar-day" data-name="day-pillar">
          <div className="pillar-name">{t('dayPillar')}</div>
          <div className="pillar-content">
            <div className="gan-zhi-container">
              <div className={`wuxing-${getWuxingClass(dayPillar.gan)}`}>
                {dayPillar.gan}
                <sup className="wuxing-notation">{t(dayAttributes.ganWuxing)}</sup>
                <span className="yinyang-tag">{dayAttributes.ganYinYang}</span>
              </div>
              <div className={`wuxing-${getWuxingClass(dayPillar.zhi)}`}>
                {dayPillar.zhi}
                <sup className="wuxing-notation">{t(dayAttributes.zhiWuxing)}</sup>
                <span className="yinyang-tag">{dayAttributes.zhiYinYang}</span>
              </div>
            </div>
            <div className="cang-gan-display">
              <span className="cang-gan-label">藏干:</span>
              {dayAttributes.zhiCangGan.map((gan, index) => (
                <span 
                  key={index} 
                  className={`cang-gan-item wuxing-${getWuxingClass(gan)}`}
                >
                  {gan}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bazi-pillar bazi-pillar-animation pillar-hour" data-name="hour-pillar">
          <div className="pillar-name">{t('hourPillar')}</div>
          <div className="pillar-content">
            <div className="gan-zhi-container">
              <div className={`wuxing-${getWuxingClass(hourPillar.gan)}`}>
                {hourPillar.gan}
                <sup className="wuxing-notation">{t(hourAttributes.ganWuxing)}</sup>
                <span className="yinyang-tag">{hourAttributes.ganYinYang}</span>
              </div>
              <div className={`wuxing-${getWuxingClass(hourPillar.zhi)}`}>
                {hourPillar.zhi}
                <sup className="wuxing-notation">{t(hourAttributes.zhiWuxing)}</sup>
                <span className="yinyang-tag">{hourAttributes.zhiYinYang}</span>
              </div>
            </div>
            <div className="cang-gan-display">
              <span className="cang-gan-label">藏干:</span>
              {hourAttributes.zhiCangGan.map((gan, index) => (
                <span 
                  key={index} 
                  className={`cang-gan-item wuxing-${getWuxingClass(gan)}`}
                >
                  {gan}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('BaziDisplay component error:', error);
    reportError(error);
    return null;
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
