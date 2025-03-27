// 创建国际化上下文
const I18nContext = React.createContext();

function App() {
  try {
    // 使用国际化提供程序
    const i18nProvider = I18nProvider();
    const { t } = i18nProvider;
    
    // 状态管理
    const [bazi, setBazi] = React.useState(null);
    const [patterns, setPatterns] = React.useState([]);
    const [wuxingResult, setWuxingResult] = React.useState(null);
    const [shishenResult, setShishenResult] = React.useState(null);
    const [shierGongResult, setShierGongResult] = React.useState(null);
    const [lunarDate, setLunarDate] = React.useState(null);
    const [solarDate, setSolarDate] = React.useState(null);
    const [calculating, setCalculating] = React.useState(false); // 添加计算中状态
    
    // 处理八字计算
    const handleCalculate = (lunarDateInput) => {
      try {
        setCalculating(true); // 开始计算动画
        
        const calculator = BaziCalculator();
        const patternAnalyzer = PatternAnalyzer();
        const wuxingAnalyzer = WuxingAnalyzer();
        const shishenAnalyzer = ShishenAnalyzer();
        const shierGongAnalyzer = ShierGongAnalyzer();
        
        // 保存日期信息
        setLunarDate(lunarDateInput);
        const solarDateResult = calculator.lunarToSolar(lunarDateInput);
        setSolarDate(solarDateResult);
        
        // 计算八字
        const baziResult = calculator.calculateBazi(lunarDateInput);
        
        // 分析格局
        const patternResult = patternAnalyzer.analyzePattern(baziResult);
        
        // 分析五行
        const wuxingAnalysisResult = wuxingAnalyzer.analyzeWuxing(baziResult);
        
        // 分析十神
        const shishenAnalysisResult = shishenAnalyzer.analyzeShishen(baziResult);
        
        // 分析十二宫
        const shierGongAnalysisResult = shierGongAnalyzer.analyzeShierGong(baziResult);
        
        // 延迟显示结果，添加计算动画效果
        setTimeout(() => {
          setBazi(baziResult);
          setPatterns(patternResult);
          setWuxingResult(wuxingAnalysisResult);
          setShishenResult(shishenAnalysisResult);
          setShierGongResult(shierGongAnalysisResult);
          setCalculating(false); // 结束计算动画
        }, 2000);
        
      } catch (error) {
        console.error("计算八字错误:", error);
        reportError(error);
        setCalculating(false); // 确保出错时也结束动画
      }
    };
    
    return (
      <I18nContext.Provider value={i18nProvider}>
        <div className="app-wrapper" data-name="app-wrapper">
          <Navbar />
          
          <div className="container mx-auto py-8 px-4" data-name="app-container">
            <Banner />
            
            <main data-name="app-main">
              <DatePicker onCalculate={handleCalculate} />
              
              {calculating && (
                <div className="calculation-animation" data-name="calculation-animation">
                  <div className="calculation-content">
                    <div className="calculation-symbol">
                      <div className="yin-yang"></div>
                    </div>
                    <div className="calculation-text">
                      <span>推算八字格局中</span>
                      <span className="dots">
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                      </span>
                    </div>
                    <div className="calculation-elements">
                      <span className="element wood">木</span>
                      <span className="element fire">火</span>
                      <span className="element earth">土</span>
                      <span className="element metal">金</span>
                      <span className="element water">水</span>
                    </div>
                  </div>
                </div>
              )}
              
              {bazi && !calculating && (
                <ResultCard 
                  bazi={bazi}
                  patterns={patterns}
                  wuxingResult={wuxingResult}
                  shishenResult={shishenResult}
                  shierGongResult={shierGongResult}
                  lunarDate={lunarDate}
                  solarDate={solarDate}
                />
              )}
              
              {/* 添加联系我们横幅 */}
              <ContactBanner />
            </main>
            
            <footer className="footer" data-name="app-footer">
              <p>{t('footer')}</p>
            </footer>
          </div>
        </div>
      </I18nContext.Provider>
    );
  } catch (error) {
    console.error('App component error:', error);
    reportError(error);
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl text-red-500">应用加载错误</h1>
        <p>请刷新页面重试</p>
      </div>
    );
  }
}

// 渲染应用
ReactDOM.render(<App />, document.getElementById('root'));
