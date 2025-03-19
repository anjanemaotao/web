function ElementsChart({ baziData }) {
  try {
    if (!baziData || !baziData.elementDistribution) {
      return null;
    }
    
    const { elementDistribution } = baziData;
    
    // 计算总分
    const totalScore = Object.values(elementDistribution).reduce((sum, score) => sum + score, 0);
    
    // 计算百分比
    const getPercentage = (value) => {
      if (totalScore === 0) return "0.0";
      const percentage = (value / totalScore) * 100;
      return percentage.toFixed(1);
    };
    
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
    
    // 格式化五行得分
    const formatScore = (score) => {
      return score.toFixed(1);
    };
    
    // 对五行按照分数排序
    const sortedElements = Object.entries(elementDistribution)
      .sort((a, b) => b[1] - a[1])
      .map(([element, score]) => ({ element, score }));
    
    return (
      <div data-name="elements-chart-container" className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 data-name="chart-title" className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
          五行分布
        </h2>
        
        <div data-name="elements-bars" className="space-y-4">
          {sortedElements.map(({ element, score }) => (
            <div key={element} data-name={`element-${element}-row`} className="flex items-center">
              <div data-name={`element-${element}-label`} className={`w-16 text-center font-bold ${getElementClass(element)}`}>
                {element}
              </div>
              <div data-name="bar-container" className="flex-grow mx-2">
                <div 
                  data-name={`element-${element}-bar`}
                  className={`h-6 rounded ${getElementBgClass(element)} border`} 
                  style={{ width: `${getPercentage(score)}%` }}
                ></div>
              </div>
              <div data-name={`element-${element}-score`} className="w-24 text-right">
                {formatScore(score)} ({getPercentage(score)}%)
              </div>
            </div>
          ))}
        </div>
        
        <div data-name="elements-summary" className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3">
          {sortedElements.map(({ element, score }) => (
            <div 
              key={element}
              data-name={`element-${element}-card`}
              className={`p-3 rounded-lg border ${getElementBgClass(element)} flex flex-col items-center`}
            >
              <div data-name={`element-${element}-title`} className={`text-lg font-bold ${getElementClass(element)}`}>
                {element}
              </div>
              <div data-name={`element-${element}-details`} className="text-sm mt-1">
                {formatScore(score)} 分
              </div>
              <div data-name={`element-${element}-percentage`} className="text-xs opacity-75">
                {getPercentage(score)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("ElementsChart component error:", error);
    reportError(error);
    return <div>五行分析加载错误，请刷新页面重试</div>;
  }
}
