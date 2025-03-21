function ElementAnalysis({ baziData }) {
  try {
    if (!baziData) return null;

    const elementUtils = ElementUtils();
    
    // 五行强弱分析
    const elementStrength = elementUtils.analyzeElementStrength(
      baziData.elementCounts, 
      baziData.day.stemElement
    );
    
    // 日主状态分析
    const dayMasterStatus = elementUtils.analyzeDayMasterStatus(
      elementStrength, 
      baziData.day.stemElement
    );
    
    // 渲染五行强弱图表
    const renderElementChart = () => {
      const elements = ["木", "火", "土", "金", "水"];
      
      return (
        <div data-name="element-chart" className="mt-4">
          {elements.map((element) => {
            const data = elementStrength[element];
            const width = `${data.percentage}%`;
            const status = data.status;
            let statusClass = "text-gray-400";
            
            if (status === "旺") statusClass = "text-green-500";
            if (status === "弱") statusClass = "text-red-500";
            
            return (
              <div key={element} className="mb-3" data-name={`element-bar-${element}`}>
                <div className="flex justify-between mb-1">
                  <div className="flex items-center">
                    <i className={`${elementUtils.getElementIconClass(element)} mr-2 ${elementUtils.getElementColorClass(element)}`}></i>
                    <span className={elementUtils.getElementColorClass(element)}>{element}({data.count.toFixed(1)})</span>
                  </div>
                  <div className={`flex items-center ${statusClass}`}>
                    {data.percentage}% - {status}
                  </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${elementUtils.getElementBgColorClass(element)}`} 
                    style={{ width }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      );
    };
    
    // 渲染五行相生相克关系
    const renderElementRelations = () => {
      const dayElement = baziData.day.stemElement;
      
      return (
        <div data-name="element-relations" className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div data-name="element-generation" className="bg-gray-800 rounded-lg p-4">
            <h4 className="font-bold mb-2 text-green-400 flex items-center">
              <i className="fas fa-seedling mr-2"></i> 相生关系
            </h4>
            <div className="space-y-2 text-sm">
              <div data-name="generates-day">
                <div className="text-gray-400 mb-1">生我的五行:</div>
                <div className={`p-2 rounded ${elementUtils.getElementColorClass(baziData.elementRelations[dayElement].被生)}`}>
                  {baziData.elementRelations[dayElement].被生} 生 {dayElement}
                  <div className="text-xs text-gray-400 mt-1">
                    {elementUtils.elementGenerationExplanations[`${baziData.elementRelations[dayElement].被生}生${dayElement}`]}
                  </div>
                </div>
              </div>
              
              <div data-name="day-generates">
                <div className="text-gray-400 mb-1">我生的五行:</div>
                <div className={`p-2 rounded ${elementUtils.getElementColorClass(baziData.elementRelations[dayElement].生)}`}>
                  {dayElement} 生 {baziData.elementRelations[dayElement].生}
                  <div className="text-xs text-gray-400 mt-1">
                    {elementUtils.elementGenerationExplanations[`${dayElement}生${baziData.elementRelations[dayElement].生}`]}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div data-name="element-restraint" className="bg-gray-800 rounded-lg p-4">
            <h4 className="font-bold mb-2 text-red-400 flex items-center">
              <i className="fas fa-ban mr-2"></i> 相克关系
            </h4>
            <div className="space-y-2 text-sm">
              <div data-name="restrains-day">
                <div className="text-gray-400 mb-1">克我的五行:</div>
                <div className={`p-2 rounded ${elementUtils.getElementColorClass(baziData.elementRelations[dayElement].被克)}`}>
                  {baziData.elementRelations[dayElement].被克} 克 {dayElement}
                  <div className="text-xs text-gray-400 mt-1">
                    {elementUtils.elementRestraintExplanations[`${baziData.elementRelations[dayElement].被克}克${dayElement}`]}
                  </div>
                </div>
              </div>
              
              <div data-name="day-restrains">
                <div className="text-gray-400 mb-1">我克的五行:</div>
                <div className={`p-2 rounded ${elementUtils.getElementColorClass(baziData.elementRelations[dayElement].克)}`}>
                  {dayElement} 克 {baziData.elementRelations[dayElement].克}
                  <div className="text-xs text-gray-400 mt-1">
                    {elementUtils.elementRestraintExplanations[`${dayElement}克${baziData.elementRelations[dayElement].克}`]}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };
    
    // 渲染日主五行状态和建议
    const renderDayMasterAnalysis = () => {
      return (
        <div data-name="day-master-analysis" className="mt-6 bg-gray-800 rounded-lg p-4">
          <h4 className="font-bold mb-2 text-mystic flex items-center">
            <i className="fas fa-user-circle mr-2"></i> 日主分析
          </h4>
          
          <div data-name="day-master-status" className="mb-3">
            <div className="text-gray-400 mb-1">日主五行:</div>
            <div className={`text-lg font-bold ${elementUtils.getElementColorClass(baziData.day.stemElement)}`}>
              {baziData.day.stemElement} ({dayMasterStatus.status})
            </div>
          </div>
          
          <div data-name="day-master-advice">
            <div className="text-gray-400 mb-1">平衡建议:</div>
            <div className="p-2 bg-gray-700 rounded">
              {dayMasterStatus.advice}
            </div>
          </div>
          
          <div data-name="day-master-personality" className="mt-3">
            <div className="text-gray-400 mb-1">性格特点:</div>
            <div className="p-2 bg-gray-700 rounded">
              {elementUtils.getElementPersonality(baziData.day.stemElement)}
            </div>
          </div>
        </div>
      );
    };
    
    return (
      <div data-name="element-analysis" className="bg-paper p-6 rounded-lg shadow-lg mb-6 animate-fade-in stagger-delay-2">
        <h2 data-name="analysis-title" className="text-xl font-bold mb-4 text-mystic flex items-center">
          <i className="fas fa-balance-scale mr-2"></i> 五行分析
        </h2>
        
        {renderElementChart()}
        {renderElementRelations()}
        {renderDayMasterAnalysis()}
      </div>
    );
  } catch (error) {
    console.error('ElementAnalysis component error:', error);
    reportError(error);
    return <div>五行分析组件加载出错</div>;
  }
}
