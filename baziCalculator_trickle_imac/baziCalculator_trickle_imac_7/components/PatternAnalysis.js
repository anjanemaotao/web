function PatternAnalysis({ patterns }) {
  try {
    const { t } = React.useContext(I18nContext);
    
    if (!patterns || patterns.length === 0) {
      return (
        <div className="analysis-item" data-name="pattern-analysis-empty">
          <div className="analysis-title">{t('patternTitle')}</div>
          <div className="analysis-content">
            <div className="mb-4 p-3 bg-gray-50 rounded-md" data-name="pattern-main-display">
              <h4 className="font-semibold mb-2">主格局：</h4>
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
        <div className="analysis-title">{t('patternTitle')}</div>
        <div className="analysis-content">
          <div className="mb-3" data-name="pattern-badges">
            {patterns.map(pattern => (
              <span 
                key={pattern} 
                className={`pattern-badge pattern-${pattern}`}
                data-name={`pattern-badge-${pattern}`}
              >
                <span className="celestial-symbol">
                  {getPatternSymbol(pattern)}
                </span>
                {t(pattern)}
              </span>
            ))}
          </div>
          
          <div className="mb-4 p-3 bg-gray-50 rounded-md" data-name="pattern-main-display">
            <h4 className="font-semibold mb-2">主格局：</h4>
            <div className="flex items-center">
              <span className="text-lg font-bold text-accent-color mr-2">
                {patterns.length > 0 ? t(patterns[0]) : '平常格'}
              </span>
              <span className="text-sm text-gray-600">
                ({patterns.length > 0 ? getPatternNickname(patterns[0]) : '无特殊格局'})
              </span>
            </div>
          </div>
          
          {patterns.map(pattern => (
            <div key={pattern} className="mb-4" data-name={`pattern-description-${pattern}`}>
              <h4 className="font-semibold mb-1">{t(pattern)}</h4>
              <p>{getPatternDescription(pattern)}</p>
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
      return '比肩格局的人重义气，朋友通常较多，在团队中往往是兜底的角色，不怕辛苦，勇于担当。他们适合从事需要团队合作的工作，如管理、销售、公关等领域，能够发挥团队协作的优势。';
    case 'shazhong':
      return '煞重格局的人风险意识强，做事情注重细节，性格较为严谨，有时可能显得过于谨慎。他们适合从事需要精确和风险控制的工作，如财务、审计、法律等领域，能够发现潜在问题并提前预防。';
    case 'caiwang':
      return '财旺格局的人执行能力很强，他们将事业成功视为衡量自己的标准，同时也用这一标准去评判他人。在"想了再做"和"做了再想"之间，他们通常会选择后者。他们适合从事商业、金融、投资等需要决断力和行动力的工作。';
    default:
      return '这是一种较为平衡的格局，没有特别突出的特点，但也意味着性格较为全面，能够适应不同的环境和情况。';
  }
}
