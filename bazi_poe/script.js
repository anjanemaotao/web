// 全局变量
let currentLang = 'zh-Hant';

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化年份选择器
    initYearSelector();
    
    // 初始化日期选择器
    updateDaySelector();
    
    // 初始化语言
    updateLanguage('zh-Hant');
    
    // 初始化浮动符号
    createFloatingSymbols();
    
    // 注册事件
    document.getElementById('calculateBtn').addEventListener('click', calculateBazi);
    document.getElementById('lunarMonth').addEventListener('change', updateDaySelector);
    
    // 语言切换
    document.querySelectorAll('.language-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            updateLanguage(lang);
            
            // 更新按钮激活状态
            document.querySelectorAll('.language-btn').forEach(b => {
                b.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
});

// 初始化年份选择器
function initYearSelector() {
    const yearSelect = document.getElementById('lunarYear');
    const currentYear = new Date().getFullYear();
    
    // 清空现有选项
    yearSelect.innerHTML = '';
    
    // 添加默认选项
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '--';
    defaultOption.selected = true;
    defaultOption.disabled = true;
    yearSelect.appendChild(defaultOption);
    
    // 添加年份选项（1900-当前年份）
    for (let year = 1900; year <= currentYear; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }

    // 默认选择当前年份
    yearSelect.value = currentYear;
}

// 更新日期选择器
function updateDaySelector() {
    const monthSelect = document.getElementById('lunarMonth');
    const daySelect = document.getElementById('lunarDay');
    const selectedMonth = parseInt(monthSelect.value);
    
    // 确定每月天数（简化，实际应考虑农历大小月）
    let daysInMonth = 30;
    if (selectedMonth === 2) {
        daysInMonth = 29; // 二月通常为小月
    }
    
    // 保存当前选中的日期
    const currentSelectedDay = daySelect.value;
    
    // 清空现有选项
    daySelect.innerHTML = '';
    
    // 添加日期选项
    for (let day = 1; day <= daysInMonth; day++) {
        const option = document.createElement('option');
        option.value = day;
        option.textContent = translations[currentLang][`day${day}`] || `${day}`;
        daySelect.appendChild(option);
    }
    
    // 尝试恢复之前选中的日期，如果超出范围则选择月末
    if (currentSelectedDay && currentSelectedDay <= daysInMonth) {
        daySelect.value = currentSelectedDay;
    } else {
        daySelect.value = 1;
    }
}

// 创建浮动符号
function createFloatingSymbols() {
    const container = document.getElementById('floatingSymbols');
    const symbols = ['☰', '☱', '☲', '☳', '☴', '☵', '☶', '☷', '卍', '卐', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
    
    for (let i = 0; i < 30; i++) {
        const symbol = document.createElement('div');
        symbol.className = 'symbol';
        symbol.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        
        // 随机位置
        const posX = Math.random() * 100;
        const posY = Math.random() * 100 + 100;
        symbol.style.left = `${posX}%`;
        symbol.style.top = `${posY}%`;
        
        // 随机大小
        const size = Math.random() * 3 + 1;
        symbol.style.fontSize = `${size}rem`;
        
        // 随机动画持续时间
        const duration = Math.random() * 40 + 20;
        symbol.style.animationDuration = `${duration}s`;
        
        // 随机动画延迟
        const delay = Math.random() * 40;
        symbol.style.animationDelay = `${delay}s`;
        
        container.appendChild(symbol);
    }
}

// 计算八字
function calculateBazi() {
    // 验证输入
    const yearSelect = document.getElementById('lunarYear');
    const year = parseInt(yearSelect.value);
    
    // 验证年份不能超过当前年份
    const currentYear = new Date().getFullYear();
    if (year > currentYear) {
        document.getElementById('yearError').classList.add('error-active');
        yearSelect.focus();
        return;
    }
    
    if (!year) {
        document.getElementById('yearError').classList.add('error-active');
        yearSelect.focus();
        return;
    } else {
        document.getElementById('yearError').classList.remove('error-active');
    }
    
    // 显示加载动画
    const loadingScreen = document.getElementById('loadingScreen');
    loadingScreen.classList.add('active');
    
    // 获取其他表单数据
    const lunarMonth = parseInt(document.getElementById('lunarMonth').value) || 1;
    const lunarDay = parseInt(document.getElementById('lunarDay').value) || 1;
    const lunarHour = parseInt(document.getElementById('lunarHour').value) || 1;
    const gender = document.getElementById('gender').value;
    
    // 设置计算超时
    const timeout = setTimeout(() => {
        loadingScreen.classList.remove('active');
        alert('计算超时，请重试');
    }, 10000);
    
    try {
        // 计算八字
        const bazi = calculateRealBazi(year, lunarMonth, lunarDay, lunarHour);
        
        // 计算格局
        const geju = determineGeju(bazi, gender);
        
        // 清除超时
        clearTimeout(timeout);
        
        // 更新界面显示结果
        updateResults(bazi, geju);
        
        // 隐藏加载动画
        loadingScreen.classList.remove('active');
        
        // 显示结果部分
        document.getElementById('resultsContainer').style.display = 'block';
        
        // 滚动到结果部分
        document.getElementById('resultsContainer').scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('计算出错:', error);
        loadingScreen.classList.remove('active');
        alert('计算出错，请重试');
        clearTimeout(timeout);
    }
}

// 更新结果显示
function updateResults(bazi, geju) {
    // 添加参数校验
    if (!bazi || !geju) {
        console.error('Invalid parameters');
        return;
    }

    // 使用可选链操作符安全访问属性
    const safeUpdate = (id, value) => {
        const el = document.getElementById(id);
        el && (el.textContent = value || '');
    };

    // 更新八字显示（添加空值处理）
    safeUpdate('yearStem', bazi?.year?.stem);
    safeUpdate('yearBranch', bazi?.year?.branch);
    safeUpdate('yearHidden', bazi?.year?.hidden);

    safeUpdate('monthStem', bazi?.month?.stem);
    safeUpdate('monthBranch', bazi?.month?.branch);
    safeUpdate('monthHidden', bazi?.month?.hidden);

    safeUpdate('dayStem', bazi?.day?.stem);
    safeUpdate('dayBranch', bazi?.day?.branch);
    safeUpdate('dayHidden', bazi?.day?.hidden);

    safeUpdate('hourStem', bazi?.hour?.stem);
    safeUpdate('hourBranch', bazi?.hour?.branch);
    safeUpdate('hourHidden', bazi?.hour?.hidden);

    // 添加五行分布校验
    if (bazi.elementCounts && Object.keys(bazi.elementCounts).length === 5) {
        updateWuxingChart(bazi.elementCounts);
    } else {
        console.warn('Invalid elementCounts:', bazi.elementCounts);
    }

    // 更新格局分析（添加空值保护）
    const gejuTypeEl = document.getElementById('gejuType');
    if (gejuTypeEl) {
        gejuTypeEl.textContent = translations[currentLang]?.[geju.type] || geju.type;
        gejuTypeEl.className = 'geju-type';
        gejuTypeEl.setAttribute('data-type', geju.type);
    }

    const gejuDescEl = document.getElementById('gejuDescription');
    if (gejuDescEl) {
        gejuDescEl.textContent = translations[currentLang]?.[geju.type + 'Desc'] || '';
    }

    // 重构详细信息列表（添加容器存在检查）
    const detailsList = document.getElementById('detailsList');
    if (detailsList) {
        detailsList.innerHTML = '';

        // 添加日主强弱分析（添加属性校验）
        if (typeof bazi.dayMasterStrength !== 'undefined') {
            const strengthKey = bazi.dayMasterStrength ? 'dayMasterStrong' : 'dayMasterWeak';
            const detailItem = createDetailItem(strengthKey, bazi.dayMasterStrength ? 'dayMasterStrongDetail' : 'dayMasterWeakDetail');
            detailsList.appendChild(detailItem);
        }

        // 添加月令分析（添加属性校验）
        if (typeof bazi.isSeasonMatch !== 'undefined') {
            const seasonKey = bazi.isSeasonMatch ? 'seasonMatch' : 'seasonNotMatch';
            const seasonItem = createDetailItem(seasonKey, seasonKey + 'Detail');
            detailsList.appendChild(seasonItem);
        }

        // 添加五行生克分析（添加错误边界）
        try {
            const analysisContent = generateWuxingAnalysis(bazi);
            const wuxingItem = createDetailItem('五行生克分析', analysisContent);
            detailsList.appendChild(wuxingItem);
        } catch (e) {
            console.error('生成五行分析失败:', e);
        }
    }

    // 创建详情项的辅助函数
    function createDetailItem(labelKey, contentKey) {
        const div = document.createElement('div');
        div.className = 'detail-item';
        div.innerHTML = `
            <div class="detail-label">${translations[currentLang]?.[labelKey] || labelKey}</div>
            <div>${translations[currentLang]?.[contentKey] || ''}</div>
        `;
        return div;
    }
}

// 更新五行图表
function updateWuxingChart(elementCounts) {
    const elements = ['wood', 'fire', 'earth', 'metal', 'water'];
    const maxCount = Math.max(...Object.values(elementCounts));
    
    elements.forEach(element => {
        const count = elementCounts[element.toUpperCase()];
        const percentage = (count / maxCount) * 100;
        
        document.getElementById(`${element}Fill`).style.height = `${percentage}%`;
        document.getElementById(`${element}Value`).textContent = count.toFixed(1);
    });
}

// 生成五行生克分析文本
function generateWuxingAnalysis(bazi) {
    const dayElement = bazi.dayStemElement;
    const elementCounts = bazi.elementCounts;
    
    // 五行相生关系
    const generates = {
        '木': '火',
        '火': '土',
        '土': '金',
        '金': '水',
        '水': '木'
    };
    
    // 五行相克关系
    const controls = {
        '木': '土',
        '土': '水',
        '水': '火',
        '火': '金',
        '金': '木'
    };
    
    let analysis = `日主五行为${dayElement}，`;
    
    // 分析生助关系
    const generatingElement = Object.entries(generates).find(([k, v]) => v === dayElement)[0];
    const generatedElement = generates[dayElement];
    
    analysis += `得${generatingElement}生助，可生${generatedElement}。`;
    
    // 分析克制关系
    const controllingElement = Object.entries(controls).find(([k, v]) => v === dayElement)[0];
    const controlledElement = controls[dayElement];
    
    analysis += `被${controllingElement}所克，可克制${controlledElement}。`;
    
    // 分析五行强弱
    const elementStrengths = Object.entries(elementCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([element, count]) => `${element}(${count.toFixed(1)})`)
        .join('、');
    
    analysis += `\n五行强弱分布为：${elementStrengths}。`;
    
    return analysis;
}

// 判断日主强弱
function judgeDayMasterStrength(dayElement, elementCounts, isSeasonMatch) {
    // 基础分值
    let strength = elementCounts[dayElement];
    
    // 月令得令加分
    if (isSeasonMatch) {
        strength *= 1.2;
    }
    
    // 判断强弱（基准值为2）
    return strength > 2;
}

// 计算格局
function determineGeju(bazi, gender) {
    const { elementCounts, dayMasterStrength, isSeasonMatch } = bazi;
    
    // 计算各格局得分
    let gejuScore = {
        shangguan: 0, // 伤官格
        yinzhong: 0,  // 印中格
        bixian: 0,    // 比肩格
        shazhong: 0,  // 煞重格
        caiwang: 0    // 财旺格
    };
}
    //