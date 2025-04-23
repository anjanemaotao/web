function LiuNianAnalysis({ bazi, showDayun = true, showLiunian = true }) {
  try {
    const { t } = React.useContext(I18nContext);
    
    if (!bazi) {
      return (
        <div className="analysis-item" data-name="liunian-analysis-empty">
          <div className="analysis-title section-title dayun-title">{showDayun ? (t('dayunTitle') || '大运分析') : (t('liunianTitle') || '近期流年')}</div>
          <div className="analysis-content">-</div>
        </div>
      );
    }
    
    const calculator = BaziCalculator();
    const { yearPillar, dayPillar } = bazi;
    
    // 获取当前年份
    const currentYear = new Date().getFullYear();
    
    // 计算未来30年的流年
    const futureYears = [];
    for (let i = 0; i <= 30; i++) {
      const year = currentYear + i;
      const yearGanZhi = calculateYearGanZhi(year);
      
      // 分析与命主八字的关系
      const analysis = analyzeLiuNian(yearGanZhi, bazi, year);
      
      futureYears.push({
        year,
        ganZhi: yearGanZhi,
        analysis
      });
    }
    
    // 计算大运
    const daYun = calculateDaYun(bazi);
    
    // 控制展示流年的数量
    const [showAllYears, setShowAllYears] = React.useState(false);
    const displayYears = showAllYears ? futureYears : futureYears.slice(0, 10);
    
    return (
      <div className="analysis-item slide-in" data-name="liunian-analysis">
        <div className="analysis-content">
          {showDayun && (
            <>
              <h4 className="analysis-title font-semibold mb-3 section-title dayun-title">{t('dayunTitle') || '大运总览'}</h4>
              <div className="mb-4" data-name="dayun-analysis">
                {/* 当前大运信息 - 移到最前面并突出显示 */}
                <div className="current-dayun-card p-4 bg-accent-color bg-opacity-10 rounded-lg border-l-4 border-accent-color mb-4">
                  <h5 className="font-semibold text-lg mb-2">{t('current_dayun')}</h5>
                  <div className="flex items-center mb-2">
                    <span className={`text-xl font-bold mr-2 wuxing-${getWuxingClass(daYun.current.ganZhi.charAt(0))}`}>
                      {t(`tiangan_${daYun.current.ganZhi.charAt(0)}`)+t(`dizhi_${daYun.current.ganZhi.charAt(1)}`)}
                    </span>
                    <span className="text-sm text-gray-600">({daYun.current.startYear}-{daYun.current.endYear})</span>
                  </div>
                  <p className="mb-2">{t('dayun_feature')}：{daYun.current.description}</p>
                  <div className="text-sm text-gray-600">
                    <p>{t('next_dayun')}：
                      <span className={`font-medium wuxing-${getWuxingClass(daYun.next.ganZhi.charAt(0))}`}>
                        {t(`tiangan_${daYun.next.ganZhi.charAt(0)}`)+t(`dizhi_${daYun.next.ganZhi.charAt(1)}`)}
                      </span>
                      {t('dayun_start_year')} {daYun.next.startYear} {t('year')}
                    </p>
                  </div>
                </div>
                
                {/* 起运年份和年龄信息 */}
                <div className="info-card p-3 bg-gray-50 rounded-lg mb-4">
                  <p><strong>{t('dayun_start_year_month')}：</strong> {daYun.startYearMonth.toFixed(2)}</p>
                  <p className="mt-1"><strong>{t('dayun_start_age')}：</strong> {daYun.startAgeYears}{t('age')}</p>
                </div>
                
                {/* 大运序列标题 */}
                <h4 className="font-semibold mb-3 sub-section-title">{t('dayun_sequence')}</h4>
                
                {/* 大运序列信息 - 使用响应式卡片式布局 */}
                <div className="dayun-sequence-container mb-4">
                  <div className="dayun-sequence-grid flex flex-wrap items-center justify-start gap-2">
                    {daYun.sequence.map((ganZhi, index) => {
                      const seqStartYear = Math.round(daYun.startYearMonth + (index * daYun.daYunDuration));
                      const seqEndYear = seqStartYear + daYun.daYunDuration - 1;
                      return (
                        <div key={index} className="dayun-sequence-item flex items-center">
                          <div 
                            className={`dayun-card p-3 rounded-lg text-center transition-all min-w-[100px] relative ${index === daYun.currentDaYunIndex ? 'bg-accent-color bg-opacity-20 border-2 border-accent-color' : 'bg-gray-50 hover:bg-gray-100'}`}
                          >
                            <div className={`text-lg font-medium mb-1 wuxing-${getWuxingClass(ganZhi.charAt(0))}`}>
                              {t(`tiangan_${ganZhi.charAt(0)}`)+t(`dizhi_${ganZhi.charAt(1)}`)}
                            </div>
                            <div className="text-sm text-gray-600">{seqStartYear}-{seqEndYear}</div>
                            {index < daYun.sequence.length - 1 && (
                              <div className="absolute right-[-8px] top-1/2 transform -translate-y-1/2 z-10">
                                <i className="fas fa-chevron-right text-accent-color"></i>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
          
          {showLiunian && (
            <>
              <h4 className="analysis-title font-semibold mb-3 section-title liunian-title">{t('liunianTitle') || '近期流年'}</h4>
              <div className="liuyun-grid" data-name="liunian-grid">
                {futureYears.slice(0, 6).map((yearData, index) => (
                  <div key={index} className="liuyun-card" data-name={`liunian-card-${yearData.year}`}>
                    <div className="liuyun-card-year">{yearData.year}{t('year')}</div>
                    <div className="liuyun-card-ganzhi">
                      <span className={`wuxing-${getWuxingClass(yearData.ganZhi.charAt(0))}`}>{t(`tiangan_${yearData.ganZhi.charAt(0)}`)}</span>
                      <span className={`wuxing-${getWuxingClass(yearData.ganZhi.charAt(1))}`}>{t(`dizhi_${yearData.ganZhi.charAt(1)}`)}</span>
                    </div>
                    <div className="text-sm">{getYearQuality(yearData.analysis.quality)}</div>
                  </div>
                ))}
              </div>
              
              <h4 className="font-semibold mt-4 mb-3 sub-section-title">{t('future_thirty_years')}</h4>
              <div className="liuyun-timeline" data-name="liunian-timeline">
                {displayYears.map((yearData, index) => (
                  <div key={index} className="liuyun-item" data-name={`liunian-item-${yearData.year}`}>
                    <div className="liuyun-year">{yearData.year}{t('year')}</div>
                    <div className="liuyun-content">
                      <div className="liuyun-ganzhi">
                        {t('liunian_ganzhi')}：
                        <span className={`wuxing-${getWuxingClass(yearData.ganZhi.charAt(0))}`}>{t(`tiangan_${yearData.ganZhi.charAt(0)}`)}</span>
                        <span className={`wuxing-${getWuxingClass(yearData.ganZhi.charAt(1))}`}>{t(`dizhi_${yearData.ganZhi.charAt(1)}`)}</span>
                      </div>
                      <div className="liuyun-description">
                        <p>{yearData.analysis.description}</p>
                        <p className="mt-1">{t('wuxing_relation')}：{yearData.analysis.wuxingRelation}</p>
                        <p className="mt-1">{t('suggestions')}：{yearData.analysis.advice}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {!showAllYears && (
                <div className="text-center mt-4">
                  <button 
                    className="btn" 
                    onClick={() => setShowAllYears(true)}
                    data-name="show-more-years"
                  >
                    {t('view_more_years')}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('LiuNianAnalysis component error:', error);
    reportError(error);
    return null;
  }
}

// 计算年干支 - 修复后的函数，不再调用不存在的方法
function calculateYearGanZhi(year) {
  try {
    // 使用天干地支的循环特性计算年干支
    const tianGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    
    // 计算天干索引：(年份 - 4) % 10
    const tianGanIndex = (year - 4) % 10;
    // 计算地支索引：(年份 - 4) % 12
    const diZhiIndex = (year - 4) % 12;
    
    // 组合天干地支
    const gan = tianGan[tianGanIndex];
    const zhi = diZhi[diZhiIndex];
    
    return gan + zhi;
  } catch (error) {
    console.error("计算年干支错误:", error);
    reportError(error);
    return "甲子"; // 返回默认值避免应用崩溃
  }
}

// 分析流年与命局的关系
function analyzeLiuNian(yearGanZhi, bazi, year) {
  const calculator = BaziCalculator();
  const { t } = React.useContext(I18nContext);
  const yearGan = yearGanZhi.charAt(0);
  const yearZhi = yearGanZhi.charAt(1);
  
  const dayGan = bazi.dayPillar.gan;
  
  const yearGanWuxing = calculator.getWuxing(yearGan);
  const yearZhiWuxing = calculator.getWuxing(yearZhi);
  const dayGanWuxing = calculator.getWuxing(dayGan);
  
  let wuxingRelation = '';
  let quality = 'neutral';
  let description = '';
  let advice = '';
  
  if (isGenerating(yearGanWuxing, dayGanWuxing)) {
    wuxingRelation = t('liunian_wuxing_generating').replace('{yearGan}', t(`tiangan_${yearGan}`))  // 添加t函数翻译
      .replace('{yearGanWuxing}', t(`wuxing_element_${yearGanWuxing}`))
      .replace('{dayGan}', t(`tiangan_${dayGan}`))  // 添加t函数翻译
      .replace('{dayGanWuxing}', t(`wuxing_element_${dayGanWuxing}`));
    quality = 'good';
    description = t('liunian_description_generating').replace('{year}', year);
    advice = t('liunian_advice_generating');
  } else if (isGenerating(dayGanWuxing, yearGanWuxing)) {
    wuxingRelation = t('liunian_wuxing_consumed').replace('{dayGan}', t(`tiangan_${dayGan}`))  // 添加t函数翻译
      .replace('{dayGanWuxing}', t(`wuxing_element_${dayGanWuxing}`))
      .replace('{yearGan}', t(`tiangan_${yearGan}`))  // 添加t函数翻译
      .replace('{yearGanWuxing}', t(`wuxing_element_${yearGanWuxing}`));
    quality = 'challenging';
    description = t('liunian_description_consumed').replace('{year}', year);
    advice = t('liunian_advice_consumed');
  } else if (isControlling(yearGanWuxing, dayGanWuxing)) {
    wuxingRelation = t('liunian_wuxing_controlling').replace('{yearGan}', t(`tiangan_${yearGan}`))  // 添加t函数翻译
      .replace('{yearGanWuxing}', t(`wuxing_element_${yearGanWuxing}`))
      .replace('{dayGan}', t(`tiangan_${dayGan}`))  // 添加t函数翻译
      .replace('{dayGanWuxing}', t(`wuxing_element_${dayGanWuxing}`));
    quality = 'bad';
    description = t('liunian_description_controlling').replace('{year}', year);
    advice = t('liunian_advice_controlling');
  } else if (isControlling(dayGanWuxing, yearGanWuxing)) {
    wuxingRelation = t('liunian_wuxing_controlled').replace('{dayGan}', t(`tiangan_${dayGan}`))  // 添加t函数翻译
      .replace('{dayGanWuxing}', t(`wuxing_element_${dayGanWuxing}`))
      .replace('{yearGan}', t(`tiangan_${yearGan}`))  // 添加t函数翻译
      .replace('{yearGanWuxing}', t(`wuxing_element_${yearGanWuxing}`));
    quality = 'good';
    description = t('liunian_description_controlled').replace('{year}', year);
    advice = t('liunian_advice_controlled');
  } else if (yearGanWuxing === dayGanWuxing) {
    wuxingRelation = t('liunian_wuxing_same').replace('{yearGan}', t(`tiangan_${yearGan}`))  // 添加t函数翻译
      .replace('{dayGan}', t(`tiangan_${dayGan}`))  // 添加t函数翻译
      .replace('{wuxing}', t(`wuxing_element_${yearGanWuxing}`));
    quality = 'neutral';
    description = t('liunian_description_same').replace('{year}', year);
    advice = t('liunian_advice_same');
  }
  
  // 考虑地支影响，增加更多变化
  if (yearZhi === '寅' || yearZhi === '卯') {
    description += t('liunian_dizhi_wood');
  } else if (yearZhi === '巳' || yearZhi === '午') {
    description += t('liunian_dizhi_fire');
  } else if (yearZhi === '申' || yearZhi === '酉') {
    description += t('liunian_dizhi_metal');
  } else if (yearZhi === '亥' || yearZhi === '子') {
    description += t('liunian_dizhi_water');
  } else if (yearZhi === '辰' || yearZhi === '戌' || yearZhi === '丑' || yearZhi === '未') {
    description += t('liunian_dizhi_earth');
  }

  return {
    wuxingRelation,
    quality,
    description,
    advice
  };
}

// 计算大运
function calculateDaYun(bazi) {
  try {
    const calculator = BaziCalculator();
    const { t } = React.useContext(I18nContext);
    const currentYear = new Date().getFullYear();
    
    // 如果没有八字数据，返回默认值
    if (!bazi || !bazi.yearPillar || !bazi.monthPillar || !bazi.dayPillar) {
      console.error("计算大运错误: 八字数据不完整");
      return getDefaultDaYun(currentYear);
    }
    
    // 从用户信息中获取性别和出生年月
    const gender = bazi.gender || 'male'; // 使用用户选择的性别，默认为男性
    const birthYear = bazi.birthYear || currentYear - 30; // 默认出生年份
    const birthMonth = bazi.birthMonth || 1; // 默认出生月份
    const birthDay = bazi.birthDay || 1; // 默认出生日
    
    // 获取年柱、月柱和日柱的天干地支
    const yearGanZhi = bazi.yearPillar.ganZhi;
    const monthGanZhi = bazi.monthPillar.ganZhi;
    const dayGanZhi = bazi.dayPillar.ganZhi;
    
    // 获取年干和月干
    const yearGan = yearGanZhi.charAt(0);
    const monthGan = monthGanZhi.charAt(0);
    
    // 确定年干和月干的阴阳属性
    const yearYinYang = calculator.getYinYang(yearGan);
    const monthYinYang = calculator.getYinYang(monthGan);
    
    // 应用大运顺逆规则
    // 男命：年干阳则顺行，年干阴则逆行
    // 女命：年干阳则逆行，年干阴则顺行
    const isForward = (gender === 'male' && yearYinYang === '阳') || 
                      (gender === 'female' && yearYinYang === '阴');
    
    // 确保顺逆方向正确
    // shouldReverse为true表示应该逆排，为false表示应该顺排
    // 在生成大运序列时，顺排是取下一个干支，逆排是取上一个干支
    const shouldReverse = !isForward;
    
    // 打印阴阳属性用于调试
    console.log(`年干(${yearGan})阴阳属性: ${yearYinYang}, 月干(${monthGan})阴阳属性: ${monthYinYang}`);
    console.log(`性别: ${gender}, 大运排序: ${isForward ? '顺排' : '逆排'}`);
    
    // 计算大运起始干支
    const tianGan = calculator.tianGan;
    const diZhi = calculator.diZhi;
    
    // 找到月干和月支的索引
    const monthGanIndex = tianGan.indexOf(monthGanZhi.charAt(0));
    const monthZhiIndex = diZhi.indexOf(monthGanZhi.charAt(1));
    
    if (monthGanIndex === -1 || monthZhiIndex === -1) {
      console.error("计算大运错误: 无法确定月干支索引");
      return getDefaultDaYun(currentYear);
    }
    
    // 生成大运序列（8个大运）
    const daYunSequence = [];
    
    // 正确处理干支配对
    // 在传统命理学中，干支配对遵循固定的六十甲子循环
    // 需要确保天干地支的配对符合传统规则
    
    // 首先找到月柱干支在六十甲子中的位置
    let ganZhiIndex = -1;
    const sixtyJiaziCycle = [];
    
    // 生成六十甲子表
    for (let i = 0; i < 60; i++) {
      const gan = tianGan[i % 10];
      const zhi = diZhi[i % 12];
      sixtyJiaziCycle.push(gan + zhi);
      
      // 找到月柱干支在六十甲子中的位置
      if (gan + zhi === monthGanZhi) {
        ganZhiIndex = i;
      }
    }
    
    // 如果没找到，使用估算的位置
    if (ganZhiIndex === -1) {
      ganZhiIndex = (monthGanIndex * 6 + monthZhiIndex) % 60;
    }
    
    // 根据顺逆方向生成大运序列
    for (let i = 0; i < 8; i++) {
      let nextIndex;
      
      if (shouldReverse) {
        // 逆排：取上一个干支
        nextIndex = (ganZhiIndex - i - 1 + 60) % 60;
      } else {
        // 顺排：取下一个干支
        nextIndex = (ganZhiIndex + i + 1) % 60;
      }
      
      // 从六十甲子表中获取正确的干支组合
      const ganZhi = sixtyJiaziCycle[nextIndex];
      daYunSequence.push(ganZhi);
    }
    
    // 打印大运序列用于调试
    console.log(`大运序列 (${isForward ? '顺排' : '逆排'})：`, daYunSequence.join(', '));
    
    // 计算起运年龄和起运年份
    // 基础起运年龄和月份
    let startAge = 0; // 初始化为0，后续根据具体情况计算
    let startMonth = 0; // 初始化为0，后续根据具体情况计算
    
    // 确定起运年龄计算方法
    // 男命：年干阳则数到下一个节令，年干阴则数到上一个节令
    // 女命：年干阳则数到上一个节令，年干阴则数到下一个节令
    const countToNextTerm = (gender === 'male' && yearYinYang === '阳') || 
                            (gender === 'female' && yearYinYang === '阴');
    
    // 计算节气间隔天数（平均约15天）
    const termDays = 15;
    
    // 假设出生日期与最近节气的天数差
    // 实际应用中应该通过精确的节气计算获取
    let daysToPrevTerm = 0;
    let daysToNextTerm = 0;
    
    // 根据出生月份估算与节气的关系
    // 每月大约有两个节气，分别在月初和月中
    const dayOfMonth = birthDay;
    if (dayOfMonth <= 15) {
      // 出生日期在月初到月中，接近月初节气
      daysToPrevTerm = dayOfMonth;
      daysToNextTerm = 15 - dayOfMonth;
    } else {
      // 出生日期在月中到月末，接近月中节气
      daysToPrevTerm = dayOfMonth - 15;
      daysToNextTerm = 30 - dayOfMonth;
    }
    
    // 根据起运方向计算起运时间
    if (countToNextTerm) {
      // 数到下一个节令
      startMonth = Math.ceil(daysToNextTerm / 3); // 每3天为1个月
    } else {
      // 数到上一个节令
      startMonth = Math.ceil(daysToPrevTerm / 3); // 每3天为1个月
    }
    
    // 转换月数为年龄（每3个月为1岁）
    startAge = Math.floor(startMonth / 3);
    startMonth = startMonth % 3;
    
    // 调整基础起运年龄（传统上为3岁）
    startAge += 3;
    
    // 计算起运年份，考虑额外的月份
    const startYear = birthYear + startAge + Math.floor(startMonth / 12);
    const remainingMonths = startMonth % 12;
    
    // 打印起运年份用于调试
    console.log(`起运年份: ${startYear}，性别: ${gender}，年干阴阳: ${yearYinYang}，月干阴阳: ${monthYinYang}，顺逆: ${isForward ? '顺排' : '逆排'}`);
    
    // 计算每个大运的持续时间（通常为10年）
    const daYunDuration = 10;
    
    // 更精确地确定当前所在大运 - 修正后的算法
    // 考虑实际起运年份和月份
    const exactStartYear = startYear + (remainingMonths / 12);
    let currentDaYunIndex = Math.floor((currentYear - exactStartYear) / daYunDuration);
    
    // 处理边界情况
    if (currentYear < startYear) {
      // 如果当前年份小于起运年份，则还未进入第一个大运
      currentDaYunIndex = 0;
    }
    
    // 打印当前大运索引和序列用于调试
    console.log(`一般情况计算，当前大运索引: ${currentDaYunIndex}，起运年份: ${startYear}，精确起运年份: ${exactStartYear.toFixed(2)}，当前年份: ${currentYear}`);
    console.log(`大运序列: ${daYunSequence.join(', ')}`);
    
    // 确保索引在有效范围内
    currentDaYunIndex = Math.max(0, Math.min(currentDaYunIndex, daYunSequence.length - 2));
    
    // 获取当前大运和下一个大运
    const currentDaYunGanZhi = daYunSequence[currentDaYunIndex];
    const nextDaYunGanZhi = daYunSequence[currentDaYunIndex + 1];
    
    console.log(`当前大运: ${currentDaYunGanZhi}，下一大运: ${nextDaYunGanZhi}`);
    
    // 计算当前大运的开始和结束年份，考虑精确的起运时间
    const currentDaYunStartYear = Math.round(exactStartYear + (currentDaYunIndex * daYunDuration));
    const currentDaYunEndYear = currentDaYunStartYear + daYunDuration - 1;
    
    // 计算下一个大运的开始和结束年份
    const nextDaYunStartYear = currentDaYunEndYear + 1;
    const nextDaYunEndYear = nextDaYunStartYear + daYunDuration - 1;
    
    // 保存起运年龄和月份，以便在UI中显示
    const startYearMonth = exactStartYear;
    const startAgeYears = startAge;
    const startAgeMonths = startMonth;
    
    // 生成大运描述
    const currentDaYunDescription = generateDaYunDescription(currentDaYunGanZhi, bazi.dayPillar.gan);
    const nextDaYunDescription = generateDaYunDescription(nextDaYunGanZhi, bazi.dayPillar.gan);
    
    // 返回大运信息
    return {
      current: {
        ganZhi: currentDaYunGanZhi,
        startYear: currentDaYunStartYear,
        endYear: currentDaYunEndYear,
        description: currentDaYunDescription
      },
      next: {
        ganZhi: nextDaYunGanZhi,
        startYear: nextDaYunStartYear,
        endYear: nextDaYunEndYear,
        description: nextDaYunDescription
      },
      sequence: daYunSequence,
      startYearMonth: exactStartYear,
      startAgeYears: startAge,
      startAgeMonths: startMonth,
      currentDaYunIndex: currentDaYunIndex,
      daYunDuration: daYunDuration
    };
  } catch (error) {
    console.error("计算大运错误:", error);
    reportError(error);
    return getDefaultDaYun(new Date().getFullYear());
  }
}

// 生成大运描述
function generateDaYunDescription(daYunGanZhi, dayGan) {
  const calculator = BaziCalculator();
  const { t } = React.useContext(I18nContext);
  const daYunGan = daYunGanZhi.charAt(0);
  const daYunZhi = daYunGanZhi.charAt(1);
  
  // 获取五行属性
  const daYunGanWuxing = calculator.getWuxing(daYunGan);
  const daYunZhiWuxing = calculator.getWuxing(daYunZhi);
  const dayGanWuxing = calculator.getWuxing(dayGan);
  
  // 分析五行关系
  let description = t('dayun_ganzhi_prefix')
    .replace('{gan}', t(`tiangan_${daYunGan}`))
    .replace('{gan_wuxing}', t(`wuxing_element_${daYunGanWuxing}`))
    .replace('{zhi}', t(`dizhi_${daYunZhi}`))
    .replace('{zhi_wuxing}', t(`wuxing_element_${daYunZhiWuxing}`));
  
  // 分析天干五行关系
  if (isGenerating(daYunGanWuxing, dayGanWuxing)) {
    // 大运天干生日主
    description += t('dayun_generating_daymaster');
  } else if (isGenerating(dayGanWuxing, daYunGanWuxing)) {
    // 日主生大运天干
    description += t('dayun_generated_by_daymaster');
  } else if (isControlling(daYunGanWuxing, dayGanWuxing)) {
    // 大运天干克日主
    description += t('dayun_controlling_daymaster');
  } else if (isControlling(dayGanWuxing, daYunGanWuxing)) {
    // 日主克大运天干
    description += t('dayun_controlled_by_daymaster');
  } else if (daYunGanWuxing === dayGanWuxing) {
    // 大运天干与日主五行相同
    description += t('dayun_same_wuxing');
  }
  
  // 根据地支特性补充描述
  if (daYunZhi === '寅' || daYunZhi === '卯') {
    description += t('dayun_dizhi_wood');
  } else if (daYunZhi === '巳' || daYunZhi === '午') {
    description += t('dayun_dizhi_fire');
  } else if (daYunZhi === '申' || daYunZhi === '酉') {
    description += t('dayun_dizhi_metal');
  } else if (daYunZhi === '亥' || daYunZhi === '子') {
    description += t('dayun_dizhi_water');
  } else if (daYunZhi === '辰' || daYunZhi === '戌' || daYunZhi === '丑' || daYunZhi === '未') {
    description += t('dayun_dizhi_earth');
  }
  
  return description;
}

// 获取默认大运信息（当无法计算时使用）
function getDefaultDaYun(currentYear) {
  return {
    current: {
      ganZhi: '戊午',
      startYear: currentYear - 5,
      endYear: currentYear + 5,
      description: '戊土为中正之土，午火为太阳当午，此大运五行土火旺盛，有助于事业发展和人际关系拓展，但也需注意健康方面的调养。'
    },
    next: {
      ganZhi: '己未',
      startYear: currentYear + 5,
      endYear: currentYear + 15,
      description: '己土阴柔，未土湿润，此大运五行偏向阴柔，适合稳健发展，注重内在修养和家庭建设，事业上可能会有稳步提升。'
    },
    sequence: ['戊午', '己未', '庚申', '辛酉', '壬戌', '癸亥', '甲子', '乙丑']
  };
}

// 判断五行相生关系
function isGenerating(source, target) {
  const generatingRelations = {
    '木': '火',
    '火': '土',
    '土': '金',
    '金': '水',
    '水': '木'
  };
  
  return generatingRelations[source] === target;
}

// 判断五行相克关系
function isControlling(source, target) {
  const controllingRelations = {
    '木': '土',
    '土': '水',
    '水': '火',
    '火': '金',
    '金': '木'
  };
  
  return controllingRelations[source] === target;
}

// 获取流年质量评估
function getYearQuality(quality) {
  const { t } = React.useContext(I18nContext);
  
  switch (quality) {
    case 'good':
      return t('year_quality_good') || '吉利之年';
    case 'bad':
      return t('year_quality_bad') || '谨慎之年';
    case 'challenging':
      return t('year_quality_challenging') || '消耗之年';
    default:
      return t('year_quality_neutral') || '平稳之年';
  }
}

// 获取五行对应的CSS类名
function getWuxingClass(ganOrZhi) {
  const calculator = BaziCalculator();
  const wuxing = calculator.getWuxing(ganOrZhi);
  
  switch (wuxing) {
    case '木': return 'wood';
    case '火': return 'fire';
    case '土': return 'earth';
    case '金': return 'metal';
    case '水': return 'water';
    default: return '';
  }
}
