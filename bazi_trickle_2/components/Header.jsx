function Header() {
  try {
    return (
      <div data-name="header" className="bg-paper p-4 shadow-lg border-b border-mystic">
        <div className="container mx-auto flex flex-col items-center justify-center">
          <h1 data-name="header-title" className="text-3xl md:text-4xl font-bold text-mystic mb-2 animate-float">
            八字命理计算器
          </h1>
          <p data-name="header-subtitle" className="text-gray-400 text-center max-w-2xl">
            根据阴历出生日期和时辰，推算命盘信息、五行分析、大运流年
          </p>
          <div data-name="header-decoration" className="flex justify-center mt-3">
            <span className="mx-1 text-xl text-mystic animate-pulse-glow">☯</span>
            <span className="mx-1 text-xl element-wood">木</span>
            <span className="mx-1 text-xl element-fire">火</span>
            <span className="mx-1 text-xl element-earth">土</span>
            <span className="mx-1 text-xl element-metal">金</span>
            <span className="mx-1 text-xl element-water">水</span>
            <span className="mx-1 text-xl text-mystic animate-pulse-glow">☯</span>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Header component error:', error);
    reportError(error);
    return <div>页面加载出错</div>;
  }
}
