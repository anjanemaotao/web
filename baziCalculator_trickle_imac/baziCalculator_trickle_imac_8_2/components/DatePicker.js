function DatePicker({ onCalculate }) {
  try {
    const { t } = React.useContext(I18nContext);
    const [calendarType, setCalendarType] = React.useState('lunar'); // 'lunar' 阴历 or 'solar' 阳历
    const [lunarDate, setLunarDate] = React.useState({
      year: new Date().getFullYear(),
      month: 1,
      day: 1,
      hour: 0
    });
    const [solarDate, setSolarDate] = React.useState(null);
    const [displayLunarDate, setDisplayLunarDate] = React.useState(null); // 用于显示的阴历日期（阳历模式下）
    const [loading, setLoading] = React.useState(false);
    
    const calculator = BaziCalculator();
    
    // 生成年份选项
    const yearOptions = [];
    const currentYear = new Date().getFullYear();
    for (let year = 1900; year <= currentYear; year++) {
      const zodiac = getChineseZodiac(year);
      yearOptions.push({
        value: year,
        label: `${year}(${t(zodiac)})`
      });
    }
    
    // 根据阴历/阳历生成月份选项
    const getMonthOptions = () => {
      const options = [];
      for (let month = 1; month <= 12; month++) {
        if (calendarType === 'lunar') {
          options.push({
            value: month,
            label: getChineseMonth(month)
          });
        } else {
          options.push({
            value: month,
            label: `${month} 月`
          });
        }
      }
      return options;
    };
    
    // 根据阴历/阳历和年月生成日期选项
    const getDayOptions = () => {
      const options = [];
      let maxDay = 31; // 默认值
      
      // 计算实际天数
      if (calendarType === 'lunar') {
        // 阴历月份天数计算 (使用lunar-javascript库)
        try {
          // 使用正确的API获取农历月天数
          const lunar = Lunar.fromYmd(lunarDate.year, lunarDate.month, 1);
          // 尝试使用不同的方法获取农历月天数
          if (typeof lunar.getDaysInMonth === 'function') {
            maxDay = lunar.getDaysInMonth();
          } else if (typeof lunar.getMonthDays === 'function') {
            maxDay = lunar.getMonthDays();
          } else {
            // 备用方法
            const nextMonth = lunarDate.month === 12 ? 
              { year: lunarDate.year + 1, month: 1 } : 
              { year: lunarDate.year, month: lunarDate.month + 1 };
            const nextMonthLunar = Lunar.fromYmd(nextMonth.year, nextMonth.month, 1);
            const thisMonthSolar = lunar.getSolar();
            const nextMonthSolar = nextMonthLunar.getSolar();
            
            // 计算两个月第一天之间的天数差
            const thisMonthDate = new Date(thisMonthSolar.getYear(), thisMonthSolar.getMonth() - 1, thisMonthSolar.getDay());
            const nextMonthDate = new Date(nextMonthSolar.getYear(), nextMonthSolar.getMonth() - 1, nextMonthSolar.getDay());
            const diffTime = nextMonthDate - thisMonthDate;
            maxDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          }
        } catch (error) {
          console.error("计算阴历月天数错误:", error);
          reportError(error);
          maxDay = 30; // 默认30天
        }
      } else {
        // 阳历月份天数计算
        const daysInMonth = new Date(lunarDate.year, lunarDate.month, 0).getDate();
        maxDay = daysInMonth;
      }
      
      for (let day = 1; day <= maxDay; day++) {
        if (calendarType === 'lunar') {
          options.push({
            value: day,
            label: getTraditionalChineseDay(day)
          });
        } else {
          options.push({
            value: day,
            label: `${day} 日`
          });
        }
      }
      return options;
    };
    
    // 生成时辰选项
    const getHourOptions = () => {
      const hourOptions = [23, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21];
      const hourRanges = [
        "23:00-01:00", // 子时
        "01:00-03:00", // 丑时
        "03:00-05:00", // 寅时
        "05:00-07:00", // 卯时
        "07:00-09:00", // 辰时
        "09:00-11:00", // 巳时
        "11:00-13:00", // 午时
        "13:00-15:00", // 未时
        "15:00-17:00", // 申时
        "17:00-19:00", // 酉时
        "19:00-21:00", // 戌时
        "21:00-23:00"  // 亥时
      ];
      
      return hourOptions.map((hour, index) => ({
        value: hour,
        label: `${hourRanges[index]} (${t(calculator.diZhi[index])})`
      }));
    };
    
    // 处理日期类型切换
    const handleCalendarTypeChange = (type) => {
      if (type === calendarType) return;
      
      setCalendarType(type);
      
      // 当切换日期类型时，保持日期一致
      if (type === 'lunar' && solarDate) {
        // 阳历转阴历
        const newLunarDate = calculator.solarToLunar(solarDate);
        if (newLunarDate) {
          setLunarDate(newLunarDate);
          setDisplayLunarDate(null); // 阴历模式不需要额外显示
        }
      } else if (type === 'solar' && lunarDate) {
        // 阴历转阳历
        const newSolarDate = calculator.lunarToSolar(lunarDate);
        if (newSolarDate) {
          setSolarDate(newSolarDate);
          setLunarDate(newSolarDate); // 更新当前使用的日期
          setDisplayLunarDate(lunarDate); // 保存原始阴历日期用于显示
        }
      }
    };
    
    // 处理输入变化
    const handleInputChange = (field, value) => {
      const numValue = parseInt(value, 10);
      
      // 更新当前使用的日期
      setLunarDate(prev => {
        const newDate = {
          ...prev,
          [field]: numValue
        };
        
        // 如果是阳历模式，直接更新solarDate
        if (calendarType === 'solar') {
          setSolarDate(newDate);
          
          // 同时更新对应的阴历日期显示
          try {
            const newLunar = calculator.solarToLunar(newDate);
            if (newLunar) {
              setDisplayLunarDate(newLunar); // 更新显示用的阴历日期
            }
            return newDate; // 在阳历模式下，lunarDate存储的是当前选择的阳历
          } catch (error) {
            console.error("阳历转阴历错误:", error);
            reportError(error);
            return newDate;
          }
        } else {
          // 阴历模式，更新对应的阳历日期显示
          try {
            const newSolar = calculator.lunarToSolar(newDate);
            setSolarDate(newSolar);
          } catch (error) {
            console.error("阴历转阳历错误:", error);
            reportError(error);
          }
          return newDate;
        }
      });
    };
    
    // 处理计算按钮点击
    const handleCalculate = () => {
      // 添加百度统计事件跟踪
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '按钮', '点击', '推算八字']);
      }
      // 添加GA4事件跟踪
      if (window.gtag) {
        window.gtag('event', 'calculate_bazi', {
          'event_category': '按钮',
          'event_label': '推算八字'
        });
      }
     
      setLoading(true);
      
      // 模拟异步计算，添加2秒左右的动画延迟
      setTimeout(() => {
        // 如果是阳历模式，先转换为阴历再计算
        if (calendarType === 'solar') {
          // 使用已经计算好的displayLunarDate
          if (displayLunarDate) {
            onCalculate(displayLunarDate);
          } else {
            // 如果没有，重新计算一次
            const lunarDateForCalc = calculator.solarToLunar(lunarDate);
            if (lunarDateForCalc) {
              onCalculate(lunarDateForCalc);
            } else {
              console.error("阳历转阴历失败");
              reportError(new Error("阳历转阴历失败"));
            }
          }
        } else {
          // 阴历模式直接计算
          onCalculate(lunarDate);
        }
        setLoading(false);
      }, 2000); // 延迟2秒显示结果
    };
    
    // 初始化日期
    React.useEffect(() => {
      try {
        if (calendarType === 'lunar') {
          const initialSolarDate = calculator.lunarToSolar(lunarDate);
          setSolarDate(initialSolarDate);
        } else {
          setSolarDate(lunarDate);
          const initialLunarDate = calculator.solarToLunar(lunarDate);
          setDisplayLunarDate(initialLunarDate);
        }
      } catch (error) {
        console.error("初始化日期错误:", error);
        reportError(error);
      }
    }, []);
    
    // 获取中文月份
    function getChineseMonth(month) {
      const chineseMonths = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
      return `${chineseMonths[month - 1]}月`;
    }
    
    // 获取传统中文日期格式（初一、初二、十一、廿一等）
    function getTraditionalChineseDay(day) {
      const prefixes = ['初', '十', '廿', '三'];
      const chineseDigits = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
      
      if (day === 1) {
        return '初一';
      } else if (day <= 10) {
        return `初${chineseDigits[day - 1]}`;
      } else if (day === 10) {
        return '初十';
      } else if (day < 20) {
        return `十${chineseDigits[day - 11]}`;
      } else if (day === 20) {
        return '二十';
      } else if (day < 30) {
        return `廿${chineseDigits[day - 21]}`;
      } else if (day === 30) {
        return '三十';
      } else {
        return '三十一';
      }
    }
    
    // 获取中文日期（仅用于显示，不用于选择）
    function getChineseDay(day) {
      const chineseDigits = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
      if (day <= 10) {
        return `${chineseDigits[day - 1]}日`;
      } else if (day < 20) {
        return `十${chineseDigits[day - 11]}日`;
      } else if (day === 20) {
        return `${chineseDigits[1]}十日`;
      } else if (day < 30) {
        return `${chineseDigits[1]}十${chineseDigits[day - 21]}日`;
      } else if (day === 30) {
        return `${chineseDigits[2]}十日`;
      } else {
        return `${chineseDigits[2]}十${chineseDigits[0]}日`;
      }
    }
    
    // 获取生肖
    function getChineseZodiac(year) {
      const zodiacList = ['rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'];
      return zodiacList[(year - 4) % 12];
    }
    
    const monthOptions = getMonthOptions();
    const dayOptions = getDayOptions();
    const hourOptions = getHourOptions();
    
    return (
      <div className="card fade-in" data-name="date-picker">
        <h2 className="text-xl font-bold mb-4">{t('dateInputSection')}</h2>
        
        <div className="calendar-type-selector mb-4" data-name="calendar-type-selector">
          <div className="flex border rounded-lg overflow-hidden">
            <button 
              className={`flex-1 py-2 px-4 calendar-type-btn ${calendarType === 'lunar' ? 'active' : ''}`}
              onClick={() => handleCalendarTypeChange('lunar')}
              data-name="lunar-selector"
            >
              {t('lunarCalendar')}
            </button>
            <button 
              className={`flex-1 py-2 px-4 calendar-type-btn ${calendarType === 'solar' ? 'active' : ''}`}
              onClick={() => handleCalendarTypeChange('solar')}
              data-name="solar-selector"
            >
              {t('solarCalendar')}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="form-group" data-name="year-select-group">
            <label htmlFor="year">{t('yearLabel')}</label>
            <select
              id="year"
              className="form-control"
              value={lunarDate.year}
              onChange={e => handleInputChange('year', e.target.value)}
              data-name="year-select"
            >
              {yearOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group" data-name="month-select-group">
            <label htmlFor="month">{t('monthLabel')}</label>
            <select
              id="month"
              className="form-control"
              value={lunarDate.month}
              onChange={e => handleInputChange('month', e.target.value)}
              data-name="month-select"
            >
              {monthOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group" data-name="day-select-group">
            <label htmlFor="day">{t('dayLabel')}</label>
            <select
              id="day"
              className="form-control"
              value={lunarDate.day}
              onChange={e => handleInputChange('day', e.target.value)}
              data-name="day-select"
            >
              {dayOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group" data-name="hour-select-group">
            <label htmlFor="hour">{t('hourLabel')}</label>
            <select
              id="hour"
              className="form-control"
              value={lunarDate.hour}
              onChange={e => handleInputChange('hour', e.target.value)}
              data-name="hour-select"
            >
              {hourOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
        
        {solarDate && calendarType === 'lunar' && (
          <div className="mt-4 p-3 bg-opacity-50 bg-gray-100 rounded-md" data-name="solar-date-display">
            <h3 className="text-lg font-semibold mb-2">{t('solarDateSection')}</h3>
            <p className="text-gray-700">
              {solarDate.year}-{solarDate.month}-{solarDate.day}
            </p>
          </div>
        )}
        
        {calendarType === 'solar' && displayLunarDate && (
          <div className="mt-4 p-3 bg-opacity-50 bg-gray-100 rounded-md" data-name="lunar-date-display">
            <h3 className="text-lg font-semibold mb-2">{t('lunarDateSection')}</h3>
            <p className="text-gray-700">
              {displayLunarDate.year} 年 {getChineseMonth(displayLunarDate.month)} {getTraditionalChineseDay(displayLunarDate.day)}
            </p>
          </div>
        )}
        
        <div className="mt-6 text-center" data-name="calculate-button-container">
          <button 
            className="btn pulse" 
            onClick={handleCalculate} 
            disabled={loading}
            data-name="calculate-button"
          >
            {loading ? (
              <div className="inline-flex items-center">
                <span className="mr-2">{t('loading')}</span>
                <span className="spin inline-block">
                  <i className="fas fa-circle-notch"></i>
                </span>
              </div>
            ) : t('calculateButton')}
          </button>
        </div>
      </div>
    );
  } catch (error) {
    console.error('DatePicker component error:', error);
    reportError(error);
    return null;
  }
}
