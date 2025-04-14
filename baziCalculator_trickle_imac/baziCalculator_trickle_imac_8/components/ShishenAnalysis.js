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
        <div className="analysis-title section-title shishen-title">{t('shishenTitle')}</div>
        <div className="analysis-content">
          <div className="mb-4" data-name="shishen-tiangan">
            <h4 className="font-semibold mb-2 sub-section-title">{t('shishenTiangan')}</h4>
            <div className="grid grid-cols-4 gap-2">
              <div className="p-2 bg-gray-50 rounded-md" data-name="shishen-year-gan">
                <div className="text-sm text-gray-600">{t('yearGan')}</div>
                <div className="font-medium">
                  {tianganShishen.yearGan ? t(tianganShishen.yearGan) : '-'}
                </div>
              </div>
              <div className="p-2 bg-gray-50 rounded-md" data-name="shishen-month-gan">
                <div className="text-sm text-gray-600">{t('monthGan')}</div>
                <div className="font-medium">
                  {tianganShishen.monthGan ? t(tianganShishen.monthGan) : '-'}
                </div>
              </div>
              <div className="p-2 bg-gray-50 rounded-md" data-name="shishen-day-gan">
                <div className="text-sm text-gray-600">{t('dayGan')}</div>
                <div className="font-medium">
                  {t('dayMaster')}
                </div>
              </div>
              <div className="p-2 bg-gray-50 rounded-md" data-name="shishen-hour-gan">
                <div className="text-sm text-gray-600">{t('hourGan')}</div>
                <div className="font-medium">
                  {tianganShishen.hourGan ? t(tianganShishen.hourGan) : '-'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-4" data-name="shishen-dizhi">
            <h4 className="font-semibold mb-2 sub-section-title">{t('shishencangganDizhi')}</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2 bg-gray-50 rounded-md" data-name="shishen-year-zhi">
                <div className="text-sm text-gray-600">{t('yearZhiCanggan')}</div>
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
                <div className="text-sm text-gray-600">{t('monthZhiCanggan')}</div>
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
                <div className="text-sm text-gray-600">{t('dayZhiCanggan')}</div>
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
                <div className="text-sm text-gray-600">{t('hourZhiCanggan')}</div>
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
            <h4 className="font-semibold mb-2 sub-section-title">{t('shishenSummary')}</h4>
            <div className="p-3 bg-gray-50 rounded-md">
              <p>{t('shishenDominant')}<strong className="text-accent-color">{t(dominantShishen)}</strong> {t('shishenDominantSuffix')}</p>
              <p className="mt-2">{t(`shishen_description_${dominantShishen}`) || t('shishen_description_default')}</p>
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
