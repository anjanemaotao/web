function PersonInfo({ bazi, lunarDate, solarDate }) {
  try {
    const { t } = React.useContext(I18nContext);
    
    if (!bazi || !lunarDate) return null;
    
    const calculator = BaziCalculator();
    
    // 获取生肖
    const zodiac = calculator.getChineseZodiac(lunarDate.year);
    
    // 计算虚岁
    const virtualAge = calculator.calculateVirtualAge(lunarDate);
    
    // 获取节气信息
    const solarTermInfo = calculator.getSolarTermInfo(lunarDate);
    
    // 格式化阴历日期
    const formattedLunarDate = calculator.formatLunarDate(lunarDate);
    
    // 格式化阳历日期
    const formattedSolarDate = calculator.formatSolarDate(solarDate);
    
    return (
      <div className="person-info-section staggered-fade-in card" data-name="person-info-section">
        <h3 className="section-title"><i className="fas fa-user-circle mr-2"></i>{t('personInfoSection')}</h3>
        <hr className="divider" />
        
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label"><i className="fas fa-dragon mr-1"></i>{t('chineseZodiac')}:</span>
            <span className="info-value fw-bold text-primary">{t(zodiac)}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label"><i className="fas fa-birthday-cake mr-1"></i>{t('virtualAge')}:</span>
            <span className="info-value fw-bold text-primary">{virtualAge}</span>
          </div>
        </div>
        
        <div className="date-info mt-3">
          <div className="info-item">
            <span className="info-label"><i className="fas fa-moon mr-1"></i>{t('lunarBirthDate')}:</span>
            <span className="info-value fw-bold">{formattedLunarDate.fullChineseDate}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label"><i className="fas fa-sun mr-1"></i>{t('solarBirthDate')}:</span>
            <span className="info-value fw-bold">{formattedSolarDate}</span>
          </div>
        </div>
        
        {solarTermInfo && (
          <div className="solar-term-info mt-3 p-3 bg-light rounded">
            <h4 className="text-accent-color mb-2"><i className="fas fa-calendar-alt mr-2"></i>{t('solarTermInfo')}</h4>
            <div className="info-item">
              <span className="info-label"><i className="fas fa-hourglass-half mr-1"></i>{t('birthSolarTerm')}:</span>
              <span className="info-value">
                {solarTermInfo.prevTerm && (
                  <span className="badge bg-secondary mr-2">{solarTermInfo.prevTerm} {t('afterTerm')} <strong className="text-accent-color">{solarTermInfo.daysToPrev}</strong> {t('days')}</span>
                )}
                {solarTermInfo.nextTerm && (
                  <span className="badge bg-primary mr-2"> {solarTermInfo.nextTerm} {t('beforeTerm')} <strong className="text-accent-color">{solarTermInfo.daysToNext}</strong> {t('days')}</span>
                )}
                {solarTermInfo.nextNextTerm && (
                  <span className="badge bg-info"> {solarTermInfo.nextNextTerm} {t('beforeTerm')} <strong className="text-accent-color">{solarTermInfo.daysToNext + 15}</strong> {t('days')}</span>
                )}
              </span>
            </div>
            
            <div className="info-item mt-2">
              <span className="info-label"><i className="fas fa-clock mr-1"></i>{t('solarTermTime')}:</span>
              <span className="info-value">
                {solarTermInfo.prevTerm && (
                  <div className="term-time-item"><span className="term-name">{solarTermInfo.prevTerm}:</span> <span className="term-time text-success fw-bold">{solarTermInfo.termTimes[solarTermInfo.prevTerm].date}</span></div>
                )}
                {solarTermInfo.nextTerm && (
                  <div className="term-time-item"><span className="term-name">{solarTermInfo.nextTerm}:</span> <span className="term-time text-success fw-bold">{solarTermInfo.termTimes[solarTermInfo.nextTerm].date}</span></div>
                )}
                {solarTermInfo.nextNextTerm && (
                  <div className="term-time-item"><span className="term-name">{solarTermInfo.nextNextTerm}:</span> <span className="term-time text-success fw-bold">{solarTermInfo.termTimes[solarTermInfo.nextNextTerm].date}</span></div>
                )}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('PersonInfo component error:', error);
    reportError(error);
    return null;
  }
}