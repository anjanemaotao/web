document.addEventListener('DOMContentLoaded', function() {
    // 年份选项填充
    const birthYear = document.getElementById('birth-year');
    const currentYear = new Date().getFullYear();
    
    // 从1900年到当前年份生成选项
    for (let year = 1900; year <= currentYear; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year + '年';
        birthYear.appendChild(option);
    }
    
    // 查询按钮点击事件
    const queryBtn = document.getElementById('query-btn');
    queryBtn.addEventListener('click', handleQuery);
    
    // 返回按钮点击事件
    const backBtn = document.getElementById('back-btn');
    backBtn.addEventListener('click', function() {
        document.getElementById('result-section').style.display = 'none';
        document.getElementById('input-section').style.display = 'block';
    });
    
    // 输入字段的动画效果
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach((group, index) => {
        group.style.opacity = '0';
        group.style.transform = 'translateY(20px)';
        setTimeout(() => {
            group.style.transition = 'all 0.5s ease';
            group.style.opacity = '1';
            group.style.transform = 'translateY(0)';
        }, 300 + (index * 100));
    });
    
    // 灯笼和云彩动画初始化
    const lanterns = document.querySelectorAll('.lantern');
    lanterns.forEach(lantern => {
        lantern.addEventListener('mouseenter', () => {
            lantern.style.animation = 'none';
            setTimeout(() => {
                lantern.style.animation = 'sway 3s infinite ease-in-out';
            }, 10);
        });});
});

