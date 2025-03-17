function ResultCard({ title, content, className = '', fortuneLevel = null, translations }) {
  try {
    // Get fortune class if fortune level is provided
    const getFortuneClass = () => {
      if (!fortuneLevel) return '';
      return talismansData.getFortuneClass(fortuneLevel);
    };
    
    // Get fortune text if fortune level is provided
    const getFortuneText = () => {
      if (!fortuneLevel || !translations) return '';
      return translations.fortuneLevels[fortuneLevel];
    };

    return (
      <div data-name="result-card" className={`card p-5 ${className}`}>
        <h3 data-name="result-card-title" className="text-lg md:text-xl font-bold mb-3 text-secondary-color flex items-center">
          {title}
          {fortuneLevel && (
            <span data-name="fortune-badge" className={`fortune-level ${getFortuneClass()}`}>
              {getFortuneText()}
            </span>
          )}
        </h3>
        <div data-name="result-card-content" className="text-base md:text-lg">
          {content}
        </div>
      </div>
    );
  } catch (error) {
    console.error('ResultCard component error:', error);
    reportError(error);
    return null;
  }
}
