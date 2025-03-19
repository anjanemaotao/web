function AnalysisResult({ baziData }) {
  try {
    if (!baziData || !baziData.dayMasterAnalysis) {
      return null;
    }
    
    const {
      dayMasterAnalysis,
      favorableElements,
      patterns,
      branchRelations
    } = baziData;
    
    // 获取五行对应的样式类
    const getElementClass = (element) => {
      const classes = {
        木: "element-wood",
        火: "element-fire",
        土: "element-earth",
        金: "element-metal",
        水: "element-water"
      };
      return classes[element] || "";
    };
    
    // 获取五行对应的背景类
    const getElementBgClass = (element) => {
      const classes = {
        木: "bg-element-wood",
        火: "bg-element-fire",
        土: "bg-element-earth",
        金: "bg-element-metal",
        水: "bg-element-water"
      };
      return classes[element] || "";
    };
    
    return (
      <div data-name="analysis-result-container" className="bg-white rounded-lg shadow-md p-6 mb-8 animate-fade-in">
        <h2 data-name="analysis-title" className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
          八字分析
        </h2>
        
        {/* 日主强弱分析 */}
        <div data-name="day-master-analysis" className="mb-6 animate-slide-in">
          <h3 data-name="day-master-title" className="text-lg font-medium mb-2 flex items-center">
            <span data-name="section-icon" className="mr-2 text-blue-500">
              <i className="fas fa-balance-scale"></i>
            </span>
            日主强弱分析
          </h3>
          
          <div data-name="day-master-card" className="p-4 rounded-lg border bg-blue-50 hover:shadow-md transition-all duration-300">
            <div data-name="day-master-info" className="flex items-center mb-3">
              <div data-name="day-master-element" className={`text-xl font-bold mr-3 ${getElementClass(dayMasterAnalysis.dayMasterElement)}`}>
                {dayMasterAnalysis.dayMaster}({dayMasterAnalysis.dayMasterElement})
              </div>
              <div data-name="day-master-strength" className="text-lg font-medium">
                {dayMasterAnalysis.strength}
              </div>
              <div data-name="day-master-score" className="ml-auto text-gray-600">
                得分: {dayMasterAnalysis.score}
              </div>
            </div>
            
            <div data-name="day-master-suggestions" className="mt-2">
              <div data-name="suggestions-title" className="font-medium mb-1">参考建议:</div>
              <ul data-name="suggestions-list" className="list-disc list-inside pl-2 text-gray-700">
                {dayMasterAnalysis.suggestions.map((suggestion, index) => (
                  <li key={index} data-name={`suggestion-${index}`} className="animate-slide-in" style={{animationDelay: `${index * 0.1}s`}}>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* 格局分析 */}
        <div data-name="pattern-analysis" className="mb-6 animate-slide-in" style={{animationDelay: '0.2s'}}>
          <h3 data-name="pattern-title" className="text-lg font-medium mb-2 flex items-center">
            <span data-name="section-icon" className="mr-2 text-indigo-500">
              <i className="fas fa-chess"></i>
            </span>
            格局分析
          </h3>
          
          <div data-name="patterns-card" className="p-4 rounded-lg border bg-indigo-50 hover:shadow-md transition-all duration-300">
            <div data-name="main-pattern" className="text-lg font-bold mb-2">
              主格局: {patterns[0]}
            </div>
            
            {patterns.length > 1 && (
              <div data-name="other-patterns">
                <div data-name="other-patterns-title" className="font-medium mb-1">其他特征:</div>
                <div data-name="patterns-tags" className="flex flex-wrap gap-2">
                  {patterns.slice(1).map((pattern, index) => (
                    <span 
                      key={index} 
                      data-name={`pattern-${index}`}
                      className="px-2 py-1 bg-white rounded-md border border-indigo-200 text-sm hover:bg-indigo-100 transition-colors duration-300 animate-fade-in"
                      style={{animationDelay: `${index * 0.1}s`}}
                    >
                      {pattern}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* 喜用神分析 */}
        <div data-name="favorable-elements-analysis" className="mb-6 animate-slide-in" style={{animationDelay: '0.4s'}}>
          <h3 data-name="favorable-elements-title" className="text-lg font-medium mb-2 flex items-center">
            <span data-name="section-icon" className="mr-2 text-green-500">
              <i className="fas fa-thumbs-up"></i>
            </span>
            喜用神分析
          </h3>
          
          <div data-name="favorable-elements-cards" className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 喜神 */}
            <div data-name="favorable-card" className="p-4 rounded-lg border bg-green-50 hover:shadow-md transition-all duration-300">
              <div data-name="favorable-title" className="font-medium mb-2">喜神:</div>
              
              <div data-name="favorable-elements" className="mb-3">
                <div data-name="favorable-elements-title" className="text-sm text-gray-600 mb-1">五行:</div>
                <div data-name="favorable-elements-tags" className="flex flex-wrap gap-2">
                  {favorableElements.favorableElements.map((element, index) => (
                    <span 
                      key={index}
                      data-name={`favorable-element-${element}`}
                      className={`px-3 py-1 rounded-md border text-sm font-medium ${getElementBgClass(element)} animate-pulse-subtle`}
                    >
                      <span className={getElementClass(element)}>{element}</span>
                    </span>
                  ))}
                </div>
              </div>
              
              <div data-name="favorable-gods">
                <div data-name="favorable-gods-title" className="text-sm text-gray-600 mb-1">十神:</div>
                <div data-name="favorable-gods-tags" className="flex flex-wrap gap-2">
                  {favorableElements.favorableGods.map((item, index) => (
                    <span 
                      key={index}
                      data-name={`favorable-god-${item.god}`}
                      className="px-3 py-1 bg-white rounded-md border border-green-200 text-sm hover:bg-green-100 transition-colors duration-300 animate-fade-in"
                      style={{animationDelay: `${index * 0.1}s`}}
                    >
                      {item.god}
                      <span className={`ml-1 ${getElementClass(item.element)}`}>({item.element})</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* 忌神 */}
            <div data-name="unfavorable-card" className="p-4 rounded-lg border bg-red-50 hover:shadow-md transition-all duration-300">
              <div data-name="unfavorable-title" className="font-medium mb-2">忌神:</div>
              
              <div data-name="unfavorable-elements" className="mb-3">
                <div data-name="unfavorable-elements-title" className="text-sm text-gray-600 mb-1">五行:</div>
                <div data-name="unfavorable-elements-tags" className="flex flex-wrap gap-2">
                  {favorableElements.unfavorableElements.map((element, index) => (
                    <span 
                      key={index}
                      data-name={`unfavorable-element-${element}`}
                      className={`px-3 py-1 rounded-md border text-sm font-medium ${getElementBgClass(element)}`}
                    >
                      <span className={getElementClass(element)}>{element}</span>
                    </span>
                  ))}
                </div>
              </div>
              
              <div data-name="unfavorable-gods">
                <div data-name="unfavorable-gods-title" className="text-sm text-gray-600 mb-1">十神:</div>
                <div data-name="unfavorable-gods-tags" className="flex flex-wrap gap-2">
                  {favorableElements.unfavorableGods.map((item, index) => (
                    <span 
                      key={index}
                      data-name={`unfavorable-god-${item.god}`}
                      className="px-3 py-1 bg-white rounded-md border border-red-200 text-sm hover:bg-red-100 transition-colors duration-300 animate-fade-in"
                      style={{animationDelay: `${index * 0.1}s`}}
                    >
                      {item.god}
                      <span className={`ml-1 ${getElementClass(item.element)}`}>({item.element})</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 地支关系分析 */}
        <div data-name="branch-relations-analysis" className="mb-6 animate-slide-in" style={{animationDelay: '0.6s'}}>
          <h3 data-name="branch-relations-title" className="text-lg font-medium mb-2 flex items-center">
            <span data-name="section-icon" className="mr-2 text-purple-500">
              <i className="fas fa-link"></i>
            </span>
            地支关系
          </h3>
          
          <div data-name="branch-relations-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 三合 */}
            {branchRelations.harmonies.length > 0 && (
              <div data-name="harmonies-card" className="p-4 rounded-lg border bg-blue-50 hover:shadow-md transition-all duration-300">
                <div data-name="harmonies-title" className="font-medium mb-2">三合:</div>
                <ul data-name="harmonies-list" className="space-y-2">
                  {branchRelations.harmonies.map((harmony, index) => (
                    <li key={index} data-name={`harmony-${index}`} className="flex items-center animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                      <span data-name="harmony-branches" className="mr-2">
                        {harmony.branches.join("+")}
                      </span>
                      <span data-name="harmony-element" className={`px-2 py-0.5 rounded text-xs ${getElementBgClass(harmony.element)}`}>
                        {harmony.element}局
                      </span>
                      <span data-name="harmony-positions" className="ml-auto text-sm text-gray-600">
                        ({harmony.positions.join("、")})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* 三会 */}
            {branchRelations.combinations.length > 0 && (
              <div data-name="combinations-card" className="p-4 rounded-lg border bg-green-50 hover:shadow-md transition-all duration-300">
                <div data-name="combinations-title" className="font-medium mb-2">三会:</div>
                <ul data-name="combinations-list" className="space-y-2">
                  {branchRelations.combinations.map((combination, index) => (
                    <li key={index} data-name={`combination-${index}`} className="flex items-center animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                      <span data-name="combination-branches" className="mr-2">
                        {combination.branches.join("+")}
                      </span>
                      <span data-name="combination-element" className={`px-2 py-0.5 rounded text-xs ${getElementBgClass(combination.element)}`}>
                        {combination.element}局
                      </span>
                      <span data-name="combination-positions" className="ml-auto text-sm text-gray-600">
                        ({combination.positions.join("、")})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* 六冲 */}
            {branchRelations.conflicts.length > 0 && (
              <div data-name="conflicts-card" className="p-4 rounded-lg border bg-red-50 hover:shadow-md transition-all duration-300">
                <div data-name="conflicts-title" className="font-medium mb-2">六冲:</div>
                <ul data-name="conflicts-list" className="space-y-2">
                  {branchRelations.conflicts.map((conflict, index) => (
                    <li key={index} data-name={`conflict-${index}`} className="flex items-center animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                      <span data-name="conflict-branches" className="mr-2">
                        {conflict.branches.join("冲")}
                      </span>
                      <span data-name="conflict-positions" className="ml-auto text-sm text-gray-600">
                        ({conflict.positions.join("、")})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* 六害 */}
            {branchRelations.harms.length > 0 && (
              <div data-name="harms-card" className="p-4 rounded-lg border bg-yellow-50 hover:shadow-md transition-all duration-300">
                <div data-name="harms-title" className="font-medium mb-2">六害:</div>
                <ul data-name="harms-list" className="space-y-2">
                  {branchRelations.harms.map((harm, index) => (
                    <li key={index} data-name={`harm-${index}`} className="flex items-center animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                      <span data-name="harm-branches" className="mr-2">
                        {harm.branches.join("害")}
                      </span>
                      <span data-name="harm-positions" className="ml-auto text-sm text-gray-600">
                        ({harm.positions.join("、")})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        
        {/* 分析说明 */}
        <div data-name="analysis-disclaimer" className="mt-6 text-sm text-gray-500 border-t pt-4">
          <p data-name="disclaimer-text">
            注：以上分析结果仅供参考，八字命理学博大精深，实际命理分析还需结合具体情况由专业命理师进行综合判断。
          </p>
        </div>
      </div>
    );
  } catch (error) {
    console.error("AnalysisResult component error:", error);
    reportError(error);
    return <div>分析结果加载错误，请刷新页面重试</div>;
  }
}
