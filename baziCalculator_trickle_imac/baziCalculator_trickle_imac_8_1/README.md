# 墨衍子八字排盘系统

墨衍子八字排盘系统是一个现代化的在线八字命理分析工具，基于React开发，提供专业的八字排盘、命理分析功能。本系统采用传统命理学理论，结合现代化的用户界面，为用户提供直观、易用的八字分析体验。

## 功能特点

- 🎯 **精准八字排盘**：支持阳历/阴历日期转换，精确计算八字
- 🔮 **多维度分析**：提供五行、十神、十二宫、大运流年等全方位分析
- 🌏 **多语言支持**：支持繁体中文和简体中文
- 💫 **动态交互**：优雅的计算动画和直观的结果展示
- 📱 **响应式设计**：完美适配各种设备屏幕

## 快速开始

### 环境要求

- Node.js >= 14.0.0
- 现代浏览器（支持ES6+）

### 安装部署

1. 克隆项目到本地：
```bash
git clone <项目地址>
cd baziCalculator_trickle_imac_8
```

2. 安装依赖：
```bash
npm install
```

3. 启动开发服务器：
```bash
npm start
```

4. 打开浏览器访问：`http://localhost:8080`

### 生产环境部署

```bash
npm run build
```

构建后的文件将生成在 `dist` 目录中，可直接部署到任何静态文件服务器。

## 使用指南

1. **选择出生日期**
   - 可选择阳历或阴历日期
   - 精确到时辰的选择

2. **查看分析结果**
   - 八字排盘
   - 命局格局分析
   - 五行强弱分析
   - 十神分析
   - 十二宫分析
   - 大运流年分析

## 技术架构

- **前端框架**：React
- **状态管理**：React Context
- **样式方案**：CSS Modules + Tailwind CSS
- **国际化**：自定义I18n方案
- **构建工具**：Vite

## 项目结构

```
├── components/     # React组件
├── styles/         # 样式文件
├── utils/          # 工具函数
│   ├── baziCalculator.js     # 八字计算核心
│   ├── patternAnalyzer.js    # 格局分析
│   ├── wuxingAnalyzer.js     # 五行分析
│   └── i18n.js              # 国际化
├── app.js          # 应用入口
└── index.html      # HTML模板
```

## 开发指南

### 代码规范

- 遵循React最佳实践
- 使用ES6+语法特性
- 组件采用函数式编程范式
- 错误处理采用try-catch机制

### 新功能开发

1. 在 `components` 目录创建新组件
2. 在 `utils` 目录添加相关工具函数
3. 更新国际化文件添加新的文案
4. 在主应用中集成新组件

### 调试技巧

- 使用React Developer Tools进行组件调试
- 通过Console查看计算过程的日志输出
- 利用React Context进行状态追踪

## 算法说明

### 八字排盘算法

八字排盘算法基于以下步骤进行计算：

1. **阳历转阴历**
   ```typescript
   interface SolarDate {
     year: number;    // 公历年
     month: number;   // 公历月
     day: number;     // 公历日
     hour: number;    // 小时（24小时制）
     minute: number;  // 分钟
   }

   interface LunarDate {
     year: number;     // 农历年
     month: number;    // 农历月
     day: number;      // 农历日
     isLeap: boolean;  // 是否闰月
     hour: number;     // 小时（24小时制）
     minute: number;   // 分钟
   }
   ```

   转换步骤：
   1. 基于寿星天文历法的JD值计算：
      ```javascript
      function getJulianDay(date: SolarDate): number {
        // 1. 计算世纪数:
        const century = Math.floor((date.year - 1900) / 100);
        // 2. 计算儒略日数:
        const jd = 365.25 * (date.year - 1900) + 30.6001 * (date.month + 1) + date.day + century / 4;
        return Math.floor(jd);
      }
      ```

   2. 节气时间判定：
      ```javascript
      const SOLAR_TERMS = {
        SPRING_BEGINS: 0,    // 立春
        RAIN_WATER: 15,      // 雨水
        // ... 其他节气角度值
      };

      function getSolarTerm(date: SolarDate): string {
        const jd = getJulianDay(date);
        const sunLongitude = calculateSunLongitude(jd);  // 计算太阳黄经
        return determineSolarTerm(sunLongitude);  // 根据黄经确定节气
      }
      ```

   3. 闰月处理：
      - 计算冬至点
      - 计算每个朔望月
      - 确定闰月位置

