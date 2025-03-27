function ShierGongAnalysis({ shierGongResult }) {
  try {
    const { t } = React.useContext(I18nContext);
    
    if (!shierGongResult) {
      return (
        <div className="analysis-item" data-name="shier-gong-analysis-empty">
          <div className="analysis-title">{t('shiergongTitle')}</div>
          <div className="analysis-content">-</div>
        </div>
      );
    }
    
    const { shierGongStates, dominantState } = shierGongResult;
    const shierGongAnalyzer = ShierGongAnalyzer();
    
    return (
      <div className="analysis-item slide-in" data-name="shier-gong-analysis">
        <div className="analysis-title">{t('shiergongTitle')}</div>
        <div className="analysis-content">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4" data-name="shier-gong-states">
            <div className="p-2 bg-gray-50 rounded-md" data-name="shier-gong-year">
              <div className="text-sm text-gray-600">年支十二宫</div>
              <div className="font-medium">
                <span className={`shier-gong-state state-${shierGongAnalyzer.getShierGongStrength(shierGongStates.yearZhi)}`}>
                  {t(shierGongStates.yearZhi || '')}
                </span>
              </div>
            </div>
            <div className="p-2 bg-gray-50 rounded-md" data-name="shier-gong-month">
              <div className="text-sm text-gray-600">月支十二宫</div>
              <div className="font-medium">
                <span className={`shier-gong-state state-${shierGongAnalyzer.getShierGongStrength(shierGongStates.monthZhi)}`}>
                  {t(shierGongStates.monthZhi || '')}
                </span>
              </div>
            </div>
            <div className="p-2 bg-gray-50 rounded-md" data-name="shier-gong-day">
              <div className="text-sm text-gray-600">日支十二宫</div>
              <div className="font-medium">
                <span className={`shier-gong-state state-${shierGongAnalyzer.getShierGongStrength(shierGongStates.dayZhi)}`}>
                  {t(shierGongStates.dayZhi || '')}
                </span>
              </div>
            </div>
            <div className="p-2 bg-gray-50 rounded-md" data-name="shier-gong-hour">
              <div className="text-sm text-gray-600">时支十二宫</div>
              <div className="font-medium">
                <span className={`shier-gong-state state-${shierGongAnalyzer.getShierGongStrength(shierGongStates.hourZhi)}`}>
                  {t(shierGongStates.hourZhi || '')}
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-4" data-name="shier-gong-dominant">
            <h4 className="font-semibold mb-2">主导十二宫状态：</h4>
            <div className="p-3 bg-gray-50 rounded-md">
              <div className="mb-2">
                <span className="font-medium mr-2">月令十二宫：</span>
                <span className={`shier-gong-state state-${shierGongAnalyzer.getShierGongStrength(dominantState)}`}>
                  {t(dominantState || '')}
                </span>
              </div>
              <p>{shierGongAnalyzer.getShierGongExplanation(dominantState)}</p>
              <p className="mt-2">{getShierGongLifeDescription(dominantState)}</p>
            </div>
          </div>
          
          <div className="mt-4" data-name="shier-gong-cycle">
            <h4 className="font-semibold mb-2">十二宫生命周期：</h4>
            <div className="relative h-20 bg-gray-100 rounded-lg overflow-hidden" data-name="shier-gong-cycle-chart">
              <div className="absolute inset-0 flex">
                {shierGongAnalyzer.shierGongNames.map((state, index) => (
                  <div 
                    key={state} 
                    className={`flex-1 h-full border-r border-white ${getShierGongCycleColor(state)}`}
                    data-name={`shier-gong-cycle-${state}`}
                  >
                    <div className="h-full flex items-center justify-center text-white text-xs font-medium">
                      {t(state)}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 当前状态指示器 */}
              {dominantState && (
                <div 
                  className="absolute top-0 h-full border-l-2 border-red-500 animate-pulse"
                  style={{ 
                    left: `${(shierGongAnalyzer.shierGongNames.indexOf(dominantState) + 0.5) * 100 / 12}%` 
                  }}
                  data-name="shier-gong-current-indicator"
                >
                  <div className="absolute -top-1 -left-2 w-4 h-4 bg-red-500 rounded-full"></div>
                </div>
              )}
            </div>
            <div className="text-center text-sm mt-2 text-gray-600">生命周期图示</div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('ShierGongAnalysis component error:', error);
    reportError(error);
    return null;
  }
}

// 获取十二宫周期颜色
function getShierGongCycleColor(state) {
  switch (state) {
    case 'changsheng':
    case 'muyu':
    case 'guandai':
      return 'bg-green-500 bg-opacity-70'; // 上升期
    case 'linguan':
    case 'diwang':
      return 'bg-red-500 bg-opacity-70'; // 巅峰期
    case 'shuai':
    case 'bing':
    case 'si':
      return 'bg-yellow-500 bg-opacity-70'; // 下降期
    case 'mu':
    case 'jue':
      return 'bg-blue-900 bg-opacity-70'; // 低谷期
    case 'tai':
    case 'yang':
      return 'bg-purple-500 bg-opacity-70'; // 孕育期
    default:
      return 'bg-gray-400';
  }
}

// 获取十二宫人生描述
function getShierGongLifeDescription(state) {
  switch (state) {
    case 'changsheng':
      return '您的命局处于"长生"阶段，这是一个充满潜力和生机的状态。在人生道路上，您可能会有较多的新机遇和发展空间，适合开始新的计划或事业。';
    case 'muyu':
      return '您的命局处于"沐浴"阶段，这是一个净化和调整的状态。您可能正在经历一些变化或转型，需要保持开放的心态，接受新的思想和观念。';
    case 'guandai':
      return '您的命局处于"冠带"阶段，这是一个准备和成长的状态。您可能正在积累经验和能力，为未来的发展打下基础，是提升自我的好时机。';
    case 'linguan':
      return '您的命局处于"临官"阶段，这是一个事业有成的状态。您可能在职业或事业上会有良好的发展和成就，是施展才华的好时期。';
    case 'diwang':
      return '您的命局处于"帝旺"阶段，这是一个巅峰和鼎盛的状态。您可能在各方面都会有较好的表现和成就，但也要注意避免骄傲和过度自信。';
    case 'shuai':
      return '您的命局处于"衰"阶段，这是一个开始走下坡路的状态。您可能会面临一些挑战或困难，需要调整心态，做好应对变化的准备。';
    case 'bing':
      return '您的命局处于"病"阶段，这是一个不太顺利的状态。您可能会遇到一些阻碍或问题，需要更多的耐心和毅力来克服困难。';
    case 'si':
      return '您的命局处于"死"阶段，这是一个结束和转变的状态。某些事物可能会结束或改变，但这也是新生的开始，需要放下过去，迎接未来。';
    case 'mu':
      return '您的命局处于"墓"阶段，这是一个收敛和积累的状态。您可能需要沉淀和反思，为未来的发展储备能量和资源。';
    case 'jue':
      return '您的命局处于"绝"阶段，这是一个低谷和挑战的状态。您可能会面临较大的困难或挑战，但这也是锻炼意志和毅力的机会。';
    case 'tai':
      return '您的命局处于"胎"阶段，这是一个孕育和酝酿的状态。新的机遇和可能性正在形成，需要耐心等待和培育。';
    case 'yang':
      return '您的命局处于"养"阶段，这是一个滋养和培育的状态。您可能正在为未来的发展做准备，积累能量和资源，是自我提升的好时机。';
    default:
      return '您的命局十二宫状态较为平衡，没有特别突出的状态。';
  }
}
