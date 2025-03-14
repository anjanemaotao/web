/**
 * 阴历命理查询系统主逻辑文件
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化年份选项
    initYearOptions();
    
    // 表单提交事件
    document.getElementById('birthForm').addEventListener('submit', function(e) {
        e.preventDefault();
        showLoading();
        
        // 模拟计算延迟，增强神秘感
        setTimeout(function() {
            calculateFate();
            hideLoading();
        }, 2000);
    });
    
    // 新查询按钮事件
    document.getElementById('newQueryBtn').addEventListener('click', function() {
        document.getElementById('resultSection').style.display = 'none';
        document.getElementById('birthForm').reset();
        document.querySelector('.input-section').style.display = 'block';
    });
    
    // 打印按钮事件
    document.getElementById('printBtn').addEventListener('click', function() {
        window.print();
    });
});

/**
 * 初始化年份选项
 */
// 初始化年份选择下拉框
function initYearOptions() {
    const yearSelect = document.getElementById('year');
    const currentYear = new Date().getFullYear();
    
    // 清空现有选项
    yearSelect.innerHTML = '';
    
    // 添加默认选项
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '请选择出生年份';
    yearSelect.appendChild(defaultOption);
    
    // 添加最近60年的选项
    for (let i = 0; i < 60; i++) {
        const year = currentYear - i;
        const option = document.createElement('option');
        
        // 计算年份对应的地支
        const earthlyBranchIndex = (year - 4) % 12; // 子鼠年的基准是公元4年
        const earthlyBranch = EARTHLY_BRANCHES[earthlyBranchIndex];
        const zodiac = ZODIAC_YEARS[earthlyBranch];
        
        option.value = year;
        option.textContent = `${year}年 (${earthlyBranch}${zodiac}年)`;
        yearSelect.appendChild(option);
    }
}

// 确保在页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initYearOptions();
    // 删除这里的initMonthOptions和initHourOptions调用，因为这些函数还未定义
    
    // 表单提交事件
    document.getElementById('birthForm').addEventListener('submit', function(e) {
        e.preventDefault();
        showLoading();
        
        setTimeout(function() {
            calculateFate();
            hideLoading();
        }, 2000);
    });
    
    // 其他按钮事件监听
    document.getElementById('newQueryBtn')?.addEventListener('click', function() {
        document.getElementById('resultSection').style.display = 'none';
        document.getElementById('birthForm').reset();
        document.querySelector('.input-section').style.display = 'block';
    });
    
    document.getElementById('printBtn')?.addEventListener('click', function() {
        window.print();
    });
});

// 修改calculateFate函数，统一变量名
function calculateFate() {
    const year = document.getElementById('year').value;
    const month = parseInt(document.getElementById('month').value);
    const hour = document.getElementById('hour').value;
    
    if (!year || !month || !hour) {
        alert('请完整填写出生信息！');
        return;
    }
    
    // 计算年份对应的地支
    const earthlyBranchIndex = (year - 4) % 12;
    const earthlyBranch = EARTHLY_BRANCHES[earthlyBranchIndex];
    
    // 计算本命宫位
    const bengMingGong = BENGMING_GONG_TABLE[month][hour];
    
    // 计算岁君
    const suiJun = SUIJUN_TABLE[bengMingGong][earthlyBranch];
    
    // 显示结果
    displayResults(bengMingGong, suiJun, year, month, hour);
}

// 修改displayResults函数中的变量引用
function displayResults(bengMingGong, suiJun, year, month, hour) {
    // 隐藏输入区域，显示结果区域
    document.querySelector('.input-section').style.display = 'none';
    const resultSection = document.getElementById('resultSection');
    resultSection.style.display = 'block';
    
    // 添加动画效果
    setTimeout(() => {
        resultSection.classList.add('visible');
    }, 100);
    
    // 显示本命宫位
    const bengMingGongElement = document.getElementById('bengMingGong');
    bengMingGongElement.innerHTML = `
        <div class="gong-result">
            <p>您的本命宫位是：<strong class="highlight-text">${bengMingGong}宫</strong></p>
            <p>阴历月份：${month}月</p>
            <p>出生时辰：${hour}时</p>
            <div class="gong-table-container">
                <table class="gong-table">
                    <tr>
                        <th>月份/时辰</th>
                        ${EARTHLY_BRANCHES.map(branch => `<th>${branch}时</th>`).join('')}
                    </tr>
                    ${Object.keys(BENGMING_GONG_TABLE).map(month => `
                        <tr>
                            <th>${month}月</th>
                            ${EARTHLY_BRANCHES.map(branch => {
                                const gong = BENGMING_GONG_TABLE[month][branch];
                                return `<td ${gong === bengMingGong ? 'class="highlight-cell"' : ''}>${gong}</td>`;
                            }).join('')}
                        </tr>
                    `).join('')}
                </table>
            </div>
        </div>
    `;
    
    // 显示岁君信息
    const suiJunElement = document.getElementById('suiJun');
    const talismanName = suiJun + '符';
    const talismanInfo = TALISMANS[talismanName]; // 修改这里
    const talismanLevel = TALISMAN_LEVELS[talismanName];
    const talismanImage = TALISMAN_IMAGES[talismanName];
    
    suiJunElement.innerHTML = `
        <div class="suijun-result">
            <h3>您的岁君是：<strong class="highlight-text">${suiJun}</strong></h3>
            <p>根据您的本命宫位和出生年份，您需要的符咒是：</p>
            <div class="talisman-card ${getLevelClass(talismanLevel)}">
                <div class="talisman-header">
                    <h4>${talismanName}</h4>
                    <span class="talisman-level">${talismanLevel}</span>
                </div>
                <div class="talisman-content">
                    <div class="talisman-image">
                        <img src="${talismanImage}" alt="${talismanName}">
                    </div>
                    <div class="talisman-info">
                        <p class="talisman-description">${talismanInfo.description}</p>
                        <div class="talisman-effect">
                            <h5>效用说明：</h5>
                            <p>${talismanInfo.effect}</p>
                        </div>
                    </div>
                </div>
                <div class="talisman-usage">
                    <h5>使用方法：</h5>
                    <ol>
                        ${talismanInfo.usage.map(step => `<li>${step}</li>`).join('')}
                    </ol>
                </div>
            </div>
        </div>
    `;
    
    // 显示注意事项
    const notesElement = document.getElementById('notes');
    notesElement.innerHTML = `
        <div class="notes-section">
            <h3>注意事项：</h3>
            <ul>
                ${NOTES.map(note => `<li>${note}</li>`).join('')}
            </ul>
        </div>
    `;
    
    // 显示查询时间
    const dateElement = document.getElementById('queryDate');
    const now = new Date();
    const dateString = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    dateElement.textContent = `查询时间：${dateString}`;
}

/**
 * 根据符咒等级获取对应的CSS类名
 */
function getLevelClass(level) {
    switch(level) {
        case '大吉':
            return 'level-great';
        case '小吉':
            return 'level-good';
        case '小凶':
            return 'level-bad';
        case '大凶':
            return 'level-terrible';
        case '极端':
            return 'level-extreme';
        default:
            return '';
    }
}