2. **天干地支计算**
   ```typescript
   interface BaziPillar {
     heavenlyStem: string;   // 天干
     earthlyBranch: string;  // 地支
     hiddenStems: string[];  // 藏干
   }

   interface BaziChart {
     year: BaziPillar;   // 年柱
     month: BaziPillar;  // 月柱
     day: BaziPillar;    // 日柱
     hour: BaziPillar;   // 时柱
   }
   ```

   计算步骤：
   1. 年柱计算：
      ```javascript
      function calculateYearPillar(lunarDate: LunarDate, solarTerm: string): BaziPillar {
        // 1. 确定年干支起始点
        const yearNumber = solarTerm === 'SPRING_BEGINS' ? 
          lunarDate.year : 
          (lunarDate.month < 2 ? lunarDate.year - 1 : lunarDate.year);
        
        // 2. 计算天干
        const stem = (yearNumber - 4) % 10;
        
        // 3. 计算地支
        const branch = (yearNumber - 4) % 12;
        
        // 4. 计算藏干
        const hiddenStems = calculateHiddenStems(branch);
        
        return {
          heavenlyStem: HEAVENLY_STEMS[stem],
          earthlyBranch: EARTHLY_BRANCHES[branch],
          hiddenStems
        };
      }
      ```

   2. 月柱计算：
      ```javascript
      function calculateMonthPillar(yearStem: string, solarTerm: string): BaziPillar {
        // 1. 确定月支
        const branch = SOLAR_TERM_TO_BRANCH[solarTerm];
        
        // 2. 计算月干
        const stemOffset = YEAR_STEM_TO_MONTH_STEM_OFFSET[yearStem];
        const stem = (branch + stemOffset) % 10;
        
        // 3. 计算藏干
        const hiddenStems = calculateHiddenStems(branch);
        
        return {
          heavenlyStem: HEAVENLY_STEMS[stem],
          earthlyBranch: EARTHLY_BRANCHES[branch],
          hiddenStems
        };
      }
      ```

   3. 日柱计算：
      ```javascript
      function calculateDayPillar(jd: number): BaziPillar {
        // 1. 计算日干支
        const cycleNumber = (jd + 49) % 60;
        const stem = cycleNumber % 10;
        const branch = cycleNumber % 12;
        
        // 2. 计算藏干
        const hiddenStems = calculateHiddenStems(branch);
        
        return {
          heavenlyStem: HEAVENLY_STEMS[stem],
          earthlyBranch: EARTHLY_BRANCHES[branch],
          hiddenStems
        };
      }
      ```

   4. 时柱计算：
      ```javascript
      function calculateHourPillar(dayStem: string, hour: number): BaziPillar {
        // 1. 确定时辰地支
        const branch = Math.floor(hour / 2);
        
        // 2. 根据日干推算时干
        const stemOffset = DAY_STEM_TO_HOUR_STEM_OFFSET[dayStem];
        const stem = (branch + stemOffset) % 10;
        
        // 3. 计算藏干
        const hiddenStems = calculateHiddenStems(branch);
        
        return {
          heavenlyStem: HEAVENLY_STEMS[stem],
          earthlyBranch: EARTHLY_BRANCHES[branch],
          hiddenStems
        };
      }
      ```

### 命局格局分析

格局分析采用多维度评分系统：

1. **格局判定标准**
   ```typescript
   interface Combination {
     type: 'HEAVENLY_COMBINATION' | 'EARTHLY_TRINITY' | 'EARTHLY_COMBINATION' | 'HIDDEN_COMBINATION';
     elements: string[];     // 组合的天干或地支
     result?: string;       // 合化结果（如五行）
     score: number;         // 组合分值
   }

   interface Pattern {
     combinations: Combination[];  // 所有组合关系
     mainElement: string;         // 主要五行
     score: number;              // 总分值
     quality: 'STRONG' | 'MODERATE' | 'WEAK';  // 格局强度
   }
   ```

   判定步骤：
   1. 天干五合判定：
      ```javascript
      const HEAVENLY_COMBINATIONS = {
        '甲己': '土',
        '乙庚': '金',
        '丙辛': '水',
        '丁壬': '木',
        '戊癸': '火'
      };

      function checkHeavenlyCombinations(baziChart: BaziChart): Combination[] {
        const stems = [
          baziChart.year.heavenlyStem,
          baziChart.month.heavenlyStem,
          baziChart.day.heavenlyStem,
          baziChart.hour.heavenlyStem
        ];
        
        const combinations: Combination[] = [];
        
        // 检查相邻天干的组合
        for (let i = 0; i < stems.length - 1; i++) {
          const pair = stems[i] + stems[i + 1];
          if (HEAVENLY_COMBINATIONS[pair]) {
            combinations.push({
              type: 'HEAVENLY_COMBINATION',
              elements: [stems[i], stems[i + 1]],
              result: HEAVENLY_COMBINATIONS[pair],
              score: calculateCombinationScore(pair)
            });
          }
        }
        
        return combinations;
      }
      ```

   2. 地支三合判定：
      ```javascript
      const EARTHLY_TRINITIES = {
        '寅午戌': '火',
        '亥卯未': '木',
        '巳酉丑': '金',
        '申子辰': '水'
      };

      function checkEarthlyTrinities(baziChart: BaziChart): Combination[] {
        const branches = [
          baziChart.year.earthlyBranch,
          baziChart.month.earthlyBranch,
          baziChart.day.earthlyBranch,
          baziChart.hour.earthlyBranch
        ];
        
        const combinations: Combination[] = [];
        
        // 检查所有可能的三合组合
        for (const trinity in EARTHLY_TRINITIES) {
          const trinityBranches = trinity.split('');
          if (trinityBranches.every(branch => branches.includes(branch))) {
            combinations.push({
              type: 'EARTHLY_TRINITY',
              elements: trinityBranches,
              result: EARTHLY_TRINITIES[trinity],
              score: calculateTrinityScore(trinity)
            });
          }
        }
        
        return combinations;
      }
      ```

   3. 地支六合判定：
      ```javascript
      const EARTHLY_COMBINATIONS = {
        '子丑': '土',
        '寅亥': '木',
        '卯戌': '火',
        '辰酉': '金',
        '巳申': '水',
        '午未': '土'
      };

      function checkEarthlyCombinations(baziChart: BaziChart): Combination[] {
        // 实现类似天干五合的检查逻辑
      }
      ```

   4. 暗合暗冲关系判定：
      ```javascript
      function checkHiddenRelations(baziChart: BaziChart): Combination[] {
        // 1. 检查藏干之间的关系
        const hiddenStems = getAllHiddenStems(baziChart);
        
        // 2. 检查暗合
        const hiddenCombinations = checkHiddenCombinations(hiddenStems);
        
        // 3. 检查暗冲
        const hiddenConflicts = checkHiddenConflicts(hiddenStems);
        
        return [...hiddenCombinations, ...hiddenConflicts];
      }
      ```

