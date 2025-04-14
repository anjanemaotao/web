function ShishenAnalysis({ shishenResult }) {
  try {
    const { t } = React.useContext(I18nContext);
    
    if (!shishenResult) {
      return (
        <div className="analysis-item" data-name="shishen-analysis-empty">
          <div className="analysis-title">{t('shishenTitle')}</div>
          <div className="analysis-content">-</div>
        </div>
      );
    }
    
    const { tianganShishen, dizhiShishen, shishenCount } = shishenResult;
    const shishenAnalyzer = ShishenAnalyzer();
    
    // 找出最强的十神
    let dominantShishen = '';
    let maxCount = 0;
    
    Object.entries(shishenCount).forEach(([shishen, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominantShishen = shishen;
      }
    });
    
    return (
      <div className="analysis-item slide-in" data-name="shishen-analysis">
        <div className="analysis-title">{t('shishenTitle')}</div>
        <div className="analysis-content">
          <div className="mb-4" data-name="shishen-tiangan">
            <h4 className="font-semibold mb-2">天干十神：</h4>
            <div className="grid grid-cols-4 gap-2">
              <div className="p-2 bg-gray-50 rounded-md" data-name="shishen-year-gan">
                <div className="text-sm text-gray-600">年干</div>
                <div className="font-medium">
                  {tianganShishen.yearGan ? t(tianganShishen.yearGan) : '-'}
                </div>
              </div>
              <div className="p-2 bg-gray-50 rounded-md" data-name="shishen-month-gan">
                <div className="text-sm text-gray-600">月干</div>
                <div className="font-medium">
                  {tianganShishen.monthGan ? t(tianganShishen.monthGan) : '-'}
                </div>
              </div>
              <div className="p-2 bg-gray-50 rounded-md" data-name="shishen-day-gan">
                <div className="text-sm text-gray-600">日干</div>
                <div className="font-medium">
                  {t('dayMaster')}
                </div>
              </div>
              <div className="p-2 bg-gray-50 rounded-md" data-name="shishen-hour-gan">
                <div className="text-sm text-gray-600">时干</div>
                <div className="font-medium">
                  {tianganShishen.hourGan ? t(tianganShishen.hourGan) : '-'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-4" data-name="shishen-dizhi">
            <h4 className="font-semibold mb-2">地支藏干十神：</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2 bg-gray-50 rounded-md" data-name="shishen-year-zhi">
                <div className="text-sm text-gray-600">年支藏干</div>
                <div>
                  {dizhiShishen.yearZhi && dizhiShishen.yearZhi.length > 0 ? 
                    dizhiShishen.yearZhi.map((shishen, index) => (
                      <span key={index} className="inline-block mr-2">
                        {shishen ? t(shishen) : '-'}
                      </span>
                    )) : '-'}
                </div>
              </div>
              <div className="p-2 bg-gray-50 rounded-md" data-name="shishen-month-zhi">
                <div className="text-sm text-gray-600">月支藏干</div>
                <div>
                  {dizhiShishen.monthZhi && dizhiShishen.monthZhi.length > 0 ? 
                    dizhiShishen.monthZhi.map((shishen, index) => (
                      <span key={index} className="inline-block mr-2">
                        {shishen ? t(shishen) : '-'}
                      </span>
                    )) : '-'}
                </div>
              </div>
              <div className="p-2 bg-gray-50 rounded-md" data-name="shishen-day-zhi">
                <div className="text-sm text-gray-600">日支藏干</div>
                <div>
                  {dizhiShishen.dayZhi && dizhiShishen.dayZhi.length > 0 ? 
                    dizhiShishen.dayZhi.map((shishen, index) => (
                      <span key={index} className="inline-block mr-2">
                        {shishen ? t(shishen) : '-'}
                      </span>
                    )) : '-'}
                </div>
              </div>
              <div className="p-2 bg-gray-50 rounded-md" data-name="shishen-hour-zhi">
                <div className="text-sm text-gray-600">时支藏干</div>
                <div>
                  {dizhiShishen.hourZhi && dizhiShishen.hourZhi.length > 0 ? 
                    dizhiShishen.hourZhi.map((shishen, index) => (
                      <span key={index} className="inline-block mr-2">
                        {shishen ? t(shishen) : '-'}
                      </span>
                    )) : '-'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4" data-name="shishen-summary">
            <h4 className="font-semibold mb-2">十神分析总结：</h4>
            <div className="p-3 bg-gray-50 rounded-md">
              <p>在您的八字中，<strong className="text-accent-color">{t(dominantShishen)}</strong> 最为突出，这表明：</p>
              <p className="mt-2">{getShishenDescription(dominantShishen)}</p>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('ShishenAnalysis component error:', error);
    reportError(error);
    return null;
  }
}

// 获取十神描述
function getShishenDescription(shishen) {
  switch (shishen) {
    case 'zhengyin':
      return '正印代表学识、文化修养，暗示您可能在学术、文化、艺术等方面有较好的天赋，也容易得到长辈的支持和帮助。';
    case 'pianyin':
      return '偏印代表智慧、聪明，暗示您可能思维敏捷，有创新能力，但也可能有些固执，不易接受他人意见。';
    case 'shangguan':
      return '伤官代表创造力、表达能力，暗示您可能在艺术、文学或创新方面有特长，但也可能性格较为任性，不拘小节。';
    case 'shishen':
      return '食神代表福气、享受，暗示您可能性格温和，善于交际，有艺术天赋，生活较为舒适。';
    case 'zhengguan':
      return '正官代表权威、规矩，暗示您可能做事有条理，遵守规则，适合在传统或规范性较强的行业发展。';
    case 'qisha':
      return '七杀代表权力、竞争，暗示您可能有较强的领导能力和竞争意识，但也可能脾气较为刚烈。';
    case 'zhengcai':
      return '正财代表稳定的财运，暗示您可能适合从事传统行业或有稳定收入的职业，财运较为平稳。';
    case 'piancai':
      return '偏财代表意外之财，暗示您可能有投资眼光，适合从事风险性投资或创业，但财运可能波动较大。';
    case 'bijian':
      return '比肩代表兄弟、朋友关系，暗示您可能人缘较好，适合团队合作，但也可能面临一些竞争。';
    case 'jiecai':
      return '劫财代表变动、波折，暗示您的人生可能会经历一些起伏和变化，需要学会适应和调整。';
    default:
      return '您的八字中各种十神较为平衡，没有特别突出的十神。';
  }
}
