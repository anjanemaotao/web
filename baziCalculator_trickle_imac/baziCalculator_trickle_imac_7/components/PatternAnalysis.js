function PatternAnalysis({ patterns, bazi }) {
  // 命主数据
  const mingzhuData = {
    "甲": { "命主": "甲木", "五常": "主仁", "属性": "阳木", "释义": "核心意象：参天大树，象征向上、领导力、仁心。\n性格：正直慷慨，独立果断，有领袖气质；但主观固执，不善妥协，易直言伤人。\n优势：进取坚韧，责任感强，善决策；木旺者仁慈乐施，但需防轻信。\n职业方向：管理、人事、教育、医疗、法律、创业（适合主导型、服务型或顾问类角色）。\n修炼建议：避免过度干涉他人，培养灵活性；收敛独断倾向，学习倾听。\n附注：甲木男性专一可靠，是己土女性的理想伴侣。" },
    "乙": { "命主": "乙木", "五常": "主仁", "属性": "阴木", "释义": "核心意象：花草藤蔓，象征柔韧、适应力与细腻情感。\n性格：温和谦逊，善解人意，心思缜密；但易犹豫、依赖，内心敏感多虑。\n优势：适应力强，善于协调，情商高；重情义，艺术感知力突出。\n职业方向：辅助型角色（秘书、顾问）、艺术创作、文化传播、零售业（花卉、文具等）。\n修炼建议：增强决断力，减少内耗；避免过度迁就他人，培养独立性。\n附注：乙木人外柔内韧，需珍惜其细腻情感，但也要引导其摆脱纠结心态。" },
    "丙": { "命主": "丙火", "五常": "主礼", "属性": "阳火", "释义": "核心意象：太阳之火，象征光明、热情与领导力。\n性格：开朗慷慨，积极乐观，感染力强；但易急躁冲动，好面子，情绪起伏大。\n优势：行动力强，富有感染力，乐于助人，社交能力强，适合引领团队。\n职业方向：销售、演讲、教育、法律、能源、餐饮、创意行业（如写作、艺术）。\n修炼建议：避免急躁冒进，增强耐心与持续性；减少虚荣心，学会沉稳处事。\n附注：丙火人像太阳般温暖耀眼，但需注意情绪管理，避免因冲动或过度自尊影响判断。" },
    "丁": { "命主": "丁火", "五常": "主礼", "属性": "阴火", "释义": "核心意象：烛火星光，象征温暖、专注与细腻情感。\n性格：温和内敛，心思缜密，善于洞察；但敏感多疑，情绪起伏，易自我消耗。\n优势：持久专注，直觉敏锐，富有奉献精神，适合深度思考与艺术创造。\n职业方向：教育、心理咨询、文化艺术（影视、音乐、书画）、宗教哲学、公益事业。\n修炼建议：减少过度思虑，增强情绪稳定性；学会拒绝，避免被他人消耗能量。\n附注：丁火人如烛光般柔和深邃，需被认可与陪伴，适当引导可发挥其智慧与创造力。" },
    "戊": { "命主": "戊土", "五常": "主信", "属性": "阳土", "释义": "核心意象：城墙之土，象征厚重、诚信与承载力。\n性格：沉稳务实，忠厚守信；但固执保守，不善变通，反应较慢。\n优势：耐力强，责任感重，脚踏实地，适合长期积累；包容度高，值得信赖。\n职业方向：房地产、金融（银行/保险）、工程建筑、农业、仓储、行政管理。\n修炼建议：增强灵活性，避免过度固执；适当突破舒适圈，培养创新思维。\n附注：戊土人如大地般可靠，需在坚守原则的同时学会适应变化，方能成就更大格局。" },
    "己": { "命主": "己土", "五常": "主信", "属性": "阴土", "释义": "核心意象：田园之土，象征滋养、包容与适应力。\n性格：温厚低调，细腻隐忍，善于协调；但易优柔寡断，缺乏主见，易被外界影响。\n优势：适应力强，耐心细致，擅长整合资源；默默奉献，是绝佳的辅助型人才。\n职业方向：教育、研究、行政管理、人力资源、传统工艺、中介服务（如咨询、协调类工作）。\n修炼建议：增强决断力，避免过度妥协；学会表达需求，减少内耗与被动心态。\n附注：己土人如土壤般柔韧包容，需在保持谦和的同时培养自信，方能避免被他人左右。" },
    "庚": { "命主": "庚金", "五常": "主义", "属性": "阳金", "释义": "核心意象：刀剑之金，象征锐利、果决与正义感。\n性格：刚毅果断，重情重义；但锋芒过露，易冲动固执，不善迂回。\n优势：执行力强，原则分明，目标导向；适合攻坚克难，捍卫规则与正义。\n职业方向：管理、司法（律师/警察）、财务、工程技术（机械/金属）、医疗外科。\n修炼建议：收敛锋芒，培养同理心；避免极端，学会灵活处事。\n附注：庚金人如利刃般锐不可当，需以柔济刚，方能成就大事而不伤己伤人。" },
    "辛": { "命主": "辛金", "五常": "主义", "属性": "阴金", "释义": "核心意象：珠玉之金，象征精致、完美与敏锐。\n性格：外柔内刚，细腻严谨；但易敏感挑剔，自尊心强，易陷入精神内耗。\n优势：思维缜密，审美出众，善于创新；追求卓越，适合精细化管理或创意工作。\n职业方向：设计、艺术、教育、编辑、精密技术（机械/光学）、金融理财、心理咨询。\n修炼建议：降低完美主义倾向，增强抗压能力；减少思虑过度，避免情绪消耗。\n附注：辛金人如珠宝般熠熠生辉，需在保持高标准的同时学会自我接纳，方能避免因苛求而损耗心力。" },
    "壬": { "命主": "壬水", "五常": "主智", "属性": "阳水", "释义": "核心意象：江海之水，象征智慧、流动与自由。\n性格：聪慧灵动，适应力强；但善变随性，缺乏持久力，不喜约束。\n优势：思维敏捷，创意丰富，善于交际；应变能力强，适合开拓性工作。\n职业方向：策划、咨询、传媒、艺术、教育、旅游、外交或自由职业。\n修炼建议：培养专注力，避免三分钟热度；增强目标感，平衡自由与责任。\n附注：壬水人如活水般充满可能，需在保持灵活的同时学会沉淀，方能将智慧转化为持久成就。" },
    "癸": { "命主": "癸水", "五常": "主智", "属性": "阴水", "释义": "核心意象：雨露之水，象征灵性、细腻与渗透力。\n性格：聪慧敏感，善解人意；但易多愁善感，缺乏行动力，过度理想化。\n优势：洞察力强，创造力突出，耐力持久；适合需要耐心与智慧的工作。\n职业方向：策划、咨询、艺术创作、心理学、命理学、金融、服务行业。\n修炼建议：增强行动力，减少空想；培养现实感，避免情绪过度消耗。\n附注：癸水人如细雨般润物无声，需在保持灵性的同时落地生根，方能将天赋转化为实际成就。" }
  };
  try {
    const { t } = React.useContext(I18nContext);
    
    if (!patterns || patterns.length === 0) {
      return (
        <div className="analysis-item" data-name="pattern-analysis-empty">
          <div className="analysis-title">{t('patternTitle')}</div>
          <div className="analysis-content">
            <div className="mb-4 p-3 bg-gray-50 rounded-md" data-name="pattern-main-display">
              <h4 className="font-semibold mb-2">格局定义：</h4>
              <div className="flex items-center">
                <span className="text-lg font-bold text-accent-color mr-2">
                  平常格
                </span>
                <span className="text-sm text-gray-600">
                  (无特殊格局)
                </span>
              </div>
            </div>
            <p>您的八字格局较为平衡，没有明显的特殊格局。这意味着您的性格较为全面，能够适应不同的环境和情况，但也可能需要更多的自我探索来发现个人独特的优势和特长。</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="analysis-item slide-in" data-name="pattern-analysis">
        {/* 命局分析 */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md" data-name="mingju-analysis">
          <h3 className="text-xl font-bold mb-4 text-accent-color"><i className="fas fa-compass mr-2"></i>命局：</h3>
          <hr className="divider mb-4" />
          {bazi && bazi.dayPillar && mingzhuData[bazi.dayPillar.gan] && (
            <div className="space-y-4">
              <div className="flex items-center mb-3 p-2 bg-light rounded">
                <span className="text-lg font-semibold text-primary mr-4">
                  <i className="fas fa-user-circle mr-1"></i>
                  {mingzhuData[bazi.dayPillar.gan].命主}
                </span>
                <span className="badge bg-secondary mr-4">{mingzhuData[bazi.dayPillar.gan].五常}</span>
                <span className="badge bg-info">{mingzhuData[bazi.dayPillar.gan].属性}</span>
              </div>
              <div className="prose max-w-none">
                {mingzhuData[bazi.dayPillar.gan].释义.split('\n').map((paragraph, index) => {
                  // 为关键词添加样式
                  let styledParagraph = paragraph;
                  if (index === 0) {
                    styledParagraph = <strong className="text-primary">{paragraph}</strong>;
                  } else if (paragraph.startsWith('性格：')) {
                    styledParagraph = <>
                      <span className="text-accent-color font-bold">性格：</span>
                      {paragraph.substring(3)}
                    </>;
                  } else if (paragraph.startsWith('优势：')) {
                    styledParagraph = <>
                      <span className="text-success font-bold">优势：</span>
                      {paragraph.substring(3)}
                    </>;
                  } else if (paragraph.startsWith('职业方向：')) {
                    styledParagraph = <>
                      <span className="text-info font-bold">职业方向：</span>
                      {paragraph.substring(5)}
                    </>;
                  } else if (paragraph.startsWith('修炼建议：')) {
                    styledParagraph = <>
                      <span className="text-warning font-bold">修炼建议：</span>
                      {paragraph.substring(5)}
                    </>;
                  } else if (paragraph.startsWith('附注：')) {
                    styledParagraph = <>
                      <span className="text-secondary font-bold">附注：</span>
                      {paragraph.substring(3)}
                    </>;
                  }
                  return <p key={index} className="text-gray-700 mb-2">{styledParagraph}</p>;
                })}
              </div>
            </div>
          )}
        </div>
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md" data-name="pattern-analysis-card">
          <h3 className="text-xl font-bold mb-4 text-accent-color"><i className="fas fa-dharmachakra mr-2"></i>{t('patternTitle')}</h3>
          <hr className="divider mb-4" />
          
          <div className="mb-4" data-name="pattern-badges">
            <div className="flex flex-wrap gap-2">
              {patterns.map(pattern => (
                <span 
                  key={pattern} 
                  className={`pattern-badge pattern-${pattern} px-3 py-1 rounded-full text-white flex items-center`}
                  data-name={`pattern-badge-${pattern}`}
                  style={{backgroundColor: getPatternColor(pattern)}}
                >
                  <span className="celestial-symbol mr-1">
                    {getPatternSymbol(pattern)}
                  </span>
                  {t(pattern)}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mb-5 p-4 bg-gray-50 rounded-lg border-l-4 border-accent-color" data-name="pattern-main-display">
            <div className="flex items-center mb-2">
              <i className="fas fa-certificate text-accent-color mr-2"></i>
              <h4 className="font-semibold">格局定义：</h4>
            </div>
            <div className="flex items-center">
              <span className="text-lg font-bold text-accent-color mr-2">
                {patterns.length > 0 ? t(patterns[0]) : '平常格'}
              </span>
              <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                {patterns.length > 0 ? getPatternNickname(patterns[0]) : '无特殊格局'}
              </span>
            </div>
          </div>
          
          {patterns.map(pattern => (
            <div key={pattern} className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm" data-name={`pattern-description-${pattern}`}>
              <div className="flex items-center mb-3">
                <span className="celestial-symbol text-xl mr-2" style={{color: getPatternColor(pattern)}}>
                  {getPatternSymbol(pattern)}
                </span>
                <h4 className="font-semibold text-lg">{t(pattern)}</h4>
              </div>
              
              <p className="mb-4 text-gray-700 leading-relaxed">{getPatternDescription(pattern)}</p>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4" data-name={`pattern-details-${pattern}`}>
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500 shadow-sm">
                  <div className="flex items-center mb-2">
                    <i className="fas fa-fingerprint text-blue-700 mr-2"></i>
                    <h5 className="font-semibold text-blue-700">特点</h5>
                  </div>
                  <p className="text-sm text-gray-700">{getPatternCharacteristic(pattern)}</p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500 shadow-sm">
                  <div className="flex items-center mb-2">
                    <i className="fas fa-award text-green-700 mr-2"></i>
                    <h5 className="font-semibold text-green-700">优势</h5>
                  </div>
                  <p className="text-sm text-gray-700">{getPatternAdvantages(pattern)}</p>
                </div>
                
                <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500 shadow-sm">
                  <div className="flex items-center mb-2">
                    <i className="fas fa-exclamation-circle text-red-700 mr-2"></i>
                    <h5 className="font-semibold text-red-700">劣势</h5>
                  </div>
                  <p className="text-sm text-gray-700">{getPatternDisadvantages(pattern)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('PatternAnalysis component error:', error);
    reportError(error);
    return null;
  }
}

// 获取格局对应的符号
function getPatternSymbol(pattern) {
  switch (pattern) {
    case 'shangguan': return '☲'; // 离卦，代表火
    case 'yinzhong': return '☵'; // 坎卦，代表水
    case 'bijian': return '☰'; // 乾卦，代表天
    case 'shazhong': return '☴'; // 巽卦，代表风
    case 'caiwang': return '☷'; // 坤卦，代表地
    default: return '☯';
  }
}

// 获取格局昵称
function getPatternNickname(pattern) {
  switch (pattern) {
    case 'shangguan': return '艺术格局';
    case 'yinzhong': return '学者格局';
    case 'bijian': return '团队格局';
    case 'shazhong': return '谨慎格局';
    case 'caiwang': return '实干格局';
    default: return '平衡格局';
  }
}

// 获取格局描述
function getPatternDescription(pattern) {
  switch (pattern) {
    case 'shangguan':
      return '伤官格局的人感性多于理性，思维活跃，富有艺术家气质。他们对他人有很强的同理心和理解能力，善于观察世界以及人与人之间的关系，热衷于感受美好的事物。适合从事艺术、设计、创意等需要灵感和想象力的工作。';
    case 'yinzhong':
      return '印重格局的人理性占主导，喜欢讲道理，性格较为固执，不太容易听取他人的意见，自我意识很强。他们通常学识丰富，做事有条理，适合从事学术研究、教育、写作等需要深思熟虑的工作。';
    case 'bijian':
      return '命旺格局的人重义气，朋友通常较多，在团队中往往是兜底的角色，不怕辛苦，勇于担当。他们适合从事需要团队合作的工作，如管理、销售、公关等领域，能够发挥团队协作的优势。';
    case 'shazhong':
      return '煞重格局的人风险意识强，做事情注重细节，性格较为严谨，有时可能显得过于谨慎。他们适合从事需要精确和风险控制的工作，如财务、审计、法律等领域，能够发现潜在问题并提前预防。';
    case 'caiwang':
      return '财旺格局的人执行能力很强，他们将事业成功视为衡量自己的标准，同时也用这一标准去评判他人。在"想了再做"和"做了再想"之间，他们通常会选择后者。他们适合从事商业、金融、投资等需要决断力和行动力的工作。';
    default:
      return '这是一种较为平衡的格局，没有特别突出的特点，但也意味着性格较为全面，能够适应不同的环境和情况。';
  }
}

// 获取格局特点
function getPatternCharacteristic(pattern) {
  switch (pattern) {
    case 'bijian': return '自信';
    case 'shazhong': return '谨慎';
    case 'caiwang': return '有目标';
    case 'shangguan': return '聪明';
    case 'yinzhong': return '爱思考';
    default: return '平衡';
  }
}

// 获取格局优势
function getPatternAdvantages(pattern) {
  switch (pattern) {
    case 'bijian':
      return '认为自己是我命由我不由天、精力旺盛、睡眠少，喜欢做大哥大、或大姐大、能吃苦、有毅力、忠诚度高、竞争心强、不服输、超级自信、甚至自负、做事注重过程，注重感受、喜欢亲力亲为、心怀天下，有拯救情节、朋友多、一心多用的能力。';
    case 'shazhong':
      return '具有正统、正直，责任心强、有担当，有使命感，有气魄、进取心强、管理能力强，轻承诺、重行动。易有一技之长，喜欢学习，善解人意，顾全大局、能屈能伸，天生演员天赋，模仿能力强，高冷、威严。';
    case 'caiwang':
      return '善于把握商机、发现商业价值，有投机性、目标感强、兴趣广泛、易多领域发展，异性缘好、想花钱时就有钱。为人大方、喜欢交朋友，有理财天赋，创意多、点子多，喜欢新鲜体验，多情善感、实干。男性对太太孩子好，女性更能干，偏女强人。';
    case 'shangguan':
      return '有才气、秀气、灵气、傲气，聪明、激情、浪漫、表演、悟性高，善解人意、洞察力强、情商高，有开拓精神、行动力强，有创新性、有长远规划、有梦想，兴趣广泛、善于表达、热情、口才好，喜欢被表扬、喜欢鲜花、掌声，有上进心，有技能、有才艺、高雅、善辨、幽默。喜欢追求新奇特、喜欢运动。';
    case 'yinzhong':
      return '仁慈、传统、爱思考、有梦想、爱做梦，做事有计划、有步骤、易指挥别人，喜欢学习、读书、标准高，有思想高度，自我价值感高，认可权威，讲逻辑、讲原理、讲出处、讲道理，记忆力好、逻辑思维强，点子多、想法多、奇思妙想，有预感、有创意、喜欢易学、玄学，悟性高、认可后执行力强。喜欢刨根问底，喜欢独处。';
    default:
      return '性格全面，适应能力强。';
  }
}

// 获取格局劣势
function getPatternDisadvantages(pattern) {
  switch (pattern) {
    case 'bijian':
      return '胆子大、坐不住、自大、孤傲、孤僻、赌性强、固执、自以为是、易破财。个别人不够自信。';
    case 'shazhong':
      return '脾气大、但能忍，爱睡懒觉，敏感、胆小懦弱，容易不好意思拒绝别人，谨慎、顾虑多、选择困难症，爱面子，拖延症，不够自信、暴躁、霸道、野心、固执。女性懂事听话易旺夫。';
    case 'caiwang':
      return '好动，坐不住，易有用人靠前，不用人靠后特点，目的性太强，容易财来财去，目标不专一、不深入、好色、谎言。';
    case 'shangguan':
      return '急性子，有攀比心，易情绪化，易冲动，感性，说话直接，爱怼人，任性、玻璃心、善变、夸大、反叛、多疑、嘴比脑子快、牢骚、小气、懒惰。男性说话或行为伤领导，女性说话、行为伤丈夫和领导。';
    case 'yinzhong':
      return '顾虑多、爱生闷、气想得多、做得少、易头痛、易早生华发，从骨子里喜欢钱或欲望很多、有洁癖、喜欢挑毛病、喜欢给人建议、凡事喜欢自己琢磨研究、标准多、要求多、固执、一根筋、有些人显得愚笨。';
    default:
      return '可能缺乏突出特点。';
  }
}

// 获取格局颜色
function getPatternColor(pattern) {
  switch (pattern) {
    case 'bijian': return '#4a6da7'; // 深蓝色
    case 'shazhong': return '#8e44ad'; // 紫色
    case 'caiwang': return '#d4af37'; // 金色
    case 'shangguan': return '#e74c3c'; // 红色
    case 'yinzhong': return '#2980b9'; // 蓝色
    default: return '#34495e'; // 深灰色
  }
}