2. **命局强度计算**
   ```typescript
   interface Strength {
     base: number;           // 基础分值（0-100）
     combinations: number;   // 组合加分
     conflicts: number;      // 冲突减分
     seasonal: number;       // 季节旺衰调整
     final: number;         // 最终分值
   }
   ```

   计算步骤：
   1. 主星强度评分：
      ```javascript
      function calculateMainStarStrength(baziChart: BaziChart): number {
        const dayMaster = baziChart.day.heavenlyStem;
        
        // 1. 计算天干力量
        const stemStrength = calculateStemStrength(dayMaster, baziChart);
        
        // 2. 计算地支力量
        const branchStrength = calculateBranchStrength(dayMaster, baziChart);
        
        // 3. 计算月令强度
        const seasonalStrength = calculateSeasonalStrength(dayMaster, baziChart.month);
        
        return (stemStrength + branchStrength + seasonalStrength) / 3;
      }
      ```

   2. 吉凶星分析权重：
      ```javascript
      function calculateStarWeights(baziChart: BaziChart): number {
        const stars = identifyStars(baziChart);
        
        return stars.reduce((total, star) => {
          return total + STAR_WEIGHTS[star.type] * star.strength;
        }, 0);
      }
      ```

   3. 四柱关系评分：
      ```javascript
      function calculatePillarRelations(baziChart: BaziChart): number {
        // 1. 计算天干关系
        const stemScore = calculateStemRelations(baziChart);
        
        // 2. 计算地支关系
        const branchScore = calculateBranchRelations(baziChart);
        
        // 3. 计算暗合暗冲
        const hiddenScore = calculateHiddenRelations(baziChart);
        
        return (stemScore + branchScore + hiddenScore) / 3;
      }
      ```

   4. 格局完整度计算：
      ```javascript
      function calculatePatternCompleteness(pattern: Pattern): number {
        // 1. 基础分值
        let score = pattern.score;
        
        // 2. 组合关系完整度
        score *= calculateCombinationCompleteness(pattern.combinations);
        
        // 3. 五行平衡度
        score *= calculateElementalBalance(pattern);
        
        // 4. 季节适应度
        score *= calculateSeasonalFitness(pattern);
        
        return Math.min(score, 100);
      }
      ```

### 基本资料计算

基本资料计算包含以下核心内容：

1. **生肖计算**
   ```typescript
   interface Zodiac {
     animal: string;      // 生肖
     element: string;     // 五行属性
     polarity: string;    // 阴阳属性
   }

   function calculateZodiac(year: number): Zodiac {
     const animals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
     const elements = ['金', '金', '土', '土', '木', '木', '火', '火', '金', '金', '土', '土'];
     const polarities = ['阳', '阴', '阳', '阴', '阳', '阴', '阳', '阴', '阳', '阴', '阳', '阴'];

     const index = (year - 4) % 12;
     return {
       animal: animals[index],
       element: elements[index],
       polarity: polarities[index]
     };
   }
   ```

2. **星座计算**
   ```typescript
   interface Constellation {
     name: string;        // 星座名称
     element: string;     // 守护星
     quality: string;     // 特质
   }

   function calculateConstellation(month: number, day: number): Constellation {
     const dates = [20, 19, 21, 20, 21, 22, 23, 23, 23, 24, 22, 21];
     const constellations = [
       { name: '水瓶', element: '天王星', quality: '固定' },
       { name: '双鱼', element: '海王星', quality: '变动' },
       // ... 其他星座配置
     ];

     const index = month - (day < dates[month - 1] ? 1 : 0);
     return constellations[index % 12];
   }
   ```

### 格局分析

格局分析包含以下五种主要格局：

1. **伤官格**
   ```typescript
   interface ShangguanPattern {
     type: 'SHANGGUAN';
     strength: number;     // 格局强度
     features: string[];   // 特征描述
     career: string[];     // 事业建议
     personality: string[]; // 性格特点
   }

   function analyzeShangguanPattern(baziChart: BaziChart): ShangguanPattern {
     const features = [
       '伤官生财',
       '才华横溢',
       '创新能力强'
     ];

     const career = [
       '适合创业',
       '文化艺术领域',
       '教育培训行业'
     ];

     const personality = [
       '聪明伶俐',
       '个性独特',
       '追求完美'
     ];

     return {
       type: 'SHANGGUAN',
       strength: calculatePatternStrength(baziChart),
       features,
       career,
       personality
     };
   }
   ```

