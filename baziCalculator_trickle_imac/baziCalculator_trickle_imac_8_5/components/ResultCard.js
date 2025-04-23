function ResultCard({ bazi, patterns, wuxingResult, shishenResult, shierGongResult, lunarDate, solarDate }) {
  try {
    const { t } = React.useContext(I18nContext);
    const [activeTab, setActiveTab] = React.useState('basic');
    
    if (!bazi) return null;
    
    // 定义Tab配置
    const tabs = [
      { id: 'basic', label: 'basicInfo', icon: 'fas fa-user' },
      { id: 'mingzhu', label: 'mingzhuSection', icon: 'fas fa-book' },
      { id: 'pattern', label: 'patternSection', icon: 'fas fa-certificate' },
      { id: 'wuxing', label: 'wuxingSection', icon: 'fas fa-yin-yang' },
      { id: 'shishen', label: 'shishenSection', icon: 'fas fa-star' },
      { id: 'shiergong', label: 'shiergongSection', icon: 'fas fa-compass' },
      { id: 'dayun', label: 'dayunSection', icon: 'fas fa-calendar' },
      { id: 'liunian', label: 'liunianSection', icon: 'fas fa-calendar-alt' }
    ];
    
    // 渲染当前活动Tab的内容
    const renderTabContent = () => {
      switch (activeTab) {
        case 'basic':
          return (
            <div className="tab-pane" data-name="basic-tab-content">
              <div className="card" data-name="bazi-card">
                <h2 className="text-xl font-bold mb-4">{t('basicInfo')}</h2>
                <BirthInfo bazi={bazi} lunarDate={lunarDate} solarDate={solarDate} />
              </div>
            </div>
          );
        case 'mingzhu':
          return (
            <div className="tab-pane" data-name="mingzhu-tab-content">
              <div className="card" data-name="mingzhu-card">
                <h2 className="text-xl font-bold mb-4">{t('mingzhuSection')}</h2>
                <MingzhuAnalysis bazi={bazi} />
              </div>
            </div>
          );
        case 'pattern':
          return (
            <div className="tab-pane" data-name="pattern-tab-content">
              <div className="card" data-name="pattern-card">
                <h2 className="text-xl font-bold mb-4">{t('patternSection')}</h2>
                <PatternAnalysis patterns={patterns} />
              </div>
            </div>
          );
        case 'wuxing':
          return (
            <div className="tab-pane" data-name="wuxing-tab-content">
              <div className="card" data-name="wuxing-card">
                <h2 className="text-xl font-bold mb-4">{t('wuxingSection')}</h2>
                <WuxingAnalysis wuxingResult={wuxingResult} bazi={bazi} patterns={patterns} />
              </div>
            </div>
          );
        case 'shishen':
          return (
            <div className="tab-pane" data-name="shishen-tab-content">
              <div className="card" data-name="shishen-card">
                <h2 className="text-xl font-bold mb-4">{t('shishenSection')}</h2>
                <ShishenAnalysis shishenResult={shishenResult} />
              </div>
            </div>
          );
        case 'shiergong':
          return (
            <div className="tab-pane" data-name="shiergong-tab-content">
              <div className="card" data-name="shiergong-card">
                <h2 className="text-xl font-bold mb-4">{t('shiergongSection')}</h2>
                <ShierGongAnalysis shierGongResult={shierGongResult} />
              </div>
            </div>
          );
        case 'dayun':
          return (
            <div className="tab-pane" data-name="dayun-tab-content">
              <div className="card" data-name="dayun-card">
                <h2 className="text-xl font-bold mb-4">{t('dayunSection') || '大运分析'}</h2>
                <LiuNianAnalysis bazi={bazi} showDayun={true} showLiunian={false} />
              </div>
            </div>
          );
        case 'liunian':
          return (
            <div className="tab-pane" data-name="liunian-tab-content">
              <div className="card" data-name="liunian-card">
                <h2 className="text-xl font-bold mb-4">{t('liunianSection') || '流年分析'}</h2>
                <LiuNianAnalysis bazi={bazi} showDayun={false} showLiunian={true} />
              </div>
            </div>
          );
        default:
          return null;
      }
    };
    
    return (
      <div className="result-section fade-in" data-name="result-card">
        <div className="bazi-core-result mb-6" data-name="bazi-core-result">
          <div className="card" data-name="bazi-core-card">
            <h2 className="text-xl font-bold mb-4">{t('baziSection')}</h2>
            <BaziDisplay bazi={bazi} />
          </div>
        </div>
        <TabsContainer 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          tabs={tabs}
        >
          {renderTabContent()}
        </TabsContainer>
      </div>
    );
  } catch (error) {
    console.error('ResultCard component error:', error);
    reportError(error);
    return null;
  }
}