/**
 * 显示符咒详情
 */
// 在showTalismanDetail函数中也需要修改
function showTalismanDetail(talismanName) {
    const modal = document.getElementById('talismanModal');
    const modalContent = document.getElementById('talismanModalContent');
    const talismanInfo = TALISMAN_EFFECTS[talismanName]; // 修改这里
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h3>${talismanName}</h3>
            <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body">
            <div class="talisman-image">
                <img src="${TALISMAN_IMAGES[talismanName]}" alt="${talismanName}">
            </div>
            <div class="talisman-detail">
                <p class="talisman-description">${talismanInfo.description}</p>
                <div class="talisman-effect">
                    <h4>效用说明：</h4>
                    <p>${talismanInfo.effect}</p>
                </div>
                <div class="talisman-usage">
                    <h4>使用方法：</h4>
                    <ol>
                        ${talismanInfo.usage.map(step => `<li>${step}</li>`).join('')}
                    </ol>
                </div>
            </div>
        </div>
    `;
    
    // 关闭按钮事件
    const closeBtn = modalContent.querySelector('.close-modal');
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    modal.style.display = 'block';
    
    // 点击模态框外部关闭
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

/**
 * 分享结果
 */
function shareResult() {
    // 获取当前结果内容
    const bengMingGong = document.querySelector('#bengMingGong .highlight-text').textContent;
    const suiJun = document.querySelector('#suiJun .highlight-text').textContent;
    const talismanName = document.querySelector('#suiJun .talisman-header h4').textContent;
    const talismanLevel = document.querySelector('#suiJun .talisman-level').textContent;
    
    // 构建分享文本
    const shareText = `我的阴历命理查询结果：本命宫位是${bengMingGong}，岁君是${suiJun}，需要的符咒是${talismanName}（${talismanLevel}）。来自阴历命理查询系统。`;
    
    // 检查是否支持分享API
    if (navigator.share) {
        navigator.share({
            title: '阴历命理查询结果',
            text: shareText,
            url: window.location.href
        }).catch(error => {
            console.error('分享失败:', error);
            fallbackShare(shareText);
        });
    } else {
        fallbackShare(shareText);
    }
}

/**
 * 备用分享方法（复制到剪贴板）
 */
function fallbackShare(text) {
    // 创建临时文本区域
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    
    // 选择并复制文本
    textarea.select();
    document.execCommand('copy');
    
    // 移除临时元素
    document.body.removeChild(textarea);
    
    // 显示提示
    alert('结果已复制到剪贴板，您可以粘贴分享给朋友。');
}

/**
 * 保存结果为图片
 */
function saveAsImage() {
    const resultSection = document.getElementById('resultSection');
    
    // 使用html2canvas库将结果区域转换为图片
    html2canvas(resultSection, {
        scale: 2, // 提高图片质量
        useCORS: true, // 允许跨域图片
        backgroundColor: '#f5f5f5'
    }).then(canvas => {
        // 转换为图片并下载
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = '阴历命理查询结果.png';
        link.click();
    }).catch(error => {
        console.error('保存图片失败:', error);
        alert('保存图片失败，请稍后再试。');
    });
}

/**
 * 切换主题
 */
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDarkTheme = document.body.classList.contains('dark-theme');
    localStorage.setItem('darkTheme', isDarkTheme);
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.textContent = isDarkTheme ? '☀️ 切换亮色' : '🌙 切换暗色';
    }
}

// 初始化页面时添加事件监听
document.addEventListener('DOMContentLoaded', function() {
    // 为结果页面中的符咒卡片添加点击事件
    document.addEventListener('click', function(e) {
        if (e.target.closest('.talisman-card')) {
            const talismanCard = e.target.closest('.talisman-card');
            const talismanName = talismanCard.querySelector('h4').textContent;
            showTalismanDetail(talismanName);
        }
    });
    
    // 添加分享按钮事件
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', shareResult);
    }
    
    // 添加保存图片按钮事件
    const saveImageBtn = document.getElementById('saveImageBtn');
    if (saveImageBtn) {
        saveImageBtn.addEventListener('click', saveAsImage);
    }
    
    // 添加主题切换按钮事件
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        
        // 检查本地存储的主题设置
        const savedTheme = localStorage.getItem('darkTheme');
        if (savedTheme === 'true') {
            document.body.classList.add('dark-theme');
            themeToggle.textContent = '☀️ 切换亮色';
        }
    }
    
    // 添加年份变化事件，动态更新生肖显示
    const yearSelect = document.getElementById('lunarYear');
    if (yearSelect) {
        yearSelect.addEventListener('change', function() {
            const selectedYear = this.value;
            const zodiacName = ZODIAC_YEARS[selectedYear];
            const zodiacDisplay = document.getElementById('zodiacDisplay');
            if (zodiacDisplay) {
                zodiacDisplay.textContent = zodiacName;
                zodiacDisplay.className = 'zodiac-icon ' + selectedYear;
            }
        });
    }
});

/**
 * 加载html2canvas库
 */
function loadHtml2Canvas() {
    if (window.html2canvas) return Promise.resolve();
    
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// 预加载html2canvas库
document.addEventListener('DOMContentLoaded', function() {
    loadHtml2Canvas().catch(error => {
        console.warn('html2canvas加载失败，保存图片功能可能不可用', error);
    });
});

// 添加月份初始化函数
function initMonthOptions() {
    const monthSelect = document.getElementById('month');
    monthSelect.innerHTML = '<option value="">请选择出生月份</option>';
    
    for (let i = 1; i <= 12; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i}月`;
        monthSelect.appendChild(option);
    }
}

// 添加时辰初始化函数
function initHourOptions() {
    const hourSelect = document.getElementById('hour');
    hourSelect.innerHTML = '<option value="">请选择出生时辰</option>';
    
    EARTHLY_BRANCHES.forEach(branch => {
        const option = document.createElement('option');
        option.value = branch;
        option.textContent = `${branch}时`;
        hourSelect.appendChild(option);
    });
}

