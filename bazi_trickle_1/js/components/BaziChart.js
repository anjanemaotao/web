function BaziChart({ baziData }) {
  try {
    if (!baziData || !baziData.bazi || !baziData.naYin || !baziData.tenGods) {
      console.error("BaziChart: Missing required data");
      return <div className="text-red-500 p-4">八字数据不完整，请检查输入</div>;
    }
    
    const { bazi, naYin, tenGods } = baziData;
    
    // 验证八字数据完整性
    const pillars = ["year", "month", "day", "hour"];
    const missingData = pillars.some(pillar => 
      !bazi[pillar] || !bazi[pillar].gan || !bazi[pillar].zhi ||
      !STEM_ELEMENTS[bazi[pillar].gan] || !BRANCH_ELEMENTS[bazi[pillar].zhi]
    );
    
    if (missingData) {
      console.error("BaziChart: Invalid bazi data structure");
      return <div className="text-red-500 p-4">八字数据格式错误，请重新输入</div>;
    }
    
    // 获取天干地支对应的五行属性
    const getStemElement = (stem) => STEM_ELEMENTS[stem];
    const getBranchElement = (branch) => BRANCH_ELEMENTS[branch];
    
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
    
    // 格式化地支藏干
    const formatHiddenStems = (zhi, position) => {
      const hiddenStems = BRANCH_HIDDEN_STEMS[zhi];
      const dayGan = bazi.day.gan;
      let gods;
      
      switch (position) {
        case "year":
          gods = tenGods.yearZhi;
          break;
        case "month":
          gods = tenGods.monthZhi;
          break;
        case "day":
          gods = tenGods.dayZhi;
          break;
        case "hour":
          gods = tenGods.hourZhi;
          break;
        default:
          gods = {};
      }
      
      return hiddenStems.map((stem, index) => {
        const element = getStemElement(stem);
        const god = gods[stem];
        return (
          <div key={index} data-name={`hidden-stem-${stem}`} className="text-xs mt-1 flex items-center justify-center">
            <span className={`${getElementClass(element)} mr-1`}>{stem}</span>
            <span className="opacity-75">({god})</span>
          </div>
        );
      });
    };
    
    return (
      <div data-name="bazi-chart-container" className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 data-name="chart-title" className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
          八字排盘
        </h2>
        
        <div data-name="chart-table" className="overflow-x-auto">
          <table data-name="bazi-table" className="w-full border-collapse">
            <thead data-name="table-header">
              <tr>
                <th className="p-2 border text-center bg-gray-50">柱位</th>
                <th className="p-2 border text-center bg-gray-50">年柱</th>
                <th className="p-2 border text-center bg-gray-50">月柱</th>
                <th className="p-2 border text-center bg-gray-50">日柱</th>
                <th className="p-2 border text-center bg-gray-50">时柱</th>
              </tr>
            </thead>
            <tbody data-name="table-body">
              {/* 天干行 */}
              <tr data-name="heavenly-stems-row">
                <td className="p-2 border text-center font-medium bg-gray-50">天干</td>
                <td className="p-2 border text-center chart-cell" data-name="year-stem-cell">
                  <div data-name="year-stem" className={`text-lg font-bold ${getElementClass(getStemElement(bazi.year.gan))}`}>
                    {bazi.year.gan}
                  </div>
                  <div data-name="year-stem-element" className="text-xs opacity-75">
                    ({getStemElement(bazi.year.gan)})
                  </div>
                  <div data-name="year-stem-god" className="text-xs mt-1">
                    {tenGods.yearGan}
                  </div>
                </td>
                <td className="p-2 border text-center chart-cell" data-name="month-stem-cell">
                  <div data-name="month-stem" className={`text-lg font-bold ${getElementClass(getStemElement(bazi.month.gan))}`}>
                    {bazi.month.gan}
                  </div>
                  <div data-name="month-stem-element" className="text-xs opacity-75">
                    ({getStemElement(bazi.month.gan)})
                  </div>
                  <div data-name="month-stem-god" className="text-xs mt-1">
                    {tenGods.monthGan}
                  </div>
                </td>
                <td className="p-2 border text-center chart-cell" data-name="day-stem-cell">
                  <div data-name="day-stem" className={`text-lg font-bold ${getElementClass(getStemElement(bazi.day.gan))}`}>
                    {bazi.day.gan}
                  </div>
                  <div data-name="day-stem-element" className="text-xs opacity-75">
                    ({getStemElement(bazi.day.gan)})
                  </div>
                  <div data-name="day-stem-god" className="text-xs mt-1">
                    日主
                  </div>
                </td>
                <td className="p-2 border text-center chart-cell" data-name="hour-stem-cell">
                  <div data-name="hour-stem" className={`text-lg font-bold ${getElementClass(getStemElement(bazi.hour.gan))}`}>
                    {bazi.hour.gan}
                  </div>
                  <div data-name="hour-stem-element" className="text-xs opacity-75">
                    ({getStemElement(bazi.hour.gan)})
                  </div>
                  <div data-name="hour-stem-god" className="text-xs mt-1">
                    {tenGods.hourGan}
                  </div>
                </td>
              </tr>
              
              {/* 地支行 */}
              <tr data-name="earthly-branches-row">
                <td className="p-2 border text-center font-medium bg-gray-50">地支</td>
                <td className="p-2 border text-center chart-cell" data-name="year-branch-cell">
                  <div data-name="year-branch" className={`text-lg font-bold ${getElementClass(getBranchElement(bazi.year.zhi))}`}>
                    {bazi.year.zhi}
                  </div>
                  <div data-name="year-branch-element" className="text-xs opacity-75">
                    ({getBranchElement(bazi.year.zhi)})
                  </div>
                  <div data-name="year-branch-hidden-stems" className="mt-2 text-xs border-t pt-1">
                    {formatHiddenStems(bazi.year.zhi, "year")}
                  </div>
                </td>
                <td className="p-2 border text-center chart-cell" data-name="month-branch-cell">
                  <div data-name="month-branch" className={`text-lg font-bold ${getElementClass(getBranchElement(bazi.month.zhi))}`}>
                    {bazi.month.zhi}
                  </div>
                  <div data-name="month-branch-element" className="text-xs opacity-75">
                    ({getBranchElement(bazi.month.zhi)})
                  </div>
                  <div data-name="month-branch-hidden-stems" className="mt-2 text-xs border-t pt-1">
                    {formatHiddenStems(bazi.month.zhi, "month")}
                  </div>
                </td>
                <td className="p-2 border text-center chart-cell" data-name="day-branch-cell">
                  <div data-name="day-branch" className={`text-lg font-bold ${getElementClass(getBranchElement(bazi.day.zhi))}`}>
                    {bazi.day.zhi}
                  </div>
                  <div data-name="day-branch-element" className="text-xs opacity-75">
                    ({getBranchElement(bazi.day.zhi)})
                  </div>
                  <div data-name="day-branch-hidden-stems" className="mt-2 text-xs border-t pt-1">
                    {formatHiddenStems(bazi.day.zhi, "day")}
                  </div>
                </td>
                <td className="p-2 border text-center chart-cell" data-name="hour-branch-cell">
                  <div data-name="hour-branch" className={`text-lg font-bold ${getElementClass(getBranchElement(bazi.hour.zhi))}`}>
                    {bazi.hour.zhi}
                  </div>
                  <div data-name="hour-branch-element" className="text-xs opacity-75">
                    ({getBranchElement(bazi.hour.zhi)})
                  </div>
                  <div data-name="hour-branch-hidden-stems" className="mt-2 text-xs border-t pt-1">
                    {formatHiddenStems(bazi.hour.zhi, "hour")}
                  </div>
                </td>
              </tr>
              
              {/* 纳音行 */}
              <tr data-name="nayin-row">
                <td className="p-2 border text-center font-medium bg-gray-50">纳音</td>
                <td className="p-2 border text-center" data-name="year-nayin-cell">
                  {naYin.year}
                </td>
                <td className="p-2 border text-center" data-name="month-nayin-cell">
                  {naYin.month}
                </td>
                <td className="p-2 border text-center" data-name="day-nayin-cell">
                  {naYin.day}
                </td>
                <td className="p-2 border text-center" data-name="hour-nayin-cell">
                  {naYin.hour}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div data-name="birth-info" className="mt-4 text-center text-gray-600">
          <div data-name="solar-date">
            公历: {bazi.solarDate.year}年{bazi.solarDate.month}月{bazi.solarDate.day}日 {bazi.solarDate.hour}时
          </div>
          <div data-name="lunar-date">
            农历: {bazi.lunarDate.lunarYear}年{bazi.lunarDate.isLeap ? '闰' : ''}{bazi.lunarDate.lunarMonth}月{bazi.lunarDate.lunarDay}日
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("BaziChart component error:", error);
    reportError(error);
    return <div>八字排盘加载错误，请刷新页面重试</div>;
  }
}
