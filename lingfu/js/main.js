// 主要JavaScript文件 - 处理用户交互和查询逻辑

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化年份选择器
    initYearSelector();
    
    // 绑定查询按钮事件
    document.getElementById('calculate-btn').addEventListener('click', calculateResult);
    
    // 初始化参考表格
    initReferenceTables();
});

// 初始化年份选择器
function initYearSelector() {
    const yearSelector = document.getElementById('lunar-year');
    const currentYear = new Date().getFullYear();
    
    // 添加1900-2050年的选项
    for (let year = 1900; year <= 2050; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year + '年';
        yearSelector.appendChild(option);
    }
    
    // 默认选择当前年份
    yearSelector.value = currentYear;
}

// 初始化参考表格
function initReferenceTables() {
    // 初始化表一：本命宫位查询表
    const table1 = document.getElementById('table1');
    
    // 创建表头行（月份）
    const headerRow = document.createElement('tr');
    const cornerCell = document.createElement('th');
    cornerCell.textContent = '时辰\月份';
    headerRow.appendChild(cornerCell);
    
    const monthNames = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    monthNames.forEach(month => {
        const th = document.createElement('th');
        th.textContent = month;
        headerRow.appendChild(th);
    });
    
    table1.appendChild(headerRow);
    
    // 添加时辰行
    const timeSlots = [
        '子时 (23:00-01:00)',
        '丑时 (01:00-03:00)',
        '寅时 (03:00-05:00)',
        '卯时 (05:00-07:00)',
        '辰时 (07:00-09:00)',
        '巳时 (09:00-11:00)',
        '午时 (11:00-13:00)',
        '未时 (13:00-15:00)',
        '申时 (15:00-17:00)',
        '酉时 (17:00-19:00)',
        '戌时 (19:00-21:00)',
        '亥时 (21:00-23:00)'
    ];
    
    const timeKeys = ['子时', '丑时', '寅时', '卯时', '辰时', '巳时', '午时', '未时', '申时', '酉时', '戌时', '亥时'];
    
    timeKeys.forEach((timeKey, index) => {
        const row = document.createElement('tr');
        
        // 添加时辰单元格
        const timeCell = document.createElement('th');
        timeCell.textContent = timeSlots[index];
        row.appendChild(timeCell);
        
        // 添加每个月份对应的宫位
        for (let i = 0; i < 12; i++) {
            const td = document.createElement('td');
            td.textContent = benmingTable[timeKey][i];
            row.appendChild(td);
        }
        
        table1.appendChild(row);
    });
    
    // 初始化表二：岁君与灵符对应表（简化版，仅展示部分数据）
    const table2 = document.getElementById('table2');
    
    // 创建表头行（流年属相）
    const headerRow2 = document.createElement('tr');
    const cornerCell2 = document.createElement('th');
    cornerCell2.textContent = '本命宫位\流年';
    headerRow2.appendChild(cornerCell2);
    
    const zodiacNames = ['子年(鼠年)', '丑年(牛年)', '寅年(虎年)', '卯年(兔年)', '辰年(龙年)', '巳年(蛇年)', 
                        '午年(马年)', '未年(羊年)', '申年(猴年)', '酉年(鸡年)', '戌年(狗年)', '亥年(猪年)'];
    zodiacNames.forEach(zodiac => {
        const th = document.createElement('th');
        th.textContent = zodiac;
        headerRow2.appendChild(th);
    });
    
    table2.appendChild(headerRow2);
    
    // 添加本命宫位行
    const gongweiList = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    const yearList = ['子年', '丑年', '寅年', '卯年', '辰年', '巳年', '午年', '未年', '申年', '酉年', '戌年', '亥年'];
    
    gongweiList.forEach(gongwei => {
        const row = document.createElement('tr');
        
        // 添加本命宫位单元格
        const gongweiCell = document.createElement('th');
        gongweiCell.textContent = gongwei;
        row.appendChild(gongweiCell);
        
        // 添加每个流年对应的灵符
        yearList.forEach(year => {
            const td = document.createElement('td');
            td.textContent = lingfuTable[gongwei][year];
            row.appendChild(td);
        });
        
        table2.appendChild(row);
    });
}

