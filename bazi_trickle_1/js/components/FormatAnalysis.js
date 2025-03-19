function FormatAnalysis({ formatAnalysis }) {
  try {
    if (!formatAnalysis || !formatAnalysis.formatType) {
      return null;
    }
    
    const { formatType, formatInfo } = formatAnalysis;
    
    return (
      <div data-name="format-analysis-container" className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 data-name="format-title" className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
          命格分析
        </h2>
        
        <div data-name="format-card" className={`p-5 rounded-lg ${formatInfo.bgColor} ${formatInfo.borderColor} border animate-fade-in`}>
          <div data-name="format-header" className="flex items-center mb-4">
            <div data-name="format-icon" className={`w-12 h-12 rounded-full flex items-center justify-center ${formatInfo.color} bg-white shadow-md`}>
              <i className={`fas fa-${formatInfo.icon} text-xl`}></i>
            </div>
            <div data-name="format-title" className="ml-4">
              <h3 data-name="format-name" className={`text-xl font-bold ${formatInfo.color}`}>{formatType}</h3>
              <p data-name="format-subtitle" className="text-gray-600 text-sm">命格类型</p>
            </div>
          </div>
          
          <div data-name="format-description" className="mb-5 text-gray-700">
            <p data-name="description-text">{formatInfo.description}</p>
          </div>
          
          <div data-name="format-characteristics">
            <h4 data-name="characteristics-title" className="font-medium mb-3 text-gray-800">性格特点：</h4>
            <div data-name="characteristics-list" className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {formatInfo.characteristics && formatInfo.characteristics.map((trait, index) => (
                <div 
                  key={index} 
                  data-name={`trait-${index}`} 
                  className="flex items-center p-2 bg-white rounded-md shadow-sm animate-slide-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <i className={`fas fa-check-circle ${formatInfo.color} mr-2`}></i>
                  <span data-name="trait-text">{trait}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("FormatAnalysis component error:", error);
    reportError(error);
    return <div>命格分析加载错误，请刷新页面重试</div>;
  }
}
