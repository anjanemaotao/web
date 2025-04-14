function Banner() {
  try {
    const { t } = React.useContext(I18nContext);
    
    return (
      <div className="banner" data-name="main-banner">
        <img 
          src="https://app.trickle.so/storage/public/images/usr_0d1d18c478000001/864fce8d-7aa2-47d7-96bb-d5a5bad897ae.png" 
          alt="八字格局推算应用" 
          className="banner-image"
        />
        <div className="banner-overlay" data-name="banner-overlay">
          <h2 className="banner-title">{t('title')}</h2>
          <p className="banner-subtitle">{t('subtitle')}</p>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Banner component error:', error);
    reportError(error);
    return null;
  }
}