// 模拟数据（在实际应用中应该从服务器或数据库获取）
const DATA = {
    // 本命宫位表（简化版，实际应完全按照文档表格填充）
    bengongTable: {
        // 月份 -> 时辰 -> 宫位
        1: { '子': '午', '丑': '巳', '寅': '辰', '卯': '卯', '辰': '寅', '巳': '丑', '午': '子', '未': '亥', '申': '戌', '酉': '酉', '戌': '申', '亥': '未' },
        2: { '子': '巳', '丑': '辰', '寅': '卯', '卯': '寅', '辰': '丑', '巳': '子', '午': '亥', '未': '戌', '申': '酉', '酉': '申', '戌': '未', '亥': '午' },
        3: { '子': '辰', '丑': '卯', '寅': '寅', '卯': '丑', '辰': '子', '巳': '亥', '午': '戌', '未': '酉', '申': '申', '酉': '未', '戌': '午', '亥': '巳' },
        4: { '子': '卯', '丑': '寅', '寅': '丑', '卯': '子', '辰': '亥', '巳': '戌', '午': '酉', '未': '申', '申': '未', '酉': '午', '戌': '巳', '亥': '辰' },
        5: { '子': '寅', '丑': '丑', '寅': '子', '卯': '亥', '辰': '戌', '巳': '酉', '午': '申', '未': '未', '申': '午', '酉': '巳', '戌': '辰', '亥': '卯' },
        6: { '子': '丑', '丑': '子', '寅': '亥', '卯': '戌', '辰': '酉', '巳': '申', '午': '未', '未': '午', '申': '巳', '酉': '辰', '戌': '卯', '亥': '寅' },
        7: { '子': '子', '丑': '亥', '寅': '戌', '卯': '酉', '辰': '申', '巳': '未', '午': '午', '未': '巳', '申': '辰', '酉': '卯', '戌': '寅', '亥': '丑' },
        8: { '子': '亥', '丑': '戌', '寅': '酉', '卯': '申', '辰': '未', '巳': '午', '午': '巳', '未': '辰', '申': '卯', '酉': '寅', '戌': '丑', '亥': '子' },
        9: { '子': '戌', '丑': '酉', '寅': '申', '卯': '未', '辰': '午', '巳': '巳', '午': '辰', '未': '卯', '申': '寅', '酉': '丑', '戌': '子', '亥': '亥' },
        10: { '子': '酉', '丑': '申', '寅': '未', '卯': '午', '辰': '巳', '巳': '辰', '午': '卯', '未': '寅', '申': '丑', '酉': '子', '戌': '亥', '亥': '戌' },
        11: { '子': '申', '丑': '未', '寅': '午', '卯': '巳', '辰': '辰', '巳': '卯', '午': '寅', '未': '丑', '申': '子', '酉': '亥', '戌': '戌', '亥': '酉' },
        12: { '子': '未', '丑': '午', '寅': '巳', '卯': '辰', '辰': '卯', '巳': '寅', '午': '丑', '未': '子', '申': '亥', '酉': '戌', '戌': '酉', '亥': '申' }
    },
    // 岁君表（简化版，按照文档表格实际填充）
    suijunTable: {
        // 本命宫位-> 出生年属相-> 岁君
        '子': { '鼠': '青龙', '牛': '朱雀', '虎': '勾陈', '兔': '腾蛇', '龙': '白虎', '蛇': '玄武', '马': '天空', '羊': '太阴', '猴': '五鬼', '鸡': '天后', '狗': '太岁', '猪': '司命' },
        '丑': { '鼠': '司命', '牛': '青龙', '虎': '朱雀', '兔': '勾陈', '龙': '腾蛇', '蛇': '白虎', '马': '玄武', '羊': '天空', '猴': '太阴', '鸡': '五鬼', '狗': '天后', '猪': '太岁' },
        '寅': { '鼠': '太岁', '牛': '司命', '虎': '青龙', '兔': '朱雀', '龙': '勾陈', '蛇': '腾蛇', '马': '白虎', '羊': '玄武', '猴': '天空', '鸡': '太阴', '狗': '五鬼', '猪': '天后' },
        '卯': { '鼠': '天后', '牛': '太岁', '虎': '司命', '兔': '青龙', '龙': '朱雀', '蛇': '勾陈', '马': '腾蛇', '羊': '白虎', '猴': '玄武', '鸡': '天空', '狗': '太阴', '猪': '五鬼' },
        '辰': { '鼠': '五鬼', '牛': '天后', '虎': '太岁', '兔': '司命', '龙': '青龙', '蛇': '朱雀', '马': '勾陈', '羊': '腾蛇', '猴': '白虎', '鸡': '玄武', '狗': '天空', '猪': '太阴' },
        '巳': { '鼠': '太阴', '牛': '五鬼', '虎': '天后', '兔': '太岁', '龙': '司命', '蛇': '青龙', '马': '朱雀', '羊': '勾陈', '猴': '腾蛇', '鸡': '白虎', '狗': '玄武', '猪': '天空' },
        '午': { '鼠': '天空', '牛': '太阴', '虎': '五鬼', '兔': '天后', '龙': '太岁', '蛇': '司命', '马': '青龙', '羊': '朱雀', '猴': '勾陈', '鸡': '腾蛇', '狗': '白虎', '猪': '玄武' },
        '未': { '鼠': '玄武', '牛': '天空', '虎': '太阴', '兔': '五鬼', '龙': '天后', '蛇': '太岁', '马': '司命', '羊': '青龙', '猴': '朱雀', '鸡': '勾陈', '狗': '腾蛇', '猪': '白虎' },
        '申': { '鼠': '白虎', '牛': '玄武', '虎': '天空', '兔': '太阴', '龙': '五鬼', '蛇': '天后', '马': '太岁', '羊': '司命', '猴': '青龙', '鸡': '朱雀', '狗': '勾陈', '猪': '腾蛇' },
        '酉': { '鼠': '腾蛇', '牛': '白虎', '虎': '玄武', '兔': '天空', '龙': '太阴', '蛇': '五鬼', '马': '天后', '羊': '太岁', '猴': '司命', '鸡': '青龙', '狗': '朱雀', '猪': '勾陈' },
        '戌': { '鼠': '勾陈', '牛': '腾蛇', '虎': '白虎', '兔': '玄武', '龙': '天空', '蛇': '太阴', '马': '五鬼', '羊': '天后', '猴': '太岁', '鸡': '司命', '狗': '青龙', '猪': '朱雀' },
        '亥': { '鼠': '朱雀', '牛': '勾陈', '虎': '腾蛇', '兔': '白虎', '龙': '玄武', '蛇': '天空', '马': '太阴', '羊': '五鬼', '猴': '天后', '鸡': '太岁', '狗': '司命', '猪': '青龙' }
    },
    
    //灵验符咒表
    fuChouTable: {
        '青龙': '驱邪缚魅符',
        '朱雀': '除秽养神符',
        '勾陈': '白虎消灾符',
        '腾蛇': '保命护身符',
        '白虎': '太岁护佑福',
        '玄武': '五鬼卫护符',
        '天空': '金光神卫符',
        '太阴': '祛邪保真符',
        '五鬼': '太阴纳福符',
        '天后': '太岁符',
        '太岁': '太岁符',
        '司命': '太岁符'
    },
    
    // 灵符效用表
    fuXiaoYongTable: {
        '驱邪缚魅符': {
            name: '驱邪缚魅符',
            image: 'https://example.com/images/fuzhou1.jpg',
            description: '此符主驱邪除灾，避鬼灭魔，用于住宅不宁、睡眠不安、疑神疑鬼、煞气冲撞、阴气缠身等情况。焚化方法：在住房东北角焚化，或在卧室东北角焚化。'
        },
        '除秽养神符': {
            name: '除秽养神符',
            image: 'https://example.com/images/fuzhou2.jpg',
            description: '此符主除秽气、养神增智、安魂定魄，用于精神恍惚、忧郁烦躁、失眠多梦、心神不安等症状。焚化方法：在家中焚化或用符水饮用。'
        },
        '白虎消灾符': {
            name: '白虎消灾符',
            image: 'https://example.com/images/fuzhou3.jpg',
            description: '此符主消灾解厄、驱散病气，用于疾病缠身、身体虚弱、久病不愈等困境。焚化方法：在家中焚化或用符水饮用。'
        },
        '保命护身符': {
            name: '保命护身符',
            image: 'https://example.com/images/fuzhou4.jpg',
            description: '此符主保命护身、趋吉避凶，用于出行安全、防范意外、化解厄运等情况。焚化方法：随身携带或在住处焚化。'
        },
        '太岁护佑福': {
            name: '太岁护佑福',
            image: 'https://example.com/images/fuzhou5.jpg',
            description: '此符主镇宅保平安，化解太岁冲、克、害的不良影响，用于本命年、冲太岁、值太岁等情况。焚化方法：在住宅堂口焚化。'
        },
        '五鬼卫护符': {
            name: '五鬼卫护符',
            image: 'https://example.com/images/fuzhou6.jpg',
            description: '此符主镇宅辟邪、避凶化煞、延年益寿，用于防止小人陷害、改善运气等情况。焚化方法：在住宅五个方位各焚化一次。'
        },
        '金光神卫符': {
            name: '金光神卫符',
            image: 'https://example.com/images/fuzhou7.jpg',
            description: '此符主守护元神、增强阳气、化解阴气侵扰，用于招财进宝、事业有成等情况。焚化方法：在家中或公司财位焚化。'
        },
        '祛邪保真符': {
            name: '祛邪保真符',
            image: 'https://example.com/images/fuzhou8.jpg',
            description: '此符主祛邪保真、化解不良磁场，用于风水调理、改善家居环境等情况。焚化方法：在住宅中心位置焚化。'
        },
        '太阴纳福符': {
            name: '太阴纳福符',
            image: 'https://example.com/images/fuzhou9.jpg',
            description: '此符主增强运势、引来贵人相助，用于提升桃花运、改善人际关系等情况。焚化方法：在自家西方焚化。'
        },
        '太岁符': {
            name: '太岁符',
            image: 'https://example.com/images/fuzhou10.jpg',
            description: '此符主镇宅辟邪、安神定魄、消灾解厄、增福添寿，用于平安健康、化解不良运势等情况。焚化方法：在住宅正门内焚化。'
        }
    },
    
    // 生肖对应表
    zodiacMap: {
        0: '猴', 1: '鸡', 2: '狗', 3: '猪', 4: '鼠', 5: '牛',
        6: '虎', 7: '兔', 8: '龙', 9: '蛇', 10: '马', 11: '羊'
    }
};

