function BirthInfo({ bazi, lunarDate, solarDate }) {
  try {
    const { t } = React.useContext(I18nContext);
    
    if (!bazi || !lunarDate) return null;
    
    // 生肖计算
    const getChineseZodiac = (year) => {
      const zodiacList = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
      return zodiacList[(year - 4) % 12];
    };
    
    // 虚岁计算（农历年份 + 1）
    const nominalAge = new Date().getFullYear() - lunarDate.year + 1;
    
    // 阴历日期格式化
    const formatLunarDate = (date) => {
      const yearMap = {
        '0': '零', '1': '一', '2': '二', '3': '三', '4': '四', 
        '5': '五', '6': '六', '7': '七', '8': '八', '9': '九'
      };
      
      const chineseMonths = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
      
      // 转换年份为中文
      let yearStr = '';
      date.year.toString().split('').forEach(digit => {
        yearStr += yearMap[digit];
      });
      
      // 获取月份
      const monthStr = chineseMonths[date.month - 1];
      
      // 获取日期
      const dayStr = getTraditionalChineseDay(date.day);
      
      return `${yearStr}年${monthStr}月${dayStr}`;
    };
    
    // 获取传统中文日期格式（初一、初二、十一、廿一等）
    const getTraditionalChineseDay = (day) => {
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
    };
    
    // 获取时辰名称
    const getChineseHour = (hour) => {
      const diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
      
      // 根据小时确定时辰索引
      let hourIndex;
      if (hour >= 23 || hour < 1) hourIndex = 0; // 子时 23:00-01:00
      else if (hour >= 1 && hour < 3) hourIndex = 1; // 丑时 01:00-03:00
      else if (hour >= 3 && hour < 5) hourIndex = 2; // 寅时 03:00-05:00
      else if (hour >= 5 && hour < 7) hourIndex = 3; // 卯时 05:00-07:00
      else if (hour >= 7 && hour < 9) hourIndex = 4; // 辰时 07:00-09:00
      else if (hour >= 9 && hour < 11) hourIndex = 5; // 巳时 09:00-11:00
      else if (hour >= 11 && hour < 13) hourIndex = 6; // 午时 11:00-13:00
      else if (hour >= 13 && hour < 15) hourIndex = 7; // 未时 13:00-15:00
      else if (hour >= 15 && hour < 17) hourIndex = 8; // 申时 15:00-17:00
      else if (hour >= 17 && hour < 19) hourIndex = 9; // 酉时 17:00-19:00
      else if (hour >= 19 && hour < 21) hourIndex = 10; // 戌时 19:00-21:00
      else hourIndex = 11; // 亥时 21:00-23:00
      
      return diZhi[hourIndex] + '时';
    };
    
    // 格式化小时为两位数
    const formatHour = (hour) => {
      return hour.toString().padStart(2, '0') + ':00';
    };
    
    // 计算节气信息
    const calculateSolarTerms = (year) => {
      // 这里使用简化的节气数据（实际应用中应该使用更准确的算法）
      // 1987年的节气数据作为示例
      const solarTerms = {
        '立春': { date: `${year}-02-04`, time: '06:05' },
        '雨水': { date: `${year}-02-19`, time: '01:57' },
        '惊蛰': { date: `${year}-03-06`, time: '10:53' },
        '春分': { date: `${year}-03-21`, time: '11:52' },
        '清明': { date: `${year}-04-05`, time: '15:44' },
        '谷雨': { date: `${year}-04-20`, time: '22:06' },
        '立夏': { date: `${year}-05-06`, time: '05:32' },
        '小满': { date: `${year}-05-21`, time: '14:50' },
        '芒种': { date: `${year}-06-06`, time: '01:58' },
        '夏至': { date: `${year}-06-22`, time: '01:23' },
        '小暑': { date: `${year}-07-07`, time: '11:50' },
        '大暑': { date: `${year}-07-23`, time: '10:11' },
        '立秋': { date: `${year}-08-08`, time: '02:02' },
        '处暑': { date: `${year}-08-23`, time: '17:21' },
        '白露': { date: `${year}-09-08`, time: '08:19' },
        '秋分': { date: `${year}-09-23`, time: '23:25' },
        '寒露': { date: `${year}-10-09`, time: '14:38' },
        '霜降': { date: `${year}-10-24`, time: '06:46' },
        '立冬': { date: `${year}-11-08`, time: '00:43' },
        '小雪': { date: `${year}-11-22`, time: '19:41' },
        '大雪': { date: `${year}-12-07`, time: '15:16' },
        '冬至': { date: `${year}-12-22`, time: '11:46' },
      };
      
      return solarTerms;
    };
    
    // 计算出生日期与前后节气的关系
    const calculateSolarTermRelations = (birthDate, year) => {
      const solarTerms = calculateSolarTerms(year);
      
      // 将出生日期和节气日期转换为时间戳进行比较
      const birthTimestamp = new Date(birthDate).getTime();
      
      // 找出出生日期之前和之后的节气
      let prevTerm = null;
      let prevTermDiff = Infinity;
      let nextTerm = null;
      let nextTermDiff = Infinity;
      let nextNextTerm = null;
      let nextNextTermDiff = Infinity;
      
      Object.entries(solarTerms).forEach(([term, data]) => {
        const termTimestamp = new Date(data.date + ' ' + data.time).getTime();
        const diffDays = Math.round((termTimestamp - birthTimestamp) / (24 * 60 * 60 * 1000));
        
        if (diffDays < 0 && Math.abs(diffDays) < prevTermDiff) {
          prevTerm = { name: term, date: data.date, time: data.time, diff: Math.abs(diffDays) };
          prevTermDiff = Math.abs(diffDays);
        } else if (diffDays >= 0 && diffDays < nextTermDiff) {
          nextTerm = { name: term, date: data.date, time: data.time, diff: diffDays };
          nextTermDiff = diffDays;
        } else if (diffDays > 0 && diffDays > nextTermDiff && diffDays < nextNextTermDiff) {
          nextNextTerm = { name: term, date: data.date, time: data.time, diff: diffDays };
          nextNextTermDiff = diffDays;
        }
      });
      
      return { prevTerm, nextTerm, nextNextTerm };
    };
    
    // 格式化阳历日期
    const formatSolarDate = (date) => {
      if (!date) return '';
      return `${date.year} 年 ${date.month} 月 ${date.day} 日`;
    };
    
    // 计算节气关系
    const birthDateStr = `${solarDate.year}-${String(solarDate.month).padStart(2, '0')}-${String(solarDate.day).padStart(2, '0')}`;
    const solarTermRelations = calculateSolarTermRelations(birthDateStr, solarDate.year);
    
    // 生肖
    const zodiac = getChineseZodiac(lunarDate.year);
    
    return (
      <div className="birth-info-section slide-in" data-name="birth-info">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="info-card info-card-decorated" data-name="basic-info">
            <h3 className="info-card-title">
              <i className="fas fa-user-circle info-icon"></i>
              <span>基本资料</span>
              <div className="title-underline"></div>
            </h3>
            <div className="info-card-content">
              <div className="info-item" data-name="zodiac-age">
                <span className="info-label"><i className="fas fa-dragon info-icon-small"></i>生肖：</span>
                <span className="info-value info-value-highlight">{zodiac}</span>
                <span className="info-divider"><i className="fas fa-circle-notch fa-xs"></i></span>
                <span className="info-label"><i className="fas fa-birthday-cake info-icon-small"></i>虚岁：</span>
                <span className="info-value info-value-highlight">{nominalAge} 岁</span>
              </div>
              
              <div className="info-item" data-name="lunar-birth">
                <span className="info-label"><i className="fas fa-moon info-icon-small"></i>阴历：</span>
                <span className="info-value">
                  <strong className="info-value-bold">{formatLunarDate(lunarDate)}</strong> {formatHour(lunarDate.hour)} <span className="chinese-hour-tag">{getChineseHour(lunarDate.hour)}</span>
                </span>
              </div>
              
              <div className="info-item" data-name="solar-birth">
                <span className="info-label"><i className="fas fa-sun info-icon-small"></i>阳历：</span>
                <span className="info-value"><strong className="info-value-bold">{formatSolarDate(solarDate)}</strong></span>
              </div>
            </div>
          </div>
          
          <div className="info-card info-card-decorated" data-name="solar-term-info">
            <h3 className="info-card-title">
              <i className="fas fa-calendar-alt info-icon"></i>
              <span>节气信息</span>
              <div className="title-underline"></div>
            </h3>
            <div className="info-card-content">
              <div className="info-item info-item-special" data-name="solar-term-relation">
                <div className="solar-term-timeline">
                  <i className="fas fa-hourglass-start timeline-icon"></i>
                  <div className="timeline-line"></div>
                  <span className="info-value info-value-highlight">
                    出生于{solarTermRelations.prevTerm ? <><span className="term-name">{solarTermRelations.prevTerm.name}</span><span className="term-diff">后 {solarTermRelations.prevTerm.diff} 天</span></> : ''}
                    {solarTermRelations.nextTerm ? <> <span className="term-name">{solarTermRelations.nextTerm.name}</span><span className="term-diff">前 {solarTermRelations.nextTerm.diff} 天</span></> : ''}
                    {solarTermRelations.nextNextTerm ? <> <span className="term-name">{solarTermRelations.nextNextTerm.name}</span><span className="term-diff">前 {solarTermRelations.nextNextTerm.diff} 天</span></> : ''}
                  </span>
                </div>
              </div>
              
              <div className="solar-terms-container">
                {solarTermRelations.prevTerm && (
                  <div className="info-item solar-term-item" data-name="solar-term-dates">
                    <span className="info-label"><i className="fas fa-history info-icon-small"></i>{solarTermRelations.prevTerm.name}：</span>
                    <span className="info-value info-value-date">
                      <i className="fas fa-calendar-day info-icon-inline"></i>
                      {solarTermRelations.prevTerm.date.split('-')[0] + ' 年 ' + solarTermRelations.prevTerm.date.split('-')[1] + ' 月 ' + solarTermRelations.prevTerm.date.split('-')[2] + ' 日'}
                      <i className="fas fa-clock info-icon-inline"></i>
                      {solarTermRelations.prevTerm.time}
                    </span>
                  </div>
                )}
                
                {solarTermRelations.nextTerm && (
                  <div className="info-item solar-term-item" data-name="solar-term-dates">
                    <span className="info-label"><i className="fas fa-forward info-icon-small"></i>{solarTermRelations.nextTerm.name}：</span>
                    <span className="info-value info-value-date">
                      <i className="fas fa-calendar-day info-icon-inline"></i>
                      {solarTermRelations.nextTerm.date.split('-')[0] + ' 年 ' + solarTermRelations.nextTerm.date.split('-')[1] + ' 月 ' + solarTermRelations.nextTerm.date.split('-')[2] + ' 日'}
                      <i className="fas fa-clock info-icon-inline"></i>
                      {solarTermRelations.nextTerm.time}
                    </span>
                  </div>
                )}
                
                {solarTermRelations.nextNextTerm && (
                  <div className="info-item solar-term-item" data-name="solar-term-dates">
                    <span className="info-label"><i className="fas fa-fast-forward info-icon-small"></i>{solarTermRelations.nextNextTerm.name}：</span>
                    <span className="info-value info-value-date">
                      <i className="fas fa-calendar-day info-icon-inline"></i>
                      {solarTermRelations.nextNextTerm.date.split('-')[0] + ' 年 ' + solarTermRelations.nextNextTerm.date.split('-')[1] + ' 月 ' + solarTermRelations.nextNextTerm.date.split('-')[2] + ' 日'}
                      <i className="fas fa-clock info-icon-inline"></i>
                      {solarTermRelations.nextNextTerm.time}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('BirthInfo component error:', error);
    reportError(error);
    return null;
  }
}
