function PatternAnalysis({ patterns }) {
  try {
    const { t } = React.useContext(I18nContext);
    
    if (!patterns || patterns.length === 0) {
      return (
        <div className="analysis-item" data-name="pattern-analysis-empty">
          <div className="analysis-title">{t('patternTitle')}</div>
          <div className="analysis-content">
            <div className="mb-4 p-3 bg-gray-50 rounded-md" data-name="pattern-main-display">
              <h4 className="font-semibold mb-2">格局导向：</h4>
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
        {/*<div className="analysis-title">{t('patternTitle')}</div>*/}
        <div className="analysis-content">
          <div className="pattern-section" data-name="pattern-badges">
            <div className="pattern-section-header">
              <i className="fas fa-certificate text-accent-color mr-2"></i>
              <h4 className="font-semibold">所属格局：</h4>
              <div className="pattern-section-line"></div>
            </div>
            <div className="pattern-badges-container">
              {patterns.map(pattern => (
                <span 
                  key={pattern} 
                  className={`pattern-badge pattern-${pattern} pattern-badge-enhanced`}
                  data-name={`pattern-badge-${pattern}`}
                >
                  <span className="celestial-symbol">
                    {getPatternSymbol(pattern)}
                  </span>
                  {t(pattern)}
                </span>
              ))}
            </div>
          </div>
          
          <div className="pattern-section mb-4" data-name="pattern-main-display">
            <div className="pattern-section-header">
              <i className="fas fa-compass text-accent-color mr-2"></i>
              <h4 className="font-semibold">格局导向：</h4>
              <div className="pattern-section-line"></div>
            </div>
            <div className="pattern-orientation p-3 bg-gray-50 rounded-md border-l-4 border-accent-color">
              <div className="flex items-center">
                <div className="pattern-main-name">
                  <span className="text-xl font-bold text-accent-color mr-2 pattern-highlight">
                    {patterns.length > 0 ? t(patterns[0]) : '平常格'}
                  </span>
                  <span className="text-sm text-gray-600 pattern-nickname">
                    ({patterns.length > 0 ? getPatternNickname(patterns[0]) : '无特殊格局'})
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {patterns.map(pattern => (
            <div key={pattern} className="mb-6 pattern-section" data-name={`pattern-description-${pattern}`}>
              <div className="pattern-section-header">
                <i className="fas fa-user-circle text-accent-color mr-2"></i>
                <h4 className="font-semibold">{t('personalityTitle')}</h4>
                <div className="pattern-section-line"></div>
              </div>
              <p className="mb-4 pattern-description">{getPatternDescription(pattern)}</p>
              
              {/* 添加格局特点、优势、劣势分析 */}
              <div className="pattern-details bg-gray-50 rounded-lg p-4 shadow-sm" data-name={`pattern-details-${pattern}`}>
                <div className="pattern-details-header">
                  <div className="pattern-details-icon">
                    <i className="fas fa-chart-line text-accent-color"></i>
                  </div>
                  <h5 className="text-md font-semibold mb-3 text-accent-color">格局详细分析</h5>
                  <div className="pattern-details-line"></div>
                </div>
                
                <div className="mb-4 pattern-feature-card" data-name={`pattern-feature-${pattern}`}>
                  <div className="flex items-center mb-2">
                    <span className="inline-block w-8 h-8 bg-accent-color bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                      <i className="fas fa-star text-sm text-accent-color"></i>
                    </span>
                    <span className="font-medium text-primary-text">特点：</span>
                    <span className="ml-2 text-lg font-bold pattern-feature-text">{getPatternFeature(pattern)}</span>
                  </div>
                </div>
                
                <div className="mb-4 pattern-advantages-card" data-name={`pattern-advantages-${pattern}`}>
                  <div className="flex items-start mb-2">
                    <span className="inline-block w-8 h-8 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center mr-3 mt-1">
                      <i className="fas fa-plus text-sm text-green-600"></i>
                    </span>
                    <span className="font-medium text-primary-text">优势：</span>
                  </div>
                  <div className="ml-11 text-gray-700 pattern-advantages-text">
                    {getPatternAdvantages(pattern)}
                  </div>
                </div>
                
                <div className="mb-2 pattern-disadvantages-card" data-name={`pattern-disadvantages-${pattern}`}>
                  <div className="flex items-start mb-2">
                    <span className="inline-block w-8 h-8 bg-red-500 bg-opacity-20 rounded-full flex items-center justify-center mr-3 mt-1">
                      <i className="fas fa-minus text-sm text-red-600"></i>
                    </span>
                    <span className="font-medium text-primary-text">劣势：</span>
                  </div>
                  <div className="ml-11 text-gray-700 pattern-disadvantages-text">
                    {getPatternDisadvantages(pattern)}
                  </div>
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
function getPatternFeature(pattern) {
  switch (pattern) {
    case 'shangguan':
      return '聪明';
    case 'yinzhong':
      return '爱思考';
    case 'bijian':
      return '自信';
    case 'shazhong':
      return '谨慎';
    case 'caiwang':
      return '有目标';
    default:
      return '平衡';
  }
}

// 获取格局优势
function getPatternAdvantages(pattern) {
  switch (pattern) {
    case 'shangguan':
      return '有才气、秀气、灵气、傲气，聪明、激情、浪漫、表演、悟性高，善解人意、洞察力强、情商高，有开拓精神、行动力强，有创新性、有长远规划、有梦想，兴趣广泛、善于表达、热情、口才好，喜欢被表扬、喜欢鲜花、掌声，有上进心，有技能、有才艺、高雅、善辨、幽默。喜欢追求新奇特、喜欢运动。';
    case 'yinzhong':
      return '仁慈、传统、爱思考、有梦想、爱做梦，做事有计划、有步骤、易指挥别人，喜欢学习、读书、标准高，有思想高度，自我价值感高，认可权威，讲逻辑、讲原理、讲出处、讲道理，记忆力好、逻辑思维强，点子多、想法多、奇思妙想，有预感、有创意、喜欢易学、玄学，悟性高、认可后执行力强。喜欢刨根问底，喜欢独处。';
    case 'bijian':
      return '认为我命由我不由天、精力旺盛、睡眠少，喜欢做大哥大、或大姐大、能吃苦、有毅力、忠诚度高、竞争心强、不服输、超级自信、甚至自负、做事注重过程，注重感受、喜欢亲力亲为、心怀天下，有拯救情节、朋友多、一心多用的能力。';
    case 'shazhong':
      return '具有正统、正直，responsibility强、有担当，有使命感，有气魄、进取心强、管理能力强，轻承诺、重行动。易有一技之长，喜欢学习，善解人意，顾全大局、能屈能伸，天生演员天赋，模仿能力强，高冷、威严。';
    case 'caiwang':
      return '善于把握商机、发现商业价值，有投机性、目标感强、兴趣广泛、易多领域发展，异性缘好、想花钱时就有钱。为人大方、喜欢交朋友，有理财天赋，创意多、点子多，喜欢新鲜体验，多情善感、实干。男性对太太孩子好，女性更能干，偏女强人。';
    default:
      return '性格较为全面，能够适应不同的环境和情况。';
  }
}

// 获取格局劣势
function getPatternDisadvantages(pattern) {
  switch (pattern) {
    case 'shangguan':
      return '急性子，有攀比心，易情绪化，易冲动，感性，说话直接，爱怼人，任性、玻璃心、善变、夸大、反叛、多疑、嘴比脑子快、牢骚、小气、懒惰。男性说话或行为伤领导，女性说话、行为伤丈夫和领导。';
    case 'yinzhong':
      return '顾虑多、爱生闷、气想得多、做得少、易头痛、易早生华发，从骨子里喜欢钱或欲望很多、有洁癖、喜欢挑毛病、喜欢给人建议、凡事喜欢自己琢磨研究、标准多、要求多、固执、一根筋、有些人显得愚笨。';
    case 'bijian':
      return '胆子大、坐不住、自大、孤傲、孤僻、赌性强、固执、自以为是、易破财。个别人不够自信。';
    case 'shazhong':
      return '脾气大、但能忍，爱睡懒觉，敏感、胆小懦弱，容易不好意思拒绝别人，谨慎、顾虑多、选择困难症，爱面子，拖延症，不够自信、暴躁、霸道、野心、固执。女性懂事听话易旺夫。';
    case 'caiwang':
      return '好动，坐不住，易有用人靠前，不用人靠后特点，目的性太强，容易财来财去，目标不专一、不深入、好色、谎言。';
    default:
      return '没有明显的劣势，但也可能缺乏鲜明的个人特色。';
  }
}
