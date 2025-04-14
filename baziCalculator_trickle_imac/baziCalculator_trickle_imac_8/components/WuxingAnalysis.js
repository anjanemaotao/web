function WuxingAnalysis({ wuxingResult, bazi, patterns }) {
  try {
    const { t, language } = React.useContext(I18nContext);
    
    if (!wuxingResult) {
      return (
        <div className="analysis-item" data-name="wuxing-analysis-empty">
          <div className="analysis-title">{t('wuxingTitle')}</div>
          <div className="analysis-content">-</div>
        </div>
      );
    }
    
    const { count, strength } = wuxingResult;
    const wuxingAnalyzer = WuxingAnalyzer();
    
    // 计算五行百分比
    const totalCount = Object.values(count).reduce((sum, value) => sum + value, 0);
    const percentages = {};
    Object.keys(count).forEach(wx => {
      percentages[wx] = Math.round((count[wx] / totalCount) * 100);
    });
    
    // 获取五行性格分析数据
    const [personalityData, setPersonalityData] = React.useState(null);
    const [personalityAnalysis, setPersonalityAnalysis] = React.useState({});
    
    // 获取wuxingxingge.json数据
    React.useEffect(() => {
      fetch('wuxingxingge.json')
        .then(response => response.json())
        .then(data => {
          setPersonalityData(data);
        })
        .catch(error => {
          console.error('加载五行性格数据失败:', error);
          reportError(error);
        });
    }, []);
    
    // 分析五行性格
    React.useEffect(() => {
      if (personalityData && bazi && patterns && patterns.length > 0) {
        try {
          // 获取日干五行属性
          const calculator = BaziCalculator();
          const dayGan = bazi.dayPillar.gan;
          const dayDry = calculator.getWuxing(dayGan);
          
          // 获取格局的中文名称
          const patternNameMap = {
            "yinzhong": "印重局",
            "shangguan": "伤官局",
            "bijian": "命旺局",
            "shazhong": "煞重局",
            "caiwang": "财旺局"
          };
          
          // 将英文格局转换为中文格局
          const chinesePatterns = patterns.map(pattern => patternNameMap[pattern] || "");
          
          // 匹配性格分析
          const analysis = {};
          
          personalityData.elements_personality.forEach(item => {
            // 检查是否满足格局条件（任意一个格局匹配即可）
            const patternMatch = item.pattern.some(p => chinesePatterns.includes(p));
            
            // 检查是否满足日干五行条件
            const dayDryMatch = item.day_dry === dayDry;
            
            // 如果同时满足格局和日干条件，则根据五行强弱匹配相应内容
            if (patternMatch && dayDryMatch) {
              const element = item.element;
              
              if (strength[element] === 'strong') {
                analysis[element] = {
                  type: 'high',
                  content: item.content_high
                };
              } else if (strength[element] === 'weak') {
                analysis[element] = {
                  type: 'low',
                  content: item.content_low
                };
              }
              // 中和状态不显示内容
            }
          });
          
          setPersonalityAnalysis(analysis);
        } catch (error) {
          console.error('分析五行性格错误:', error);
          reportError(error);
        }
      }
    }, [personalityData, bazi, patterns, strength]);
    
    return (
      <div className="analysis-item slide-in" data-name="wuxing-analysis">
        <div className="analysis-title section-title wuxing-title">{t('wuxingTitle')}</div>
        <div className="analysis-content">
          <div className="grid grid-cols-5 gap-2 mb-4" data-name="wuxing-strength-display">
            {wuxingAnalyzer.wuxing.map(wx => (
              <div 
                key={wx} 
                className="text-center p-2 rounded-md"
                data-name={`wuxing-${wx}-display`}
              >
                <div className={`text-xl font-bold wuxing-${getWuxingClass(wx)}`}>
                  {t(`wuxing_element_${wx}`)}
                </div>
                <div className="text-sm mt-1">
                  <span className={`shier-gong-state state-${strength[wx]}`}>
                    {t(strength[wx])}
                  </span>
                </div>
                <div className="mt-1 text-sm">
                  <span className="font-medium">{count[wx].toFixed(1)}</span>
                </div>
                <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden" data-name={`wuxing-${wx}-bar`}>
                  <div 
                    className={`h-full bg-${getWuxingBarColor(wx)}`}
                    style={{ width: `${percentages[wx]}%` }}
                  ></div>
                </div>
                <div className="text-xs mt-1">{percentages[wx]}%</div>
              </div>
            ))}
          </div>
          
          <div className="mt-4" data-name="wuxing-analysis-description">
            <h4 className="font-semibold mb-2 sub-section-title">{t('wuxing_analysis_title')}</h4>
            <ul className="list-disc pl-5 space-y-2">
              {wuxingAnalyzer.wuxing.map(wx => {
                if (strength[wx] === 'strong') {
                  return (
                    <li key={wx} data-name={`wuxing-${wx}-description`}>
                      <span className={`font-medium wuxing-${getWuxingClass(wx)}`}>{t(`wuxing_element_${wx}`)}</span>
                      {t('wuxing_status_strong')}{', '}{t('wuxing_quantity')}{' '}{count[wx].toFixed(1)}{', '}{t('wuxing_percentage')}{' '}{percentages[wx]}{'%。'}
                      {t(`wuxing_${getWuxingTranslationKey(wx)}_strong`)}
                    </li>
                  );
                } else if (strength[wx] === 'weak') {
                  return (
                    <li key={wx} data-name={`wuxing-${wx}-description`}>
                      <span className={`font-medium wuxing-${getWuxingClass(wx)}`}>{t(`wuxing_element_${wx}`)}</span>
                      {t('wuxing_status_weak')}{', '}{t('wuxing_quantity')}{' '}{count[wx].toFixed(1)}{', '}{t('wuxing_percentage')}{' '}{percentages[wx]}{'%。'}
                      {t(`wuxing_${getWuxingTranslationKey(wx)}_weak`)}
                    </li>
                  );
                }
                return (
                  <li key={wx} data-name={`wuxing-${wx}-description`}>
                    <span className={`font-medium wuxing-${getWuxingClass(wx)}`}>{t(`wuxing_element_${wx}`)}</span>
                    {t('wuxing_status_neutral')}{', '}{t('wuxing_quantity')}{' '}{count[wx].toFixed(1)}{', '}{t('wuxing_percentage')}{' '}{percentages[wx]}{'%。'}
                  </li>
                );
              })}
            </ul>
          </div>
          
          {/* 五行性格分析部分 */}
          {Object.keys(personalityAnalysis).length > 0 && (
            <div className="mt-6" data-name="wuxing-personality-analysis">
              <h4 className="font-semibold mb-2 sub-section-title">{t('wuxing_personality_title') || '五行性格分析'}</h4>
              <ul className="list-disc pl-5 space-y-3">
                {wuxingAnalyzer.wuxing.map(wx => {
                  if (personalityAnalysis[wx]) {
                    return (
                      <li key={`personality-${wx}`} data-name={`wuxing-${wx}-personality`}>
                        <div>
                          <span className={`font-medium wuxing-${getWuxingClass(wx)}`}>{t(`wuxing_element_${wx}`)}</span>
                          <span className="ml-1">
                            {personalityAnalysis[wx].type === 'high' ? 
                              (t('wuxing_personality_strong') || '旺盛') : 
                              (t('wuxing_personality_weak') || '薄弱')}
                          </span>
                          <span className="ml-1">: </span>
                          <span>{personalityAnalysis[wx].content[language] || personalityAnalysis[wx].content['zh-Hans']}</span>
                        </div>
                      </li>
                    );
                  }
                  return null;
                }).filter(Boolean)}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('WuxingAnalysis component error:', error);
    reportError(error);
    return null;
  }
}

// 获取五行对应的CSS类名
function getWuxingClass(wx) {
  switch (wx) {
    case '木': return 'wood';
    case '火': return 'fire';
    case '土': return 'earth';
    case '金': return 'metal';
    case '水': return 'water';
    default: return '';
  }
}

// 获取五行对应的翻译键
function getWuxingTranslationKey(wx) {
  switch (wx) {
    case '木': return 'wood';
    case '火': return 'fire';
    case '土': return 'earth';
    case '金': return 'metal';
    case '水': return 'water';
    default: return '';
  }
}

// 获取五行对应的进度条颜色
function getWuxingBarColor(wx) {
  switch (wx) {
    case '木': return 'green-500';
    case '火': return 'red-500';
    case '土': return 'yellow-700';
    case '金': return 'amber-500'; /* 更适合金属的颜色 */
    case '水': return 'blue-500';
    default: return 'gray-300';
  }
}

// 获取五行状态描述
function getWuxingDescription(wx, strength, t) {
  if (strength === 'strong') {
    switch (wx) {
      case '木': 
        return t(`wuxing_wood_strong`);
      case '火': 
        return t(`wuxing_fire_strong`);
      case '土': 
        return t(`wuxing_earth_strong`);
      case '金': 
        return t(`wuxing_metal_strong`);
      case '水': 
        return t(`wuxing_water_strong`);
      default: 
        return '';
    }
  } else if (strength === 'weak') {
    switch (wx) {
      case '木': 
        return t(`wuxing_wood_weak`);
      case '火': 
        return t(`wuxing_fire_weak`);
      case '土': 
        return t(`wuxing_earth_weak`);
      case '金': 
        return t(`wuxing_metal_weak`);
      case '水': 
        return t(`wuxing_water_weak`);
      default: 
        return '';
    }
  }
  return '';
}
