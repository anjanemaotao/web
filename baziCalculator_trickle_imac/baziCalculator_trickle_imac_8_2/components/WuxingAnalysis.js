function WuxingAnalysis({ wuxingResult }) {
  try {
    const { t } = React.useContext(I18nContext);
    
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
    
    return (
      <div className="analysis-item slide-in" data-name="wuxing-analysis">
        <div className="analysis-title">{t('wuxingTitle')}</div>
        <div className="analysis-content">
          <div className="grid grid-cols-5 gap-2 mb-4" data-name="wuxing-strength-display">
            {wuxingAnalyzer.wuxing.map(wx => (
              <div 
                key={wx} 
                className="text-center p-2 rounded-md"
                data-name={`wuxing-${wx}-display`}
              >
                <div className={`text-xl font-bold wuxing-${getWuxingClass(wx)}`}>
                  {wx}
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
            <h4 className="font-semibold mb-2">{t('wuxing_analysis_title')}</h4>
            <ul className="list-disc pl-5 space-y-2">
              {wuxingAnalyzer.wuxing.map(wx => {
                if (strength[wx] === 'strong') {
                  return (
                    <li key={wx} data-name={`wuxing-${wx}-description`}>
                      <span className={`font-medium wuxing-${getWuxingClass(wx)}`}>{wx}</span>
                      {t('wuxing_status_strong')}{', '}{t('wuxing_quantity')}{' '}{count[wx].toFixed(1)}{', '}{t('wuxing_percentage')}{' '}{percentages[wx]}{'%。'}
                      {t(`wuxing_${getWuxingTranslationKey(wx)}_strong`)}
                    </li>
                  );
                } else if (strength[wx] === 'weak') {
                  return (
                    <li key={wx} data-name={`wuxing-${wx}-description`}>
                      <span className={`font-medium wuxing-${getWuxingClass(wx)}`}>{wx}</span>
                      {t('wuxing_status_weak')}{', '}{t('wuxing_quantity')}{' '}{count[wx].toFixed(1)}{', '}{t('wuxing_percentage')}{' '}{percentages[wx]}{'%。'}
                      {t(`wuxing_${getWuxingTranslationKey(wx)}_weak`)}
                    </li>
                  );
                }
                return (
                  <li key={wx} data-name={`wuxing-${wx}-description`}>
                    <span className={`font-medium wuxing-${getWuxingClass(wx)}`}>{wx}</span>
                    {t('wuxing_status_neutral')}{', '}{t('wuxing_quantity')}{' '}{count[wx].toFixed(1)}{', '}{t('wuxing_percentage')}{' '}{percentages[wx]}{'%。'}
                  </li>
                );
              })}
            </ul>
          </div>
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
function getWuxingDescription(wx, strength) {
  if (strength === 'strong') {
    switch (wx) {
      case '木': 
        return '木旺代表创造力强，有进取心，性格坚韧，适合从事创新、规划类工作。';
      case '火': 
        return '火旺代表热情洋溢，性格开朗，善于表达，适合从事需要人际交往的工作。';
      case '土': 
        return '土旺代表稳重踏实，忠厚老实，适合从事需要耐心和细致的工作。';
      case '金': 
        return '金旺代表意志坚定，果断决策，适合从事需要精确和纪律的工作。';
      case '水': 
        return '水旺代表思维灵活，善于沟通，适应性强，适合从事需要智慧和变通的工作。';
      default: 
        return '';
    }
  } else if (strength === 'weak') {
    switch (wx) {
      case '木': 
        return '木弱可能缺乏决断力，缺少进取心，建议多培养自信和毅力。';
      case '火': 
        return '火弱可能缺乏热情，表达能力较弱，建议多参与社交活动，增强自信心。';
      case '土': 
        return '土弱可能缺乏稳定性，做事不够踏实，建议培养耐心和专注力。';
      case '金': 
        return '金弱可能缺乏纪律性，意志力不够坚定，建议加强自律和坚持。';
      case '水': 
        return '水弱可能思维不够灵活，适应能力较弱，建议多学习新知识，提高应变能力。';
      default: 
        return '';
    }
  }
  return '';
}
