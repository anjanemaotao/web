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
        <div className="analysis-title section-title shiergong-title">{t('shiergongTitle')}</div>
        <div className="analysis-content">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4" data-name="shier-gong-states">
            <div className="p-2 bg-gray-50 rounded-md" data-name="shier-gong-year">
              <div className="text-sm text-gray-600">{t('yearZhiShierGong')}</div>
              <div className="font-medium">
                <span className={`shier-gong-state state-${shierGongAnalyzer.getShierGongStrength(shierGongStates.yearZhi)}`}>
                  {t(shierGongStates.yearZhi || '')}
                </span>
              </div>
            </div>
            <div className="p-2 bg-gray-50 rounded-md" data-name="shier-gong-month">
              <div className="text-sm text-gray-600">{t('monthZhiShierGong')}</div>
              <div className="font-medium">
                <span className={`shier-gong-state state-${shierGongAnalyzer.getShierGongStrength(shierGongStates.monthZhi)}`}>
                  {t(shierGongStates.monthZhi || '')}
                </span>
              </div>
            </div>
            <div className="p-2 bg-gray-50 rounded-md" data-name="shier-gong-day">
              <div className="text-sm text-gray-600">{t('dayZhiShierGong')}</div>
              <div className="font-medium">
                <span className={`shier-gong-state state-${shierGongAnalyzer.getShierGongStrength(shierGongStates.dayZhi)}`}>
                  {t(shierGongStates.dayZhi || '')}
                </span>
              </div>
            </div>
            <div className="p-2 bg-gray-50 rounded-md" data-name="shier-gong-hour">
              <div className="text-sm text-gray-600">{t('hourZhiShierGong')}</div>
              <div className="font-medium">
                <span className={`shier-gong-state state-${shierGongAnalyzer.getShierGongStrength(shierGongStates.hourZhi)}`}>
                  {t(shierGongStates.hourZhi || '')}
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-4" data-name="shier-gong-dominant">
            <h4 className="font-semibold mb-2 sub-section-title">{t('dominantShierGongStatus')}</h4>
            <div className="p-3 bg-gray-50 rounded-md">
              <div className="mb-2">
                <span className="font-medium mr-2">{t('monthRulingShierGong')}</span>
                <span className={`shier-gong-state state-${shierGongAnalyzer.getShierGongStrength(dominantState)}`}>
                  {t(dominantState || '')}
                </span>
              </div>
              <p>{shierGongAnalyzer.getShierGongExplanation(dominantState)}</p>
              <p className="mt-2">{getShierGongLifeDescription(dominantState)}</p>
            </div>
          </div>
          
          <div className="mt-4" data-name="shier-gong-cycle">
            <h4 className="font-semibold mb-2 sub-section-title">{t('shierGongLifeCycle')}</h4>
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
            <div className="text-center text-sm mt-2 text-gray-600">{t('lifeCycleChart')}</div>
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
  const { t } = React.useContext(I18nContext);
  switch (state) {
    case 'changsheng':
      return t('shierGong_description_changsheng');
    case 'muyu':
      return t('shierGong_description_muyu');
    case 'guandai':
      return t('shierGong_description_guandai');
    case 'linguan':
      return t('shierGong_description_linguan');
    case 'diwang':
      return t('shierGong_description_diwang');
    case 'shuai':
      return t('shierGong_description_shuai');
    case 'bing':
      return t('shierGong_description_bing');
    case 'si':
      return t('shierGong_description_si');
    case 'mu':
      return t('shierGong_description_mu');
    case 'jue':
      return t('shierGong_description_jue');
    case 'tai':
      return t('shierGong_description_tai');
    case 'yang':
      return t('shierGong_description_yang');
    default:
      return t('shierGong_description_default');
  }
}
