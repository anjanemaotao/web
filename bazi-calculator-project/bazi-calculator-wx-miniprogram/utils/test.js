// utils/test.js
// 八字计算测试文件

const { calculateFullBazi } = require('./baziCalculator');

// 测试函数
function testBaziCalculation() {
  console.log('开始测试八字计算...');
  
  // 测试用例列表
  const testCases = [
    // 测试案例1：1987年2月22日丑时
    {
      lunarYear: 1987,
      lunarMonth: 2,
      lunarDay: 22,
      hour: 2, // 丑时对应的小时值
      expected: {
        year: ['丁', '卯'],
        month: ['癸', '卯'],
        day: ['己', '巳'],
        hour: ['乙', '丑']
      },
      description: '1987年2月22日丑时'
    },
    // 测试案例2：1990年8月15日午时
    {
      lunarYear: 1990,
      lunarMonth: 8,
      lunarDay: 15,
      hour: 12, // 午时对应的小时值
      expected: {
        year: ['庚', '午'],
        month: ['辛', '申'],
        day: ['丙', '申'],
        hour: ['戊', '午']
      },
      description: '1990年8月15日午时'
    },
    // 测试案例3：2000年1月1日子时
    {
      lunarYear: 2000,
      lunarMonth: 1,
      lunarDay: 1,
      hour: 0, // 子时对应的小时值
      expected: {
        year: ['庚', '辰'],
        month: ['丙', '寅'],
        day: ['壬', '子'],
        hour: ['壬', '子']
      },
      description: '2000年1月1日子时'
    }
  ];
  
  let allTestsPassed = true;
  
  // 执行所有测试用例
  for (const testCase of testCases) {
    console.log(`\n测试案例: ${testCase.description}`);
    
    // 执行计算
    const result = calculateFullBazi(testCase.lunarYear, testCase.lunarMonth, testCase.lunarDay, testCase.hour);
    
    // 验证结果
    const isYearCorrect = result.year[0] === testCase.expected.year[0] && result.year[1] === testCase.expected.year[1];
    const isMonthCorrect = result.month[0] === testCase.expected.month[0] && result.month[1] === testCase.expected.month[1];
    const isDayCorrect = result.day[0] === testCase.expected.day[0] && result.day[1] === testCase.expected.day[1];
    const isHourCorrect = result.hour[0] === testCase.expected.hour[0] && result.hour[1] === testCase.expected.hour[1];
    
    console.log('测试结果:');
    console.log('年柱:', result.year.join(''), isYearCorrect ? '✓' : '✗', '预期:', testCase.expected.year.join(''));
    console.log('月柱:', result.month.join(''), isMonthCorrect ? '✓' : '✗', '预期:', testCase.expected.month.join(''));
    console.log('日柱:', result.day.join(''), isDayCorrect ? '✓' : '✗', '预期:', testCase.expected.day.join(''));
    console.log('时柱:', result.hour.join(''), isHourCorrect ? '✓' : '✗', '预期:', testCase.expected.hour.join(''));
    
    const caseCorrect = isYearCorrect && isMonthCorrect && isDayCorrect && isHourCorrect;
    console.log('测试结果:', caseCorrect ? '通过' : '失败');
    
    if (!caseCorrect) {
      allTestsPassed = false;
    }
  }
  
  console.log('\n总体测试结果:', allTestsPassed ? '全部通过' : '存在失败');
  
  return allTestsPassed;
}

// 执行测试
testBaziCalculation();

// 导出测试函数
module.exports = {
  testBaziCalculation
};