// 获取生肖
function getZodiac(year) {
    return DATA.zodiacMap[(year - 4) % 12];
}

// 处理查询逻辑
function handleQuery() {
    // 获取输入值
    const year = document.getElementById('birth-year').value;
    const month = document.getElementById('birth-month').value;
    const time = document.getElementById('birth-time').value;
    // 输入验证
    if (!year || !month || !time) {
        alert('请完整填写出生年份、月份和时辰！');
        return;
    }// 显示加载动画
    const loading = document.getElementById('loading');
    loading.classList.add('active');
    
    // 模拟查询延迟
    setTimeout(() => {
        try {
            // 1. 查找本命宫位
            const bengong = DATA.bengongTable[month][time];
            
            // 2. 确定生肖
            const zodiac = getZodiac(parseInt(year));
            
            // 3. 查找岁君
            const suijun = DATA.suijunTable[bengong][zodiac];
            
            // 4. 查找灵验符咒
            const fuChou = DATA.fuChouTable[suijun];
            
            // 5. 查询灵符效用
            const xiaoYong = DATA.fuXiaoYongTable[fuChou];
            
            // 显示结果
            document.getElementById('bengong').textContent = bengong + '宫';
            document.getElementById('suijun').textContent = suijun;
            document.getElementById('fuzhou-name').textContent = xiaoYong.name;
            
            // 设置符咒图片
            const fuzhouImg = document.createElement('img');
            fuzhouImg.src = xiaoYong.image;
            fuzhouImg.alt = xiaoYong.name;
            document.getElementById('fuzhou-image').innerHTML = '';
            document.getElementById('fuzhou-image').appendChild(fuzhouImg);
            
            // 设置效用和用法
            document.getElementById('usage').textContent = xiaoYong.description;
            
            // 隐藏输入区域，显示结果区域
            document.getElementById('input-section').style.display = 'none';
            document.getElementById('result-section').style.display = 'block';
            
            // 结果区域动画
            document.getElementById('result-section').classList.remove('animate__fadeInUp');
            void document.getElementById('result-section').offsetWidth;
            document.getElementById('result-section').classList.add('animate__fadeInUp');
            
            // 添加符咒特效
            addFuzhouEffect();} catch (error) {
            console.error('查询过程出错:', error);
            alert('查询过程出现错误，请重试!');
        } finally {
            // 隐藏加载动画
            loading.classList.remove('active');}
    }, 2000);
}