// 修复displayResults函数中的变量引用
function displayResults(bengMingGong, suiJun, year, month, hour) {
    // 隐藏输入区域，显示结果区域
    document.querySelector('.input-section').style.display = 'none';
    const resultSection = document.getElementById('resultSection');
    resultSection.style.display = 'block';
    
    // 添加动画效果
    setTimeout(() => {
        resultSection.classList.add('visible');
    }, 100);
    
    // 显示本命宫位
    const bengMingGongElement = document.getElementById('bengMingGong');
    bengMingGongElement.innerHTML = `
        <div class="gong-result">
            <p>您的本命宫位是：<strong class="highlight-text">${bengMingGong}宫</strong></p>
            <p>阴历月份：${month}月</p>
            <p>出生时辰：${hour}时</p>
            <div class="gong-table-container">
                <table class="gong-table">
                    <tr>
                        <th>月份/时辰</th>
                        ${EARTHLY_BRANCHES.map(branch => `<th>${branch}时</th>`).join('')}
                    </tr>
                    ${Object.keys(BENGMING_GONG_TABLE).map(month => `
                        <tr>
                            <th>${month}月</th>
                            ${EARTHLY_BRANCHES.map(branch => {
                                const gong = BENGMING_GONG_TABLE[month][branch];
                                return `<td ${gong === bengMingGong ? 'class="highlight-cell"' : ''}>${gong}</td>`;
                            }).join('')}
                        </tr>
                    `).join('')}
                </table>
            </div>
        </div>
    `;
    
    // 显示岁君信息
    const suiJunElement = document.getElementById('suiJun');
    const talismanName = suiJun + '符';
    const talismanInfo = TALISMANS[talismanName];
    const talismanLevel = TALISMAN_LEVELS[talismanName];
    const talismanImage = TALISMAN_IMAGES[talismanName];
    
    suiJunElement.innerHTML = `
        <div class="suijun-result">
            <h3>您的岁君是：<strong class="highlight-text">${suiJun}</strong></h3>
            <p>根据您的本命宫位和出生年份，您需要的符咒是：</p>
            <div class="talisman-card ${getLevelClass(talismanLevel)}">
                <div class="talisman-header">
                    <h4>${talismanName}</h4>
                    <span class="talisman-level">${talismanLevel}</span>
                </div>
                <div class="talisman-content">
                    <div class="talisman-image">
                        <img src="${talismanImage}" alt="${talismanName}">
                    </div>
                    <div class="talisman-info">
                        <p class="talisman-description">${talismanInfo.description}</p>
                        <div class="talisman-effect">
                            <h5>效用说明：</h5>
                            <p>${talismanInfo.effect}</p>
                        </div>
                    </div>
                </div>
                <div class="talisman-usage">
                    <h5>使用方法：</h5>
                    <ol>
                        ${talismanInfo.usage.map(step => `<li>${step}</li>`).join('')}
                    </ol>
                </div>
            </div>
        </div>
    `;
    
    // 显示注意事项
    const notesElement = document.getElementById('notes');
    notesElement.innerHTML = `
        <div class="notes-section">
            <h3>注意事项：</h3>
            <ul>
                ${NOTES.map(note => `<li>${note}</li>`).join('')}
            </ul>
        </div>
    `;
    
    // 显示查询时间
    const dateElement = document.getElementById('queryDate');
    const now = new Date();
    const dateString = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    dateElement.textContent = `查询时间：${dateString}`;
}

/**
 * 根据符咒等级获取对应的CSS类名
 */
function getLevelClass(level) {
    switch(level) {
        case '大吉':
            return 'level-great';
        case '小吉':
            return 'level-good';
        case '小凶':
            return 'level-bad';
        case '大凶':
            return 'level-terrible';
        case '极端':
            return 'level-extreme';
        default:
            return '';
    }
}

/**
 * 显示符咒详情
 */
// 在showTalismanDetail函数中也需要修改
function showTalismanDetail(talismanName) {
    const modal = document.getElementById('talismanModal');
    const modalContent = document.getElementById('talismanModalContent');
    const talismanInfo = TALISMANS[talismanName]; // 修改这里
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h3>${talismanName}</h3>
            <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body">
            <div class="talisman-image">
                <img src="${TALISMAN_IMAGES[talismanName]}" alt="${talismanName}">
            </div>
            <div class="talisman-detail">
                <p class="talisman-description">${talismanInfo.description}</p>
                <div class="talisman-effect">
                    <h4>效用说明：</h4>
                    <p>${talismanInfo.effect}</p>
                </div>
                <div class="talisman-usage">
                    <h4>使用方法：</h4>
                    <ol>
                        ${talismanInfo.usage.map(step => `<li>${step}</li>`).join('')}
                    </ol>
                </div>
            </div>
        </div>
    `;
    
    // 关闭按钮事件
    const closeBtn = modalContent.querySelector('.close-modal');
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    modal.style.display = 'block';
    
    // 点击模态框外部关闭
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

/**
 * 分享结果
 */
function shareResult() {
    // 获取当前结果内容
    const bengMingGong = document.querySelector('#bengMingGong .highlight-text').textContent;
    const suiJun = document.querySelector('#suiJun .highlight-text').textContent;
    const talismanName = document.querySelector('#suiJun .talisman-header h4').textContent;
    const talismanLevel = document.querySelector('#suiJun .talisman-level').textContent;
    
    // 构建分享文本
    const shareText = `我的阴历命理查询结果：本命宫位是${bengMingGong}，岁君是${suiJun}，需要的符咒是${talismanName}（${talismanLevel}）。来自阴历命理查询系统。`;
    
    // 检查是否支持分享API
    if (navigator.share) {
        navigator.share({
            title: '阴历命理查询结果',
            text: shareText,
            url: window.location.href
        }).catch(error => {
            console.error('分享失败:', error);
            fallbackShare(shareText);
        });
    } else {
        fallbackShare(shareText);
    }
}

/**
 * 备用分享方法（复制到剪贴板）
 */
function fallbackShare(text) {
    // 创建临时文本区域
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    
    // 选择并复制文本
    textarea.select();
    document.execCommand('copy');
    
    // 移除临时元素
    document.body.removeChild(textarea);
    
    // 显示提示
    alert('结果已复制到剪贴板，您可以粘贴分享给朋友。');
}

/**
 * 保存结果为图片
 */
function saveAsImage() {
    const resultSection = document.getElementById('resultSection');
    
    // 使用html2canvas库将结果区域转换为图片
    html2canvas(resultSection, {
        scale: 2, // 提高图片质量
        useCORS: true, // 允许跨域图片
        backgroundColor: '#f5f5f5'
    }).then(canvas => {
        // 转换为图片并下载
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = '阴历命理查询结果.png';
        link.click();
    }).catch(error => {
        console.error('保存图片失败:', error);
        alert('保存图片失败，请稍后再试。');
    });
}

/**
 * 切换主题
 */
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDarkTheme = document.body.classList.contains('dark-theme');
    localStorage.setItem('darkTheme', isDarkTheme);
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.textContent = isDarkTheme ? '☀️ 切换亮色' : '🌙 切换暗色';
    }
}

// 初始化页面时添加事件监听
document.addEventListener('DOMContentLoaded', function() {
    // 为结果页面中的符咒卡片添加点击事件
    document.addEventListener('click', function(e) {
        if (e.target.closest('.talisman-card')) {
            const talismanCard = e.target.closest('.talisman-card');
            const talismanName = talismanCard.querySelector('h4').textContent;
            showTalismanDetail(talismanName);
        }
    });
    
    // 添加分享按钮事件
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', shareResult);
    }
    
    // 添加保存图片按钮事件
    const saveImageBtn = document.getElementById('saveImageBtn');
    if (saveImageBtn) {
        saveImageBtn.addEventListener('click', saveAsImage);
    }
    
    // 添加主题切换按钮事件
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        
        // 检查本地存储的主题设置
        const savedTheme = localStorage.getItem('darkTheme');
        if (savedTheme === 'true') {
            document.body.classList.add('dark-theme');
            themeToggle.textContent = '☀️ 切换亮色';
        }
    }
    
    // 添加年份变化事件，动态更新生肖显示
    const yearSelect = document.getElementById('lunarYear');
    if (yearSelect) {
        yearSelect.addEventListener('change', function() {
            const selectedYear = this.value;
            const zodiacName = ZODIAC_YEARS[selectedYear];
            const zodiacDisplay = document.getElementById('zodiacDisplay');
            if (zodiacDisplay) {
                zodiacDisplay.textContent = zodiacName;
                zodiacDisplay.className = 'zodiac-icon ' + selectedYear;
            }
        });
    }
});

/**
 * 加载html2canvas库
 */
function loadHtml2Canvas() {
    if (window.html2canvas) return Promise.resolve();
    
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// 预加载html2canvas库
document.addEventListener('DOMContentLoaded', function() {
    loadHtml2Canvas().catch(error => {
        console.warn('html2canvas加载失败，保存图片功能可能不可用', error);
    });
});

// 添加月份初始化函数
function initMonthOptions() {
    const monthSelect = document.getElementById('month');
    monthSelect.innerHTML = '<option value="">请选择出生月份</option>';
    
    for (let i = 1; i <= 12; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i}月`;
        monthSelect.appendChild(option);
    }
}

