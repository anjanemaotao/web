function MingzhuAnalysis({ bazi }) {
  try {
    const { t } = React.useContext(I18nContext);
    
    if (!bazi) return null;
    
    // 获取日干
    const dayMaster = bazi.dayPillar.gan;
    
    // 根据日干获取对应的命主数据
    const mingzhuData = getMingzhuData(dayMaster);
    
    if (!mingzhuData) {
      return (
        <div className="analysis-item" data-name="mingzhu-analysis-empty">
          <div className="analysis-title">{t('mingzhuAnalysis')}</div>
          <div className="analysis-content">{t('noMingzhuData')}</div>
        </div>
      );
    }
    
    // 将释义中的换行符转换为JSX
    const interpretationParts = t(`mingzhu_interpretation_${dayMaster}`).split('\n').map((part, index) => (
      <p key={index} className="mb-2">{part}</p>
    ));
    
    return (
      <div className="analysis-item slide-in" data-name="mingzhu-analysis">
        <div className="analysis-content">
          <div className="pattern-section" data-name="mingzhu-main">
            <div className="pattern-section-header">
              <i className="fas fa-user text-accent-color mr-2"></i>
              <h4 className="font-semibold">{t('mingzhuInfo')}</h4>
              <div className="pattern-section-line"></div>
            </div>
            <div className="mingzhu-header mb-4 p-3 bg-gray-50 rounded-md border-l-4 border-accent-color" data-name="mingzhu-header">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className={`mingzhu-symbol wuxing-${getWuxingClass(dayMaster)}`}>
                    {dayMaster}
                  </span>
                  <span className="text-xl font-bold ml-2 text-accent-color">{t(`mingzhu_name_${dayMaster}`)}</span>
                </div>
                <div className="flex items-center">
                  <span className="mingzhu-badge mr-2 pattern-badge-enhanced">{t(`mingzhu_wuchang_${dayMaster}`)}</span>
                  <span className="mingzhu-badge pattern-badge-enhanced">{t(`mingzhu_attribute_${dayMaster}`)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pattern-section" data-name="mingzhu-analysis-section">
            <div className="pattern-section-header">
              <i className="fas fa-book-open text-accent-color mr-2"></i>
              <h4 className="font-semibold">{t('mingzhuAnalysisTitle')}</h4>
              <div className="pattern-section-line"></div>
            </div>
            <div className="mingzhu-details bg-gray-50 rounded-lg p-4 shadow-sm" data-name="mingzhu-details">
              <div className="pattern-details-header">
                <div className="pattern-details-icon">
                  <i className="fas fa-info-circle text-accent-color"></i>
                </div>
                <h5 className="text-md font-semibold mb-3 text-accent-color">{t('detailedExplanation')}</h5>
                <div className="pattern-details-line"></div>
              </div>
              <div className="mingzhu-interpretation">
                {interpretationParts}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('MingzhuAnalysis component error:', error);
    reportError(error);
    return null;
  }
}

// 获取五行对应的CSS类名
function getWuxingClass(gan) {
  const calculator = BaziCalculator();
  const wuxing = calculator.getWuxing(gan);
  
  switch (wuxing) {
    case '木': return 'wood';
    case '火': return 'fire';
    case '土': return 'earth';
    case '金': return 'metal';
    case '水': return 'water';
    default: return '';
  }
}

// 获取命主数据
function getMingzhuData(dayMaster) {
  const mingzhuDatabase = [
    {
      "命主": "甲木",
      "五常": "主仁",
      "属性": "阳木",
      "释义": "核心意象：参天大树，象征向上、领导力、仁心。\n性格：正直慷慨，独立果断，有领袖气质；但主观固执，不善妥协，易直言伤人。\n优势：进取坚韧，责任感强，善决策；木旺者仁慈乐施，但需防轻信。\n职业方向：管理、人事、教育、医疗、法律、创业（适合主导型、服务型或顾问类角色）。\n修炼建议：避免过度干涉他人，培养灵活性；收敛独断倾向，学习倾听。\n附注：甲木男性专一可靠，是己土女性的理想伴侣。"
    },
    {
      "命主": "乙木",
      "五常": "主仁",
      "属性": "阴木",
      "释义": "核心意象：花草藤蔓，象征柔韧、适应力与细腻情感。\n性格：温和谦逊，善解人意，心思缜密；但易犹豫、依赖，内心敏感多虑。\n优势：适应力强，善于协调，情商高；重情义，艺术感知力突出。\n职业方向：辅助型角色（秘书、顾问）、艺术创作、文化传播、零售业（花卉、文具等）。\n修炼建议：增强决断力，减少内耗；避免过度迁就他人，培养独立性。\n附注：乙木人外柔内韧，需珍惜其细腻情感，但也要引导其摆脱纠结心态。"
    },
    {
      "命主": "丙火",
      "五常": "主礼",
      "属性": "阳火",
      "释义": "核心意象：太阳之火，象征光明、热情与领导力。\n性格：开朗慷慨，积极乐观，感染力强；但易急躁冲动，好面子，情绪起伏大。\n优势：行动力强，富有感染力，乐于助人，社交能力强，适合引领团队。\n职业方向：销售、演讲、教育、法律、能源、餐饮、创意行业（如写作、艺术）。\n修炼建议：避免急躁冒进，增强耐心与持续性；减少虚荣心，学会沉稳处事。\n附注：丙火人像太阳般温暖耀眼，但需注意情绪管理，避免因冲动或过度自尊影响判断。"
    },
    {
      "命主": "丁火",
      "五常": "主礼",
      "属性": "阴火",
      "释义": "核心意象：烛火星光，象征温暖、专注与细腻情感。\n性格：温和内敛，心思缜密，善于洞察；但敏感多疑，情绪起伏，易自我消耗。\n优势：持久专注，直觉敏锐，富有奉献精神，适合深度思考与艺术创造。\n职业方向：教育、心理咨询、文化艺术（影视、音乐、书画）、宗教哲学、公益事业。\n修炼建议：减少过度思虑，增强情绪稳定性；学会拒绝，避免被他人消耗能量。\n附注：丁火人如烛光般柔和深邃，需被认可与陪伴，适当引导可发挥其智慧与创造力。"
    },
    {
      "命主": "戊土",
      "五常": "主信",
      "属性": "阳土",
      "释义": "核心意象：城墙之土，象征厚重、诚信与承载力。\n性格：沉稳务实，忠厚守信；但固执保守，不善变通，反应较慢。\n优势：耐力强，责任感重，脚踏实地，适合长期积累；包容度高，值得信赖。\n职业方向：房地产、金融（银行/保险）、工程建筑、农业、仓储、行政管理。\n修炼建议：增强灵活性，避免过度固执；适当突破舒适圈，培养创新思维。\n附注：戊土人如大地般可靠，需在坚守原则的同时学会适应变化，方能成就更大格局。"
    },
    {
      "命主": "己土",
      "五常": "主信",
      "属性": "阴土",
      "释义": "核心意象：田园之土，象征滋养、包容与适应力。\n性格：温厚低调，细腻隐忍，善于协调；但易优柔寡断，缺乏主见，易被外界影响。\n优势：适应力强，耐心细致，擅长整合资源；默默奉献，是绝佳的辅助型人才。\n职业方向：教育、研究、行政管理、人力资源、传统工艺、中介服务（如咨询、协调类工作）。\n修炼建议：增强决断力，避免过度妥协；学会表达需求，减少内耗与被动心态。\n附注：己土人如土壤般柔韧包容，需在保持谦和的同时培养自信，方能避免被他人左右。"
    },
    {
      "命主": "庚金",
      "五常": "主义",
      "属性": "阳金",
      "释义": "核心意象：刀剑之金，象征锐利、果决与正义感。\n性格：刚毅果断，重情重义；但锋芒过露，易冲动固执，不善迂回。\n优势：执行力强，原则分明，目标导向；适合攻坚克难，捍卫规则与正义。\n职业方向：管理、司法（律师/警察）、财务、工程技术（机械/金属）、医疗外科。\n修炼建议：收敛锋芒，培养同理心；避免极端，学会灵活处事。\n附注：庚金人如利刃般锐不可当，需以柔济刚，方能成就大事而不伤己伤人。"
    },
    {
      "命主": "辛金",
      "五常": "主义",
      "属性": "阴金",
      "释义": "核心意象：珠玉之金，象征精致、完美与敏锐。\n性格：外柔内刚，细腻严谨；但易敏感挑剔，自尊心强，易陷入精神内耗。\n优势：思维缜密，审美出众，善于创新；追求卓越，适合精细化管理或创意工作。\n职业方向：设计、艺术、教育、编辑、精密技术（机械/光学）、金融理财、心理咨询。\n修炼建议：降低完美主义倾向，增强抗压能力；减少思虑过度，避免情绪消耗。\n附注：辛金人如珠宝般熠熠生辉，需在保持高标准的同时学会自我接纳，方能避免因苛求而损耗心力。"
    },
    {
      "命主": "壬水",
      "五常": "主智",
      "属性": "阳水",
      "释义": "核心意象：江海之水，象征智慧、流动与自由。\n性格：聪慧灵动，适应力强；但善变随性，缺乏持久力，不喜约束。\n优势：思维敏捷，创意丰富，善于交际；应变能力强，适合开拓性工作。\n职业方向：策划、咨询、传媒、艺术、教育、旅游、外交或自由职业。\n修炼建议：培养专注力，避免三分钟热度；增强目标感，平衡自由与责任。\n附注：壬水人如活水般充满可能，需在保持灵活的同时学会沉淀，方能将智慧转化为持久成就。"
    },
    {
      "命主": "癸水",
      "五常": "主智",
      "属性": "阴水",
      "释义": "核心意象：雨露之水，象征灵性、细腻与渗透力。\n性格：聪慧敏感，善解人意；但易多愁善感，缺乏行动力，过度理想化。\n优势：洞察力强，创造力突出，耐力持久；适合需要耐心与智慧的工作。\n职业方向：策划、咨询、艺术创作、心理学、命理学、金融、服务行业。\n修炼建议：增强行动力，减少空想；培养现实感，避免情绪过度消耗。\n附注：癸水人如细雨般润物无声，需在保持灵性的同时落地生根，方能将天赋转化为实际成就。"
    }
  ];
  
  return mingzhuDatabase.find(item => item.命主.startsWith(dayMaster));
}
