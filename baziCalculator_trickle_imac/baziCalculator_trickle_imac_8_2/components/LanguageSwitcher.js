function LanguageSwitcher(props) {
  try {
    const { language, changeLanguage } = React.useContext(I18nContext);
    
    const languages = [
      { code: 'zh-Hant', name: '繁體中文' },
      { code: 'zh-Hans', name: '简体中文' },
      { code: 'en', name: 'English' },
      { code: 'ja', name: '日本語' },
      { code: 'ko', name: '한국어' }
    ];
    
    return (
      <div className="language-switcher" data-name="language-switcher">
        {languages.map(lang => (
          <button
            key={lang.code}
            className={`language-btn ${language === lang.code ? 'active' : ''}`}
            onClick={() => changeLanguage(lang.code)}
            data-name={`language-btn-${lang.code}`}
          >
            {lang.name}
          </button>
        ))}
      </div>
    );
  } catch (error) {
    console.error('LanguageSwitcher component error:', error);
    reportError(error);
    return null;
  }
}
