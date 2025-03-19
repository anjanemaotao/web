function FateChart({ baziData }) {
  try {
    if (!baziData || !baziData.bazi) {
      return null;
    }
    
    const { bazi, dayMasterAnalysis } = baziData;
    const currentYear = new Date().getFullYear();
    
    // 计算大运起始年
    const birthYear = bazi.solarDate.year;
    const gender = baziData.gender || "男"; // 默认男性
    const birthMonth = bazi.solarDate.month;
    
    // 根据性别和出生月份确定起运年龄
    // 男阳女阴顺推，男阴女阳逆推
    const isDayMasterYin = ["乙", "丁", "己", "辛", "癸"].includes(bazi.day.gan);
    const isForward = (gender === "男" && !isDayMasterYin) || (gender === "女" && isDayMasterYin);
    
    // 计算起运年龄：出生月份 + 1，不足1年的按1年计
    const monthsToStart = Math.max(1, 13 - birthMonth);
    const startAge = Math.ceil(monthsToStart / 12);
    
    // 获取起运年份
    const fateStartYear = birthYear + startAge;
    
    // 生成大运数组（8个大运，每个10年）
    const fateYears = Array.from({ length: 8 }, (_, i) => {
      const startYear = fateStartYear + i * 10;
      const endYear = startYear + 9;
      
      // 计算大运天干地支
      const monthGanIndex = CELESTIAL_STEMS.indexOf(bazi.month.gan);
      const monthZhiIndex = TERRESTRIAL_BRANCHES.indexOf(bazi.month.zhi);
      
      let ganIndex, zhiIndex;
      
      if (isForward) {
        // 顺行
        ganIndex = (monthGanIndex + i + 1) % 10;
        zhiIndex = (monthZhiIndex + i + 1) % 12;
      } else {
        // 逆行
        ganIndex = (monthGanIndex - i - 1 + 10) % 10;
        zhiIndex = (monthZhiIndex - i - 1 + 12) % 12;
      }
      
      const gan = CELESTIAL_STEMS[ganIndex];
      const zhi = TERRESTRIAL_BRANCHES[zhiIndex];
      
      // 计算大运与日主的关系
      const dayGan = bazi.day.gan;
      const dayMasterElement = STEM_ELEMENTS[dayGan];
      const fateElement = STEM_ELEMENTS[gan];
      
      // 计算大运五行与日主的关系
      let relationship = "";
      if (fateElement === dayMasterElement) {
        relationship = "比劫";
      } else if (ELEMENT_CYCLE["生"][dayMasterElement] === fateElement) {
        relationship = "食伤";
      } else if (ELEMENT_CYCLE["克"][dayMasterElement] === fateElement) {
        relationship = "官杀";
      } else if (ELEMENT_CYCLE["被生"][dayMasterElement] === fateElement) {
        relationship = "印枭";
      } else if (ELEMENT_CYCLE["被克"][dayMasterElement] === fateElement) {
        relationship = "财星";
      }
      
      // 判断大运是否有利
      let isFavorable = false;
      if (dayMasterAnalysis.strength === "日主过强") {
        // 日主过强，官杀财星有利
        isFavorable = ["官杀", "财星"].includes(relationship);
      } else if (dayMasterAnalysis.strength === "日主过弱") {
        // 日主过弱，印枭比劫有利
        isFavorable = ["印枭", "比劫"].includes(relationship);
      } else {
        // 日主中和，根据具体情况判断
        isFavorable = Math.random() > 0.5; // 简化处理，实际应该根据八字具体情况
      }
      
      return {
        startYear,
        endYear,
        age: startAge + i * 10,
        gan,
        zhi,
        ganZhi: gan + zhi,
        element: STEM_ELEMENTS[gan],
        relationship,
        isFavorable,
        isCurrent: currentYear >= startYear && currentYear <= endYear
      };
    });
    
    // 生成流年信息（当前年份前后各5年）
    const yearsRange = 5;
    const yearlyFates = Array.from({ length: yearsRange * 2 + 1 }, (_, i) => {
      const year = currentYear - yearsRange + i;
      
      // 计算流年天干地支
      const yearGanIndex = (year - 4) % 10; // 1984年为甲子年
      const yearZhiIndex = (year - 4) % 12;
      
      const gan = CELESTIAL_STEMS[yearGanIndex];
      const zhi = TERRESTRIAL_BRANCHES[yearZhiIndex];
      
      // 计算流年与日主的关系
      const dayGan = bazi.day.gan;
      const godRelation = TEN_GODS[dayGan][gan];
      
      return {
        year,
        gan,
        zhi,
        ganZhi: gan + zhi,
        element: STEM_ELEMENTS[gan],
        godRelation,
        isCurrent: year === currentYear
      };
    });
    
    // 获取五行对应的样式类
    const getElementClass = (element) => {
      const classes = {
        木: "element-wood",
        火: "element-fire",
        土: "element-earth",
        金: "element-metal",
        水: "element-water"
      };
      return classes[element] || "";
    };
    
    // 获取五行对应的背景类
    const getElementBgClass = (element) => {
      const classes = {
        木: "bg-element-wood",
        火: "bg-element-fire",
        土: "bg-element-earth",
        金: "bg-element-metal",
        水: "bg-element-water"
      };
      return classes[element] || "";
    };
    
    return (
      <div data-name="fate-chart-container" className="bg-chinese-bg rounded-lg shadow-md p-6 mb-8">
        <h2 data-name="chart-title" className="text-xl font-semibold mb-4 text-chinese-text border-b pb-2 flex items-center">
          <i className="fas fa-compass mr-2 text-chinese-primary"></i>
          大运流年
        </h2>
        
        {/* 大运显示 */}
        <div data-name="fate-periods" className="mb-8">
          <h3 data-name="fate-periods-title" className="text-lg font-medium mb-3 text-chinese-text">
            大运
          </h3>
          
          <div data-name="fate-periods-scroll" className="overflow-x-auto">
            <div data-name="fate-periods-container" className="flex min-w-max">
              {fateYears.map((fate, index) => (
                <div 
                  key={index} 
                  data-name={`fate-period-${index}`} 
                  className={`w-40 p-4 border-r last:border-r-0 text-center ${fate.isCurrent ? 'bg-chinese-highlight bg-opacity-20' : ''} ${fate.isFavorable ? 'border-b-2 border-chinese-primary' : 'border-b-2 border-chinese-secondary'}`}
                >
                  <div data-name="fate-years" className="text-sm text-chinese-text mb-1">
                    {fate.startYear}-{fate.endYear} ({fate.age}岁起)
                  </div>
                  <div data-name="fate-ganzhi" className="text-xl font-bold mb-1">
                    <span className={getElementClass(fate.element)}>{fate.ganZhi}</span>
                  </div>
                  <div data-name="fate-element" className="text-sm mb-1">
                    ({fate.element}五行)
                  </div>
                  <div data-name={`fate-relationship-${index}`} className={`mt-1 text-sm px-2 py-1 rounded inline-block ${fate.isFavorable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {fate.relationship} {fate.isFavorable ? '(吉)' : '(忌)'}
                  </div>
                  {fate.isCurrent && (
                    <div data-name="current-indicator" className="mt-2 text-xs text-chinese-primary font-medium">
                      当前大运
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* 流年显示 */}
        <div data-name="yearly-fates">
          <h3 data-name="yearly-fates-title" className="text-lg font-medium mb-3 text-chinese-text">
            流年
          </h3>
          
          <div data-name="yearly-fates-scroll" className="overflow-x-auto">
            <div data-name="yearly-fates-container" className="flex min-w-max">
              {yearlyFates.map((yearFate, index) => (
                <div 
                  key={index} 
                  data-name={`yearly-fate-${index}`} 
                  className={`w-32 p-3 border-r last:border-r-0 text-center ${yearFate.isCurrent ? 'bg-chinese-highlight bg-opacity-20' : ''}`}
                >
                  <div data-name="year-number" className="text-sm text-chinese-text mb-1">
                    {yearFate.year}年
                  </div>
                  <div data-name="year-ganzhi" className="text-lg font-bold mb-1">
                    <span className={getElementClass(yearFate.element)}>{yearFate.ganZhi}</span>
                  </div>
                  <div data-name="year-element" className="text-xs mb-1">
                    ({yearFate.element}五行)
                  </div>
                  <div data-name={`year-god-relation-${index}`} className="mt-1 text-xs px-2 py-1 rounded inline-block bg-gray-100">
                    {yearFate.godRelation}
                  </div>
                  {yearFate.isCurrent && (
                    <div data-name="current-year-indicator" className="mt-1 text-xs text-chinese-primary font-medium">
                      本年
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div data-name="fate-note" className="mt-6 text-sm text-gray-500 border-t pt-3">
          <p>注：大运与流年分析仅供参考，实际运势受多种因素影响，应结合具体情况综合判断。</p>
        </div>
      </div>
    );
  } catch (error) {
    console.error("FateChart component error:", error);
    reportError(error);
    return <div>大运流年加载错误，请刷新页面重试</div>;
  }
}
