function Header({ title, subtitle }) {
  try {
    return (
      <header data-name="header" className="text-center mb-10 relative">
        <h1 data-name="title" className="text-4xl md:text-5xl font-bold mb-4 glow-text">
          {title}
        </h1>
        <div data-name="subtitle" className="text-lg md:text-xl opacity-80">
          {subtitle}
        </div>
        <div data-name="decorative-line" className="w-24 h-1 bg-gradient-to-r from-transparent via-secondary-color to-transparent mx-auto mt-4"></div>
      </header>
    );
  } catch (error) {
    console.error('Header component error:', error);
    reportError(error);
    return null;
  }
}
