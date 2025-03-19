function App() {
  try {
    const [baziData, setBaziData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    
    // 计算八字
    const calculateBazi = (formData) => {
      try {
        setLoading(true);
        setError(null);
        
        // 获取表单数据
        const { year, month, day, hour, isLunar, gender } = formData;
        
        // 创建计算工具实例
        const calculator = BaziCalculator();
        const analyzer = BaziAnalyzer();
        
        let bazi;
        
        // 根据日期类型计算八字
        if (isLunar) {
          // 阴历日期，先转换为阳历
          const lunarCalendar = LunarCalendar();
          const solarDate = lunarCalendar.getSolarDateByLunar(year, month, day, false);
          
          if (!solarDate) {
            throw new Error("阴历日期转换失败，请检查输入的日期是否正确");
          }
          
          bazi = calculator.calculateBazi(solarDate.year, solarDate.month, solarDate.day, hour);
        } else {
          // 阳历日期直接计算
          bazi = calculator.calculateBazi(year, month, day, hour);
        }
        
        if (!bazi) {
          throw new Error("八字计算失败，请检查输入的日期是否正确");
        }
        
        // 分析八字
        const analysis = analyzer.analyzeBazi(bazi);
        
        // 更新状态
        setTimeout(() => {
          setBaziData({
            ...analysis,
            gender
          });
          setLoading(false);
          
          // 滚动到结果区域
          setTimeout(() => {
            const resultsElement = document.getElementById('bazi-results');
            if (resultsElement) {
              resultsElement.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        }, 800); // 减少延迟时间
        
      } catch (error) {
        console.error("计算八字时出错:", error);
        reportError(error);
        setError(error.message || "计算八字时发生错误，请重试");
        setLoading(false);
      }
    };
    
    return (
      <div data-name="app-container" className="min-h-screen flex flex-col bg-chinese-pattern">
        <Header />
        
        <main data-name="main-content" className="flex-grow container mx-auto px-4 py-8 relative">
          <InputForm onCalculate={calculateBazi} />
          
          {loading && (
            <div data-name="loading-state" className="flex flex-col justify-center items-center p-8 my-4 bg-chinese-bg rounded-lg shadow-lg animate-fade-in">
              <div data-name="loading-animation" className="relative">
                <div data-name="loading-spinner-outer" className="w-20 h-20 rounded-full border-4 border-red-200 border-opacity-50 animate-spin-slow"></div>
                <div data-name="loading-spinner-inner" className="absolute top-2 left-2 w-16 h-16 rounded-full border-4 border-t-red-600 border-r-transparent border-b-red-600 border-l-transparent animate-spin"></div>
                <div data-name="loading-center" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl text-red-600">
                  <i className="fas fa-yin-yang animate-pulse"></i>
                </div>
              </div>
              <span data-name="loading-text" className="mt-4 text-lg text-chinese-text font-medium">
                八字推算中...
              </span>
              <div data-name="loading-elements" className="flex justify-center mt-4 space-x-4">
                <span className="element-wood animate-bounce" style={{animationDelay: '0s'}}>木</span>
                <span className="element-fire animate-bounce" style={{animationDelay: '0.1s'}}>火</span>
                <span className="element-earth animate-bounce" style={{animationDelay: '0.2s'}}>土</span>
                <span className="element-metal animate-bounce" style={{animationDelay: '0.3s'}}>金</span>
                <span className="element-water animate-bounce" style={{animationDelay: '0.4s'}}>水</span>
              </div>
            </div>
          )}
          
          {error && (
            <div data-name="error-message" className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 animate-shake">
              <div data-name="error-content" className="flex items-center">
                <div data-name="error-icon" className="mr-2">
                  <i className="fas fa-exclamation-circle"></i>
                </div>
                <div data-name="error-text">{error}</div>
              </div>
            </div>
          )}
          
          {!loading && baziData && (
            <div data-name="bazi-results" id="bazi-results" className="relative">
              <BaziChart baziData={baziData} />
              <ElementsChart baziData={baziData} />
              <FormatAnalysis formatAnalysis={baziData.formatAnalysis} />
              <FateChart baziData={baziData} />
              <AnalysisResult baziData={baziData} />
            </div>
          )}
        </main>
        
        <Footer />
      </div>
    );
  } catch (error) {
    console.error("App component error:", error);
    reportError(error);
    return <div>应用加载错误，请刷新页面重试</div>;
  }
}

// 渲染应用
ReactDOM.render(<App />, document.getElementById('root'));