// 添加时辰初始化函数
function initHourOptions() {
    const hourSelect = document.getElementById('hour');
    hourSelect.innerHTML = '<option value="">请选择出生时辰</option>';
    
    EARTHLY_BRANCHES.forEach(branch => {
        const option = document.createElement('option');
        option.value = branch;
        option.textContent = `${branch}时`;
        hourSelect.appendChild(option);
    });
}

// 修复displayResults函数中的变量引用
function displayResults(bengMingGong, suiJun, year, month, hour) {
    // 隐藏输入区域，显示结果区域
    document.querySelector('.input-section').style.display = 'none';
    const resultSection = document.getElementById('resultSection');
    resultSection.style.display = 'block';
    
    // 添加动画效果
    setTimeout(() => {
        resultSection.classList.add('visible');
    }, 100);
    
    // 显示本命宫位
    const bengMingGongElement = document.getElementById('bengMingGong');
    bengMingGongElement.innerHTML = `
        <div class="gong-result">
            <p>您的本命宫位是：<strong class="highlight-text">${bengMingGong}宫</strong></p>
            <p>阴历月份：${month}月</p>
            <p>出生时辰：${hour}时</p>
            <div class="gong-table-container">
                <table class="gong-table">
                    <tr>
                        <th>月份/时辰</th>
                        ${EARTHLY_BRANCHES.map(branch => `<th>${branch}时</th>`).join('')}
                    </tr>
                    ${Object.keys(BENGMING_GONG_TABLE).map(month => `
                        <tr>
                            <th>${month}月</th>
                            ${EARTHLY_BRANCHES.map(branch => {
                                const gong = BENGMING_GONG_TABLE[month][branch];
                                return `<td ${gong === bengMingGong ? 'class="highlight-cell"' : ''}>${gong}</td>`;
                            }).join('')}
                        </tr>
                    `).join('')}
                </table>
            </div>
        </div>
    `;
    
    // 显示岁君信息
    const suiJunElement = document.getElementById('suiJun');
    const talismanName = suiJun + '符';
    const talismanInfo = TALISMANS[talismanName];
    const talismanLevel = TALISMAN_LEVELS[talismanName];
    const talismanImage = TALISMAN_IMAGES[talismanName];
    
    suiJunElement.innerHTML = `
        <div class="suijun-result">
            <h3>您的岁君是：<strong class="highlight-text">${suiJun}</strong></h3>
            <p>根据您的本命宫位和出生年份，您需要的符咒是：</p>
            <div class="talisman-card ${getLevelClass(talismanLevel)}">
                <div class="talisman-header">
                    <h4>${talismanName}</h4>
                    <span class="talisman-level">${talismanLevel}</span>
                </div>
                <div class="talisman-content">
                    <div class="talisman-image">
                        <img src="${talismanImage}" alt="${talismanName}">
                    </div>
                    <div class="talisman-info">
                        <p class="talisman-description">${talismanInfo.description}</p>
                        <div class="talisman-effect">
                            <h5>效用说明：</h5>
                            <p>${talismanInfo.effect}</p>
                        </div>
                    </div>
                </div>
                <div class="talisman-usage">
                    <h5>使用方法：</h5>
                    <ol>
                        ${talismanInfo.usage.map(step => `<li>${step}</li>`).join('')}
                    </ol>
                </div>
            </div>
        </div>
    `;
    
    // 显示注意事项
    const notesElement = document.getElementById('notes');
    notesElement.innerHTML = `
        <div class="notes-section">
            <h3>注意事项：</h3>
            <ul>
                ${NOTES.map(note => `<li>${note}</li>`).join('')}
            </ul>
        </div>
    `;
    
    // 显示查询时间
    const dateElement = document.getElementById('queryDate');
    const now = new Date();
    const dateString = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    dateElement.textContent = `查询时间：${dateString}`;
}

/**
 * 根据符咒等级获取对应的CSS类名
 */
function getLevelClass(level) {
    switch(level) {
        case '大吉':
            return 'level-great';
        case '小吉':
            return 'level-good';
        case '小凶':
            return 'level-bad';
        case '大凶':
            return 'level-terrible';
        case '极端':
            return 'level-extreme';
        default:
            return '';
    }
}

/**
 * 显示符咒详情
 */
