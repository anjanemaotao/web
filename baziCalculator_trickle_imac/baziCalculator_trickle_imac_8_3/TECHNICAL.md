# 墨衍子八字排盘系统技术文档

本文档详细描述了墨衍子八字排盘系统的核心功能模块实现逻辑。每个模块的具体算法和计算方法都基于传统命理学理论，结合现代化的计算机实现方式。

## 1. 阴历与阳历的切换算法

### 1.1 算法概述
- 基于寿星天文历法实现阳历和阴历的精确转换
- 使用lunar-javascript库进行日期转换计算
- 处理闰月情况和特殊年份的日期转换

### 1.2 实现细节
- 阳历转阴历：
  1. 首先将阳历年月日转换为儒略日(JD)值，计算方法为：
     - 计算该日期距公元前4713年1月1日12时的天数
     - 考虑闰年修正和月份位置修正
  2. 根据JD值查表确定对应阴历日期：
     - 使用寿星天文历法表查找最近的朔日
     - 计算距离朔日的天数确定阴历日期
  3. 处理闰月情况：
     - 检查当月是否为闰月
     - 如果是闰月，根据闰月规则调整月份
     - 确保日期在有效范围内
- 阴历转阳历：
  1. 处理阴历年月日信息：
     - 验证阴历日期的有效性
     - 处理年份的起止范围
  2. 考虑闰月标志：
     - 判断当月是否为闰月
     - 调整月份编号
  3. 转换为对应阳历日期：
     - 查找对应月份的朔日
     - 计算日期偏移
     - 转换为阳历年月日

## 2. 八字四柱计算算法

### 2.1 四柱计算

#### 2.1.1 基础数据结构

