function TalismanResult({ result, translations, language }) {
  try {
    const { benMing, suiJun, fortuneLevel, talismanName, effect, birthData } = result;
    
    // Get language-specific class for font
    const getLangClass = () => {
      if (language === 'zh-CN' || language === 'zh-TW') return 'chinese-font';
      if (language === 'ja') return 'japanese-font';
      if (language === 'ko') return 'korean-font';
      return '';
    };
    
    // Get talisman image URL
    const talismanImageUrl = talismansData.getTalismanImageUrl(talismanName);
    
    // Format birth summary
    const formatBirthSummary = () => {
      const currentYear = new Date().getFullYear();
      const birthZodiac = zodiacUtils.getZodiacSign(birthData.birthYear, language === 'en' ? 'en' : 'cn');
      const currentZodiac = zodiacUtils.getZodiacSign(currentYear, language === 'en' ? 'en' : 'cn');
      
      return (
        <div data-name="birth-summary" className="mb-6 p-4 bg-opacity-20 bg-gray-700 rounded-md">
          <div data-name="birth-details">
            <strong>{translations.inputSummary}:</strong> {birthData.birthYear} {language === 'en' ? '' : '年'}
            ({birthZodiac}{language === 'en' ? '' : '年'}) {translations.months[birthData.birthMonth - 1]} {translations.hours[birthData.birthTime]}
          </div>
          <div data-name="current-year">
            <strong>{translations.currentYear}:</strong> {currentYear} {language === 'en' ? '' : '年'} ({currentZodiac}{language === 'en' ? '' : '年'})
          </div>
        </div>
      );
    };

    // Get request talisman text based on language
    const getRequestTalismanText = () => {
      const textMap = {
        'en': 'Request Talisman',
        'zh-CN': '去请灵符',
        'zh-TW': '去請靈符',
        'ja': '護符を請う',
        'ko': '부적 요청하기'
      };
      return textMap[language] || textMap['zh-CN'];
    };

    return (
      <div data-name="talisman-result" className={`fade-in ${getLangClass()}`}>
        <div data-name="result-header" className="text-center mb-8">
          <h2 data-name="result-title" className="text-2xl md:text-3xl font-bold mb-4 glow-text">
            {translations.resultTitle}
          </h2>
        </div>
        
        {formatBirthSummary()}
        
        <div data-name="result-grid" className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ResultCard 
            title={translations.birthHouseTitle}
            content={benMing}
            className="fade-in-delay-1"
            translations={translations}
          />
          
          <ResultCard 
            title={translations.yearGuardianTitle}
            content={suiJun}
            className="fade-in-delay-2"
            translations={translations}
          />
          
          <ResultCard 
            title={translations.fortuneTitle}
            content=""
            fortuneLevel={fortuneLevel}
            className="fade-in-delay-3"
            translations={translations}
          />
          
          <div data-name="talisman-card" className="card p-5 fade-in-delay-4">
            <h3 data-name="talisman-title" className="text-lg md:text-xl font-bold mb-3 text-secondary-color">
              {translations.talismanTitle}
            </h3>
            <div data-name="talisman-content" className="flex flex-col items-center">
              <img 
                data-name="talisman-image" 
                src={talismanImageUrl}
                alt={talismanName}
                className="w-32 h-32 mb-3 talisman-glow object-contain"
              />
              <div data-name="talisman-name" className="text-lg font-bold mb-4">{talismanName}</div>
              <a 
                href="https://easternmuse.com/products/10%E7%A8%AE%E9%9D%88%E9%A9%97%E5%92%92%E7%AC%A6-%E5%88%B6%E5%8C%962025%E6%B5%81%E5%B9%B4%E4%B8%8D%E5%88%A9%EF%BC%81" 
                target="_blank" 
                rel="noopener noreferrer"
                data-name="request-talisman-button"
                className="btn-request-talisman"
              >
                <span>{getRequestTalismanText()}</span>
              </a>
            </div>
          </div>
        </div>
        
        <ResultCard 
          title={translations.effectTitle}
          content={effect}
          className="mb-8 fade-in-delay-4"
          translations={translations}
        />
        
        <div data-name="usage-method" className="card p-5 fade-in-delay-4">
          <h3 data-name="usage-title" className="text-lg md:text-xl font-bold mb-3 text-secondary-color">
            {translations.usageMethodTitle}
          </h3>
          <ol data-name="usage-steps" className="list-decimal pl-5 space-y-2">
            {translations.usageSteps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    );
  } catch (error) {
    console.error('TalismanResult component error:', error);
    reportError(error);
    return null;
  }
}