// 在showTalismanDetail函数中也需要修改
function showTalismanDetail(talismanName) {
    const modal = document.getElementById('talismanModal');
    const modalContent = document.getElementById('talismanModalContent');
    const talismanInfo = TALISMAN_EFFECTS[talismanName]; // 修改这里
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h3>${talismanName}</h3>
            <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body">
            <div class="talisman-image">
                <img src="${TALISMAN_IMAGES[talismanName]}" alt="${talismanName}">
            </div>
            <div class="talisman-detail">
                <p class="talisman-description">${talismanInfo.description}</p>
                <div class="talisman-effect">
                    <h4>效用说明：</h4>
                    <p>${talismanInfo.effect}</p>
                </div>
                <div class="talisman-usage">
                    <h4>使用方法：</h4>
                    <ol>
                        ${talismanInfo.usage.map(step => `<li>${step}</li>`).join('')}
                    </ol>
                </div>
            </div>
        </div>
    `;
    
    // 关闭按钮事件
    const closeBtn = modalContent.querySelector('.close-modal');
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    modal.style.display = 'block';
    
    // 点击模态框外部关闭
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

/**
 * 分享结果
 */
function shareResult() {
    // 获取当前结果内容
    const bengMingGong = document.querySelector('#bengMingGong .highlight-text').textContent;
    const suiJun = document.querySelector('#suiJun .highlight-text').textContent;
    const talismanName = document.querySelector('#suiJun .talisman-header h4').textContent;
    const talismanLevel = document.querySelector('#suiJun .talisman-level').textContent;
    
    // 构建分享文本
    const shareText = `我的阴历命理查询结果：本命宫位是${bengMingGong}，岁君是${suiJun}，需要的符咒是${talismanName}（${talismanLevel}）。来自阴历命理查询系统。`;
    
    // 检查是否支持分享API
    if (navigator.share) {
        navigator.share({
            title: '阴历命理查询结果',
            text: shareText,
            url: window.location.href
        }).catch(error => {
            console.error('分享失败:', error);
            fallbackShare(shareText);
        });
    } else {
        fallbackShare(shareText);
    }
}

/**
 * 备用分享方法（复制到剪贴板）
 */
function fallbackShare(text) {
    // 创建临时文本区域
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    
    // 选择并复制文本
    textarea.select();
    document.execCommand('copy');
    
    // 移除临时元素
    document.body.removeChild(textarea);
    
    // 显示提示
    alert('结果已复制到剪贴板，您可以粘贴分享给朋友。');
}

/**
 * 保存结果为图片
 */
function saveAsImage() {
    const resultSection = document.getElementById('resultSection');
    
    // 使用html2canvas库将结果区域转换为图片
    html2canvas(resultSection, {
        scale: 2, // 提高图片质量
        useCORS: true, // 允许跨域图片
        backgroundColor: '#f5f5f5'
    }).then(canvas => {
        // 转换为图片并下载
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = '阴历命理查询结果.png';
        link.click();
    }).catch(error => {
        console.error('保存图片失败:', error);
        alert('保存图片失败，请稍后再试。');
    });
}

/**
 * 切换主题
 */
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDarkTheme = document.body.classList.contains('dark-theme');
    localStorage.setItem('darkTheme', isDarkTheme);
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.textContent = isDarkTheme ? '☀️ 切换亮色' : '🌙 切换暗色';
    }
}

// 初始化页面时添加事件监听
document.addEventListener('DOMContentLoaded', function() {
    // 为结果页面中的符咒卡片添加点击事件
    document.addEventListener('click', function(e) {
        if (e.target.closest('.talisman-card')) {
            const talismanCard = e.target.closest('.talisman-card');
            const talismanName = talismanCard.querySelector('h4').textContent;
            showTalismanDetail(talismanName);
        }
    });
    
    // 添加分享按钮事件
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', shareResult);
    }
    
    // 添加保存图片按钮事件
    const saveImageBtn = document.getElementById('saveImageBtn');
    if (saveImageBtn) {
        saveImageBtn.addEventListener('click', saveAsImage);
    }
    
    // 添加主题切换按钮事件
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        
        // 检查本地存储的主题设置
        const savedTheme = localStorage.getItem('darkTheme');
        if (savedTheme === 'true') {
            document.body.classList.add('dark-theme');
            themeToggle.textContent = '☀️ 切换亮色';
        }
    }
    
    // 添加年份变化事件，动态更新生肖显示
    const yearSelect = document.getElementById('lunarYear');
    if (yearSelect) {
        yearSelect.addEventListener('change', function() {
            const selectedYear = this.value;
            const zodiacName = ZODIAC_YEARS[selectedYear];
            const zodiacDisplay = document.getElementById('zodiacDisplay');
            if (zodiacDisplay) {
                zodiacDisplay.textContent = zodiacName;
                zodiacDisplay.className = 'zodiac-icon ' + selectedYear;
            }
        });
    }
});

/**
 * 加载html2canvas库
 */
function loadHtml2Canvas() {
    if (window.html2canvas) return Promise.resolve();
    
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// 预加载html2canvas库
document.addEventListener('DOMContentLoaded', function() {
    loadHtml2Canvas().catch(error => {
        console.warn('html2canvas加载失败，保存图片功能可能不可用', error);
    });
});

// 添加月份初始化函数
function initMonthOptions() {
    const monthSelect = document.getElementById('month');
    monthSelect.innerHTML = '<option value="">请选择出生月份</option>';
    
    for (let i = 1; i <= 12; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i}月`;
        monthSelect.appendChild(option);
    }
}

// 添加时辰初始化函数
function initHourOptions() {
    const hourSelect = document.getElementById('hour');
    hourSelect.innerHTML = '<option value="">请选择出生时辰</option>';
    
    EARTHLY_BRANCHES.forEach(branch => {
        const option = document.createElement('option');
        option.value = branch;
        option.textContent = `${branch}时`;
        hourSelect.appendChild(option);
    });
}

// 修复displayResults函数中的变量引用
function displayResults(bengMingGong, suiJun, year, month, hour) {
    // 隐藏输入区域，显示结果区域
    document.querySelector('.input-section').style.display = 'none';
    const resultSection = document.getElementById('resultSection');
    resultSection.style.display = 'block';
    
    // 添加动画效果
    setTimeout(() => {
        resultSection.classList.add('visible');
    }, 100);
    
    // 显示本命宫位
    const bengMingGongElement = document.getElementById('bengMingGong');
    bengMingGongElement.innerHTML = `
        <div class="gong-result">
            <p>您的本命宫位是：<strong class="highlight-text">${bengMingGong}宫</strong></p>
            <p>阴历月份：${month}月</p>
            <p>出生时辰：${hour}时</p>
            <div class="gong-table-container">
                <table class="gong-table">
                    <tr>
                        <th>月份/时辰</th>
                        ${EARTHLY_BRANCHES.map(branch => `<th>${branch}时</th>`).join('')}
                    </tr>
                    ${Object.keys(BENGMING_GONG_TABLE).map(month => `
                        <tr>
                            <th>${month}月</th>
                            ${EARTHLY_BRANCHES.map(branch => {
                                const gong = BENGMING_GONG_TABLE[month][branch];
                                return `<td ${gong === bengMingGong ? 'class="highlight-cell"' : ''}>${gong}</td>`;
                            }).join('')}
                        </tr>
                    `).join('')}
                </table>
            </div>
        </div>
    `;
    
    // 显示岁君信息
    const suiJunElement = document.getElementById('suiJun');
    const talismanName = suiJun + '符';
    const talismanInfo = TALISMANS[talismanName];
    const talismanLevel = TALISMAN_LEVELS[talismanName];
    const talismanImage = TALISMAN_IMAGES[talismanName];
    
    suiJunElement.innerHTML = `
        <div class="suijun-result">
            <h3>您的岁君是：<strong class="highlight-text">${suiJun}</strong></h3>
            <p>根据您的本命宫位和出生年份，您需要的符咒是：</p>
            <div class="talisman-card ${getLevelClass(talismanLevel)}">
                <div class="talisman-header">
                    <h4>${talismanName}</h4>
                    <span class="talisman-level">${talismanLevel}</span>
                </div>
                <div class="talisman-content">
                    <div class="talisman-image">
                        <img src="${talismanImage}" alt="${talismanName}">
                    </div>
                    <div class="talisman-info">
                        <p class="talisman-description">${talismanInfo.description}</p>
                        <div class="talisman-effect">
                            <h5>效用说明：</h5>
                            <p>${talismanInfo.effect}</p>
                        </div>
                    </div>
                </div>
                <div class="talisman-usage">
                    <h5>使用方法：</h5>
                    <ol>
                        ${talismanInfo.usage.map(step => `<li>${step}</li>`).join('')}
                    </ol>
                </div>
            </div>
        </div>
    `;
    
    // 显示注意事项
    const notesElement = document.getElementById('notes');
    notesElement.innerHTML = `
        <div class="notes-section">
            <h3>注意事项：</h3>
            <ul>
                ${NOTES.map(note => `<li>${note}</li>`).join('')}
            </ul>
        </div>
    `;
    
    // 显示查询时间
    const dateElement = document.getElementById('queryDate');
    const now = new Date();
    const dateString = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    dateElement.textContent = `查询时间：${dateString}`;
}

