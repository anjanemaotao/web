import { ElementUtils } from '../utils/elementUtils';

export function BaziChart({ baziData }) {
  try {
    if (!baziData) return null;

    const elementUtils = ElementUtils();
    
    // 渲染单个单元格
    const renderCell = (title, stem, branch, nayin, god) => {
      const stemElement = baziData.fiveElements[stem];
      const branchElement = baziData.fiveElements[branch];
      
      return (
        <div data-name="chart-column" className="flex flex-col">
          <div data-name="chart-header" className="chart-cell chart-header">
            {title}
          </div>
          <div 
            data-name="chart-stem" 
            className={`chart-cell ${elementUtils.getElementColorClass(stemElement)}`}
          >
            {stem}
            <span className="absolute top-0 right-0 text-xs p-1 opacity-70">{stemElement}</span>
          </div>
          <div 
            data-name="chart-branch" 
            className={`chart-cell ${elementUtils.getElementColorClass(branchElement)}`}
          >
            {branch}
            <span className="absolute top-0 right-0 text-xs p-1 opacity-70">{branchElement}</span>
          </div>
          <div data-name="chart-nayin" className="chart-cell text-sm">
            {nayin}
          </div>
          <div data-name="chart-god" className="chart-cell text-sm text-yellow-400">
            {god}
          </div>
        </div>
      );
    };
    
    // 渲染地支藏干
    const renderHiddenStems = (hiddenStems) => {
      if (!hiddenStems || hiddenStems.length === 0) return null;
      
      return (
        <div data-name="hidden-stems" className="mt-2 p-2 bg-gray-800 rounded text-sm">
          <div className="font-bold mb-1 text-gray-400">地支藏干:</div>
          <div className="flex flex-wrap">
            {hiddenStems.map((stem, index) => {
              const element = baziData.fiveElements[stem];
              return (
                <span 
                  key={index}
                  className={`mr-2 ${elementUtils.getElementColorClass(element)}`}
                  data-name={`hidden-stem-${index}`}
                >
                  {stem}({element})
                </span>
              );
            })}
          </div>
        </div>
      );
    };
    
    return (
      <div data-name="bazi-chart" className="bg-paper p-6 rounded-lg shadow-lg mb-6 animate-fade-in stagger-delay-1">
        <h2 data-name="chart-title" className="text-xl font-bold mb-4 text-mystic flex items-center">
          <i className="fas fa-dharmachakra mr-2"></i> 八字命盘
        </h2>
        
        <div data-name="chart-container" className="overflow-x-auto">
          <div className="flex justify-center min-w-max">
            {renderCell(
              "年柱", 
              baziData.year.stem, 
              baziData.year.branch, 
              baziData.year.nayin, 
              baziData.year.god
            )}
            
            {renderCell(
              "月柱", 
              baziData.month.stem, 
              baziData.month.branch, 
              baziData.month.nayin, 
              baziData.month.god
            )}
            
            {renderCell(
              "日柱", 
              baziData.day.stem, 
              baziData.day.branch, 
              baziData.day.nayin, 
              baziData.day.god
            )}
            
            {renderCell(
              "时柱", 
              baziData.hour.stem, 
              baziData.hour.branch, 
              baziData.hour.nayin, 
              baziData.hour.god
            )}
          </div>
        </div>
        
        <div data-name="hidden-stems-container" className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          <div data-name="year-hidden-stems">
            <div className="text-sm text-gray-400">年柱</div>
            {renderHiddenStems(baziData.year.hiddenStems)}
          </div>
          
          <div data-name="month-hidden-stems">
            <div className="text-sm text-gray-400">月柱</div>
            {renderHiddenStems(baziData.month.hiddenStems)}
          </div>
          
          <div data-name="day-hidden-stems">
            <div className="text-sm text-gray-400">日柱</div>
            {renderHiddenStems(baziData.day.hiddenStems)}
          </div>
          
          <div data-name="hour-hidden-stems">
            <div className="text-sm text-gray-400">时柱</div>
            {renderHiddenStems(baziData.hour.hiddenStems)}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('BaziChart component error:', error);
    return <div>命盘组件加载出错</div>;
  }
}
