function LuckyPeriods({ baziData }) {
  try {
    if (!baziData) return null;
    
    const elementUtils = ElementUtils();
    const currentYear = new Date().getFullYear();
    
    return (
      <div data-name="lucky-periods" className="bg-paper p-6 rounded-lg shadow-lg mb-6 animate-fade-in stagger-delay-3">
        <h2 data-name="lucky-title" className="text-xl font-bold mb-4 text-mystic flex items-center">
          <i className="fas fa-hourglass-half mr-2"></i> 大运流年
        </h2>
        
        <div data-name="periods-container" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {baziData.luckyPeriods.map((period, index) => {
            const stemElement = baziData.fiveElements[period.stem];
            const branchElement = baziData.fiveElements[period.branch];
            const isCurrentPeriod = period.year <= currentYear && (index === baziData.luckyPeriods.length - 1 || baziData.luckyPeriods[index + 1].year > currentYear);
            
            return (
              <div 
                key={index} 
                className={`lucky-period-item ${isCurrentPeriod ? 'ring-2 ring-yellow-500' : ''}`}
                data-name={`lucky-period-${index}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="font-bold">
                    {period.age}岁 - {period.age + 9}岁
                  </div>
                  <div className="text-sm text-gray-400">
                    {period.year}年 - {period.year + 9}年
                  </div>
                </div>
                
                <div className="flex items-center justify-center p-2 bg-gray-800 rounded">
                  <div className={`text-2xl mr-4 ${elementUtils.getElementColorClass(stemElement)}`} data-name="period-stem">
                    {period.stem}
                  </div>
                  <div className={`text-2xl ${elementUtils.getElementColorClass(branchElement)}`} data-name="period-branch">
                    {period.branch}
                  </div>
                </div>
                
                <div className="mt-2 text-center text-sm" data-name="period-nayin">
                  {period.nayin}
                </div>
                
                {isCurrentPeriod && (
                  <div className="mt-2 text-xs text-center bg-yellow-900 text-yellow-200 py-1 px-2 rounded-full" data-name="current-period-marker">
                    当前大运
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-gray-800 rounded-lg" data-name="periods-explanation">
          <h4 className="font-bold mb-2 text-mystic">大运解读</h4>
          <p className="text-sm text-gray-300">
            大运是人生命运的长期趋势，每十年一个大运，对人生有重要影响。大运五行与日主五行的关系，决定了这段时期的吉凶祸福。
          </p>
          <ul className="mt-2 text-sm text-gray-300 list-disc list-inside">
            <li>大运五行生扶日主，为有利大运</li>
            <li>大运五行克制日主，为不利大运</li>
            <li>大运纳音五行的特性，也会影响运势表现</li>
          </ul>
        </div>
      </div>
    );
  } catch (error) {
    console.error('LuckyPeriods component error:', error);
    reportError(error);
    return <div>大运流年组件加载出错</div>;
  }
}
