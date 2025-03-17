function BirthForm({ language, onSubmit, translations }) {
  try {
    const [birthYear, setBirthYear] = React.useState('');
    const [birthMonth, setBirthMonth] = React.useState('');
    const [birthTime, setBirthTime] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    
    // Generate years for dropdown
    const yearOptions = React.useMemo(() => {
      const currentYear = new Date().getFullYear();
      const years = [];
      
      for (let year = currentYear - 100; year <= currentYear; year++) {
        const zodiacSign = zodiacUtils.getZodiacSign(year, language === 'en' ? 'en' : 'cn');
        years.push({
          value: year,
          label: `${year} (${zodiacSign}${language === 'en' ? '' : '年'})`
        });
      }
      
      return years;
    }, [language]);
    
    // Time options
    const timeOptions = React.useMemo(() => {
      return [
        { value: 'zi', label: translations.hours['zi'] },
        { value: 'chou', label: translations.hours['chou'] },
        { value: 'yin', label: translations.hours['yin'] },
        { value: 'mao', label: translations.hours['mao'] },
        { value: 'chen', label: translations.hours['chen'] },
        { value: 'si', label: translations.hours['si'] },
        { value: 'wu', label: translations.hours['wu'] },
        { value: 'wei', label: translations.hours['wei'] },
        { value: 'shen', label: translations.hours['shen'] },
        { value: 'you', label: translations.hours['you'] },
        { value: 'xu', label: translations.hours['xu'] },
        { value: 'hai', label: translations.hours['hai'] }
      ];
    }, [translations]);
    
    const handleSubmit = (e) => {
      try {
        e.preventDefault();
        
        // Validate inputs
        if (!birthYear || !birthMonth || !birthTime) {
          alert(translations.pleaseSelect);
          return;
        }
        
        setIsLoading(true);
        
        // Play animation and submit after it completes
        talismansData.playTalismanAnimation(() => {
          onSubmit({
            birthYear: parseInt(birthYear),
            birthMonth: parseInt(birthMonth),
            birthTime
          });
          setIsLoading(false);
        });
      } catch (error) {
        console.error('Form submission error:', error);
        reportError(error);
        setIsLoading(false);
      }
    };
    
    // Get language-specific class for font
    const getLangClass = () => {
      if (language === 'zh-CN' || language === 'zh-TW') return 'chinese-font';
      if (language === 'ja') return 'japanese-font';
      if (language === 'ko') return 'korean-font';
      return '';
    };

    return (
      <div data-name="birth-form" className={`card p-6 mb-10 ${getLangClass()}`}>
        <h2 data-name="form-title" className="text-xl md:text-2xl font-bold mb-6 text-center glow-text">
          {translations.formTitle}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div data-name="form-fields" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div data-name="year-field" className="form-group">
              <label htmlFor="birthYear" className="block mb-2 text-secondary-color">
                {translations.birthYear}
              </label>
              <select
                id="birthYear"
                data-name="birth-year-select"
                className="w-full bg-opacity-50 bg-card-color border border-border-color rounded-md p-3 text-text-color"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                disabled={isLoading}
              >
                <option value="">{translations.pleaseSelect}</option>
                {yearOptions.map((year) => (
                  <option key={year.value} value={year.value}>
                    {year.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div data-name="month-field" className="form-group">
              <label htmlFor="birthMonth" className="block mb-2 text-secondary-color">
                {translations.birthMonth}
              </label>
              <select
                id="birthMonth"
                data-name="birth-month-select"
                className="w-full bg-opacity-50 bg-card-color border border-border-color rounded-md p-3 text-text-color"
                value={birthMonth}
                onChange={(e) => setBirthMonth(e.target.value)}
                disabled={isLoading}
              >
                <option value="">{translations.pleaseSelect}</option>
                {translations.months.map((month, index) => (
                  <option key={index + 1} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            
            <div data-name="time-field" className="form-group">
              <label htmlFor="birthTime" className="block mb-2 text-secondary-color">
                {translations.birthTime}
              </label>
              <select
                id="birthTime"
                data-name="birth-time-select"
                className="w-full bg-opacity-50 bg-card-color border border-border-color rounded-md p-3 text-text-color"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                disabled={isLoading}
              >
                <option value="">{translations.pleaseSelect}</option>
                {timeOptions.map((time) => (
                  <option key={time.value} value={time.value}>
                    {time.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <button
            type="submit"
            data-name="submit-button"
            className={`btn-primary w-full py-4 text-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            <span>
              {isLoading ? (
                <div data-name="loading-spinner" className="inline-block animate-spin mr-2">
                  <i className="fas fa-circle-notch"></i>
                </div>
              ) : (
                <i className="fas fa-search mr-2"></i>
              )}
              {translations.queryButton}
            </span>
          </button>
        </form>
      </div>
    );
  } catch (error) {
    console.error('BirthForm component error:', error);
    reportError(error);
    return null;
  }
}
