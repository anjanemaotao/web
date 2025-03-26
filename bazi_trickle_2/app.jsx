import React from 'react';
import ReactDOM from 'react-dom/client';
import { BaziCalculator } from './utils/baziCalculator';
import { Header } from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import { DateTimeInput } from './components/DateTimeInput';
import { BaziChart } from './components/BaziChart';
import { ElementAnalysis } from './components/ElementAnalysis';
import { LuckyPeriods } from './components/LuckyPeriods';

function App() {
  try {
    const [baziData, setBaziData] = React.useState(null);
    const [showResults, setShowResults] = React.useState(false);
    const resultsRef = React.useRef(null);

    // 初始化八字计算器
    const baziCalculator = BaziCalculator();

    // 处理计算结果
    const handleCalculate = (formData) => {
      try {
        // 计算八字
        const result = baziCalculator.calculateBazi(
          formData.year,
          formData.month,
          formData.day,
          formData.hour
        );
        
        if (result) {
          // 添加五行与相生相克信息
          result.fiveElements = baziCalculator.fiveElements;
          result.elementRelations = baziCalculator.elementRelations;
          
          // 更新状态
          setBaziData(result);
          setShowResults(true);
          
          // 滚动到结果部分
          setTimeout(() => {
            if (resultsRef.current) {
              resultsRef.current.scrollIntoView({ behavior: 'smooth' });
            }
          }, 300);
        }

      } catch (error) {
        console.error("计算八字时出错:", error);
        alert("计算八字时出错，请检查输入信息是否正确");
      }

    };

    return (
      <div data-name="app-container" className="min-h-screen flex flex-col bg-paper">
        <Header />
        
        <main data-name="main-content" className="flex-grow container mx-auto px-4 py-6">
          <DateTimeInput onCalculate={handleCalculate} />
          
          {showResults && (
            <div 
              data-name="results-container" 
              ref={resultsRef}
              className="mt-8"
            >
              <BaziChart baziData={baziData} />
              <ElementAnalysis baziData={baziData} />
              <LuckyPeriods baziData={baziData} />
            </div>
          )}

        </main>
        
        <Footer />
      </div>
    );
  } catch (error) {
    console.error('App component error:', error);
    return <div>应用加载出错</div>;
  }

}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
