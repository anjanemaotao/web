// lunar.js - 农历日期计算工具

const Lunar = {
  fromYmd: function(year, month, day) {
    return {
      getYear: function() {
        return year;
      },
      getMonth: function() {
        return month;
      },
      getDay: function() {
        return day;
      },
      getSolar: function() {
        // 阴历转阳历实现
        // 使用固定偏移量进行简单转换
        // 注意：这是一个简化版本，实际应用中应该使用更准确的转换表
        const lunarOffset = 15; // 平均阴阳历偏移天数
        const baseDate = new Date(year, month - 1, day + lunarOffset);
        
        // 返回阳历日期对象
        return {
          getYear: () => baseDate.getFullYear(),
          getMonth: () => baseDate.getMonth() + 1,
          getDay: () => baseDate.getDate(),
          // 添加原始日期获取方法
          getRawDate: () => baseDate
        };
      },
      getMonthInGanZhi: function() {
        // 计算月干支
        const monthGan = ['丙', '丁', '戊', '己', '庚', '辛', '壬', '癸', '甲', '乙'];
        const monthZhi = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
        
        // 根据年份计算月干的偏移
        const yearGanIndex = (year - 4) % 10;
        const monthGanOffset = (yearGanIndex % 5) * 2;
        
        // 计算月干和月支
        const ganIndex = (monthGanOffset + month - 1) % 10;
        const zhiIndex = (month - 1) % 12;
        
        return monthGan[ganIndex] + monthZhi[zhiIndex];
      },
      
      getDayInGanZhi: function() {
        // 计算日干支
        const dayGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
        const dayZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
        
        // 使用简化的算法计算日期距离甲子日的天数
        const base = new Date(1900, 0, 31).getTime(); // 1900年1月31日为甲子日
        const current = new Date(year, month - 1, day).getTime();
        const days = Math.floor((current - base) / (24 * 60 * 60 * 1000));
        
        const ganIndex = days % 10;
        const zhiIndex = days % 12;
        
        return dayGan[ganIndex] + dayZhi[zhiIndex];
      }
    };
  }
};

module.exports = {
  Lunar: Lunar
};