- 天干序列：['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
- 地支序列：['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
- 天干五行对应：
  ```javascript
  {
    '甲': '木', '乙': '木', '丙': '火', '丁': '火',
    '戊': '土', '己': '土', '庚': '金', '辛': '金',
    '壬': '水', '癸': '水'
  }
  ```
- 地支五行对应：
  ```javascript
  {
    '寅': '木', '卯': '木', '巳': '火', '午': '火',
    '辰': '土', '戌': '土', '丑': '土', '未': '土',
    '申': '金', '酉': '金', '亥': '水', '子': '水'
  }
  ```
- 阴阳属性：
  - 天干：甲丙戊庚壬为阳，乙丁己辛癸为阴
  - 地支：子寅辰午申戌为阳，丑卯巳未酉亥为阴

#### 2.1.2 年柱计算

```javascript
const calculateYearPillar = (year) => {
  const tianGanIndex = (year - 4) % 10;  // 天干索引
  const diZhiIndex = (year - 4) % 12;    // 地支索引
  return {
    gan: tianGan[tianGanIndex],     // 年干
    zhi: diZhi[diZhiIndex],         // 年支
    ganZhi: tianGan[tianGanIndex] + diZhi[diZhiIndex]  // 年柱
  };
};
```

特殊处理：
- 如果出生在立春前，年柱需要退前一年
- 立春时刻的判定使用天文历法精确计算

#### 2.1.3 月柱计算

基于lunar-javascript库实现：
```javascript
const calculateMonthPillar = (lunarDate) => {
  const lunar = Lunar.fromYmd(lunarDate.year, lunarDate.month, lunarDate.day);
  const monthGanZhi = lunar.getMonthInGanZhi();
  return {
    gan: monthGanZhi.substring(0, 1),    // 月干
    zhi: monthGanZhi.substring(1),        // 月支
    ganZhi: monthGanZhi                   // 月柱
  };
};
```

计算规则：
1. 以节气为界定月柱，每个节气交接时刻为新月令的开始
2. 月干推算：
   - 甲己之年起丙寅
   - 乙庚之年起戊寅
   - 丙辛之年起庚寅
   - 丁壬之年起壬寅
   - 戊癸之年起甲寅
3. 月支固定：
   - 寅月为正月，卯月为二月，依次类推
   - 节气交接时刻精确到分钟

#### 2.1.4 日柱计算

使用lunar-javascript库计算：
```javascript
const calculateDayPillar = (lunarDate) => {
  const lunar = Lunar.fromYmd(lunarDate.year, lunarDate.month, lunarDate.day);
  const dayGanZhi = lunar.getDayInGanZhi();
  return {
    gan: dayGanZhi.substring(0, 1),    // 日干
    zhi: dayGanZhi.substring(1),        // 日支
    ganZhi: dayGanZhi                   // 日柱
  };
};
```

特殊处理：
- 子时（23:00-01:00）跨日的情况需要特别处理
- 如果出生在子时，且时间在23:00-24:00之间，应取下一日的日柱

#### 2.1.5 时柱计算

```javascript
const calculateHourPillar = (dayGan, hour) => {
  // 时辰对照表（24小时制转12时辰）
  const hourToZhi = {
    '23-1': 0,   // 子时 23:00-01:00
    '1-3': 1,    // 丑时 01:00-03:00
    '3-5': 2,    // 寅时 03:00-05:00
    '5-7': 3,    // 卯时 05:00-07:00
    '7-9': 4,    // 辰时 07:00-09:00
    '9-11': 5,   // 巳时 09:00-11:00
    '11-13': 6,  // 午时 11:00-13:00
    '13-15': 7,  // 未时 13:00-15:00
    '15-17': 8,  // 申时 15:00-17:00
    '17-19': 9,  // 酉时 17:00-19:00
    '19-21': 10, // 戌时 19:00-21:00
    '21-23': 11  // 亥时 21:00-23:00
  };

  // 日干对应时干起始索引
  const dayGanToStartIndex = {
    '甲己': 0,  // 甲己日起甲子时
    '乙庚': 2,  // 乙庚日起丙子时
    '丙辛': 4,  // 丙辛日起戊子时
    '丁壬': 6,  // 丁壬日起庚子时
    '戊癸': 8   // 戊癸日起壬子时
  };

  // 计算时干和时支
  const hourIndex = getHourIndex(hour);
  const startIndex = getStartIndex(dayGan);
  const hourGanIndex = (startIndex + hourIndex) % 10;

  return {
    gan: tianGan[hourGanIndex],
    zhi: diZhi[hourIndex],
    ganZhi: tianGan[hourGanIndex] + diZhi[hourIndex]
  };
};
```

### 2.2 五行对应
1. 天干五行对应规则：
   - 甲乙属木
   - 丙丁属火
   - 戊己属土
   - 庚辛属金
   - 壬癸属水
2. 地支五行对应规则：
   - 寅卯属木
   - 巳午属火
   - 辰戌丑未属土
   - 申酉属金
   - 亥子属水
3. 阴阳属性判定：
   - 天干：甲丙戊庚壬为阳，乙丁己辛癸为阴
   - 地支：子寅辰午申戌为阳，丑卯巳未酉亥为阴

### 2.3 藏干计算
1. 地支藏干规则：
   - 子藏癸
   - 丑藏己癸辛
   - 寅藏甲丙戊
   - 卯藏乙
   - 辰藏戊乙癸
   - 巳藏丙庚戊
   - 午藏丁己
   - 未藏己丁乙
   - 申藏庚壬戊
   - 酉藏辛
   - 戌藏戊辛丁
   - 亥藏壬甲
2. 藏干强度计算：
   - 本气强度为100%
   - 中气强度为70%
   - 余气强度为50%
3. 多重藏干处理：
   - 按照本气、中气、余气顺序处理
   - 考虑藏干五行相生相克关系
   - 计算最终影响力

## 3. 基本资料与节气信息

### 3.1 数据来源
- 节气数据：
  - 采用天文历法计算
  - 精确到分钟的节气时刻
- 五行数据：
  - 传统五行对应关系
  - 五行生克制化规则

### 3.2 节气计算
- 二十四节气精确时刻计算
- 节气交接时刻的特殊处理
- 节气影响的月令判定

## 4. 格局分析模块

### 4.1 格局判定

#### 4.1.1 基础数据结构
```javascript
// 格局对照表：根据月支和日干的组合确定格局
const patternTable = {
  "子": {
    "甲": "印重局", "乙": "印重局",
    "丙": "煞重局", "丁": "煞重局",
    "戊": "财旺局", "己": "财旺局",
    "庚": "伤官局", "辛": "伤官局",
    "壬": "命旺局", "癸": "命旺局"
  },
  // ... 其他月支的格局对照（丑至亥）
};

// 格局名称映射
const patternNameMap = {
  "印重局": "yinzhong",
  "伤官局": "shangguan",
  "命旺局": "bijian",
  "煞重局": "shazhong",
  "财旺局": "caiwang"
};
```

#### 4.1.2 格局判定算法
```javascript
const analyzePattern = (bazi) => {
  const dayGan = bazi.dayPillar.gan;    // 日干
  const monthZhi = bazi.monthPillar.zhi; // 月支
  
  // 通过查表确定格局
  if (patternTable[monthZhi] && patternTable[monthZhi][dayGan]) {
    const chinesePattern = patternTable[monthZhi][dayGan];
    return [patternNameMap[chinesePattern]];
  }
  
  return []; // 未找到对应格局
};
```

#### 4.1.3 格局类型特征

1. 印重局：
   - 特征：日主得印星生助
   - 条件：月支藏干中有生日主五行的天干
   - 例如：甲日生于子月，得水生木

2. 伤官局：
   - 特征：日主生伤官食神
   - 条件：日主五行生月支五行
   - 例如：庚日生于寅月，金生水

3. 命旺局：
   - 特征：日主旺相得助
   - 条件：日主五行与月令相生或相同
   - 例如：甲日生于寅月，木旺于寅

4. 煞重局：
   - 特征：日主受制伤克
   - 条件：月令五行克制日主五行
   - 例如：甲日生于申月，金克木

5. 财旺局：
   - 特征：日主生财得助
   - 条件：日主五行生月令五行
   - 例如：甲日生于巳月，木生火

#### 4.1.4 格局强度评估

1. 主格局判定：
   - 基于月支和日干的组合关系
   - 参考天干五行生克
   - 考虑地支藏干影响

2. 格局稳定性分析：
   - 检查天干组合是否支持主格局
   - 分析地支藏干对格局的影响
   - 评估其他干支对格局的补充或破坏

3. 格局作用力评估：
   - 统计支持该格局的干支数量
   - 计算干支五行对格局的贡献度
   - 考虑月令旺衰对格局强度的调整

### 4.2 格局组合效果

1. 格局相互作用：
   - 生：一个格局对另一个格局有增强作用
   - 克：一个格局对另一个格局有制约作用
   - 中和：两个格局的特性相互平衡

2. 格局稳定性：
   - 强：主格局特征明显，支持因素多
   - 中：主格局特征存在，但有制约
   - 弱：主格局特征不明显或受到严重制约

3. 格局变化：
   - 大运流年对格局的影响
   - 格局转化的可能性
   - 格局衰旺的周期性变化

### 4.3 格局吉凶判定

1. 基础判定：
   - 印重局：有利于学习、创作
   - 伤官局：利于事业、创新
   - 命旺局：整体运势较好
   - 煞重局：需要化解克制
   - 财旺局：有利于财运

2. 环境影响：
   - 月令旺相：增强格局特性
   - 月令休囚：减弱格局效果
   - 季节变化：影响格局表现

3. 综合评估：
   - 格局强度：影响效果显现程度
   - 组合关系：多重格局的互动
   - 变化趋势：格局随时间的演变

## 5. 命主分析模块

### 5.1 命主信息计算
1. 日主五行属性确定：
   - 根据日干确定五行属性
   - 判断阴阳属性
   - 确定生克关系
2. 命主强弱评估：
   - 计算天干五行力量（占比12%）
   - 统计地支五行力量（占比30%）
   - 考虑月令旺衰（调整系数0.6-1.5）
3. 命局特征分析：
   - 分析五行组合特点
   - 评估阴阳平衡
   - 判断命局类型

### 5.2 命主组合关系
1. 天干组合关系：
   - 分析天干相合
   - 计算组合强度
   - 评估组合效果
2. 地支组合关系：
   - 检查地支三合
   - 分析地支六合
   - 评估组合影响
3. 特殊组合效果：
   - 检查天干地支冲克
   - 分析特殊组合
   - 评估整体格局

## 6. 五行分析模块

### 6.1 五行强弱计算

#### 6.1.1 基础数据结构
```javascript
// 五行基本序列
const wuxing = ['金', '木', '水', '火', '土'];

// 五行计数初始化
const wuxingCount = {
  '木': 0, '火': 0, '土': 0, '金': 0, '水': 0
};
```

#### 6.1.2 本气五行力量计算（总计82%）

1. 天干五行力量（12%）：
```javascript
// 年干、月干、日干、时干各占3%
[yearPillar.gan, monthPillar.gan, dayPillar.gan, hourPillar.gan].forEach(gan => {
  const ganWuxing = calculator.getWuxing(gan);
  wuxingCount[ganWuxing] += 3;
});
```

2. 地支五行力量（70%）：
```javascript
// 月支占40%
const monthZhiWuxing = calculator.getWuxing(monthPillar.zhi);
wuxingCount[monthZhiWuxing] += 40;

// 年支、日支、时支各占10%（共30%）
[yearPillar.zhi, dayPillar.zhi, hourPillar.zhi].forEach(zhi => {
  const zhiWuxing = calculator.getWuxing(zhi);
  wuxingCount[zhiWuxing] += 10;
});
```

#### 6.1.3 藏干五行力量计算（总计18%）

1. 月支藏干分配（8%）：
```javascript
// 仅计算中气和余气（本气已计入月支五行）
const monthCangGans = calculator.getCangGan(monthPillar.zhi);
const monthZhiWuxingValue = calculator.getWuxing(monthPillar.zhi);
const monthNonBenQiCount = monthCangGans.filter((gan, index) => 
  calculator.getWuxing(gan) !== monthZhiWuxingValue && index > 0
).length;

if (monthNonBenQiCount > 0) {
  const monthWeight = 8 / monthNonBenQiCount; // 8%平均分配
  monthCangGans.forEach((gan, index) => {
    const ganWuxing = calculator.getWuxing(gan);
    if (ganWuxing !== monthZhiWuxingValue && index > 0) {
      wuxingCount[ganWuxing] += monthWeight;
    }
  });
}
```

2. 其他地支藏干分配（10%）：
```javascript
// 年支、日支、时支的中气和余气平均分配10%
[yearPillar.zhi, dayPillar.zhi, hourPillar.zhi].forEach(zhi => {
  const cangGans = calculator.getCangGan(zhi);
  const zhiWuxing = calculator.getWuxing(zhi);
  const nonBenQiCount = cangGans.filter((gan, index) => 
    calculator.getWuxing(gan) !== zhiWuxing && index > 0
  ).length;
  
  if (nonBenQiCount > 0) {
    const weight = 10 / (3 * nonBenQiCount);
    cangGans.forEach((gan, index) => {
      const ganWuxing = calculator.getWuxing(gan);
      if (ganWuxing !== zhiWuxing && index > 0) {
        wuxingCount[ganWuxing] += weight;
      }
    });
  }
});
```

#### 6.1.4 月令旺相调整

根据月支确定季节性调整系数：
```javascript
const seasonalFactor = {
  '春季': { // 寅卯
    '木': 1.5, '火': 1.2, '土': 0.8, '金': 0.6, '水': 1.0
  },
  '夏季': { // 巳午
    '木': 1.0, '火': 1.5, '土': 1.2, '金': 0.6, '水': 0.8
  },
  '秋季': { // 申酉
    '木': 0.6, '火': 0.8, '土': 1.0, '金': 1.5, '水': 1.2
  },
  '冬季': { // 亥子
    '木': 1.2, '火': 0.6, '土': 0.8, '金': 1.0, '水': 1.5
  },
  '四季': { // 辰戌丑未
    '木': 0.8, '火': 1.0, '土': 1.5, '金': 1.2, '水': 0.6
  }
};
```

#### 6.1.5 归一化处理

1. 应用季节调整：
```javascript
Object.keys(wuxingCount).forEach(wx => {
  wuxingCount[wx] *= seasonalFactor[wx] || 1.0;
});
```

2. 归一化计算：
```javascript
// 计算总分
const totalCount = Object.values(wuxingCount).reduce((sum, count) => sum + count, 0);

// 归一化到100分制
Object.keys(wuxingCount).forEach(wx => {
  wuxingCount[wx] = (wuxingCount[wx] / totalCount) * 100;
});
```

#### 6.1.6 五行强弱判定标准

根据归一化后的分数判定：
```javascript
const wuxingStrength = {};
Object.keys(wuxingCount).forEach(wx => {
  const percentage = wuxingCount[wx];
  if (percentage >= 30) {
    wuxingStrength[wx] = 'strong';      // 强：≥30分
  } else if (percentage <= 10) {
    wuxingStrength[wx] = 'weak';        // 弱：≤10分
  } else {
    wuxingStrength[wx] = 'neutral';     // 中等：10-30分
  }
});
```

### 6.2 五行性格分析
1. 主导五行特征：
   - 统计五行分布比例
   - 识别主导五行（占比≥30%为强）
   - 分析五行特质
2. 五行组合性格特点：
   - 分析五行相生关系
   - 评估五行相克影响
   - 判断性格倾向
3. 五行平衡状态评估：
   - 计算五行分布均衡度
   - 分析五行缺失影响
   - 评估调和可能

## 7. 十神分析模块

### 7.1 天干十神计算

#### 7.1.1 基础数据结构
```javascript
// 十神名称定义
const shishenNames = {
  'zhengyin': '正印',
  'pianyin': '偏印',
  'shangguan': '伤官',
  'shishen': '食神',
  'zhengguan': '正官',
  'qisha': '七杀',
  'zhengcai': '正财',
  'piancai': '偏财',
  'bijian': '比肩',
  'jiecai': '劫财'
};
```

#### 7.1.2 十神判定算法
```javascript
const getShishen = (gan, dayMasterGan) => {
  // 获取五行和阴阳属性
  const ganWuxing = calculator.getWuxing(gan);
  const ganYinYang = calculator.getYinYang(gan);
  const dayMasterWuxing = calculator.getWuxing(dayMasterGan);
  const dayMasterYinYang = calculator.getYinYang(dayMasterGan);
  
  // 同我者为比劫
  if (ganWuxing === dayMasterWuxing) {
    return ganYinYang === dayMasterYinYang ? 'bijian' : 'jiecai';
  }
  
  // 我生者为食伤
  if (isGenerating(dayMasterWuxing, ganWuxing)) {
    return ganYinYang === dayMasterYinYang ? 'shishen' : 'shangguan';
  }
  
  // 生我者为印绶
  if (isGenerating(ganWuxing, dayMasterWuxing)) {
    return ganYinYang === dayMasterYinYang ? 'pianyin' : 'zhengyin';
  }
  
  // 克我者为官杀
  if (isControlling(ganWuxing, dayMasterWuxing)) {
    return ganYinYang === dayMasterYinYang ? 'qisha' : 'zhengguan';
  }
  
  // 我克者为财星
  if (isControlling(dayMasterWuxing, ganWuxing)) {
    return ganYinYang === dayMasterYinYang ? 'piancai' : 'zhengcai';
  }
};
```

#### 7.1.3 十神力量计算

1. 天干十神权重：
```javascript
// 天干十神（年干、月干、时干各占1分）
Object.entries(tianganShishen).forEach(([key, shishen]) => {
  if (key !== 'dayGan' && shishen) {
    count[shishen] += 1;
  }
});
```

2. 地支藏干十神权重：
```javascript
// 地支藏干（权重递减）
Object.values(dizhiShishen).forEach(shishenArray => {
  shishenArray.forEach((shishen, index) => {
    if (shishen) {
      count[shishen] += 0.5 / (index + 1);
    }
  });
});
```

#### 7.1.4 十神组合关系

1. 生克关系判定：
```javascript
// 五行相生关系
const generatingRelations = {
  '木': '火',
  '火': '土',
  '土': '金',
  '金': '水',
  '水': '木'
};

// 五行相克关系
const controllingRelations = {
  '木': '土',
  '土': '水',
  '水': '火',
  '火': '金',
  '金': '木'
};
```

2. 制化规则：
- 印绶生日主：增强日主力量
- 食伤克印绶：减弱印绶作用
- 财星克食伤：抑制食伤特性
- 官杀克财星：制约财星力量
- 印绶克官杀：化解官杀之克

### 7.2 地支藏神计算
1. 藏干十神确定：
   - 分析地支藏干
   - 计算与日主关系
   - 确定藏神属性
2. 藏神强度计算：
   - 本气强度100%
   - 中气强度70%
   - 余气强度50%
3. 多重藏神处理：
   - 统计藏神数量
   - 计算权重影响
   - 评估整体作用

### 7.3 十神分析总结
1. 主导十神确定：
   - 统计十神出现频率
   - 计算十神强度
   - 判定主导十神
2. 十神作用力评估：
   - 分析十神生克关系
   - 计算作用强度
   - 评估影响范围
3. 十神组合效果分析：
   - 检查十神相互制约
   - 分析组合特点
   - 评估整体格局

## 8. 十二宫分析模块

### 8.1 十二宫状态
1. 十二宫排序：
   - 长生、沐浴、冠带、临官、帝旺、衰、病、死、墓、绝、胎、养
2. 起始位置判定：
   - 阳干从长生位顺行：
     - 甲：亥宫起长生
     - 丙戊：寅宫起长生
     - 庚：巳宫起长生
     - 壬：申宫起长生
   - 阴干从长生位逆行：
     - 乙：午宫起长生
     - 丁己：酉宫起长生
     - 辛：子宫起长生
     - 癸：卯宫起长生
3. 宫位状态评估：
   - 最旺阶段：
     - 临官：80-90分
     - 帝旺：90-100分
   - 次旺阶段：
     - 冠带：70-80分
     - 衰：60-70分
   - 平稳阶段：
     - 长生：60-70分
     - 沐浴：50-60分
     - 病：40-50分
   - 衰弱阶段：
     - 死：30-40分
     - 墓：20-30分
     - 绝：10-20分
   - 转化阶段：
     - 胎：20-30分
     - 养：30-40分

### 8.2 主导宫位分析
1. 主要宫位确定：
   - 分析命宫特征
   - 计算宫位强度
   - 确定主导宫位
2. 宫位相互影响：
   - 检查宫位三合
   - 分析宫位六合
   - 评估冲克关系
3. 宫位组合效果：
   - 计算组合强度
   - 分析互补作用
   - 评估整体格局

### 8.3 生命周期分析
1. 各宫位主导时期：
   - 计算流年宫位
   - 分析大运宫位
   - 确定主导时期
2. 宫位交接变化：
   - 分析交接特征
   - 计算变化强度
   - 评估过渡期
3. 周期特征分析：
   - 统计周期规律
   - 分析关键时点
   - 预测发展趋势

## 9. 流年大运分析模块

### 9.1 大运计算
1. 起运年龄计算：
   - 根据性别和年干阴阳确定数到上一个节令还是下一个节令
   - 计算出生日期与最近节气的天数差
   - 将天数差除以3得到月数，再将月数除以3得到基础起运年龄
   - 最后加上传统的3岁基数，得到最终的起运年龄
2. 大运排序规则：
   - 根据性别确定顺逆：
     - 男命阳年顺行，阴年逆行
     - 女命阳年逆行，阴年顺行
   - 按十年间隔排列大运：
     - 从起运年龄开始每十年一运
     - 考虑节气交接影响

### 9.2 流年分析
1. 近期流年分析：
   - 流年干支计算：
     - 以节气为界定流年
     - 考虑节气交接时刻
   - 流年吉凶判定：
     - 分析流年五行生克
     - 评估流年十神关系
     - 计算流年格局
2. 未来流年预测：
   - 流年变化规律：
     - 分析周期性变化
     - 识别关键节点
   - 关键流年识别：
     - 计算大运交接年
     - 分析流年冲克
   - 流年组合效果：
     - 评估流年与大运关系
     - 分析流年与本命互动
     - 预测综合影响