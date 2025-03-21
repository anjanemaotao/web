// 测试八字计算
const lunarCalendar = require('./utils/lunarCalendar')();
const baziCalculator = require('./utils/baziCalculator')();

// 测试农历1987年2月22日丑时(1点)的八字
const lunarYear = 1987;
const lunarMonth = 2;
const lunarDay = 22;
const hour = 1; // 丑时

// 转换为公历日期
const solarDate = lunarCalendar.lunarToSolar(lunarYear, lunarMonth, lunarDay, false);
console.log('农历1987年2月22日转公历:', solarDate);

// 计算日柱
const dayGanZhi = lunarCalendar.getDayGanZhi(solarDate.year, solarDate.month, solarDate.day);
console.log('日柱:', dayGanZhi);

// 计算时柱
const hourGanZhi = lunarCalendar.getHourGanZhi(dayGanZhi.heavenlyStem, hour);
console.log('丑时(1点)时柱:', hourGanZhi);

// 计算完整八字
const bazi = baziCalculator.calculateBazi(lunarYear, lunarMonth, lunarDay, hour);
console.log('\n完整八字:');
console.log('年柱:', bazi.year.stem + bazi.year.branch);
console.log('月柱:', bazi.month.stem + bazi.month.branch);
console.log('日柱:', bazi.day.stem + bazi.day.branch);
console.log('时柱:', bazi.hour.stem + bazi.hour.branch);
console.log('\n期望结果: 丁卯 癸卯 己巳 乙丑');