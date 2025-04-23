function DaYunAnalysis({ bazi }) {
  try {
    const { t } = React.useContext(I18nContext);
    
    if (!bazi) {
      return (
        <div className="analysis-item" data-name="dayun-analysis-empty">
          <div className="analysis-title">{t('dayunTitle') || '大运分析'}</div>
          <div className="analysis-content">-</div>
        </div>
      );
    }
    
    // 计算大运
    const daYun = calculateDaYun(bazi);
    
    return (
      <div className="analysis-item slide-in" data-name="dayun-analysis">
        <div className="analysis-content">
          <div className="pattern-section" data-name="dayun-main">
            <div className="pattern-section-header">
              <i className="fas fa-hourglass-half text-accent-color mr-2"></i>
              <h4 className="font-semibold">{t('dayunOverview') || '大运总览'}</h4>
              <div className="pattern-section-line"></div>
            </div>
            <div className="mb-4 p-3 bg-gray-50 rounded-md" data-name="dayun-overview">
              <p>{t('startingYear')}：<span className="font-medium">
                {daYun.startYear ? daYun.startYear : '-'} {t('year')} {daYun.startMonth ? daYun.startMonth : 0} {t('monthUnit')}
              </span></p>
              <p className="mt-2">{t('startingAge')}：<span className="font-medium">
                {daYun.startAge ? daYun.startAge : '-'} {t('year')} {daYun.startMonth ? daYun.startMonth : 0} {t('monthUnit')}
              </span></p>
              <p className="mt-2">{t('current_dayun')}：<span className="font-medium">
                {daYun.current && daYun.current.ganZhi && typeof daYun.current.ganZhi === 'string' && daYun.current.ganZhi.length >= 2 ? 
                  t(`tiangan_${daYun.current.ganZhi.charAt(0)}`)+t(`dizhi_${daYun.current.ganZhi.charAt(1)}`) : '-'}
              </span></p>
              <p className="mt-2">{t('dayun_feature')}：{daYun.current && daYun.current.description ? daYun.current.description : '-'}</p>
              <p className="mt-2">{t('next_dayun')}：<span className="font-medium">
                {daYun.next && daYun.next.ganZhi && typeof daYun.next.ganZhi === 'string' && daYun.next.ganZhi.length >= 2 ? 
                  t(`tiangan_${daYun.next.ganZhi.charAt(0)}`)+t(`dizhi_${daYun.next.ganZhi.charAt(1)}`) : '-'}
              </span>，{t('dayun_start_year')} {daYun.next && daYun.next.startYear ? daYun.next.startYear : '-'} {t('year')}</p>
            </div>
          </div>
          
          <div className="pattern-section" data-name="dayun-sequence">
            <div className="pattern-section-header">
              <i className="fas fa-stream text-accent-color mr-2"></i>
              <h4 className="font-semibold">{t('dayunSequence') || '大运序列'}</h4>
              <div className="pattern-section-line"></div>
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-md" data-name="dayun-sequence-list">
              <div className="pattern-section-header mb-2">
                <i className="fas fa-stream text-accent-color mr-2"></i>
                <h4 className="font-semibold">{t('dayunSequenceList') || '大运序列'}</h4>
              </div>
              <div className="dayun-sequence-container">
                {Array.isArray(daYun.sequence) && daYun.sequence.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                    {daYun.sequence.map((dayunData, index) => {
                      // 计算每个大运的起止年份
                      const startYear = daYun.startYear + (index * 10);
                      const endYear = startYear + 9;
                      return (
                        <div key={index} className={`p-2 border rounded ${dayunData.isCurrent ? 'border-accent-color bg-accent-color bg-opacity-10' : 'border-gray-200'}`}>
                          <div className="font-medium">
                            {dayunData && dayunData.ganZhi && typeof dayunData.ganZhi === 'string' && dayunData.ganZhi.length >= 2 ? (
                              <>
                                <span className={`wuxing-${getWuxingClass(dayunData.ganZhi.charAt(0))}`}>{t(`tiangan_${dayunData.ganZhi.charAt(0)}`) || dayunData.ganZhi.charAt(0)}</span>
                                <span className={`wuxing-${getWuxingClass(dayunData.ganZhi.charAt(1))}`}>{t(`dizhi_${dayunData.ganZhi.charAt(1)}`) || dayunData.ganZhi.charAt(1)}</span>
                              </>
                            ) : '-'}
                          </div>
                          <div className="text-sm text-gray-600">
                            {t('yearRange')}: {startYear}-{endYear}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p>{t('no_dayun_data') || '暂无大运数据'}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('DaYunAnalysis component error:', error);
    reportError(error);
    return null;
  }
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
    
    // 确保birthDay是有效的数字
    const validBirthDay = Number.isFinite(birthDay) && birthDay > 0 && birthDay <= 31 ? birthDay : 15;
    
    // 根据出生月份估算与节气的关系
    // 每月大约有两个节气，分别在月初和月中
    const dayOfMonth = validBirthDay;
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
      startMonth = Math.max(1, Math.ceil(daysToNextTerm / 3)); // 每3天为1个月，确保至少为1
    } else {
      // 数到上一个节令
      startMonth = Math.max(1, Math.ceil(daysToPrevTerm / 3)); // 每3天为1个月，确保至少为1
    }
    
    // 转换月数为年龄（每3个月为1岁）
    startAge = Math.floor(startMonth / 3);
    startMonth = startMonth % 3;
    
    // 调整基础起运年龄（传统上为3岁）
    startAge += 3;
    
    // 确保birthYear是有效的数字
    const validBirthYear = Number.isFinite(birthYear) && birthYear > 0 ? birthYear : currentYear - 30;
    
    // 计算起运年份，考虑额外的月份
    const startYear = validBirthYear + startAge + Math.floor(startMonth / 12);
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
    if (currentYear < startYear || currentDaYunIndex < 0) {
      // 如果当前年份小于起运年份，或计算出的索引小于0，则设为第一个大运
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
    
    // 计算下一个大运的开始年份
    const nextDaYunStartYear = startYear + (currentDaYunIndex + 1) * daYunDuration;
    
    // 分析当前大运和下一个大运
    const currentDaYunAnalysis = analyzeDaYun(currentDaYunGanZhi, bazi);
    const nextDaYunAnalysis = analyzeDaYun(nextDaYunGanZhi, bazi);
    
    // 构建完整的大运序列信息
    const fullDaYunSequence = [];
    for (let i = 0; i < daYunSequence.length; i++) {
      const sequenceStartYear = startYear + i * daYunDuration;
      const sequenceEndYear = startYear + (i + 1) * daYunDuration - 1;
      const analysis = analyzeDaYun(daYunSequence[i], bazi);
      
      // 确保analysis对象包含所有必要的属性
      if (analysis && typeof analysis === 'object') {
        fullDaYunSequence.push({
          ganZhi: daYunSequence[i],
          startYear: sequenceStartYear,
          endYear: sequenceEndYear,
          description: analysis.description || '',
          wuxingRelation: analysis.wuxingRelation || '',
          advice: analysis.advice || '',
          isCurrent: i === currentDaYunIndex
        });
      } else {
        console.error('大运分析结果无效:', analysis);
        fullDaYunSequence.push({
          ganZhi: daYunSequence[i],
          startYear: sequenceStartYear,
          endYear: sequenceEndYear,
          description: '',
          wuxingRelation: '',
          advice: '',
          isCurrent: i === currentDaYunIndex
        });
      }
    }
    
    // 返回大运信息
    return {
      startYear: startYear,
      startMonth: remainingMonths,
      startAge: startAge,
      current: {
        ganZhi: currentDaYunGanZhi,
        description: currentDaYunAnalysis.description,
        wuxingRelation: currentDaYunAnalysis.wuxingRelation,
        advice: currentDaYunAnalysis.advice
      },
      next: {
        ganZhi: nextDaYunGanZhi,
        startYear: nextDaYunStartYear,
        description: nextDaYunAnalysis.description,
        wuxingRelation: nextDaYunAnalysis.wuxingRelation,
        advice: nextDaYunAnalysis.advice
      },
      sequence: fullDaYunSequence
    };
  } catch (error) {
    console.error("计算大运错误:", error);
    reportError(error);
    return getDefaultDaYun(currentYear);
  }
}

// 分析大运与命局的关系
function analyzeDaYun(daYunGanZhi, bazi) {
  try {
    const calculator = BaziCalculator();
    const { t } = React.useContext(I18nContext);
    
    // 添加空值检查，确保daYunGanZhi是有效的字符串
    if (!daYunGanZhi || typeof daYunGanZhi !== 'string' || daYunGanZhi.length < 2) {
      console.error("分析大运错误: 大运干支无效", daYunGanZhi);
      return {
        wuxingRelation: '',
        description: t('dayun_analysis_error') || '大运分析出错',
        advice: t('dayun_advice_error') || '请重新计算'
      };
    }
    
    const daYunGan = daYunGanZhi.charAt(0);
    const daYunZhi = daYunGanZhi.charAt(1);
    
    const dayGan = bazi.dayPillar.gan;
    
    const daYunGanWuxing = calculator.getWuxing(daYunGan);
    const daYunZhiWuxing = calculator.getWuxing(daYunZhi);
    const dayGanWuxing = calculator.getWuxing(dayGan);
    
    let wuxingRelation = '';
    let description = '';
    let advice = '';
    
    // 分析天干五行关系
    if (calculator.isGenerating(daYunGanWuxing, dayGanWuxing)) {
      wuxingRelation = t('dayun_wuxing_generating') || 
        `${t(`tiangan_${daYunGan}`)}(${t(`wuxing_element_${daYunGanWuxing}`)})生${t(`tiangan_${dayGan}`)}(${t(`wuxing_element_${dayGanWuxing}`)})` || '生';
      description = t('dayun_description_generating') || '此大运对命主有助力，有利于事业发展和财运提升。';
      advice = t('dayun_advice_generating') || '宜积极拓展事业，把握机会，开创新局面。';
    } else if (calculator.isGenerating(dayGanWuxing, daYunGanWuxing)) {
      wuxingRelation = t('dayun_wuxing_consumed') || 
        `${t(`tiangan_${dayGan}`)}(${t(`wuxing_element_${dayGanWuxing}`)})生${t(`tiangan_${daYunGan}`)}(${t(`wuxing_element_${daYunGanWuxing}`)})` || '泄';
      description = t('dayun_description_consumed') || '此大运消耗命主元气，需注意健康和精力分配。';
      advice = t('dayun_advice_consumed') || '宜保守行事，量力而为，注重养生和休息。';
    } else if (calculator.isControlling(daYunGanWuxing, dayGanWuxing)) {
      wuxingRelation = t('dayun_wuxing_controlling') || 
        `${t(`tiangan_${daYunGan}`)}(${t(`wuxing_element_${daYunGanWuxing}`)})克${t(`tiangan_${dayGan}`)}(${t(`wuxing_element_${dayGanWuxing}`)})` || '克';
      description = t('dayun_description_controlling') || '此大运对命主有压制作用，可能面临挑战和阻碍。';
      advice = t('dayun_advice_controlling') || '需谨慎决策，避免冲动，寻求稳妥的发展路径。';
    } else if (calculator.isControlling(dayGanWuxing, daYunGanWuxing)) {
      wuxingRelation = t('dayun_wuxing_controlled') || 
        `${t(`tiangan_${dayGan}`)}(${t(`wuxing_element_${dayGanWuxing}`)})克${t(`tiangan_${daYunGan}`)}(${t(`wuxing_element_${daYunGanWuxing}`)})` || '被克';
      description = t('dayun_description_controlled') || '此大运受命主克制，有利于掌控局面和发挥主导作用。';
      advice = t('dayun_advice_controlled') || '可主动出击，展现领导力，推动重要计划。';
    } else if (daYunGanWuxing === dayGanWuxing) {
      wuxingRelation = t('dayun_wuxing_same') || 
        `${t(`tiangan_${daYunGan}`)}与${t(`tiangan_${dayGan}`)}同属${t(`wuxing_element_${daYunGanWuxing}`)}`;
      description = t('dayun_description_same') || '此大运与命主五行相同，力量得到加强，但也可能导致偏颇。大运天干与日主同属一种五行，能量相互增强，但过强则失去平衡，需注意调和。';
      advice = t('dayun_advice_same') || '宜扬长避短，注意平衡发展，避免过于极端。应充分发挥自身优势，同时注意补足短板，保持五行平衡，避免偏执。';
    }
    
    // 考虑地支影响，增加更详细的解释
    if (daYunZhi === '寅' || daYunZhi === '卯') {
      description += t('dayun_dizhi_wood') || '。地支属木，具有生发、向上的特性，有利于创新和开拓。此运有助于开创新业，拓展新领域，适合学习新知识，开展创新活动。';
      advice += t('dayun_advice_wood') || '宜积极进取，开拓创新，投资新兴行业，发展与木相关的事业如教育、文化、植物、木材等。';
    } else if (daYunZhi === '巳' || daYunZhi === '午') {
      description += t('dayun_dizhi_fire') || '。地支属火，具有光明、热情的特性，有助于提升声望和影响力。此运利于扩大社交圈，提高知名度，增强个人魅力和领导能力。';
      advice += t('dayun_advice_fire') || '宜拓展人脉，提升个人品牌，从事与火相关的行业如餐饮、娱乐、照明、能源等，注意情绪管理，避免冲动。';
    } else if (daYunZhi === '申' || daYunZhi === '酉') {
      description += t('dayun_dizhi_metal') || '。地支属金，具有坚韧、果断的特性，有利于纪律性和执行力。此运有助于提高做事效率，增强决断能力，适合规范化管理和系统性工作。';
      advice += t('dayun_advice_metal') || '宜注重规划，提高执行力，从事与金相关的行业如金融、珠宝、机械、IT等，培养严谨作风，避免过于刚硬。';
    } else if (daYunZhi === '亥' || daYunZhi === '子') {
      description += t('dayun_dizhi_water') || '。地支属水，具有智慧、灵活的特性，有助于智慧和灵活性的发挥。此运有利于学术研究，思维创新，适合需要深度思考和灵活应变的工作。';
      advice += t('dayun_advice_water') || '宜发挥智慧，灵活应变，从事与水相关的行业如贸易、运输、旅游、传媒等，培养洞察力，避免优柔寡断。';
    } else if (daYunZhi === '辰' || daYunZhi === '戌' || daYunZhi === '丑' || daYunZhi === '未') {
      description += t('dayun_dizhi_earth') || '。地支属土，具有稳重、厚实的特性，有利于稳定和积累。此运有助于事业稳固，财富积累，适合长期规划和稳健发展的项目。';
      advice += t('dayun_advice_earth') || '宜稳健发展，注重积累，从事与土相关的行业如房地产、农业、建筑、制造业等，培养踏实作风，避免过于保守。';
    }
    
    // 分析大运与命局的整体关系
    const dayunRelationship = analyzeDayunRelationship(daYunGanZhi, bazi);
    
    // 确保description和advice字段正确添加关系分析内容
    if (dayunRelationship && dayunRelationship.description) {
      description += ' ' + dayunRelationship.description;
    }
    
    if (dayunRelationship && dayunRelationship.advice) {
      advice += ' ' + dayunRelationship.advice;
    }
    
    return {
      wuxingRelation,
      description,
      advice
    };
  } catch (error) {
    console.error("分析大运错误:", error);
    reportError(error);
    return {
      wuxingRelation: '',
      description: t('dayun_analysis_error') || '大运分析出错',
      advice: t('dayun_advice_error') || '请重新计算'
    };
  }
}

// 获取默认大运信息（当无法计算时使用）
function getDefaultDaYun(currentYear) {
  const { t } = React.useContext(I18nContext);
  // 确保currentYear是有效的数字
  const validYear = Number.isFinite(currentYear) ? currentYear : new Date().getFullYear();
  // 设置默认起运年龄为3岁
  const defaultStartAge = 3;
  // 设置默认起运年份为当前年份减去30年加上起运年龄
  const defaultStartYear = validYear - 30 + defaultStartAge;
  
  return {
    startYear: defaultStartYear,
    startMonth: 0,
    startAge: defaultStartAge,
    current: {
      ganZhi: '甲子',
      description: t('dayun_default_description') || '大运信息不完整，无法准确分析',
      wuxingRelation: '',
      advice: t('dayun_default_advice') || '建议重新输入完整的八字信息'
    },
    next: {
      ganZhi: '乙丑',
      startYear: defaultStartYear + 10,
      description: t('dayun_default_description') || '大运信息不完整，无法准确分析',
      wuxingRelation: '',
      advice: t('dayun_default_advice') || '建议重新输入完整的八字信息'
    },
    sequence: [
      {
        ganZhi: '甲子',
        startYear: defaultStartYear,
        endYear: defaultStartYear + 9,
        description: t('dayun_default_description') || '大运信息不完整，无法准确分析',
        wuxingRelation: '',
        advice: t('dayun_default_advice') || '建议重新输入完整的八字信息',
        isCurrent: true
      },
      {
        ganZhi: '乙丑',
        startYear: defaultStartYear + 10,
        endYear: defaultStartYear + 19,
        description: t('dayun_default_description') || '大运信息不完整，无法准确分析',
        wuxingRelation: '',
        advice: t('dayun_default_advice') || '建议重新输入完整的八字信息',
        isCurrent: false
      }
    ]
  };
}

// 判断五行生克关系的辅助函数
function isGenerating(source, target) {
  // 五行相生关系：木生火，火生土，土生金，金生水，水生木
  const generatingRelations = {
    '木': '火',
    '火': '土',
    '土': '金',
    '金': '水',
    '水': '木'
  };
  
  return generatingRelations[source] === target;
}

function isControlling(source, target) {
  // 五行相克关系：木克土，土克水，水克火，火克金，金克木
  const controllingRelations = {
    '木': '土',
    '土': '水',
    '水': '火',
    '火': '金',
    '金': '木'
  };
  
  return controllingRelations[source] === target;
}

// 获取五行对应的CSS类名
function getWuxingClass(element) {
  const calculator = BaziCalculator();
  const wuxing = calculator.getWuxing(element);
  
  switch (wuxing) {
    case '木': return 'wood';
    case '火': return 'fire';
    case '土': return 'earth';
    case '金': return 'metal';
    case '水': return 'water';
    default: return '';
  }
}

// 分析大运与命局的整体关系
function analyzeDayunRelationship(daYunGanZhi, bazi) {
  try {
    const calculator = BaziCalculator();
    const { t } = React.useContext(I18nContext);
    
    // 获取大运干支的五行属性
    const daYunGan = daYunGanZhi.charAt(0);
    const daYunZhi = daYunGanZhi.charAt(1);
    
    // 获取命局信息
    const yearGan = bazi.yearPillar.gan;
    const monthGan = bazi.monthPillar.gan;
    const dayGan = bazi.dayPillar.gan;
    const hourGan = bazi.hourPillar ? bazi.hourPillar.gan : null;
    
    // 分析大运与年柱的关系
    let description = '';
    let advice = '';
    
    // 检查大运是否与年柱天干相同（逢冲）
    if (daYunGan === yearGan) {
      description += t('dayun_year_same') || '大运天干与年柱天干相同，表示人生阶段与原生家庭或社会背景产生共振，可能重新面对成长环境中的议题。';
      advice += t('dayun_year_same_advice') || '建议处理好家庭关系，重新审视原生家庭的影响，调整与长辈的互动模式。';
    }
    
    // 检查大运是否与月柱天干相同
    if (daYunGan === monthGan) {
      description += t('dayun_month_same') || '大运天干与月柱天干相同，表示此阶段与个人能力和专业发展紧密相关，有助于强化专业技能和职业定位。';
      advice += t('dayun_month_same_advice') || '建议专注于专业能力提升，参加进修或培训，巩固职业优势，拓展专业网络。';
    }
    
    // 检查大运地支与命局地支的冲克关系
    const yearZhi = bazi.yearPillar.zhi;
    const monthZhi = bazi.monthPillar.zhi;
    const dayZhi = bazi.dayPillar.zhi;
    const hourZhi = bazi.hourPillar ? bazi.hourPillar.zhi : null;
    
    // 地支六冲关系检查
    const zhiClashes = {
      '子': '午', '午': '子',
      '丑': '未', '未': '丑',
      '寅': '申', '申': '寅',
      '卯': '酉', '酉': '卯',
      '辰': '戌', '戌': '辰',
      '巳': '亥', '亥': '巳'
    };
    
    if (zhiClashes[daYunZhi] === yearZhi) {
      description += t('dayun_year_clash') || '大运地支与年柱地支相冲，可能带来家庭关系或生活基础的变动，需要调整与原生家庭的关系。';
      advice += t('dayun_year_clash_advice') || '宜妥善处理家庭事务，避免与长辈发生冲突，注意居住环境的变化和调整。';
    }
    
    if (zhiClashes[daYunZhi] === monthZhi) {
      description += t('dayun_month_clash') || '大运地支与月柱地支相冲，可能影响职业发展和工作稳定性，带来职业转变或工作环境变化。';
      advice += t('dayun_month_clash_advice') || '宜提前规划职业路径，增强适应能力，做好职业转型的准备，保持专业竞争力。';
    }
    
    if (zhiClashes[daYunZhi] === dayZhi) {
      description += t('dayun_day_clash') || '大运地支与日柱地支相冲，可能影响个人健康和婚姻关系，需要特别关注身心平衡和人际关系。';
      advice += t('dayun_day_clash_advice') || '宜注重健康管理，保持良好生活习惯，处理好婚姻和重要人际关系，避免情绪波动。';
    }
    
    // 如果描述和建议为空，添加默认内容
    if (description === '') {
      description = t('dayun_general_description') || '此大运与命局关系较为平稳，没有明显的冲突或特殊影响，可以按照大运五行特性发展。';
    }
    
    if (advice === '') {
      advice = t('dayun_general_advice') || '建议根据大运五行特性，合理规划人生发展方向，注重身心平衡，稳步推进各项计划。'
    }
    
    return {
      description,
      advice
    };
  } catch (error) {
    console.error("分析大运与命局关系错误:", error);
    reportError(error);
    return {
      description: '',
      advice: ''
    };
  }
}