/**
 * 根据符咒等级获取对应的CSS类名
 */
function getLevelClass(level) {
    switch(level) {
        case '大吉':
            return 'level-great';
        case '小吉':
            return 'level-good';
        case '小凶':
            return 'level-bad';
        case '大凶':
            return 'level-terrible';
        case '极端':
            return 'level-extreme';
        default:
            return '';
    }
}

/**
 * 显示符咒详情
 */
// 在showTalismanDetail函数中也需要修改
function showTalismanDetail(talismanName) {
    const modal = document.getElementById('talismanModal');
    const modalContent = document.getElementById('talismanModalContent');
    const talismanInfo = TALISMANS[talismanName]; // 修改这里
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h3>${talismanName}</h3>
            <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body">
            <div class="talisman-image">
                <img src="${TALISMAN_IMAGES[talismanName]}" alt="${talismanName}">
            </div>
            <div class="talisman-detail">
                <p class="talisman-description">${talismanInfo.description}</p>
                <div class="talisman-effect">
                    <h4>效用说明：</h4>
                    <p>${talismanInfo.effect}</p>
                </div>
                <div class="talisman-usage">
                    <h4>使用方法：</h4>
                    <ol>
                        ${talismanInfo.usage.map(step => `<li>${step}</li>`).join('')}
                    </ol>
                </div>
            </div>
        </div>
    `;
    
    // 关闭按钮事件
    const closeBtn = modalContent.querySelector('.close-modal');
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    modal.style.display = 'block';
    
    // 点击模态框外部关闭
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

/**
 * 分享结果
 */
function shareResult() {
    // 获取当前结果内容
    const bengMingGong = document.querySelector('#bengMingGong .highlight-text').textContent;
    const suiJun = document.querySelector('#suiJun .highlight-text').textContent;
    const talismanName = document.querySelector('#suiJun .talisman-header h4').textContent;
    const talismanLevel = document.querySelector('#suiJun .talisman-level').textContent;
    
    // 构建分享文本
    const shareText = `我的阴历命理查询结果：本命宫位是${bengMingGong}，岁君是${suiJun}，需要的符咒是${talismanName}（${talismanLevel}）。来自阴历命理查询系统。`;
    
    // 检查是否支持分享API
    if (navigator.share) {
        navigator.share({
            title: '阴历命理查询结果',
            text: shareText,
            url: window.location.href
        }).catch(error => {
            console.error('分享失败:', error);
            fallbackShare(shareText);
        });
    } else {
        fallbackShare(shareText);
    }
}

/**
 * 备用分享方法（复制到剪贴板）
 */
function fallbackShare(text) {
    // 创建临时文本区域
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    
    // 选择并复制文本
    textarea.select();
    document.execCommand('copy');
    
    // 移除临时元素
    document.body.removeChild(textarea);
    
    // 显示提示
    alert('结果已复制到剪贴板，您可以粘贴分享给朋友。');
}

/**
 * 保存结果为图片
 */
function saveAsImage() {
    const resultSection = document.getElementById('resultSection');
    
    // 使用html2canvas库将结果区域转换为图片
    html2canvas(resultSection, {
        scale: 2, // 提高图片质量
        useCORS: true, // 允许跨域图片
        backgroundColor: '#f5f5f5'
    }).then(canvas => {
        // 转换为图片并下载
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = '阴历命理查询结果.png';
        link.click();
    }).catch(error => {
        console.error('保存图片失败:', error);
        alert('保存图片失败，请稍后再试。');
    });
}

/**
 * 切换主题
 */
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDarkTheme = document.body.classList.contains('dark-theme');
    localStorage.setItem('darkTheme', isDarkTheme);
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.textContent = isDarkTheme ? '☀️ 切换亮色' : '🌙 切换暗色';
    }
}

// 初始化页面时添加事件监听
document.addEventListener('DOMContentLoaded', function() {
    // 为结果页面中的符咒卡片添加点击事件
    document.addEventListener('click', function(e) {
        if (e.target.closest('.talisman-card')) {
            const talismanCard = e.target.closest('.talisman-card');
            const talismanName = talismanCard.querySelector('h4').textContent;
            showTalismanDetail(talismanName);
        }
    });
    
    // 添加分享按钮事件
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', shareResult);
    }
    
    // 添加保存图片按钮事件
    const saveImageBtn = document.getElementById('saveImageBtn');
    if (saveImageBtn) {
        saveImageBtn.addEventListener('click', saveAsImage);
    }
    
    // 添加主题切换按钮事件
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        
        // 检查本地存储的主题设置
        const savedTheme = localStorage.getItem('darkTheme');
        if (savedTheme === 'true') {
            document.body.classList.add('dark-theme');
            themeToggle.textContent = '☀️ 切换亮色';
        }
    }
    
    // 添加年份变化事件，动态更新生肖显示
    const yearSelect = document.getElementById('lunarYear');
    if (yearSelect) {
        yearSelect.addEventListener('change', function() {
            const selectedYear = this.value;
            const zodiacName = ZODIAC_YEARS[selectedYear];
            const zodiacDisplay = document.getElementById('zodiacDisplay');
            if (zodiacDisplay) {
                zodiacDisplay.textContent = zodiacName;
                zodiacDisplay.className = 'zodiac-icon ' + selectedYear;
            }
        });
    }
});

/**
 * 加载html2canvas库
 */
function loadHtml2Canvas() {
    if (window.html2canvas) return Promise.resolve();
    
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// 预加载html2canvas库
document.addEventListener('DOMContentLoaded', function() {
    loadHtml2Canvas().catch(error => {
        console.warn('html2canvas加载失败，保存图片功能可能不可用', error);
    });
});

// 添加月份初始化函数
function initMonthOptions() {
    const monthSelect = document.getElementById('month');
    monthSelect.innerHTML = '<option value="">请选择出生月份</option>';
    
    for (let i = 1; i <= 12; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i}月`;
        monthSelect.appendChild(option);
    }
}

// 添加时辰初始化函数
function initHourOptions() {
    const hourSelect = document.getElementById('hour');
    hourSelect.innerHTML = '<option value="">请选择出生时辰</option>';
    
    EARTHLY_BRANCHES.forEach(branch => {
        const option = document.createElement('option');
        option.value = branch;
        option.textContent = `${branch}时`;
        hourSelect.appendChild(option);
    });
}