2. **印中格**
   ```typescript
   interface YinzhongPattern {
     type: 'YINZHONG';
     strength: number;
     features: string[];
     career: string[];
     personality: string[];
   }

   function analyzeYinzhongPattern(baziChart: BaziChart): YinzhongPattern {
     // 实现印中格分析逻辑
   }
   ```

3. **命旺格**
   ```typescript
   interface MingwangPattern {
     type: 'MINGWANG';
     strength: number;
     features: string[];
     career: string[];
     personality: string[];
   }

   function analyzeMingwangPattern(baziChart: BaziChart): MingwangPattern {
     // 实现命旺格分析逻辑
   }
   ```

### 命主分析

命主分析基于以下算法：

1. **命主类型判定**
   ```typescript
   type MingzhuType = 
     | '财官双美' 
     | '伤官佳运' 
     | '印绶格' 
     | '建禄格' 
     | '七杀格';

   interface MingzhuAnalysis {
     type: MingzhuType;
     strength: number;
     characteristics: string[];
     lifePattern: string[];
     suggestions: string[];
   }

   function analyzeMingzhu(baziChart: BaziChart): MingzhuAnalysis {
     // 1. 确定命主类型
     const type = determineMingzhuType(baziChart);

     // 2. 分析命主特征
     const characteristics = analyzeCharacteristics(type, baziChart);

     // 3. 分析人生格局
     const lifePattern = analyzeLifePattern(type, baziChart);

     // 4. 生成建议
     const suggestions = generateSuggestions(type, characteristics, lifePattern);

     return {
       type,
       strength: calculateMingzhuStrength(baziChart),
       characteristics,
       lifePattern,
       suggestions
     };
   }
   ```

2. **命主信息解析**
   ```typescript
   interface MingzhuInfo {
     basicInfo: {
       gender: string;
       birthDate: string;
       birthTime: string;
       zodiac: string;
       constellation: string;
     };
     personalityTraits: string[];
     careerSuggestions: string[];
     relationshipAdvice: string[];
     healthIndications: string[];
   }

   function parseMingzhuInfo(baziChart: BaziChart): MingzhuInfo {
     return {
       basicInfo: extractBasicInfo(baziChart),
       personalityTraits: analyzePersonality(baziChart),
       careerSuggestions: analyzeCareer(baziChart),
       relationshipAdvice: analyzeRelationships(baziChart),
       healthIndications: analyzeHealth(baziChart)
     };
   }
   ```

### 五行分析系统

五行分析基于以下算法：

1. **五行力量计算**
   ```typescript
   interface ElementalForce {
     wood: number;    // 木的力量值
     fire: number;    // 火的力量值
     earth: number;   // 土的力量值
     metal: number;   // 金的力量值
     water: number;   // 水的力量值
   }

   interface ElementalAnalysis {
     forces: ElementalForce;          // 五行力量值
     dominantElement: string;         // 最旺的五行
     weakestElement: string;          // 最弱的五行
     balance: number;                 // 平衡度（0-100）
     seasonalAdjustment: number;      // 季节调整系数
   }
   ```

   计算步骤：
   1. 天干本气力量：
      ```javascript
      const STEM_ELEMENT_FORCE = {
        '甲': { wood: 1.2, fire: 0.3, earth: 0.1, metal: 0.1, water: 0.3 },
        '乙': { wood: 1.0, fire: 0.3, earth: 0.1, metal: 0.1, water: 0.3 },
        // ... 其他天干的力量配置
      };

      function calculateStemForce(stem: string): ElementalForce {
        return STEM_ELEMENT_FORCE[stem] || {
          wood: 0, fire: 0, earth: 0, metal: 0, water: 0
        };
      }
      ```

   2. 地支藏干力量：
      ```javascript
      const BRANCH_HIDDEN_STEMS = {
        '子': ['癸'],
        '丑': ['己', '辛', '癸'],
        // ... 其他地支的藏干配置
      };

      function calculateBranchForce(branch: string): ElementalForce {
        const hiddenStems = BRANCH_HIDDEN_STEMS[branch] || [];
        
        return hiddenStems.reduce((force, stem) => {
          const stemForce = calculateStemForce(stem);
          return addElementalForces(force, stemForce);
        }, createEmptyForce());
      }
      ```

   3. 四柱组合力量：
      ```javascript
      function calculateCombinedForce(baziChart: BaziChart): ElementalForce {
        // 1. 计算天干力量
        const stemForce = calculateAllStemForces(baziChart);
        
        // 2. 计算地支力量
        const branchForce = calculateAllBranchForces(baziChart);
        
        // 3. 计算组合产生的力量
        const combinationForce = calculateCombinationForces(baziChart);
        
        // 4. 合并所有力量
        return mergeElementalForces([stemForce, branchForce, combinationForce]);
      }
      ```

   4. 季节旺衰调整：
      ```javascript
      const SEASONAL_ADJUSTMENTS = {
        SPRING: { wood: 1.2, fire: 1.1, earth: 0.9, metal: 0.8, water: 1.0 },
        SUMMER: { wood: 1.0, fire: 1.2, earth: 1.1, metal: 0.8, water: 0.9 },
        // ... 其他季节的调整系数
      };

      function adjustSeasonalForce(force: ElementalForce, season: string): ElementalForce {
        const adjustment = SEASONAL_ADJUSTMENTS[season];
        
        return {
          wood: force.wood * adjustment.wood,
          fire: force.fire * adjustment.fire,
          earth: force.earth * adjustment.earth,
          metal: force.metal * adjustment.metal,
          water: force.water * adjustment.water
        };
      }
      ```

