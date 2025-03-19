function Footer() {
  try {
    const currentYear = new Date().getFullYear();
    
    return (
      <footer data-name="footer" className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-8 mt-8 relative overflow-hidden">
        {/* Mystical background elements */}
        <div data-name="mystical-bg-elements" className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
          <div data-name="star-1" className="absolute w-2 h-2 bg-white rounded-full top-1/4 left-1/4 animate-pulse-slow"></div>
          <div data-name="star-2" className="absolute w-1 h-1 bg-white rounded-full top-1/3 left-1/2 animate-pulse-slow"></div>
          <div data-name="star-3" className="absolute w-3 h-3 bg-white rounded-full top-2/3 left-3/4 animate-pulse-slow"></div>
          <div data-name="star-4" className="absolute w-2 h-2 bg-white rounded-full top-1/2 left-1/5 animate-pulse-slow"></div>
          <div data-name="constellation-1" className="absolute w-20 h-20 border border-white/20 rounded-full top-10 left-1/4 animate-spin-slow"></div>
          <div data-name="constellation-2" className="absolute w-32 h-32 border border-white/10 rounded-full bottom-5 right-1/4 animate-spin-slow"></div>
        </div>
        
        <div data-name="footer-container" className="container mx-auto px-4 relative z-10">
          <div data-name="footer-content" className="flex flex-col md:flex-row justify-between items-center">
            <div data-name="footer-copyright" className="mb-4 md:mb-0">
              <p data-name="copyright-text" className="text-center md:text-left">
                © {currentYear} 八字计算器 - 仅供学习参考，非商业用途
              </p>
            </div>
            
            <div data-name="footer-disclaimer" className="text-sm text-gray-400 text-center md:text-right">
              <p data-name="disclaimer-text">
                本工具基于传统命理学原理，结果仅供娱乐参考
              </p>
            </div>
          </div>
          
          <div data-name="footer-notes" className="mt-6 pt-4 border-t border-gray-700 text-xs text-gray-400 text-center">
            <p data-name="notes-text" className="flex items-center justify-center">
              <i className="fas fa-balance-scale mr-2"></i>
              命由己造，相信科学，请理性看待命理分析结果
            </p>
          </div>
          
          <div data-name="mystical-symbols" className="flex justify-center mt-4 space-x-8 text-gray-500">
            <i className="fas fa-yin-yang animate-spin-slow"></i>
            <i className="fas fa-moon animate-pulse-slow"></i>
            <i className="fas fa-sun animate-pulse-slow"></i>
            <i className="fas fa-star animate-pulse-slow"></i>
          </div>
        </div>
      </footer>
    );
  } catch (error) {
    console.error("Footer component error:", error);
    reportError(error);
    return null;
  }
}
