/**
 * 阴历命理查询系统数据文件
 * 包含本命宫位、岁君、灵验符咒等数据
 */

// 十二地支与时辰对应关系
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 十二生肖年份对应
const ZODIAC_YEARS = {
    '子': '鼠',
    '丑': '牛',
    '寅': '虎',
    '卯': '兔',
    '辰': '龙',
    '巳': '蛇',
    '午': '马',
    '未': '羊',
    '申': '猴',
    '酉': '鸡',
    '戌': '狗',
    '亥': '猪'
};

// 本命宫位查询表（月份 x 时辰）
const BENGMING_GONG_TABLE = {
    // 正月
    1: {
        '子': '卯', '丑': '寅', '寅': '丑', '卯': '子', '辰': '亥', '巳': '戌',
        '午': '酉', '未': '申', '申': '未', '酉': '午', '戌': '巳', '亥': '辰'
    },
    // 二月
    2: {
        '子': '寅', '丑': '丑', '寅': '子', '卯': '亥', '辰': '戌', '巳': '酉',
        '午': '申', '未': '未', '申': '午', '酉': '巳', '戌': '辰', '亥': '卯'
    },
    // 三月
    3: {
        '子': '丑', '丑': '子', '寅': '亥', '卯': '戌', '辰': '酉', '巳': '申',
        '午': '未', '未': '午', '申': '巳', '酉': '辰', '戌': '卯', '亥': '寅'
    },
    // 四月
    4: {
        '子': '子', '丑': '亥', '寅': '戌', '卯': '酉', '辰': '申', '巳': '未',
        '午': '午', '未': '巳', '申': '辰', '酉': '卯', '戌': '寅', '亥': '丑'
    },
    // 五月
    5: {
        '子': '亥', '丑': '戌', '寅': '酉', '卯': '申', '辰': '未', '巳': '午',
        '午': '巳', '未': '辰', '申': '卯', '酉': '寅', '戌': '丑', '亥': '子'
    },
    // 六月
    6: {
        '子': '戌', '丑': '酉', '寅': '申', '卯': '未', '辰': '午', '巳': '巳',
        '午': '辰', '未': '卯', '申': '寅', '酉': '丑', '戌': '子', '亥': '亥'
    },
    // 七月
    7: {
        '子': '酉', '丑': '申', '寅': '未', '卯': '午', '辰': '巳', '巳': '辰',
        '午': '卯', '未': '寅', '申': '丑', '酉': '子', '戌': '亥', '亥': '戌'
    },
    // 八月
    8: {
        '子': '申', '丑': '未', '寅': '午', '卯': '巳', '辰': '辰', '巳': '卯',
        '午': '寅', '未': '丑', '申': '子', '酉': '亥', '戌': '戌', '亥': '酉'
    },
    // 九月
    9: {
        '子': '未', '丑': '午', '寅': '巳', '卯': '辰', '辰': '卯', '巳': '寅',
        '午': '丑', '未': '子', '申': '亥', '酉': '戌', '戌': '酉', '亥': '申'
    },
    // 十月
    10: {
        '子': '午', '丑': '巳', '寅': '辰', '卯': '卯', '辰': '寅', '巳': '丑',
        '午': '子', '未': '亥', '申': '戌', '酉': '酉', '戌': '申', '亥': '未'
    },
    // 十一月
    11: {
        '子': '巳', '丑': '辰', '寅': '卯', '卯': '寅', '辰': '丑', '巳': '子',
        '午': '亥', '未': '戌', '申': '酉', '酉': '申', '戌': '未', '亥': '午'
    },
    // 十二月
    12: {
        '子': '辰', '丑': '卯', '寅': '寅', '卯': '丑', '辰': '子', '巳': '亥',
        '午': '戌', '未': '酉', '申': '申', '酉': '未', '戌': '午', '亥': '巳'
    }
};