// 添加符咒特效
function addFuzhouEffect() {
    const fuzhouImage = document.querySelector('.fuzhou-image img');
    
    if (fuzhouImage) {
        // 添加发光效果
        fuzhouImage.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.8)';
        
        // 添加呼吸动画
        fuzhouImage.style.animation = 'pulse 2s infinite';
        // 定义动画
        const style = document.createElement('style');
        style.innerHTML = `
        @keyframes pulse {
            0% { transform: scale(1); box-shadow: 0 0 20px rgba(255, 215, 0, 0.8); }
            50% { transform: scale(1.02); box-shadow: 0 0 30px rgba(255, 215, 0, 0.9); }
            100% { transform: scale(1); box-shadow: 0 0 20px rgba(255, 215, 0, 0.8); }
        }
        `;
        document.head.appendChild(style);
        
        // 点击效果
        fuzhouImage.addEventListener('click', function() {
            // 创建符咒激活特效
            const effectOverlay = document.createElement('div');
            effectOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: radial-gradient(circle, rgba(255,215,0,0.2) 0%, rgba(0,0,0,0) 70%);
                z-index: 999;
                opacity: 0;
                pointer-events: none;
                transition: opacity 1s ease;
            `;
            document.body.appendChild(effectOverlay);// 显示特效
            setTimeout(() => {
                effectOverlay.style.opacity = '1';
            }, 10);
            
            // 播放音效
            const audio = new Audio('https://example.com/sounds/magic.mp3');
            audio.volume = 0.5;
            audio.play().catch(e => console.log('无法播放音效，可能需要用户交互后才能播放音频'));
            // 移除特效
            setTimeout(() => {
                effectOverlay.style.opacity = '0';
                setTimeout(() => {document.body.removeChild(effectOverlay);
                }, 1000);
            }, 2000);
        });
    }
}