// 计算查询结果
function calculateResult() {
    // 显示加载动画
    document.getElementById('loading-overlay').classList.remove('hidden');
    
    // 获取用户输入
    const lunarYear = document.getElementById('lunar-year').value;
    const lunarMonth = document.getElementById('lunar-month').value;
    const lunarHour = document.getElementById('lunar-hour').value;
    
    // 验证输入
    if (!lunarYear || !lunarMonth || !lunarHour) {
        alert('请完整填写阴历出生年月和时辰信息！');
        document.getElementById('loading-overlay').classList.add('hidden');
        return;
    }
    
    // 添加炫酷的动画效果
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.innerHTML = '<div class="loader"></div><div class="loader-text">正在推算命理...</div>';
    
    // 模拟异步查询过程，增加动画效果
    setTimeout(() => {
        loadingOverlay.innerHTML = '<div class="loader"></div><div class="loader-text">正在查询本命宫位...</div>';
        
        setTimeout(() => {
            // 1. 查询本命宫位
            const benmingGong = getBenmingGong(lunarMonth, lunarHour + '时');
            
            loadingOverlay.innerHTML = '<div class="loader"></div><div class="loader-text">正在推算流年岁君...</div>';
            
            setTimeout(() => {
                // 2. 获取当前流年属相
                const currentYear = new Date().getFullYear();
                const suijun = getCurrentYearZodiac(currentYear);
                
                // 获取用户的属相
                const userZodiac = getZodiacByYear(lunarYear);
                
                loadingOverlay.innerHTML = '<div class="loader"></div><div class="loader-text">正在匹配灵验符咒...</div>';
                
                setTimeout(() => {
                    // 3. 查询对应岁君
                    const suijunName = getSuijun(benmingGong, suijun);
                    
                    // 4. 查询对应灵符
                    const lingfu = getLingfu(benmingGong, suijun);
                    
                    // 5. 查询灵符吉凶
                    const jixiong = getJixiong(suijunName);
                    
                    // 6. 查询灵符效用
                    const lingfuEffect = getLingfuEffect(lingfu);
                    
                    // 7. 获取使用方法
                    const usageMethod = getUsageMethod();
                    
                    loadingOverlay.innerHTML = '<div class="loader"></div><div class="loader-text">正在生成结果...</div>';
                    
                    setTimeout(() => {
                        // 清空上次查询记录
                        const resultCard = document.querySelector('.result-card');
                        const oldUserInfo = document.querySelector('.user-info');
                        if (oldUserInfo) {
                            resultCard.removeChild(oldUserInfo);
                        }
                        
                        // 更新结果显示
                        document.getElementById('benming-gong').textContent = benmingGong + '宫';
                        document.getElementById('suijun-year').textContent = suijun;
                        document.getElementById('suijun-name').textContent = suijunName;
                        document.getElementById('lingfu').textContent = lingfu;
                        document.getElementById('jixiong').textContent = jixiong;
                        document.getElementById('lingfu-effect').textContent = lingfuEffect;
                        document.getElementById('usage-method').innerHTML = usageMethod;
                        
                        // 添加用户输入信息显示
                        const userInfoDiv = document.createElement('div');
                        userInfoDiv.className = 'result-item user-info';
                        userInfoDiv.innerHTML = `
                            <h3>您的信息</h3>
                            <div class="result-value">
                                阴历：${lunarYear}年 ${document.getElementById('lunar-month').options[document.getElementById('lunar-month').selectedIndex].text} ${document.getElementById('lunar-hour').options[document.getElementById('lunar-hour').selectedIndex].text}<br>
                                属相：${userZodiac}
                            </div>
                        `;
                        resultCard.insertBefore(userInfoDiv, resultCard.firstChild.nextSibling);
                        
                        // 显示结果区域
                        document.getElementById('result-section').classList.remove('hidden');
                        document.getElementById('reference-tables').classList.remove('hidden');
                        
                        // 为结果项添加动画效果
                        const resultItems = document.querySelectorAll('.result-item');
                        resultItems.forEach((item, index) => {
                            item.style.opacity = '0';
                            item.style.transform = 'translateY(20px)';
                            setTimeout(() => {
                                item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                                item.style.opacity = '1';
                                item.style.transform = 'translateY(0)';
                            }, 100 * index);
                        });
                        
                        // 隐藏加载动画
                        document.getElementById('loading-overlay').classList.add('hidden');
                        
                        // 平滑滚动到结果区域
                        document.getElementById('result-section').scrollIntoView({ behavior: 'smooth' });
                    }, 500);
                }, 500);
            }, 500);
        }, 500);
    }, 500);
}

