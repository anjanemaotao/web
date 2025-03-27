function ContactBanner() {
  try {
    return (
      <div className="contact-banner" data-name="contact-banner">
        <div className="contact-banner-content">
          <div className="contact-banner-text">
            <span className="contact-banner-icon">
              <i className="fas fa-star-half-alt"></i>
            </span>
            联系我们，获取免费深度解读
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
          >
            立即咨询 <i className="fas fa-arrow-right"></i>
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