// 修复displayResults函数中的变量引用
function displayResults(bengMingGong, suiJun, year, month, hour) {
    // 隐藏输入区域，显示结果区域
    document.querySelector('.input-section').style.display = 'none';
    const resultSection = document.getElementById('resultSection');
    resultSection.style.display = 'block';
    
    // 添加动画效果
    setTimeout(() => {
        resultSection.classList.add('visible');
    }, 100);
    
    // 显示本命宫位
    const bengMingGongElement = document.getElementById('bengMingGong');
    bengMingGongElement.innerHTML = `
        <div class="gong-result">
            <p>您的本命宫位是：<strong class="highlight-text">${bengMingGong}宫</strong></p>
            <p>阴历月份：${month}月</p>
            <p>出生时辰：${hour}时</p>
            <div class="gong-table-container">
                <table class="gong-table">
                    <tr>
                        <th>月份/时辰</th>
                        ${EARTHLY_BRANCHES.map(branch => `<th>${branch}时</th>`).join('')}
                    </tr>
                    ${Object.keys(BENGMING_GONG_TABLE).map(month => `
                        <tr>
                            <th>${month}月</th>
                            ${EARTHLY_BRANCHES.map(branch => {
                                const gong = BENGMING_GONG_TABLE[month][branch];
                                return `<td ${gong === bengMingGong ? 'class="highlight-cell"' : ''}>${gong}</td>`;
                            }).join('')}
                        </tr>
                    `).join('')}
                </table>
            </div>
        </div>
    `;
    
    // 显示岁君信息
    const suiJunElement = document.getElementById('suiJun');
    const talismanName = suiJun + '符';
    const talismanInfo = TALISMANS[talismanName];
    const talismanLevel = TALISMAN_LEVELS[talismanName];
    const talismanImage = TALISMAN_IMAGES[talismanName];
    
    suiJunElement.innerHTML = `
        <div class="suijun-result">
            <h3>您的岁君是：<strong class="highlight-text">${suiJun}</strong></h3>
            <p>根据您的本命宫位和出生年份，您需要的符咒是：</p>
            <div class="talisman-card ${getLevelClass(talismanLevel)}">
                <div class="talisman-header">
                    <h4>${talismanName}</h4>
                    <span class="talisman-level">${talismanLevel}</span>
                </div>
                <div class="talisman-content">
                    <div class="talisman-image">
                        <img src="${talismanImage}" alt="${talismanName}">
                    </div>
                    <div class="talisman-info">
                        <p class="talisman-description">${talismanInfo.description}</p>
                        <div class="talisman-effect">
                            <h5>效用说明：</h5>
                            <p>${talismanInfo.effect}</p>
                        </div>
                    </div>
                </div>
                <div class="talisman-usage">
                    <h5>使用方法：</h5>
                    <ol>
                        ${talismanInfo.usage.map(step => `<li>${step}</li>`).join('')}
                    </ol>
                </div>
            </div>
        </div>
    `;
    
    // 显示注意事项
    const notesElement = document.getElementById('notes');
    notesElement.innerHTML = `
        <div class="notes-section">
            <h3>注意事项：</h3>
            <ul>
                ${NOTES.map(note => `<li>${note}</li>`).join('')}
            </ul>
        </div>
    `;
    
    // 显示查询时间
    const dateElement = document.getElementById('queryDate');
    const now = new Date();
    const dateString = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    dateElement.textContent = `查询时间：${dateString}`;
}

/**
 * 根据符咒等级获取对应的CSS类名
 */
function getLevelClass(level) {
    switch(level) {
        case '大吉':
            return 'level-great';
        case '小吉':
            return 'level-good';
        case '小凶':
            return 'level-bad';
        case '大凶':
            return 'level-terrible';
        case '极端':
            return 'level-extreme';
        default:
            return '';
    }
}

/**
 * 显示符咒详情
 */
// 在showTalismanDetail函数中也需要修改
function showTalismanDetail(talismanName) {
    const modal = document.getElementById('talismanModal');
    const modalContent = document.getElementById('talismanModalContent');
    const talismanInfo = TALISMANS[talismanName]; // 修改这里
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h3>${talismanName}</h3>
            <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body">
            <div class="talisman-image">
                <img src="${TALISMAN_IMAGES[talismanName]}" alt="${talismanName}">
            </div>
            <div class="talisman-detail">
                <p class="talisman-description">${talismanInfo.description}</p>
                <div class="talisman-effect">
                    <h4>效用说明：</h4>
                    <p>${talismanInfo.effect}</p>
                </div>
                <div class="talisman-usage">
                    <h4>使用方法：</h4>
                    <ol>
                        ${talismanInfo.usage.map(step => `<li>${step}</li>`).join('')}
                    </ol>
                </div>
            </div>
        </div>
    `;
    
    // 关闭按钮事件
    const closeBtn = modalContent.querySelector('.close-modal');
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    modal.style.display = 'block';
    
    // 点击模态框外部关闭
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

/**
 * 分享结果
 */
function shareResult() {
    // 获取当前结果内容
    const bengMingGong = document.querySelector('#bengMingGong .highlight-text').textContent;
    const suiJun = document.querySelector('#suiJun .highlight-text').textContent;
    const talismanName = document.querySelector('#suiJun .talisman-header h4').textContent;
    const talismanLevel = document.querySelector('#suiJun .talisman-level').textContent;
    
    // 构建分享文本
    const shareText = `我的阴历命理查询结果：本命宫位是${bengMingGong}，岁君是${suiJun}，需要的符咒是${talismanName}（${talismanLevel}）。来自阴历命理查询系统。`;
    
    // 检查是否支持分享API
    if (navigator.share) {
        navigator.share({
            title: '阴历命理查询结果',
            text: shareText,
            url: window.location.href
        }).catch(error => {
            console.error('分享失败:', error);
            fallbackShare(shareText);
        });
    } else {
        fallbackShare(shareText);
    }
}

/**
 * 备用分享方法（复制到剪贴板）
 */
function fallbackShare(text) {
    // 创建临时文本区域
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    
    // 选择并复制文本
    textarea.select();
    document.execCommand('copy');
    
    // 移除临时元素
    document.body.removeChild(textarea);
    
    // 显示提示
    alert('结果已复制到剪贴板，您可以粘贴分享给朋友。');
}

/**
 * 保存结果为图片
 */
function saveAsImage() {
    const resultSection = document.getElementById('resultSection');
    
    // 使用html2canvas库将结果区域转换为图片
    html2canvas(resultSection, {
        scale: 2, // 提高图片质量
        useCORS: true, // 允许跨域图片
        backgroundColor: '#f5f5f5'
    }).then(canvas => {
        // 转换为图片并下载
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = '阴历命理查询结果.png';
        link.click();
    }).catch(error => {
        console.error('保存图片失败:', error);
        alert('保存图片失败，请稍后再试。');
    });
}

/**
 * 切换主题
 */
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDarkTheme = document.body.classList.contains('dark-theme');
    localStorage.setItem('darkTheme', isDarkTheme);
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.textContent = isDarkTheme ? '☀️ 切换亮色' : '🌙 切换暗色';
    }
}

// 初始化页面时添加事件监听
document.addEventListener('DOMContentLoaded', function() {
    // 为结果页面中的符咒卡片添加点击事件
    document.addEventListener('click', function(e) {
        if (e.target.closest('.talisman-card')) {
            const talismanCard = e.target.closest('.talisman-card');
            const talismanName = talismanCard.querySelector('h4').textContent;
            showTalismanDetail(talismanName);
        }
    });
    
    // 添加分享按钮事件
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', shareResult);
    }
    
    // 添加保存图片按钮事件
    const saveImageBtn = document.getElementById('saveImageBtn');
    if (saveImageBtn) {
        saveImageBtn.addEventListener('click', saveAsImage);
    }
    
    // 添加主题切换按钮事件
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        
        // 检查本地存储的主题设置
        const savedTheme = localStorage.getItem('darkTheme');
        if (savedTheme === 'true') {
            document.body.classList.add('dark-theme');
            themeToggle.textContent = '☀️ 切换亮色';
        }
    }
    
    // 添加年份变化事件，动态更新生肖显示
    const yearSelect = document.getElementById('lunarYear');
    if (yearSelect) {
        yearSelect.addEventListener('change', function() {
            const selectedYear = this.value;
            const zodiacName = ZODIAC_YEARS[selectedYear];
            const zodiacDisplay = document.getElementById('zodiacDisplay');
            if (zodiacDisplay) {
                zodiacDisplay.textContent = zodiacName;
                zodiacDisplay.className = 'zodiac-icon ' + selectedYear;
            }
        });
    }
});

/**
 * 加载html2canvas库
 */
function loadHtml2Canvas() {
    if (window.html2canvas) return Promise.resolve();
    
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// 预加载html2canvas库
document.addEventListener('DOMContentLoaded', function() {
    loadHtml2Canvas().catch(error => {
        console.warn('html2canvas加载失败，保存图片功能可能不可用', error);
    });
});

// 添加月份初始化函数
function initMonthOptions() {
    const monthSelect = document.getElementById('month');
    monthSelect.innerHTML = '<option value="">请选择出生月份</option>';
    
    for (let i = 1; i <= 12; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i}月`;
        monthSelect.appendChild(option);
    }
}

