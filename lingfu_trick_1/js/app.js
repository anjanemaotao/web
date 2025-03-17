function App() {
  try {
    // State for language and results
    const [language, setLanguage] = React.useState('zh-CN');
    const [result, setResult] = React.useState(null);
    
    // Get translations for current language
    const t = translations[language] || translations['zh-CN'];
    
    // Handle language change
    const handleLanguageChange = (newLanguage) => {
      setLanguage(newLanguage);
    };
    
    // Handle form submission
    const handleFormSubmit = (birthData) => {
      try {
        // Current year for calculations
        const currentYear = new Date().getFullYear();
        
        // Get Ben Ming (birth house) based on birth month and hour
        const benMing = zodiacUtils.getBenMing(birthData.birthMonth.toString(), birthData.birthTime);
        
        // Get current year's Chinese name (e.g., "子年")
        const currentYearChineseName = zodiacUtils.getChineseYearName(currentYear);
        
        // Get Sui Jun (year guardian) based on Ben Ming and current year
        const suiJun = zodiacUtils.getSuiJun(benMing, currentYearChineseName);
        
        // Get fortune level
        const fortuneLevel = zodiacUtils.getFortuneLevel(suiJun);
        
        // Get talisman name
        const talismanName = zodiacUtils.getTalismanName(suiJun);
        
        // Get effect text
        const effect = talismansData.effects[talismanName];
        
        // Set result
        setResult({
          benMing,
          suiJun,
          fortuneLevel,
          talismanName,
          effect,
          birthData
        });
        
        // Scroll to results after a short delay
        setTimeout(() => {
          window.scrollTo({
            top: document.getElementById('result-section')?.offsetTop || 0,
            behavior: 'smooth'
          });
        }, 100);
      } catch (error) {
        console.error('Error calculating talisman:', error);
        reportError(error);
      }
    };

    return (
      <div data-name="app-container" className="app-container">
        <AnimatedBackground />
        
        <div data-name="content-container" className="content-container">
          <LanguageSelector 
            currentLanguage={language} 
            onLanguageChange={handleLanguageChange} 
          />
          
          <Header 
            title={t.title} 
            subtitle={t.subtitle} 
          />
          
          <BirthForm 
            language={language} 
            onSubmit={handleFormSubmit} 
            translations={t} 
          />
          
          <div id="result-section" data-name="result-section">
            {result && (
              <TalismanResult 
                result={result} 
                translations={t} 
                language={language} 
              />
            )}
          </div>
          
          <Footer text={t.footer} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('App component error:', error);
    reportError(error);
    return (
      <div data-name="error-message" className="p-8 text-center text-red-500">
        <h2>An error occurred in the application.</h2>
        <p>Please try refreshing the page.</p>
      </div>
    );
  }
}

// Render the App component using the legacy ReactDOM.render method instead of createRoot
// This is compatible with React 18 production build
ReactDOM.render(<App />, document.getElementById('root'));
