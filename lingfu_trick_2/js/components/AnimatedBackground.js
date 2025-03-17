function AnimatedBackground() {
  try {
    React.useEffect(() => {
      // Create floating symbols
      const container = document.createElement('div');
      container.className = 'floating-elements';
      document.body.appendChild(container);
      
      const symbols = ['卦', '符', '命', '运', '道', '法', '灵', '德', '佑', '福', '吉', '祥'];
      
      for (let i = 0; i < 24; i++) {
        const symbol = document.createElement('div');
        symbol.className = 'floating-symbol';
        symbol.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        
        const size = Math.random() * 2 + 1;
        const left = Math.random() * 100;
        const duration = Math.random() * 40 + 20;
        const delay = Math.random() * 40;
        
        symbol.style.left = `${left}%`;
        symbol.style.fontSize = `${size}rem`;
        symbol.style.opacity = `${0.1 - size * 0.02}`;
        symbol.style.animationDuration = `${duration}s`;
        symbol.style.animationDelay = `${delay}s`;
        
        container.appendChild(symbol);
      }
      
      // Cleanup function
      return () => {
        if (container && document.body.contains(container)) {
          document.body.removeChild(container);
        }
      };
    }, []);

    return (
      <div data-name="mystic-background">
        <div data-name="mystic-bg" className="mystic-bg"></div>
      </div>
    );
  } catch (error) {
    console.error('AnimatedBackground component error:', error);
    reportError(error);
    return null;
  }
}
