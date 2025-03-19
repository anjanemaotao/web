function Header() {
  try {
    return (
      <header data-name="header" className="bg-gradient-to-r from-red-800 to-red-700 text-white py-6 shadow-lg">
        <div data-name="header-container" className="container mx-auto px-4">
          <div data-name="header-content" className="flex flex-col items-center justify-center">
            <div data-name="header-icon" className="mb-3">
              <i className="fas fa-yin-yang text-3xl text-yellow-300 animate-spin-slow"></i>
            </div>
            <h1 data-name="header-title" className="text-3xl md:text-4xl font-bold mb-2 text-center text-yellow-100">
              八字命理推算
            </h1>
            <p data-name="header-subtitle" className="text-lg opacity-90 text-center">
              输入阴历生日，推算命理格局
            </p>
            <div data-name="header-decoration" className="w-40 h-1 bg-yellow-300 mt-3 relative">
              <div data-name="decoration-dot-left" className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-yellow-300"></div>
              <div data-name="decoration-dot-right" className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-yellow-300"></div>
            </div>
          </div>
        </div>
      </header>
    );
  } catch (error) {
    console.error("Header component error:", error);
    reportError(error);
    return null;
  }
}
