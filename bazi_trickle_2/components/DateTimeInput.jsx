import React from 'react';
import { LunarCalendar } from '../utils/lunarCalendar.js';

export function DateTimeInput({ onCalculate }) {
  try {
    const [formData, setFormData] = React.useState({
      year: 1990,
      month: 1,
      day: 1,
      hour: 0,
      calendarType: "lunar", // lunar or solar
      gender: "male" // male or female
    });

    const [formErrors, setFormErrors] = React.useState({});
    const [isCalculating, setIsCalculating] = React.useState(false);

    const lunarCalendar = LunarCalendar();
    const { branchToHour, earthlyBranches } = lunarCalendar;

    // 生成年份选项
    const generateYearOptions = () => {
      const options = [];
      for (let year = 1900; year <= 2100; year++) {
        options.push(
          <option key={year} value={year} data-name={`year-option-${year}`}>
            {year}年
          </option>
        );
      }
      return options;
    };

    // 生成月份选项
    const generateMonthOptions = () => {
      const options = [];
      for (let month = 1; month <= 12; month++) {
        options.push(
          <option key={month} value={month} data-name={`month-option-${month}`}>
            {month}月
          </option>
        );
      }
      return options;
    };

    // 生成日期选项
    const generateDayOptions = () => {
      const options = [];
      // 简单处理，每月31天
      for (let day = 1; day <= 31; day++) {
        options.push(
          <option key={day} value={day} data-name={`day-option-${day}`}>
            {day}日
          </option>
        );
      }
      return options;
    };

    // 生成时辰选项
    const generateHourOptions = () => {
      const options = [];
      const branches = lunarCalendar.earthlyBranches;
      
      branches.forEach((branch, index) => {
        const hourRange = branchToHour[branch];
        options.push(
          <option key={index} value={index * 2} data-name={`hour-option-${branch}`}>
            {branch}时 ({hourRange})
          </option>
        );
      });
      
      return options;
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      
      if (name === "calendarType") {
        // 当切换日历类型时，转换日期
        const currentDate = formData;
        let convertedDate;
        
        if (value === "solar" && currentDate.calendarType === "lunar") {
          // 从阴历转换为阳历
          convertedDate = lunarCalendar.lunarToSolar(currentDate.year, currentDate.month, currentDate.day);
        } else if (value === "lunar" && currentDate.calendarType === "solar") {
          // 从阳历转换为阴历
          convertedDate = lunarCalendar.solarToLunar(currentDate.year, currentDate.month, currentDate.day);
        }
        
        if (convertedDate && !convertedDate.error) {
          setFormData({
            ...formData,
            year: convertedDate.year,
            month: convertedDate.month,
            day: convertedDate.day,
            calendarType: value
          });
        } else {
          setFormData({
            ...formData,
            calendarType: value
          });
          if (convertedDate?.error) {
            setFormErrors({ general: convertedDate.error });
          }
        }
      } else {
        setFormData({
          ...formData,
          [name]: name === "gender" ? value : parseInt(value, 10)
        });
      }
    };

    const validateForm = () => {
      const errors = {};
      
      if (formData.year < 1900 || formData.year > 2100) {
        errors.year = "年份必须在1900-2100之间";
      }
      
      if (formData.month < 1 || formData.month > 12) {
        errors.month = "月份必须在1-12之间";
      }
      
      if (formData.day < 1 || formData.day > 31) {
        errors.day = "日期必须在1-31之间";
      }
      
      setFormErrors(errors);
      return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      
      if (!validateForm()) {
        return;
      }
      
      setIsCalculating(true);
      
      // 转换为阴历日期（如果输入是阳历）
      let lunarDate = formData;
      
      if (formData.calendarType === "solar") {
        const converted = lunarCalendar.solarToLunar(formData.year, formData.month, formData.day);
        if (converted.error) {
          setFormErrors({ general: converted.error });
          setIsCalculating(false);
          return;
        }
        
        lunarDate = {
          ...formData,
          year: converted.year,
          month: converted.month,
          day: converted.day
        };
      }
      
      // 延迟一下，显示加载状态
      setTimeout(() => {
        onCalculate({
          ...lunarDate,
          gender: formData.gender
        });
        setIsCalculating(false);
      }, 800);
    };

    return (
      <div data-name="date-time-input" className="bg-paper p-6 rounded-lg shadow-lg animate-fade-in">
        <h2 data-name="input-title" className="text-xl font-bold mb-4 text-mystic">
          <i className="fas fa-calendar-alt mr-2"></i> 输入出生信息
        </h2>
        
        <form data-name="input-form" onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="flex flex-wrap -mx-2">
              <div data-name="calendar-type-selector" className="w-full md:w-1/2 px-2 mb-4">
                <label className="block text-gray-300 mb-2">日历类型</label>
                <div className="flex">
                  <label className="mr-4 flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="calendarType"
                      value="lunar"
                      checked={formData.calendarType === "lunar"}
                      onChange={handleInputChange}
                      className="mr-2"
                      data-name="lunar-radio"
                    />
                    阴历
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="calendarType"
                      value="solar"
                      checked={formData.calendarType === "solar"}
                      onChange={handleInputChange}
                      className="mr-2"
                      data-name="solar-radio"
                    />
                    阳历
                  </label>
                </div>
              </div>
              
              <div data-name="gender-selector" className="w-full md:w-1/2 px-2 mb-4">
                <label className="block text-gray-300 mb-2">性别</label>
                <div className="flex">
                  <label className="mr-4 flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === "male"}
                      onChange={handleInputChange}
                      className="mr-2"
                      data-name="male-radio"
                    />
                    男
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === "female"}
                      onChange={handleInputChange}
                      className="mr-2"
                      data-name="female-radio"
                    />
                    女
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex flex-wrap -mx-2">
              <div data-name="year-selector" className="w-full sm:w-1/2 md:w-1/4 px-2 mb-4">
                <label className="block text-gray-300 mb-2">年</label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  data-name="year-select"
                >
                  {generateYearOptions()}
                </select>
                {formErrors.year && <p className="text-red-500 mt-1 text-sm">{formErrors.year}</p>}
              </div>
              
              <div data-name="month-selector" className="w-full sm:w-1/2 md:w-1/4 px-2 mb-4">
                <label className="block text-gray-300 mb-2">月</label>
                <select
                  name="month"
                  value={formData.month}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  data-name="month-select"
                >
                  {generateMonthOptions()}
                </select>
                {formErrors.month && <p className="text-red-500 mt-1 text-sm">{formErrors.month}</p>}
              </div>
              
              <div data-name="day-selector" className="w-full sm:w-1/2 md:w-1/4 px-2 mb-4">
                <label className="block text-gray-300 mb-2">日</label>
                <select
                  name="day"
                  value={formData.day}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  data-name="day-select"
                >
                  {generateDayOptions()}
                </select>
                {formErrors.day && <p className="text-red-500 mt-1 text-sm">{formErrors.day}</p>}
              </div>
              
              <div data-name="hour-selector" className="w-full sm:w-1/2 md:w-1/4 px-2 mb-4">
                <label className="block text-gray-300 mb-2">时辰</label>
                <select
                  name="hour"
                  value={formData.hour}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  data-name="hour-select"
                >
                  {generateHourOptions()}
                </select>
              </div>
            </div>
          </div>
          
          {formErrors.general && (
            <div className="mb-4 p-2 bg-red-900 text-white rounded" data-name="general-error">
              {formErrors.general}
            </div>
          )}
          
          <div className="text-center">
            <button
              type="submit"
              className="bg-gradient-to-r from-yellow-600 to-red-800 hover:from-yellow-500 hover:to-red-700 text-white font-bold py-2 px-6 rounded-full shadow-lg transform transition hover:scale-105 focus:outline-none animate-pulse-glow"
              disabled={isCalculating}
              data-name="calculate-button"
            >
              {isCalculating ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  计算中...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <i className="fas fa-calculator mr-2"></i>
                  推算命盘
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    );
  } catch (error) {
    console.error('DateTimeInput component error:', error);
    return <div>输入组件加载出错</div>;
  }
}
