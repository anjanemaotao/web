function PatternAnalysis({ patterns }) {
  try {
    const { t } = React.useContext(I18nContext);
    
    if (!patterns || patterns.length === 0) {
      return (
        <div className="analysis-item" data-name="pattern-analysis-empty">
          <div className="analysis-title">{t('patternTitle')}</div>
          <div className="analysis-content">
            <div className="mb-4 p-3 bg-gray-50 rounded-md" data-name="pattern-main-display">
              <h4 className="font-semibold mb-2">格局导向：</h4>
              <div className="flex items-center">
                <span className="text-lg font-bold text-accent-color mr-2">
                  平常格
                </span>
                <span className="text-sm text-gray-600">
                  (无特殊格局)
                </span>
              </div>
            </div>
            <p>您的八字格局较为平衡，没有明显的特殊格局。这意味着您的性格较为全面，能够适应不同的环境和情况，但也可能需要更多的自我探索来发现个人独特的优势和特长。</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="analysis-item slide-in" data-name="pattern-analysis">
        <div className="analysis-title font-semibold mb-3 section-title pattern-title">{t('patternTitle')}</div>
        <div className="analysis-content">
          <div className="pattern-section" data-name="pattern-badges">        
            <div className="pattern-badges-container">
              {patterns.map(pattern => (
                <span 
                  key={pattern} 
                  className={`pattern-badge pattern-${pattern} pattern-badge-enhanced`}
                  data-name={`pattern-badge-${pattern}`}
                >
                  <span className="celestial-symbol">
                    {getPatternSymbol(pattern)}
                  </span>
                  {t(pattern)}
                </span>
              ))}
            </div>
          </div>
          
          <div className="pattern-section mb-4" data-name="pattern-main-display">
            <div className="pattern-section-header">
              <i className="fas fa-compass text-accent-color mr-2"></i>
              <h4 className="font-semibold">{t('patternOrientation')}：</h4>
              <div className="pattern-section-line"></div>
            </div>
            <div className="pattern-orientation p-3 bg-gray-50 rounded-md border-l-4 border-accent-color">
              <div className="flex items-center">
                <div className="pattern-main-name">
                  <span className="text-xl font-bold text-accent-color mr-2 pattern-highlight">
                  {patterns.length > 0 ? getPatternNickname(patterns[0]) : '无特殊格局'}                 
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {patterns.map(pattern => (
            <div key={pattern} className="mb-6 pattern-section" data-name={`pattern-description-${pattern}`}>
              <div className="pattern-section-header">
                <i className="fas fa-user-circle text-accent-color mr-2"></i>
                <h4 className="font-semibold">{t('personalityTitle')}</h4>
                <div className="pattern-section-line"></div>
              </div>
              <p className="mb-4 pattern-description">{getPatternDescription(pattern)}</p>
              
              {/* 添加格局特点、优势、劣势分析 */}
              <div className="pattern-details bg-gray-50 rounded-lg p-4 shadow-sm" data-name={`pattern-details-${pattern}`}>
                <div className="pattern-details-header">
                  <div className="pattern-details-icon">
                    <i className="fas fa-chart-line text-accent-color"></i>
                  </div>
                  <h5 className="text-md font-semibold mb-3 text-accent-color">{t('patternAnalysisDetail')}</h5>
                  <div className="pattern-details-line"></div>
                </div>
                
                <div className="mb-4 pattern-feature-card" data-name={`pattern-feature-${pattern}`}>
                  <div className="flex items-center mb-2">
                    <span className="inline-block w-8 h-8 bg-accent-color bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                      <i className="fas fa-star text-sm text-accent-color"></i>
                    </span>
                    <span className="font-medium text-primary-text">{t('patternFeature')}：</span>
                    <span className="ml-2 text-lg font-bold pattern-feature-text">{getPatternFeature(pattern)}</span>
                  </div>
                </div>
                
                <div className="mb-4 pattern-advantages-card" data-name={`pattern-advantages-${pattern}`}>
                  <div className="flex items-start mb-2">
                    <span className="inline-block w-8 h-8 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center mr-3 mt-1">
                      <i className="fas fa-plus text-sm text-green-600"></i>
                    </span>
                    <span className="font-medium text-primary-text">{t('patternAdvantages')}：</span>
                  </div>
                  <div className="ml-11 text-gray-700 pattern-advantages-text">
                    {getPatternAdvantages(pattern)}
                  </div>
                </div>
                
                <div className="mb-2 pattern-disadvantages-card" data-name={`pattern-disadvantages-${pattern}`}>
                  <div className="flex items-start mb-2">
                    <span className="inline-block w-8 h-8 bg-red-500 bg-opacity-20 rounded-full flex items-center justify-center mr-3 mt-1">
                      <i className="fas fa-minus text-sm text-red-600"></i>
                    </span>
                    <span className="font-medium text-primary-text">{t('patternDisadvantages')}：</span>
                  </div>
                  <div className="ml-11 text-gray-700 pattern-disadvantages-text">
                    {getPatternDisadvantages(pattern)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('PatternAnalysis component error:', error);
    reportError(error);
    return null;
  }
}

// 获取格局对应的符号
function getPatternSymbol(pattern) {
  switch (pattern) {
    case 'shangguan': return '☲'; // 离卦，代表火
    case 'yinzhong': return '☵'; // 坎卦，代表水
    case 'bijian': return '☰'; // 乾卦，代表天
    case 'shazhong': return '☴'; // 巽卦，代表风
    case 'caiwang': return '☷'; // 坤卦，代表地
    default: return '☯';
  }
}

// 获取格局昵称
function getPatternNickname(pattern) {
  const { t } = React.useContext(I18nContext);
  switch (pattern) {
    case 'shangguan': return t('pattern_nickname_shangguan');
    case 'yinzhong': return t('pattern_nickname_yinzhong');
    case 'bijian': return t('pattern_nickname_bijian');
    case 'shazhong': return t('pattern_nickname_shazhong');
    case 'caiwang': return t('pattern_nickname_caiwang');
    default: return t('pattern_nickname_default');
  }
}

// 获取格局描述
function getPatternDescription(pattern) {
  const { t } = React.useContext(I18nContext);
  switch (pattern) {
    case 'shangguan':
      return t('shangguan_desc');
    case 'yinzhong':
      return t('yinzhong_desc');
    case 'bijian':
      return t('bijian_desc');
    case 'shazhong':
      return t('shazhong_desc');
    case 'caiwang':
      return t('caiwang_desc');
    default:
      return t('default_pattern_desc');
  }
}

// 获取格局特点
function getPatternFeature(pattern) {
  const { t } = React.useContext(I18nContext);
  switch (pattern) {
    case 'shangguan':
      return t('pattern_feature_shangguan');
    case 'yinzhong':
      return t('pattern_feature_yinzhong');
    case 'bijian':
      return t('pattern_feature_bijian');
    case 'shazhong':
      return t('pattern_feature_shazhong');
    case 'caiwang':
      return t('pattern_feature_caiwang');
    default:
      return t('pattern_feature_default');
  }
}

// 获取格局优势
function getPatternAdvantages(pattern) {
  const { t } = React.useContext(I18nContext);
  switch (pattern) {
    case 'shangguan':
      return t('pattern_advantages_shangguan');
    case 'yinzhong':
      return t('pattern_advantages_yinzhong');
    case 'bijian':
      return t('pattern_advantages_bijian');
    case 'shazhong':
      return t('pattern_advantages_shazhong');
    case 'caiwang':
      return t('pattern_advantages_caiwang');
    default:
      return t('pattern_advantages_default');
  }
}

// 获取格局劣势
function getPatternDisadvantages(pattern) {
  const { t } = React.useContext(I18nContext);
  switch (pattern) {
    case 'shangguan':
      return t('pattern_disadvantages_shangguan');
    case 'yinzhong':
      return t('pattern_disadvantages_yinzhong');
    case 'bijian':
      return t('pattern_disadvantages_bijian');
    case 'shazhong':
      return t('pattern_disadvantages_shazhong');
    case 'caiwang':
      return t('pattern_disadvantages_caiwang');
    default:
      return t('pattern_disadvantages_default');
  }
}
