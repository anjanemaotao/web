function TabsContainer({ children, activeTab, setActiveTab, tabs }) {
  try {
    const { t } = React.useContext(I18nContext);
    
    return (
      <div className="tabs-container" data-name="tabs-container">
        <div className="tabs-header" data-name="tabs-header">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              data-name={`tab-button-${tab.id}`}
            >
              {tab.icon && <i className={`${tab.icon} mr-2`}></i>}
              {t(tab.label)}
            </button>
          ))}
        </div>
        <div className="tab-content" data-name="tab-content">
          {children}
        </div>
      </div>
    );
  } catch (error) {
    console.error('TabsContainer component error:', error);
    reportError(error);
    return <div className="error-message">标签加载错误</div>;
  }
}