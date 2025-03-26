// test-lunar.js
const LunarLib = require('lunar-javascript');
const Lunar = LunarLib.Lunar;

try {
  const lunar = Lunar.fromYmd(1987, 2, 22);
  const solar = lunar.getSolar();
  console.log('农历：', 1987, 2, 22);
  console.log('阳历：', solar.getYear(), solar.getMonth(), solar.getDay());
} catch (e) {
  console.error('测试失败:', e);
}