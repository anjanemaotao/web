function LanguageSelector({ currentLanguage, onLanguageChange }) {
  try {
    const languages = [
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
      { code: 'zh-TW', name: '繁體中文', flag: '🇹🇼' },
      { code: 'ja', name: '日本語', flag: '🇯🇵' },
      { code: 'ko', name: '한국어', flag: '🇰🇷' }
    ];

    const handleLanguageClick = (code) => {
      onLanguageChange(code);
    };

    return (
      <div data-name="language-selector" className="flex justify-center mb-4 space-x-2">
        {languages.map((lang) => (
          <button
            key={lang.code}
            data-name={`language-button-${lang.code}`}
            className={`language-btn px-3 py-1 rounded-md text-sm flex items-center ${
              currentLanguage === lang.code ? 'active' : 'bg-opacity-50'
            }`}
            onClick={() => handleLanguageClick(lang.code)}
          >
            <span className="mr-2" data-name="language-flag">{lang.flag}</span>
            <span data-name="language-name">{lang.name}</span>
          </button>
        ))}
      </div>
    );
  } catch (error) {
    console.error('LanguageSelector component error:', error);
    reportError(error);
    return null;
  }
}
