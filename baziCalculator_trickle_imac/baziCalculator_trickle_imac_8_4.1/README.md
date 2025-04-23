# 墨衍子八字排盘系统

墨衍子八字排盘系统是一个纯静态网页应用，基于React开发的现代化在线八字命理分析工具，提供专业的八字排盘、命理分析功能。本系统采用传统命理学理论，结合现代化的用户界面，为用户提供直观、易用的八字分析体验。作为纯静态应用，只需启动HTTP服务器即可运行，无需其他后端服务支持。

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

2. 启动HTTP服务器：
```bash
npx http-server . --port 8080
```

服务启动后，在浏览器中访问 http://localhost:8080 即可使用应用。

## 项目架构

### 目录结构

```
├── components/          # React组件
│   ├── BaziDisplay.js      # 八字显示组件
│   ├── BirthInfo.js        # 生辰信息输入组件
│   ├── MingzhuAnalysis.js  # 命主分析组件
│   ├── PatternAnalysis.js  # 格局分析组件
│   ├── ShierGongAnalysis.js # 十二宫分析组件
│   ├── ShishenAnalysis.js  # 十神分析组件
│   └── WuxingAnalysis.js   # 五行分析组件
├── styles/             # 样式文件
│   ├── animations.css     # 动画样式
│   ├── main.css          # 主样式
│   └── themes.css        # 主题样式
├── utils/              # 工具函数
│   ├── baziCalculator.js   # 八字计算核心
│   ├── patternAnalyzer.js  # 格局分析器
│   ├── wuxingAnalyzer.js   # 五行分析器
│   └── i18n.js            # 国际化工具
└── app.js              # 应用入口
```

### 核心算法实现

#### 1. 八字计算核心 (baziCalculator.js)

八字计算采用精确的天文历法算法，主要包含以下核心功能：

```javascript
// 阳历转阴历
function solarToLunar(year, month, day) {
  // 使用寿星天文历法
  // 1. 计算JD值
  // 2. 对应阴历日期
  // 3. 处理闰月
}

// 八字计算
function calculateBazi(birthDate) {
  // 1. 确定农历年月日时
  // 2. 计算年柱、月柱、日柱、时柱
  // 3. 处理节气交接
}

// 起运计算
function calculateStartingAge(gender, birthDate) {
  // 1. 确定生年月令
  // 2. 计算起运年龄
  // 3. 判断大运顺逆
}
```

#### 2. 五行分析系统 (wuxingAnalyzer.js)

五行分析系统基于传统五行生克理论，实现了以下核心功能：

```javascript
// 五行力量计算
function calculateElementalForces(bazi) {
  // 1. 天干本气力量
  // 2. 地支藏干力量
  // 3. 十神力量
  // 4. 生克制化关系
}

// 日主旺衰判断
function analyzeDayMasterStrength(forces) {
  // 1. 月令旺衰
  // 2. 四柱配合
  // 3. 十神配置
}
```

#### 3. 命局格局分析 (patternAnalyzer.js)

格局分析系统实现了多维度的命局评分机制：

```javascript
// 格局判定
function analyzePattern(bazi) {
  // 1. 天干组合
  // 2. 地支组合
  // 3. 特殊格局判定
  // 4. 格局完整度评分
}

// 吉凶判定
function analyzeLuckLevel(pattern) {
  // 1. 基础格局分
  // 2. 组合关系评分
  // 3. 特殊情况加分
}
```

### 多语言支持实现 (i18n.js)

系统采用自定义的国际化方案，支持动态切换语言：

```javascript
// 语言配置
const translations = {
  zh_CN: { /* 简体中文翻译 */ },
  zh_TW: { /* 繁体中文翻译 */ }
};

// 语言切换
function switchLanguage(lang) {
  // 1. 更新语言设置
  // 2. 触发UI更新
  // 3. 持久化语言选择
}
```

## 技术特点

1. **高精度计算**
   - 采用天文历法算法
   - 精确处理节气交接
   - 准确计算大运流年

2. **优化的性能**
   - 缓存计算结果
   - 按需加载组件
   - 优化渲染性能

3. **现代化UI设计**
   - 响应式布局
   - 流畅动画效果
   - 主题切换支持

4. **可扩展架构**
   - 模块化设计
   - 插件化功能
   - 易于维护和扩展

## 开发指南

### 新功能开发流程

1. 在 `components` 目录创建新组件
2. 在 `utils` 目录添加相关工具函数
3. 更新国际化文件添加新的文案
4. 在主应用中集成新组件

### 代码规范

- 使用 ES6+ 语法特性
- 遵循 React 最佳实践
- 保持代码简洁清晰
- 添加必要的注释

### 调试技巧

- 使用 React Developer Tools
- 通过 Console 查看计算过程
- 利用浏览器开发工具分析性能

## 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进项目。在提交代码前，请确保：

1. 代码符合项目规范
2. 添加必要的测试
3. 更新相关文档
4. 本地测试通过