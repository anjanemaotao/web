function ResultCard({ bazi, patterns, wuxingResult, shishenResult, shierGongResult, lunarDate, solarDate }) {
  try {
    const { t } = React.useContext(I18nContext);
    
    if (!bazi) return null;
    
    return (
      <div className="result-section fade-in" data-name="result-card">
        <div className="card" data-name="bazi-card">
          <h2 className="text-xl font-bold mb-4">{t('baziSection')}</h2>
          <BaziDisplay bazi={bazi} />
          <BirthInfo bazi={bazi} lunarDate={lunarDate} solarDate={solarDate} />
        </div>
        
        <div className="card" data-name="pattern-card">
          <h2 className="text-xl font-bold mb-4">{t('patternSection')}</h2>
          <PatternAnalysis patterns={patterns} />
        </div>
        
        <div className="card" data-name="mingzhu-card">
          <h2 className="text-xl font-bold mb-4">{t('mingzhuSection')}</h2>
          <MingzhuAnalysis bazi={bazi} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card" data-name="wuxing-card">
            <h2 className="text-xl font-bold mb-4">{t('wuxingSection')}</h2>
            <WuxingAnalysis wuxingResult={wuxingResult} />
          </div>
          
          <div className="card" data-name="shishen-card">
            <h2 className="text-xl font-bold mb-4">{t('shishenSection')}</h2>
            <ShishenAnalysis shishenResult={shishenResult} />
          </div>
        </div>
        
        <div className="card" data-name="shiergong-card">
          <h2 className="text-xl font-bold mb-4">{t('shiergongSection')}</h2>
          <ShierGongAnalysis shierGongResult={shierGongResult} />
        </div>
        
        <div className="card" data-name="liunian-card">
          <h2 className="text-xl font-bold mb-4">{t('liunianSection') || '流年大运分析'}</h2>
          <LiuNianAnalysis bazi={bazi} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('ResultCard component error:', error);
    reportError(error);
    return null;
  }
}