2. **五行关系判定**
   ```typescript
   interface ElementalRelation {
     type: 'GENERATING' | 'CONTROLLING' | 'WEAKENING' | 'STRENGTHENING';
     source: string;
     target: string;
     strength: number;
   }

   interface ElementalBalance {
     relations: ElementalRelation[];
     score: number;              // 平衡度分数
     suggestions: string[];      // 调节建议
   }
   ```

   计算步骤：
   1. 生克制化关系矩阵：
      ```javascript
      const ELEMENTAL_RELATIONS = {
        GENERATING: {
          wood: 'fire',
          fire: 'earth',
          earth: 'metal',
          metal: 'water',
          water: 'wood'
        },
        CONTROLLING: {
          wood: 'earth',
          earth: 'water',
          water: 'fire',
          fire: 'metal',
          metal: 'wood'
        }
      };

      function calculateElementalRelations(force: ElementalForce): ElementalRelation[] {
        const relations: ElementalRelation[] = [];
        
        // 1. 计算生关系
        for (const element in force) {
          const generating = ELEMENTAL_RELATIONS.GENERATING[element];
          relations.push({
            type: 'GENERATING',
            source: element,
            target: generating,
            strength: calculateGeneratingStrength(force[element], force[generating])
          });
        }
        
        // 2. 计算克关系
        for (const element in force) {
          const controlling = ELEMENTAL_RELATIONS.CONTROLLING[element];
          relations.push({
            type: 'CONTROLLING',
            source: element,
            target: controlling,
            strength: calculateControllingStrength(force[element], force[controlling])
          });
        }
        
        return relations;
      }
      ```

   2. 十神力量计算：
      ```javascript
      function calculateDeityStrengths(baziChart: BaziChart): Map<string, number> {
        const dayMaster = baziChart.day.heavenlyStem;
        const force = calculateCombinedForce(baziChart);
        const relations = calculateElementalRelations(force);
        
        return calculateDeityStrengthsFromRelations(dayMaster, relations);
      }
      ```

   3. 平衡度评估：
      ```javascript
      function evaluateElementalBalance(force: ElementalForce): ElementalBalance {
        // 1. 计算五行关系
        const relations = calculateElementalRelations(force);
        
        // 2. 计算平衡分数
        const score = calculateBalanceScore(relations);
        
        // 3. 生成调节建议
        const suggestions = generateBalanceSuggestions(score, relations);
        
        return { relations, score, suggestions };
      }
      ```

### 十神关系算法

十神计算基于日主对比：

1. **十神判定规则**
   ```typescript
   type DeityType =
     | 'PEER'           // 比肩
     | 'WEALTH_ROBBER'  // 劫财
     | 'EATING_GOD'     // 食神
     | 'HURTING_GOD'    // 伤官
     | 'INDIRECT_WEALTH' // 偏财
     | 'DIRECT_WEALTH'   // 正财
     | 'SEVEN_KILLING'   // 七杀
     | 'DIRECT_OFFICER'  // 正官
     | 'INDIRECT_RESOURCE' // 偏印
     | 'DIRECT_RESOURCE';  // 正印

   interface Deity {
     type: DeityType;
     stem: string;        // 对应天干
     branch?: string;     // 对应地支（如果来自藏干）
     strength: number;    // 力量值
     position: string;    // 所在柱位
   }
   ```

   判定步骤：
   ```javascript
   const DEITY_RULES = {
     SAME_ELEMENT: {
       SAME_YIN_YANG: 'PEER',
       DIFFERENT_YIN_YANG: 'WEALTH_ROBBER'
     },
     GENERATING_ME: {
       SAME_YIN_YANG: 'EATING_GOD',
       DIFFERENT_YIN_YANG: 'HURTING_GOD'
     },
     CONTROLLING_ME: {
       SAME_YIN_YANG: 'INDIRECT_WEALTH',
       DIFFERENT_YIN_YANG: 'DIRECT_WEALTH'
     },
     I_GENERATE: {
       SAME_YIN_YANG: 'SEVEN_KILLING',
       DIFFERENT_YIN_YANG: 'DIRECT_OFFICER'
     },
     I_CONTROL: {
       SAME_YIN_YANG: 'INDIRECT_RESOURCE',
       DIFFERENT_YIN_YANG: 'DIRECT_RESOURCE'
     }
   };

   function determineDeity(dayMaster: string, stem: string): DeityType {
     // 1. 确定五行关系
     const relationship = determineElementalRelationship(dayMaster, stem);
     
     // 2. 确定阴阳关系
     const yinYangRelation = determineYinYangRelationship(dayMaster, stem);
     
     // 3. 根据规则判定十神
     return DEITY_RULES[relationship][yinYangRelation];
   }
   ```

