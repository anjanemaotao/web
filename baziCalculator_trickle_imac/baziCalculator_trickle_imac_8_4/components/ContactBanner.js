function ContactBanner() {
  try {
    const { t } = React.useContext(I18nContext);
    return (
      <div className="contact-banner" data-name="contact-banner">
        <div className="contact-banner-content">
          <div className="contact-banner-text">
            <span className="contact-banner-icon">
              <i className="fas fa-star-half-alt"></i>
            </span>
            {t('contact_us')}
            <span className="contact-banner-icon">
              <i className="fas fa-star-half-alt"></i>
            </span>
          </div>
          <a 
            href="https://easternmuse.com/pages/bazi" 
            target="_blank" 
            rel="noopener noreferrer"
            className="contact-banner-button"
            data-name="contact-banner-button"
            onClick={() => {
              gtag('event', 'contact_now', {
                'event_category': 'engagement',
                'event_label': t('contact_now')
              });
            }}
          >
            {t('contact_now')} <i className="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    );
  } catch (error) {
    console.error('ContactBanner component error:', error);
    reportError(error);
    return null;
  }
}
