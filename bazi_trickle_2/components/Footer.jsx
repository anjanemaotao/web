export default function Footer() {
  try {
    return (
      <footer data-name="footer" className="bg-gray-900 text-gray-400 py-8 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div data-name="footer-info" className="mb-4 md:mb-0 text-center md:text-left">
              <h3 className="text-lg font-bold text-mystic mb-2">八字命理计算器</h3>
              <p className="text-sm">
                基于传统命理学计算，仅供娱乐参考，不作为人生决策依据
              </p>
            </div>
            
            <div data-name="footer-links" className="flex flex-wrap justify-center">
              <div className="px-4 mb-4 md:mb-0 text-center">
                <h4 className="text-white text-sm font-bold mb-2">命理基础</h4>
                <ul className="text-xs">
                  <li className="mb-1"><a href="#" className="hover:text-yellow-400 transition">天干地支</a></li>
                  <li className="mb-1"><a href="#" className="hover:text-yellow-400 transition">五行相生相克</a></li>
                  <li className="mb-1"><a href="#" className="hover:text-yellow-400 transition">纳音五行</a></li>
                </ul>
              </div>
              
              <div className="px-4 mb-4 md:mb-0 text-center">
                <h4 className="text-white text-sm font-bold mb-2">命盘解读</h4>
                <ul className="text-xs">
                  <li className="mb-1"><a href="#" className="hover:text-yellow-400 transition">日主旺衰</a></li>
                  <li className="mb-1"><a href="#" className="hover:text-yellow-400 transition">大运流年</a></li>
                  <li className="mb-1"><a href="#" className="hover:text-yellow-400 transition">格局用神</a></li>
                </ul>
              </div>
              
              <div className="px-4 text-center">
                <h4 className="text-white text-sm font-bold mb-2">资源推荐</h4>
                <ul className="text-xs">
                  <li className="mb-1"><a href="#" className="hover:text-yellow-400 transition">命理书籍</a></li>
                  <li className="mb-1"><a href="#" className="hover:text-yellow-400 transition">进阶学习</a></li>
                  <li className="mb-1"><a href="#" className="hover:text-yellow-400 transition">命理软件</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div data-name="footer-copyright" className="text-center text-xs mt-8 pt-6 border-t border-gray-800">
            <p>© {new Date().getFullYear()} 八字命理计算器 | 传统文化研究与探索</p>
            <p className="mt-2">
              <i className="fas fa-dharmachakra text-yellow-600 mr-2"></i>
              <span>天人合一，知命不惧，顺天应人</span>
              <i className="fas fa-dharmachakra text-yellow-600 ml-2"></i>
            </p>
          </div>
        </div>
      </footer>
    );
  } catch (error) {
    console.error('Footer component error:', error);
    reportError(error);
    return <div>页脚组件加载出错</div>;
  }
}