2. **十神力量计算**
   ```typescript
   interface DeityStrength {
     base: number;           // 基础力量
     branchBonus: number;    // 地支加成
     seasonalFactor: number; // 月令调整
     combinationFactor: number; // 组合影响
     final: number;         // 最终力量
   }
   ```

   计算步骤：
   1. 基础力量评分：
      ```javascript
      const BASE_DEITY_STRENGTH = {
        PEER: 60,
        WEALTH_ROBBER: 70,
        EATING_GOD: 65,
        HURTING_GOD: 75,
        INDIRECT_WEALTH: 80,
        DIRECT_WEALTH: 85,
        SEVEN_KILLING: 90,
        DIRECT_OFFICER: 95,
        INDIRECT_RESOURCE: 55,
        DIRECT_RESOURCE: 50
      };

      function calculateBaseStrength(deity: Deity): number {
        return BASE_DEITY_STRENGTH[deity.type];
      }
      ```

   2. 地支藏干加成：
      ```javascript
      function calculateBranchBonus(deity: Deity, baziChart: BaziChart): number {
        if (!deity.branch) return 0;
        
        // 1. 获取地支藏干
        const hiddenStems = getHiddenStems(deity.branch);
        
        // 2. 计算每个藏干的贡献
        return hiddenStems.reduce((bonus, stem) => {
          const relationship = determineElementalRelationship(deity.stem, stem);
          return bonus + HIDDEN_STEM_BONUS[relationship];
        }, 0);
      }
      ```

   3. 月令旺衰调整：
      ```javascript
      function calculateSeasonalAdjustment(deity: Deity, month: string): number {
        // 1. 确定月令五行
        const monthElement = get

### 十二宫位分析

十二宫位分析流程：

1. **宫位确定方法**
   ```typescript
   interface Palace {
     name: string;          // 宫位名称
     branch: string;        // 对应地支
     mainStar: Star[];      // 主星
     minorStar: Star[];     // 辅星
     strength: number;      // 宫位强度
     quality: 'AUSPICIOUS' | 'NEUTRAL' | 'INAUSPICIOUS';  // 吉凶
   }

   interface Star {
     name: string;         // 星名
     type: 'MAIN' | 'MINOR';  // 主星或辅星
     element: string;      // 五行属性
     strength: number;     // 星耀强度
   }

   interface PalaceSystem {
     palaces: Palace[];     // 十二宫
     lifePalace: Palace;    // 命宫
     bodyPalace: Palace;    // 身宫
     yearPalace: Palace;    // 大限宫
   }
   ```

   计算步骤：
   1. 命宫计算：
      ```javascript
      function calculateLifePalace(baziChart: BaziChart): Palace {
        // 1. 计算命宫地支
        const monthBranch = baziChart.month.earthlyBranch;
        const hourBranch = baziChart.hour.earthlyBranch;
        
        // 2. 确定命宫位置
        const lifePalaceBranch = calculatePalacePosition(monthBranch, hourBranch);
        
        // 3. 安星
        const stars = assignStars(lifePalaceBranch, 'LIFE_PALACE');
        
        return createPalace('命宫', lifePalaceBranch, stars);
      }

      function calculatePalacePosition(monthBranch: string, hourBranch: string): string {
        const monthIndex = EARTHLY_BRANCHES.indexOf(monthBranch);
        const hourIndex = EARTHLY_BRANCHES.indexOf(hourBranch);
        
        // 命宫计算公式：12 - 月支序号 + 时支序号
        const position = (12 - monthIndex + hourIndex) % 12;
        return EARTHLY_BRANCHES[position];
      }
      ```

   2. 十二宫安排：
      ```javascript
      function arrangeTwelvePalaces(lifePalace: Palace): Palace[] {
        const palaces: Palace[] = [];
        const startIndex = EARTHLY_BRANCHES.indexOf(lifePalace.branch);
        
        // 顺时针安排十二宫
        for (let i = 0; i < 12; i++) {
          const index = (startIndex + i) % 12;
          const branch = EARTHLY_BRANCHES[index];
          const stars = assignStars(branch, PALACE_TYPES[i]);
          
          palaces.push(createPalace(
            PALACE_NAMES[i],
            branch,
            stars
          ));
        }
        
        return palaces;
      }
      ```

   3. 长生十二宫：
      ```javascript
      const GROWTH_CYCLE = {
        '甲': ['亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌'],
        '乙': ['午', '巳', '辰', '卯', '寅', '丑', '子', '亥', '戌', '酉', '申', '未'],
        // ... 其他天干的长生十二宫
      };

      function calculateGrowthPalaces(dayMaster: string): string[] {
        return GROWTH_CYCLE[dayMaster] || [];
      }
      ```

2. **宫位强度计算**
   ```typescript
   interface PalaceStrength {
     starStrength: number;     // 星耀强度
     elementalStrength: number; // 五行强度
     relationStrength: number;  // 关系强度
     seasonalStrength: number;  // 月令强度
     final: number;            // 最终强度
   }
   ```

   计算步骤：
   1. 主星入宫评分：
      ```javascript
      const STAR_WEIGHTS = {
        '紫微': 100,
        '天机': 90,
        '太阳': 95,
        // ... 其他主星权重
      };

      function calculateStarStrength(palace: Palace): number {
        // 1. 计算主星强度
        const mainStarStrength = palace.mainStar.reduce((strength, star) => {
          return strength + STAR_WEIGHTS[star.name] * star.strength;
        }, 0);
        
        // 2. 计算辅星加成
        const minorStarBonus = calculateMinorStarBonus(palace.minorStar);
        
        return mainStarStrength * (1 + minorStarBonus);
      }
      ```

   2. 宫位吉凶判定：
      ```javascript
      function determinePalaceQuality(palace: Palace): 'AUSPICIOUS' | 'NEUTRAL' | 'INAUSPICIOUS' {
        // 1. 计算吉星数量
        const auspiciousCount = countAuspiciousStars(palace);
        
        // 2. 计算凶星数量
        const inauspiciousCount = countInauspiciousStars(palace);
        
        // 3. 考虑宫位本身属性
        const baseQuality = PALACE_BASE_QUALITY[palace.name];
        
        return determineFinalQuality(auspiciousCount, inauspiciousCount, baseQuality);
      }
      ```

   3. 宫位冲合关系：
      ```javascript
      function calculatePalaceRelations(palace: Palace, allPalaces: Palace[]): number {
        // 1. 计算六合关系
        const combinationStrength = calculateCombinations(palace, allPalaces);
        
        // 2. 计算三合关系
        const trinityStrength = calculateTrinities(palace, allPalaces);
        
        // 3. 计算冲突关系
        const conflictStrength = calculateConflicts(palace, allPalaces);
        
        return (combinationStrength + trinityStrength) * (1 - conflictStrength);
      }
      ```

   4. 宫位安定度分析：
      ```javascript
      function analyzePalaceStability(palace: Palace, baziChart: BaziChart): number {
        // 1. 计算宫位基础安定度
        const baseStability = calculateBaseStability(palace);
        
        // 2. 计算星耀对安定度的影响
        const starEffect = calculateStarEffect(palace.mainStar, palace.minorStar);
        
        // 3. 计算大运流年影响
        const timeEffect = calculateTimeEffect(palace, baziChart);
        
        return baseStability * starEffect * timeEffect;
      }
      ```

### 大运流年算法

大运流年计算规则：

1. **大运计算**
   ```typescript
   interface Destiny {
     startAge: number;      // 起运年龄
     sequence: string[];    // 大运序列
     direction: 'FORWARD' | 'BACKWARD';  // 顺逆
     currentDestiny: string; // 当前大运
     remainingYears: number; // 余下年数
   }

   interface YearlyFate {
     year: number;          // 流年
     age: number;          // 虚岁
     yearPillar: BaziPillar;  // 流年柱
     destiny: string;      // 当前大运
     strength: number;     // 运势强度
   }
   ```

   计算步骤：
   1. 起运时间计算：
      ```javascript
      function calculateDestinyStart(baziChart: BaziChart, gender: 'MALE' | 'FEMALE'): number {
        // 1. 确定月令强度
        const monthStrength = calculateMonthStrength(baziChart.month);
        
        // 2. 计算起运月数
        const monthsToStart = calculateMonthsToStart(monthStrength);
        
        // 3. 转换为年龄
        return monthsToStart / 12;
      }

      function calculateMonthsToStart(monthStrength: number): number {
        // 1. 基础月数（3个月）
        let months = 3;
        
        // 2. 根据月令强度调整
        months += (100 - monthStrength) / 10;
        
        return Math.round(months);
      }
      ```

   2. 大运序列生成：
      ```javascript
      function generateDestinySequence(
        baziChart: BaziChart,
        gender: 'MALE' | 'FEMALE'
      ): string[] {
        // 1. 确定起始干支
        const startStem = baziChart.month.heavenlyStem;
        const startBranch = baziChart.month.earthlyBranch;
        
        // 2. 确定顺逆
        const direction = determineDirection(baziChart.year.heavenlyStem, gender);
        
        // 3. 生成序列
        return generateSequence(startStem, startBranch, direction);
      }

      function determineDirection(
        yearStem: string,
        gender: 'MALE' | 'FEMALE'
      ): 'FORWARD' | 'BACKWARD' {
        const stemYinYang = getYinYang(yearStem);
        return (
          (stemYinYang === 'YANG' && gender === 'MALE') ||
          (stemYinYang === 'YIN' && gender === 'FEMALE')
        ) ? 'FORWARD' : 'BACKWARD';
      }
      ```

   3. 运势强度计算：
      ```javascript
      function calculateDestinyStrength(destiny: string, baziChart: BaziChart): number {
        // 1. 计算天干强度
        const stemStrength = calculateStemStrength(destiny[0], baziChart);
        
        // 2. 计算地支强度
        const branchStrength = calculateBranchStrength(destiny[1], baziChart);
        
        // 3. 计算大运与日主关系
        const relationStrength = calculateRelationStrength(destiny, baziChart.day);
        
        return (stemStrength + branchStrength + relationStrength) / 3;
      }
      ```

2. **流年分析**
   ```typescript
   interface YearlyAnalysis {
     yearPillar: BaziPillar;     // 流年柱
     destinyInfluence: number;    // 大运影响
     yearlyStrength: number;      // 流年强度
     opportunities: string[];     // 机遇
     challenges: string[];        // 挑战
   }
   ```

   分析步骤：
   1. 流年干支计算：
      ```javascript
      function calculateYearlyPillar(year: number): BaziPillar {
        // 1. 计算年干
        const stem = ((year - 4) % 10);
        
        // 2. 计算年支
        const branch = ((year - 4) % 12);
        
        // 3. 计算藏干
        const hiddenStems = calculateHiddenStems(EARTHLY_BRANCHES[branch]);
        
        return {
          heavenlyStem: HEAVENLY_STEMS[stem],
          earthlyBranch: EARTHLY_BRANCHES[branch],
          hiddenStems
        };
      }
      ```

   2. 运势评估：
      ```javascript
      function evaluateYearlyFate(
        yearPillar: BaziPillar,
        destiny: string,
        baziChart: BaziChart
      ): YearlyAnalysis {
        // 1. 计算大运影响
        const destinyInfluence = calculateDestinyInfluence(destiny, yearPillar);
        
        // 2. 计算流年强度
        const yearlyStrength = calculateYearlyStrength(yearPillar, baziChart);
        
        // 3. 分析机遇
        const opportunities = analyzeOpportunities(yearPillar, destiny, baziChart);
        
        // 4. 分析挑战
        const challenges = analyzeChallenges(yearPillar, destiny, baziChart);
        
        return {
          yearPillar,
          destinyInfluence,
          yearlyStrength,
          opportunities,
          challenges
        };
      }
      ```

   3. 流年冲合：
      ```javascript
      function analyzeYearlyCombinations(
        yearPillar: BaziPillar,
        baziChart: BaziChart
      ): Combination[] {
        // 1. 分析天干组合
        const stemCombinations = analyzeStemCombinations(yearPillar.heavenlyStem, baziChart);
        
        // 2. 分析地支组合
        const branchCombinations = analyzeBranchCombinations(yearPillar.earthlyBranch, baziChart);
        
        // 3. 分析暗合
        const hiddenCombinations = analyzeHiddenCombinations(yearPillar.hiddenStems, baziChart);
        
        return [...stemCombinations, ...branchCombinations, ...hiddenCombinations];
      }
      ```

3. **运程预测**
   ```typescript
   interface Prediction {
     period: string;          // 预测时段
     type: 'YEARLY' | 'MONTHLY' | 'DAILY';  // 预测类型
     aspects: PredictionAspect[];  // 预测方面
     score: number;          // 综合评分
   }

   interface PredictionAspect {
     category: string;       // 预测类别
     description: string;    // 描述
     probability: number;    // 概率
     intensity: number;      // 强度
   }
   ```

   预测步骤：
   1. 运程分析：
      ```javascript
      function analyzeFate(
        yearlyAnalysis: YearlyAnalysis,
        baziChart: BaziChart
      ): Prediction[] {
        // 1. 年运分析
        const yearlyPrediction = predictYearlyFate(yearlyAnalysis, baziChart);
        
        // 2. 月运分析
        const monthlyPredictions = predictMonthlyFate(yearlyAnalysis, baziChart);
        
        // 3. 日运分析
        const dailyPredictions = predictDailyFate(yearlyAnalysis, baziChart);
        
        return [yearlyPrediction, ...monthlyPredictions, ...dailyPredictions];
      }
      ```

   2. 流月预测：
      ```javascript
      function predictMonthlyFate(
        yearlyAnalysis: YearlyAnalysis,
        baziChart: BaziChart
      ): Prediction[] {
        return EARTHLY_BRANCHES.map((branch, index) => {
          // 1. 计算月柱
          const monthPillar = calculateMonthPillar(yearlyAnalysis.yearPillar, index);
          
          // 2. 分析月运
          const aspects = analyzeMonthlyAspects(monthPillar, yearlyAnalysis, baziChart);
          
          // 3. 计算综合评分
          const score = calculateMonthlyScore(aspects);
          
          return {
            period: `${index + 1}月`,
            type: 'MONTHLY',
            aspects,
            score
          };
        });
      }
      ```

   3. 流日预测：
      ```javascript
      function predictDailyFate(
        yearlyAnalysis: YearlyAnalysis,
        baziChart: BaziChart
      ): Prediction[] {
        // 1. 计算日柱周期
        const dailyCycle = calculateDailyCycle(yearlyAnalysis.yearPillar);
        
        // 2. 分析每日运势
        return dailyCycle.map(dayPillar => {
          const aspects = analyzeDailyAspects(dayPillar, yearlyAnalysis, baziChart);
          const score = calculateDailyScore(aspects);
          
          return {
            period: formatDailyPeriod(dayPillar),
            type: 'DAILY',
            aspects,
            score
          };
        });
      }
      ```

2. **流年分析**
   - 年干支组合
   - 运干支关系
   - 流年冲合
   - 四柱关系变化

3. **吉凶预测**
   - 大运流年交集分析
   - 流年十神变化
   - 流年五行强弱
   - 年运组合评分

## 贡献指南

欢迎提交Issue和Pull Request来帮助改进项目。在提交PR前，请确保：

1. 代码符合项目规范
2. 添加必要的测试用例
3. 更新相关文档
4. 本地测试通过

## 许可说明

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

## 联系方式

如有问题或建议，欢迎通过以下方式联系：

- 提交 Issue
- 发送邮件至：[联系邮箱]

## 致谢

感谢所有为本项目做出贡献的开发者。

---

© 2024 八字格局推算应用 - 仅供娱乐参考