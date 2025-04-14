function Navbar() {
  try {
    const { t } = React.useContext(I18nContext);
    
    return (
      <nav className="navbar" data-name="main-navbar">
        <div className="navbar-container">
          <div className="navbar-logo" data-name="navbar-logo">
            <img 
              src="https://app.trickle.so/storage/public/images/usr_0d1d18c478000001/e15032a7-1610-436e-9918-901c057de8b3.jpeg" 
              alt="墨衍字八字" 
              className="logo-image"
            />
            <span className="logo-text">墨衍字八字</span>
          </div>
          
          <div className="navbar-right" data-name="navbar-right">
            <LanguageSwitcher />
          </div>
        </div>
      </nav>
    );
  } catch (error) {
    console.error('Navbar component error:', error);
    reportError(error);
    return null;
  }
}
