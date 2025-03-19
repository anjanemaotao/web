function InputForm({ onCalculate }) {
  try {
    // 年份范围 (1900-2100)
    const yearOptions = Array.from({ length: 201 }, (_, i) => 1900 + i);
    
    // 月份选项
    const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);
    
    // 日期选项 (先设置为31天，后面会根据年月动态调整)
    const [dayOptions, setDayOptions] = React.useState(Array.from({ length: 31 }, (_, i) => i + 1));
    
    // 时辰选项
    const hourOptions = [
      { value: 0, label: "子时 (23:00-00:59)" },
      { value: 1, label: "丑时 (01:00-02:59)" },
      { value: 3, label: "寅时 (03:00-04:59)" },
      { value: 5, label: "卯时 (05:00-06:59)" },
      { value: 7, label: "辰时 (07:00-08:59)" },
      { value: 9, label: "巳时 (09:00-10:59)" },
      { value: 11, label: "午时 (11:00-12:59)" },
      { value: 13, label: "未时 (13:00-14:59)" },
      { value: 15, label: "申时 (15:00-16:59)" },
      { value: 17, label: "酉时 (17:00-18:59)" },
      { value: 19, label: "戌时 (19:00-20:59)" },
      { value: 21, label: "亥时 (21:00-22:59)" }
    ];
    
    // 表单状态
    const [formData, setFormData] = React.useState({
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
      hour: new Date().getHours(),
      isLunar: true,
      gender: "男"
    });
    
    // 表单错误状态
    const [errors, setErrors] = React.useState({});
    
    // 更新天数选项
    React.useEffect(() => {
      // 如果是农历，每个月最多30天
      if (formData.isLunar) {
        setDayOptions(Array.from({ length: 30 }, (_, i) => i + 1));
        if (formData.day > 30) {
          setFormData(prev => ({ ...prev, day: 30 }));
        }
        return;
      }
      
      // 如果是公历，根据年月计算天数
      const daysInMonth = new Date(formData.year, formData.month, 0).getDate();
      setDayOptions(Array.from({ length: daysInMonth }, (_, i) => i + 1));
      
      // 如果当前选择的日期超过了该月的最大天数，则调整为最大天数
      if (formData.day > daysInMonth) {
        setFormData(prev => ({ ...prev, day: daysInMonth }));
      }
    }, [formData.year, formData.month, formData.isLunar]);
    
    // 处理表单变化
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value, 10) : value)
      }));
    };
    
    // 表单提交处理
    const handleSubmit = (e) => {
      e.preventDefault();
      
      // 表单验证
      const newErrors = {};
      if (!formData.year || formData.year < 1900 || formData.year > 2100) {
        newErrors.year = "请输入1900-2100之间的年份";
      }
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      
      // 清除错误
      setErrors({});
      
      // 转换时辰为小时
      let hour = formData.hour;
      if (typeof hour === 'string') {
        hour = parseInt(hour, 10);
      }
      
      // 调用父组件的计算方法
      onCalculate({
        ...formData,
        hour
      });
    };
    
    return (
      <div data-name="input-form-container" className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 data-name="form-title" className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
          输入出生信息
        </h2>
        
        <form data-name="bazi-form" onSubmit={handleSubmit}>
          <div data-name="form-calendar-toggle" className="mb-4">
            <label data-name="calendar-toggle-label" className="flex items-center cursor-pointer">
              <div data-name="toggle-track" className="relative">
                <input
                  data-name="calendar-type-checkbox"
                  type="checkbox"
                  name="isLunar"
                  checked={formData.isLunar}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div data-name="toggle-bg" className={`block w-14 h-8 rounded-full transition ${formData.isLunar ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                <div data-name="toggle-dot" className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${formData.isLunar ? 'translate-x-6' : ''}`}></div>
              </div>
              <div data-name="toggle-label" className="ml-3 text-gray-700 font-medium">
                {formData.isLunar ? "阴历日期" : "阳历日期"}
              </div>
            </label>
          </div>
          
          <div data-name="form-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div data-name="form-year" className="mb-4">
              <label data-name="year-label" className="block text-sm font-medium text-gray-700 mb-1">
                年份
              </label>
              <select
                data-name="year-select"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 form-input"
              >
                {yearOptions.map(year => (
                  <option key={year} value={year}>{year}年</option>
                ))}
              </select>
              {errors.year && <p data-name="year-error" className="text-red-500 text-sm mt-1">{errors.year}</p>}
            </div>
            
            <div data-name="form-month" className="mb-4">
              <label data-name="month-label" className="block text-sm font-medium text-gray-700 mb-1">
                月份
              </label>
              <select
                data-name="month-select"
                name="month"
                value={formData.month}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 form-input"
              >
                {monthOptions.map(month => (
                  <option key={month} value={month}>{month}月</option>
                ))}
              </select>
            </div>
            
            <div data-name="form-day" className="mb-4">
              <label data-name="day-label" className="block text-sm font-medium text-gray-700 mb-1">
                日期
              </label>
              <select
                data-name="day-select"
                name="day"
                value={formData.day}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 form-input"
              >
                {dayOptions.map(day => (
                  <option key={day} value={day}>{day}日</option>
                ))}
              </select>
            </div>
            
            <div data-name="form-hour" className="mb-4">
              <label data-name="hour-label" className="block text-sm font-medium text-gray-700 mb-1">
                时辰
              </label>
              <select
                data-name="hour-select"
                name="hour"
                value={formData.hour}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 form-input"
              >
                {hourOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            <div data-name="form-gender" className="mb-4">
              <label data-name="gender-label" className="block text-sm font-medium text-gray-700 mb-1">
                性别
              </label>
              <div data-name="gender-options" className="flex space-x-4">
                <label data-name="gender-male" className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="男"
                    checked={formData.gender === "男"}
                    onChange={handleChange}
                    className="form-radio h-4 w-4 text-red-600"
                  />
                  <span className="ml-2 text-gray-700">男</span>
                </label>
                <label data-name="gender-female" className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="女"
                    checked={formData.gender === "女"}
                    onChange={handleChange}
                    className="form-radio h-4 w-4 text-pink-600"
                  />
                  <span className="ml-2 text-gray-700">女</span>
                </label>
              </div>
            </div>
          </div>
          
          <div data-name="form-submit" className="mt-6">
            <button
              data-name="calculate-button"
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              计算八字
            </button>
          </div>
        </form>
      </div>
    );
  } catch (error) {
    console.error("InputForm component error:", error);
    reportError(error);
    return <div>表单加载错误，请刷新页面重试</div>;
  }
}