// 根据阴历月份和时辰查询本命宫位
function getBenmingGong(month, hour) {
    // 月份索引从0开始
    const monthIndex = parseInt(month) - 1;
    
    // 确保hour是正确的格式（如'子时'、'丑时'等）
    if (!benmingTable[hour]) {
        // 如果hour不是直接可用的键，尝试提取时辰部分
        const hourMatch = hour.match(/^([子丑寅卯辰巳午未申酉戌亥])/);
        if (hourMatch) {
            hour = hourMatch[1] + '时';
        } else {
            console.error('无效的时辰格式:', hour);
            return '未知';
        }
    }
    
    return benmingTable[hour][monthIndex];
}

// 获取当前流年属相
function getCurrentYearZodiac(year) {
    // 简化版，实际应用中需要更复杂的农历转换
    const zodiacIndex = (year - 4) % 12; // 4是因为1900年是鼠年
    const zodiacYearMap = {
        0: '子年', // 鼠
        1: '丑年', // 牛
        2: '寅年', // 虎
        3: '卯年', // 兔
        4: '辰年', // 龙
        5: '巳年', // 蛇
        6: '午年', // 马
        7: '未年', // 羊
        8: '申年', // 猴
        9: '酉年', // 鸡
        10: '戌年', // 狗
        11: '亥年'  // 猪
    };
    
    return zodiacYearMap[zodiacIndex];
}

// 根据年份获取属相
function getZodiacByYear(year) {
    const zodiacIndex = (year - 4) % 12; // 4是因为1900年是鼠年
    const zodiacMap = {
        0: '鼠',
        1: '牛',
        2: '虎',
        3: '兔',
        4: '龙',
        5: '蛇',
        6: '马',
        7: '羊',
        8: '猴',
        9: '鸡',
        10: '狗',
        11: '猪'
    };
    
    return zodiacMap[zodiacIndex];
}

// 根据本命宫位和流年查询岁君
function getSuijun(benmingGong, suijun) {
    return suijunTable[benmingGong][suijun];
}

// 根据本命宫位和流年查询灵符
function getLingfu(benmingGong, suijun) {
    return lingfuTable[benmingGong][suijun];
}

// 查询灵符吉凶
function getJixiong(suijunName) {
    // 处理带有'符'字的岁君名称
    const key = suijunName.replace('符', '');
    return jixiongTable[key] || jixiongTable[suijunName];
}

// 查询灵符效用
function getLingfuEffect(lingfu) {
    return lingfuEffectTable[lingfu];
}

// 获取使用方法
function getUsageMethod() {
    let html = '';
    lingfuUsageTable['通用方法'].forEach(method => {
        html += `<p>${method}</p>`;
    });
    return html;
}

// 添加动画效果
function addAnimationEffects() {
    // 为结果卡片添加渐入动画
    const resultCard = document.querySelector('.result-card');
    resultCard.style.animation = 'fadeIn 0.5s ease-out';
    
    // 为结果项添加依次渐入动画
    const resultItems = document.querySelectorAll('.result-item');
    resultItems.forEach((item, index) => {
        item.style.animation = `fadeIn 0.5s ease-out ${index * 0.1}s`;
        item.style.opacity = 0;
        item.style.animationFillMode = 'forwards';
    });
}