// 添加时辰初始化函数
function initHourOptions() {
    const hourSelect = document.getElementById('hour');
    hourSelect.innerHTML = '<option value="">请选择出生时辰</option>';
    
    EARTHLY_BRANCHES.forEach(branch => {
        const option = document.createElement('option');
        option.value = branch;
        option.textContent = `${branch}时`;
        hourSelect.appendChild(option);
    });
}

// 修复displayResults函数中的变量引用
function displayResults(bengMingGong, suiJun, year, month, hour) {
    // 隐藏输入区域，显示结果区域
    document.querySelector('.input-section').style.display = 'none';
    const resultSection = document.getElementById('resultSection');
    resultSection.style.display = 'block';
    
    // 添加动画效果
    setTimeout(() => {
        resultSection.classList.add('visible');
    }, 100);
    
    // 显示本命宫位
    const bengMingGongElement = document.getElementById('bengMingGong');
    bengMingGongElement.innerHTML = `
        <div class="gong-result">
            <p>您的本命宫位是：<strong class="highlight-text">${bengMingGong}宫</strong></p>
            <p>阴历月份：${month}月</p>
            <p>出生时辰：${hour}时</p>
            <div class="gong-table-container">
                <table class="gong-table">
                    <tr>
                        <th>月份/时辰</th>
                        ${EARTHLY_BRANCHES.map(branch => `<th>${branch}时</th>`).join('')}
                    </tr>
                    ${Object.keys(BENGMING_GONG_TABLE).map(month => `
                        <tr>
                            <th>${month}月</th>
                            ${EARTHLY_BRANCHES.map(branch => {
                                const gong = BENGMING_GONG_TABLE[month][branch];
                                return `<td ${gong === bengMingGong ? 'class="highlight-cell"' : ''}>${gong}</td>`;
                            }).join('')}
                        </tr>
                    `).join('')}
                </table>
            </div>
        </div>
    `;
    
    // 显示岁君信息
    const suiJunElement = document.getElementById('suiJun');
    const talismanName = suiJun + '符';
    const talismanInfo = TALISMANS[talismanName];
    const talismanLevel = TALISMAN_LEVELS[talismanName];
    const talismanImage = TALISMAN_IMAGES[talismanName];
    
    suiJunElement.innerHTML = `
        <div class="suijun-result">
            <h3>您的岁君是：<strong class="highlight-text">${suiJun}</strong></h3>
            <p>根据您的本命宫位和出生年份，您需要的符咒是：</p>
            <div class="talisman-card ${getLevelClass(talismanLevel)}">
                <div class="talisman-header">
                    <h4>${talismanName}</h4>
                    <span class="talisman-level">${talismanLevel}</span>
                </div>
                <div class="talisman-content">
                    <div class="talisman-image">
                        <img src="${talismanImage}" alt="${talismanName}">
                    </div>
                    <div class="talisman-info">
                        <p class="talisman-description">${talismanInfo.description}</p>
                        <div class="talisman-effect">
                            <h5>效用说明：</h5>
                            <p>${talismanInfo.effect}</p>
                        </div>
                    </div>
                </div>
                <div class="talisman-usage">
                    <h5>使用方法：</h5>
                    <ol>
                        ${talismanInfo.usage.map(step => `<li>${step}</li>`).join('')}
                    </ol>
                </div>
            </div>
        </div>
    `;
    
    // 显示注意事项
    const notesElement = document.getElementById('notes');
    notesElement.innerHTML = `
        <div class="notes-section">
            <h3>注意事项：</h3>
            <ul>
                ${NOTES.map(note => `<li>${note}</li>`).join('')}
            </ul>
        </div>
    `;
    
    // 显示查询时间
    const dateElement = document.getElementById('queryDate');
    const now = new Date();
    const dateString = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    dateElement.textContent = `查询时间：${dateString}`;
}

/**
 * 根据符咒等级获取对应的CSS类名
 */
function getLevelClass(level) {
    switch(level) {
        case '大吉':
            return 'level-great';
        case '小吉':
            return 'level-good';
        case '小凶':
            return 'level-bad';
        case '大凶':
            return 'level-terrible';
        case '极端':
            return 'level-extreme';
        default:
            return '';
    }
}

/**
 * 显示符咒详情
 */
// 在showTalismanDetail函数中也需要修改
function showTalismanDetail(talismanName) {
    const modal = document.getElementById('talismanModal');
    const modalContent = document.getElementById('talismanModalContent');
    const talismanInfo = TALISMANS[talismanName]; // 修改这里
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h3>${talismanName}</h3>
            <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body">
            <div class="talisman-image">
                <img src="${TALISMAN_IMAGES[talismanName]}" alt="${talismanName}">
            </div>
            <div class="talisman-detail">
                <p class="talisman-description">${talismanInfo.description}</p>
                <div class="talisman-effect">
                    <h4>效用说明：</h4>
                    <p>${talismanInfo.effect}</p>
                </div>
                <div class="talisman-usage">
                    <h4>使用方法：</h4>
                    <ol>
                        ${talisman