// 岁君查询表（本命宫位 x 生肖年）
const SUIJUN_TABLE = {
    '子': {
        '子': '太岁符', '丑': '金光神卫', '寅': '太明纳福', '卯': '驱邪缠魅',
        '辰': '福德符', '巳': '白虎消灾', '午': '龙德符', '未': '太岁护佑',
        '申': '保命护身', '酉': '五鬼卫护', '戌': '太明纳福', '亥': '祛邪保真'
    },
    '丑': {
        '子': '金光神卫', '丑': '太岁符', '寅': '除秽养神', '卯': '驱邪缠魅',
        '辰': '福德符', '巳': '白虎消灾', '午': '龙德符', '未': '太岁护佑',
        '申': '保命护身', '酉': '五鬼卫护', '戌': '太明纳福', '亥': '祛邪保真'
    },
    '寅': {
        '子': '祛邪保真', '丑': '金光神卫', '寅': '太岁符', '卯': '除秽养神',
        '辰': '驱邪缠魅', '巳': '福德符', '午': '白虎消灾', '未': '龙德符',
        '申': '太岁护佑', '酉': '保命护身', '戌': '五鬼卫护', '亥': '太明纳福'
    },
    '卯': {
        '子': '太明纳福', '丑': '祛邪保真', '寅': '金光神卫', '卯': '太岁符',
        '辰': '除秽养神', '巳': '驱邪缠魅', '午': '福德符', '未': '白虎消灾',
        '申': '龙德符', '酉': '太岁护佑', '戌': '保命护身', '亥': '五鬼卫护'
    },
    '辰': {
        '子': '五鬼卫护', '丑': '太明纳福', '寅': '祛邪保真', '卯': '金光神卫',
        '辰': '太岁符', '巳': '除秽养神', '午': '驱邪缠魅', '未': '福德符',
        '申': '白虎消灾', '酉': '龙德符', '戌': '太岁护佑', '亥': '保命护身'
    },
    '巳': {
        '子': '保命护身', '丑': '五鬼卫护', '寅': '太明纳福', '卯': '祛邪保真',
        '辰': '金光神卫', '巳': '太岁符', '午': '除秽养神', '未': '驱邪缠魅',
        '申': '福德符', '酉': '白虎消灾', '戌': '龙德符', '亥': '太岁护佑'
    },
    '午': {
        '子': '太岁护佑', '丑': '保命护身', '寅': '五鬼卫护', '卯': '太明纳福',
        '辰': '祛邪保真', '巳': '金光神卫', '午': '太岁符', '未': '除秽养神',
        '申': '驱邪缠魅', '酉': '福德符', '戌': '白虎消灾', '亥': '龙德符'
    },
    '未': {
        '子': '龙德符', '丑': '太岁护佑', '寅': '保命护身', '卯': '五鬼卫护',
        '辰': '太明纳福', '巳': '祛邪保真', '午': '金光神卫', '未': '太岁符',
        '申': '除秽养神', '酉': '驱邪缠魅', '戌': '福德符', '亥': '白虎消灾'
    },
    '申': {
        '子': '白虎消灾', '丑': '龙德符', '寅': '太岁护佑', '卯': '保命护身',
        '辰': '五鬼卫护', '巳': '太明纳福', '午': '祛邪保真', '未': '金光神卫',
        '申': '太岁符', '酉': '除秽养神', '戌': '驱邪缠魅', '亥': '福德符'
    },
    '酉': {
        '子': '福德符', '丑': '白虎消灾', '寅': '龙德符', '卯': '太岁护佑',
        '辰': '保命护身', '巳': '五鬼卫护', '午': '太明纳福', '未': '祛邪保真',
        '申': '金光神卫', '酉': '太岁符', '戌': '除秽养神', '亥': '驱邪缠魅'
    }
}; // 修复了多余的大括号

    // 修复TALISMAN_LEVELS的语法
    const TALISMAN_LEVELS = {
        '太岁符': '极端',
        '金光神卫符': '小凶',
        '太明纳福符': '小凶',
        '驱邪缠魅符': '大凶',
        '福德符': '大吉',
        '白虎消灾符': '大凶',
        '龙德符': '大吉',
        '太岁护佑符': '大吉',
        '保命护身符': '大凶',
        '五鬼卫护符': '大凶',
        '祛邪保真符': '小凶',
        '除秽养神符': '小凶'
    };

    // 符咒图片路径
    const TALISMAN_IMAGES = {
        '太岁符': 'images/talismans/taisui.png',
        '金光神卫符': 'images/talismans/jinguang.png',
        '太明纳福符': 'images/talismans/taiming.png',
        '驱邪缠魅符': 'images/talismans/quxie.png',
        '福德符': 'images/talismans/fude.png',
        '白虎消灾符': 'images/talismans/baihu.png',
        '龙德符': 'images/talismans/longde.png',
        '太岁护佑符': 'images/talismans/taisuihuyou.png',
        '保命护身符': 'images/talismans/baoming.png',
        '五鬼卫护符': 'images/talismans/wugui.png',
        '祛邪保真符': 'images/talismans/quxiebaozhen.png',
        '除秽养神符': 'images/talismans/chuhuiyangshen.png'
    };
    // 注意事项
    const NOTES = [
        '随着流年变化，制化流年类灵符的有效期仅限当年，次年还需再按照本命宫位查询表去查询请购。',
        '请购制化流年类灵符的最佳时间为大年初一，因此时为新年年初，此时如能将一年之霉运与衰气尽数化解，将会对该年运程有极大助益。',
        '请购方法：结合本命宫位查询表使用。'
    ];
// 删除多余的大括号，因为这不是一个对象或函数声明的结尾

// 在文件末尾添加以下代码，导出所有变量
// 导出所有变量供其他文件使用
if (typeof window !== 'undefined') {
    window.EARTHLY_BRANCHES = EARTHLY_BRANCHES;
    window.ZODIAC_YEARS = ZODIAC_YEARS;
    window.BENGMING_GONG_TABLE = BENGMING_GONG_TABLE;
    window.SUIJUN_TABLE = SUIJUN_TABLE;
    window.TALISMANS = TALISMANS;
    window.TALISMAN_LEVELS = TALISMAN_LEVELS;
    window.TALISMAN_IMAGES = TALISMAN_IMAGES;
    window.NOTES = NOTES;
}