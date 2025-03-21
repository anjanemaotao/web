import { createI18n } from 'vue-i18n';

const messages = {
  'zh-TW': {
    //繁體中文(默认)
    app: {
      title: '墨衍子八字',
      subtitle: '探索命運天機，尋求人生指引',
    },
    form: {
      title: '請輸入您的出生資訊',
      year: '年',
      month: '月',
      day: '日',
      hour: '時辰',
      calculate: '推算命盤',
      calculating: '正在推算...',
      reset: '重設',
    },
    result: {
      bazi: '八字',
      wuxing: '五行',
      shishen: '十神',
      ju: '格局',
      twelveStages: '十二宮',
      year: '年柱',
      month: '月柱',
      day: '日柱',
      hour: '時柱',
      position: '位置',
      tianGan: '天干',
      diZhi: '地支',
      stage: '階段',
      meaning: '含義',
      analysis: '分析解釋',
    },
    footer: {
      copyright: '版權所有',about: '關於我們',
      terms: '使用條款',
      privacy: '隱私政策',
    }
  },
  'zh-CN': {
    // 简体中文
    app: {
      title: '墨衍子八字',
      subtitle: '探索命运天机，寻求人生指引',
    },
    form: {
      title: '请输入您的出生信息',
      year: '年',
      month: '月',
      day: '日',
      hour: '时辰',
      calculate: '推算命盘',
      calculating: '正在推算...',
      reset: '重置',
    },
    result: {
      bazi: '八字',
      wuxing: '五行',
      shishen: '十神',
      ju: '格局',
      twelveStages: '十二宫',
      year: '年柱',
      month: '月柱',
      day: '日柱',
      hour: '时柱',
      position: '位置',
      tianGan: '天干',
      diZhi: '地支',
      stage: '阶段',
      meaning: '含义',
      analysis: '分析解释',
    },
    footer: {
      copyright: '版权所有',
      about: '关于我们',
      terms: '使用条款',
      privacy: '隐私政策',
    }
  },'en': {
    //英文
    app: {
      title: 'Bazi Fortune Calculator',
      subtitle: 'Explore the mysteries of fate, seek guidance for life',
    },
    form: {
      title: 'Enter Your Birth Information',
      year: 'Year',
      month: 'Month',
      day: 'Day',
      hour: 'Hour',
      calculate: 'Calculate',
      calculating: 'Calculating...',
      reset: 'Reset',
    },
    result: {
      bazi: 'Eight Characters',
      wuxing: 'Five Elements',
      shishen: 'Ten Gods',
      ju: 'Pattern',
      twelveStages: 'Twelve Stages',
      year: 'Year Pillar',
      month: 'Month Pillar',
      day: 'Day Pillar',
      hour: 'Hour Pillar',
      position: 'Position',
      tianGan: 'Heavenly Stem',
      diZhi: 'Earthly Branch',
      stage: 'Stage',
      meaning: 'Meaning',
      analysis: 'Analysis',
    },
    footer: {
      copyright: 'Copyright',
      about: 'About',
      terms: 'Terms',
      privacy: 'Privacy',
    }
  },'ja': {
    // 日语
    app: {
      title: '八字と命格推算',
      subtitle: '運命の神秘を探り、人生の指針を求める',
    },
    form: {
      title: '生年月日時間を入力してください',
      year: '年',
      month: '月',
      day: '日',
      hour: '時刻',
      calculate: '計算する',
      calculating: '計算中...',
      reset: 'リセット',
    },
    result: {
      bazi: '八字',
      wuxing: '五行',
      shishen: '十神',
      ju: '格局',
      twelveStages: '十二宮',
      year: '年柱',
      month: '月柱',
      day: '日柱',
      hour: '時柱',
      position: '位置',
      tianGan: '天干',
      diZhi: '地支',
      stage: '段階',
      meaning: '意味',
      analysis: '分析',
    },
    footer: {
      copyright: '著作権',
      about: '当社について',
      terms: '利用規約',
      privacy: 'プライバシーポリシー',
    }
  },'ko': {
    // 韩文
    app: {
      title: '사주와 명국 계산',
      subtitle: '운명의 신비를탐구하고삶의 방향을 찾다',
    },
    form: {
      title: '출생 정보를 입력하세요',
      year: '년',
      month: '월',
      day: '일',
      hour: '시간',
      calculate: '계산하기',
      calculating: '계산중...',
      reset: '재설정',
    },
    result: {
      bazi: '사주',
      wuxing: '오행',
      shishen: '십신',
      ju: '격국',
      twelveStages: '십이궁',
      year: '년주',
      month: '월주',
      day: '일주',
      hour: '시주',
      position: '위치',
      tianGan: '천간',
      diZhi: '지지',
      stage: '단계',
      meaning: '의미',
      analysis: '분석',
    },
    footer: {
      copyright: '저작권',
      about: '회사 소개',
      terms: '이용약관',
      privacy: '개인정보처리방침',
    }
  }
};

//修改：添加legacy: false来使用Composition API模式
const i18n = createI18n({
  legacy: false, // 使用Composition API模式
  locale: 'zh-TW', // 默认使用繁体中文
  fallbackLocale: 'zh-TW',
  messages,
});

export default i18n;