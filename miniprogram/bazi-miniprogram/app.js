// app.js - 小程序全局逻辑
App({
  globalData: {
    // 全局数据
    bazi: null,
    patterns: [],
    wuxingResult: null,
    shishenResult: null,
    shierGongResult: null,
    lunarDate: null,
    solarDate: null,
    calculating: false
  },
  
  onLaunch() {
    // 小程序启动时执行
    console.log('小程序启动');
  },
  
  // 处理八字计算
  calculateBazi(lunarDateInput) {
    console.log('开始计算八字，输入数据:', lunarDateInput);
    
    // 验证输入数据
    if (!lunarDateInput || !lunarDateInput.year || !lunarDateInput.month || !lunarDateInput.day) {
      console.error('输入数据无效:', lunarDateInput);
      return null;
    }
    
    try {
      // 设置计算中状态
      this.globalData.calculating = true;
      
      // 加载必要的模块
      const calculator = require('./utils/baziCalculator');
      const patternAnalyzer = require('./utils/patternAnalyzer');
      const wuxingAnalyzer = require('./utils/wuxingAnalyzer');
      const shishenAnalyzer = require('./utils/shishenAnalyzer');
      const shierGongAnalyzer = require('./utils/shierGongAnalyzer');
      
      console.log('模块加载成功');
      
      // 保存日期信息
      this.globalData.lunarDate = lunarDateInput;
      
      // 转换阴历到阳历
      console.log('转换阴历到阳历...');
      const solarDateResult = calculator.lunarToSolar(lunarDateInput);
      this.globalData.solarDate = solarDateResult;
      console.log('阳历日期:', solarDateResult);
      
      // 计算八字
      console.log('计算八字...');
      const baziResult = calculator.calculateBazi(lunarDateInput);
      console.log('八字结果:', baziResult);
      
      // 检查是否有错误
      if (baziResult && baziResult.error) {
        console.error('八字计算错误:', baziResult.error);
        this.globalData.calculating = false;
        return { error: baziResult.error };
      }
      
      // 分析格局
      console.log('分析格局...');
      const patternResult = patternAnalyzer.analyzePattern(baziResult);
      
      // 分析五行
      console.log('分析五行...');
      const wuxingAnalysisResult = wuxingAnalyzer.analyzeWuxing(baziResult);
      
      // 分析十神
      console.log('分析十神...');
      const shishenAnalysisResult = shishenAnalyzer.analyzeShishen(baziResult);
      
      // 分析十二宫
      console.log('分析十二宫...');
      const shierGongAnalysisResult = shierGongAnalyzer().analyzeShierGong(baziResult);
      
      // 保存结果到全局数据
      this.globalData.bazi = baziResult;
      this.globalData.patterns = patternResult;
      this.globalData.wuxingResult = wuxingAnalysisResult;
      this.globalData.shishenResult = shishenAnalysisResult;
      this.globalData.shierGongResult = shierGongAnalysisResult;
      
      // 重置计算状态
      this.globalData.calculating = false;
      
      console.log('八字计算完成');
      
      return {
        bazi: baziResult,
        patterns: patternResult,
        wuxingResult: wuxingAnalysisResult,
        shishenResult: shishenAnalysisResult,
        shierGongResult: shierGongAnalysisResult
      };
    } catch (error) {
      console.error('计算八字错误:', error);
      // 重置计算状态
      this.globalData.calculating = false;
      return null;
    }
  }
});