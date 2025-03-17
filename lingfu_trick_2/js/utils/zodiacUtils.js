// Chinese zodiac related utilities
const zodiacUtils = {
  // Earthly Branches (地支) - used for hours and years
  earthlyBranches: ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'],
  
  // Chinese zodiac signs in English
  zodiacSigns: ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'],
  
  // Chinese zodiac signs in Chinese
  zodiacSignsCN: ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'],
  
  // Get zodiac animal based on year
  getZodiacSign: function(year, language = 'en') {
    const index = (year - 4) % 12;
    return language === 'en' ? this.zodiacSigns[index] : this.zodiacSignsCN[index];
  },
  
  // Get Chinese year name (e.g., "子年")
  getChineseYearName: function(year) {
    return this.earthlyBranches[(year - 4) % 12] + '年';
  },
  
  // Get ben ming (birth house) based on birth month and hour
  getBenMing: function(month, hour) {
    // Ben Ming calculation table
    const bengMingTable = {
      '1': { 'zi': '卯', 'chou': '寅', 'yin': '丑', 'mao': '子', 'chen': '亥', 'si': '戌', 'wu': '酉', 'wei': '申', 'shen': '未', 'you': '午', 'xu': '巳', 'hai': '辰' },
      '2': { 'zi': '寅', 'chou': '丑', 'yin': '子', 'mao': '亥', 'chen': '戌', 'si': '酉', 'wu': '申', 'wei': '未', 'shen': '午', 'you': '巳', 'xu': '辰', 'hai': '卯' },
      '3': { 'zi': '丑', 'chou': '子', 'yin': '亥', 'mao': '戌', 'chen': '酉', 'si': '申', 'wu': '未', 'wei': '午', 'shen': '巳', 'you': '辰', 'xu': '卯', 'hai': '寅' },
      '4': { 'zi': '子', 'chou': '亥', 'yin': '戌', 'mao': '酉', 'chen': '申', 'si': '未', 'wu': '午', 'wei': '巳', 'shen': '辰', 'you': '卯', 'xu': '寅', 'hai': '丑' },
      '5': { 'zi': '亥', 'chou': '戌', 'yin': '酉', 'mao': '申', 'chen': '未', 'si': '午', 'wu': '巳', 'wei': '辰', 'shen': '卯', 'you': '寅', 'xu': '丑', 'hai': '子' },
      '6': { 'zi': '戌', 'chou': '酉', 'yin': '申', 'mao': '未', 'chen': '午', 'si': '巳', 'wu': '辰', 'wei': '卯', 'shen': '寅', 'you': '丑', 'xu': '子', 'hai': '亥' },
      '7': { 'zi': '酉', 'chou': '申', 'yin': '未', 'mao': '午', 'chen': '巳', 'si': '辰', 'wu': '卯', 'wei': '寅', 'shen': '丑', 'you': '子', 'xu': '亥', 'hai': '戌' },
      '8': { 'zi': '申', 'chou': '未', 'yin': '午', 'mao': '巳', 'chen': '辰', 'si': '卯', 'wu': '寅', 'wei': '丑', 'shen': '子', 'you': '亥', 'xu': '戌', 'hai': '酉' },
      '9': { 'zi': '未', 'chou': '午', 'yin': '巳', 'mao': '辰', 'chen': '卯', 'si': '寅', 'wu': '丑', 'wei': '子', 'shen': '亥', 'you': '戌', 'xu': '酉', 'hai': '申' },
      '10': { 'zi': '午', 'chou': '巳', 'yin': '辰', 'mao': '卯', 'chen': '寅', 'si': '丑', 'wu': '子', 'wei': '亥', 'shen': '戌', 'you': '酉', 'xu': '申', 'hai': '未' },
      '11': { 'zi': '巳', 'chou': '辰', 'yin': '卯', 'mao': '寅', 'chen': '丑', 'si': '子', 'wu': '亥', 'wei': '戌', 'shen': '酉', 'you': '申', 'xu': '未', 'hai': '午' },
      '12': { 'zi': '辰', 'chou': '卯', 'yin': '寅', 'mao': '丑', 'chen': '子', 'si': '亥', 'wu': '戌', 'wei': '酉', 'shen': '申', 'you': '未', 'xu': '午', 'hai': '巳' }
    };
    
    return bengMingTable[month][hour];
  },
  
  // Get sui jun (year guardian) based on ben ming and current year
  getSuiJun: function(benMing, currentYearBranch) {
    // Sui Jun calculation table
    const suiJunTable = {
      '子': {
        '子年': '太岁符', '丑年': '除秽养神', '寅年': '驱邪缚魅', '卯年': '福德符', 
        '辰年': '白虎消灾', '巳年': '龙德符', '午年': '太岁护佑', '未年': '保命护身', 
        '申年': '五鬼卫护', '酉年': '太阴纳福', '戌年': '祛邪保真', '亥年': '金光神卫'
      },
      '丑': {
        '子年': '金光神卫', '丑年': '太岁符', '寅年': '除秽养神', '卯年': '驱邪缚魅', 
        '辰年': '福德符', '巳年': '白虎消灾', '午年': '龙德符', '未年': '太岁护佑', 
        '申年': '保命护身', '酉年': '五鬼卫护', '戌年': '太阴纳福', '亥年': '祛邪保真'
      },
      '寅': {
        '子年': '祛邪保真', '丑年': '金光神卫', '寅年': '太岁符', '卯年': '除秽养神', 
        '辰年': '驱邪缚魅', '巳年': '福德符', '午年': '白虎消灾', '未年': '龙德符', 
        '申年': '太岁护佑', '酉年': '保命护身', '戌年': '五鬼卫护', '亥年': '太阴纳福'
      },
      '卯': {
        '子年': '太阴纳福', '丑年': '祛邪保真', '寅年': '金光神卫', '卯年': '太岁符', 
        '辰年': '除秽养神', '巳年': '驱邪缚魅', '午年': '福德符', '未年': '白虎消灾', 
        '申年': '龙德符', '酉年': '太岁护佑', '戌年': '保命护身', '亥年': '五鬼卫护'
      },
      '辰': {
        '子年': '五鬼卫护', '丑年': '太阴纳福', '寅年': '祛邪保真', '卯年': '金光神卫', 
        '辰年': '太岁符', '巳年': '除秽养神', '午年': '驱邪缚魅', '未年': '福德符', 
        '申年': '白虎消灾', '酉年': '龙德符', '戌年': '太岁护佑', '亥年': '保命护身'
      },
      '巳': {
        '子年': '保命护身', '丑年': '五鬼卫护', '寅年': '太阴纳福', '卯年': '祛邪保真', 
        '辰年': '金光神卫', '巳年': '太岁符', '午年': '除秽养神', '未年': '驱邪缚魅', 
        '申年': '福德符', '酉年': '白虎消灾', '戌年': '龙德符', '亥年': '太岁护佑'
      },
      '午': {
        '子年': '太岁护佑', '丑年': '保命护身', '寅年': '五鬼卫护', '卯年': '太阴纳福', 
        '辰年': '祛邪保真', '巳年': '金光神卫', '午年': '太岁符', '未年': '除秽养神', 
        '申年': '驱邪缚魅', '酉年': '福德符', '戌年': '白虎消灾', '亥年': '龙德符'
      },
      '未': {
        '子年': '龙德符', '丑年': '太岁护佑', '寅年': '保命护身', '卯年': '五鬼卫护', 
        '辰年': '太阴纳福', '巳年': '祛邪保真', '午年': '金光神卫', '未年': '太岁符', 
        '申年': '除秽养神', '酉年': '驱邪缚魅', '戌年': '福德符', '亥年': '白虎消灾'
      },
      '申': {
        '子年': '白虎消灾', '丑年': '龙德符', '寅年': '太岁护佑', '卯年': '保命护身', 
        '辰年': '五鬼卫护', '巳年': '太阴纳福', '午年': '祛邪保真', '未年': '金光神卫', 
        '申年': '太岁符', '酉年': '除秽养神', '戌年': '驱邪缚魅', '亥年': '福德符'
      },
      '酉': {
        '子年': '福德符', '丑年': '白虎消灾', '寅年': '龙德符', '卯年': '太岁护佑', 
        '辰年': '保命护身', '巳年': '五鬼卫护', '午年': '太阴纳福', '未年': '祛邪保真', 
        '申年': '金光神卫', '酉年': '太岁符', '戌年': '除秽养神', '亥年': '驱邪缚魅'
      },
      '戌': {
        '子年': '驱邪缚魅', '丑年': '福德符', '寅年': '白虎消灾', '卯年': '龙德符', 
        '辰年': '太岁护佑', '巳年': '保命护身', '午年': '五鬼卫护', '未年': '太阴纳福', 
        '申年': '祛邪保真', '酉年': '金光神卫', '戌年': '太岁符', '亥年': '除秽养神'
      },
      '亥': {
        '子年': '除秽养神', '丑年': '驱邪缚魅', '寅年': '福德符', '卯年': '白虎消灾', 
        '辰年': '龙德符', '巳年': '太岁护佑', '午年': '保命护身', '未年': '五鬼卫护', 
        '申年': '太阴纳福', '酉年': '祛邪保真', '戌年': '金光神卫', '亥年': '太岁符'
      }
    };
    
    return suiJunTable[benMing][currentYearBranch];
  },
  
  // Get fortune level based on sui jun
  getFortuneLevel: function(suiJun) {
    const fortuneTable = {
      '太岁符': 'extreme',
      '白虎消灾': 'terribleFortune',
      '祛邪保真': 'badFortune',
      '除秽养神': 'badFortune',
      '金光神卫': 'badFortune',
      '五鬼卫护': 'terribleFortune',
      '太岁护佑': 'terribleFortune',
      '福德符': 'greatFortune',
      '太阴纳福': 'badFortune',
      '驱邪缚魅': 'terribleFortune',
      '保命护身': 'terribleFortune',
      '龙德符': 'greatFortune'
    };
    
    return fortuneTable[suiJun];
  },
  
  // Get talisman name by adding "符" if needed
  getTalismanName: function(suiJun) {
    if (!suiJun.endsWith('符')) {
      return suiJun + '符';
    }
    return suiJun;
  },
  
  // Generate years for dropdown (current year - 100 to current year)
  generateYearOptions: function() {
    const currentYear = new Date().getFullYear();
    const years = [];
    
    for (let year = currentYear - 100; year <= currentYear; year++) {
      years.push({
        value: year,
        label: year
      });
    }
    
    return years;
  },
  
  // Convert hour string to earthly branch
  hourToEarthlyBranch: function(hour) {
    const hourMap = {
      '23': 'zi', '0': 'zi',
      '1': 'chou', '2': 'chou',
      '3': 'yin', '4': 'yin',
      '5': 'mao', '6': 'mao',
      '7': 'chen', '8': 'chen',
      '9': 'si', '10': 'si',
      '11': 'wu', '12': 'wu',
      '13': 'wei', '14': 'wei',
      '15': 'shen', '16': 'shen',
      '17': 'you', '18': 'you',
      '19': 'xu', '20': 'xu',
      '21': 'hai', '22': 'hai'
    };
    
    return hourMap[hour] || 'zi';
  }
};
