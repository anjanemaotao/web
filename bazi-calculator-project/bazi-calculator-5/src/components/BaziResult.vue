<template>
  <div class="bazi-result">
    <!-- 八字基本信息 -->
    <div class="card bazi-card">
      <h2>{{ t('result.bazi') }}</h2>
      <div class="bazi-grid">
        <div class="bazi-pillar year">
          <div class="tian-gan">
            {{ result.bazi.year[0] }}
            <span class="wuxing-tag" :text-content="result.wuxingAnalysis.wuxingInfo.year.tianGanWuxing">{{ result.wuxingAnalysis.wuxingInfo.year.tianGanWuxing }}</span>
            <span class="yinyang-tag" :class="{ 'yang': TIAN_GAN_YIN_YANG[result.bazi.year[0]] === '阳', 'yin': TIAN_GAN_YIN_YANG[result.bazi.year[0]] === '阴' }">{{ TIAN_GAN_YIN_YANG[result.bazi.year[0]] }}</span>
          </div>
          <div class="di-zhi">{{ result.bazi.year[1] }}<span class="wuxing-tag" :text-content="result.wuxingAnalysis.wuxingInfo.year.diZhiWuxing">{{ result.wuxingAnalysis.wuxingInfo.year.diZhiWuxing }}</span><span class="yinyang-tag" :class="{ 'yang': DI_ZHI_YIN_YANG[result.bazi.year[1]] === '阳', 'yin': DI_ZHI_YIN_YANG[result.bazi.year[1]] === '阴' }">{{ DI_ZHI_YIN_YANG[result.bazi.year[1]] }}</span><span class="cang-gan-tag">{{ DI_ZHI_CANG_GAN[result.bazi.year[1]].join('') }}</span></div>
          <div class="label">{{ t('result.year') }}</div>
        </div>
        <div class="bazi-pillar month">
          <div class="tian-gan">
            {{ result.bazi.month[0] }}
            <span class="wuxing-tag" :text-content="result.wuxingAnalysis.wuxingInfo.month.tianGanWuxing">{{ result.wuxingAnalysis.wuxingInfo.month.tianGanWuxing }}</span>
            <span class="yinyang-tag" :class="{ 'yang': TIAN_GAN_YIN_YANG[result.bazi.month[0]] === '阳', 'yin': TIAN_GAN_YIN_YANG[result.bazi.month[0]] === '阴' }">{{ TIAN_GAN_YIN_YANG[result.bazi.month[0]] }}</span>
          </div>
          <div class="di-zhi">{{ result.bazi.month[1] }}<span class="wuxing-tag" :text-content="result.wuxingAnalysis.wuxingInfo.month.diZhiWuxing">{{ result.wuxingAnalysis.wuxingInfo.month.diZhiWuxing }}</span><span class="yinyang-tag" :class="{ 'yang': DI_ZHI_YIN_YANG[result.bazi.month[1]] === '阳', 'yin': DI_ZHI_YIN_YANG[result.bazi.month[1]] === '阴' }">{{ DI_ZHI_YIN_YANG[result.bazi.month[1]] }}</span><span class="cang-gan-tag">{{ DI_ZHI_CANG_GAN[result.bazi.month[1]].join('') }}</span></div>
          <div class="label">{{ t('result.month') }}</div>
        </div>
        <div class="bazi-pillar day">
          <div class="tian-gan">
            {{ result.bazi.day[0] }}
            <span class="wuxing-tag" :text-content="result.wuxingAnalysis.wuxingInfo.day.tianGanWuxing">{{ result.wuxingAnalysis.wuxingInfo.day.tianGanWuxing }}</span>
            <span class="yinyang-tag" :class="{ 'yang': TIAN_GAN_YIN_YANG[result.bazi.day[0]] === '阳', 'yin': TIAN_GAN_YIN_YANG[result.bazi.day[0]] === '阴' }">{{ TIAN_GAN_YIN_YANG[result.bazi.day[0]] }}</span>
          </div>
          <div class="di-zhi">{{ result.bazi.day[1] }}<span class="wuxing-tag" :text-content="result.wuxingAnalysis.wuxingInfo.day.diZhiWuxing">{{ result.wuxingAnalysis.wuxingInfo.day.diZhiWuxing }}</span><span class="yinyang-tag" :class="{ 'yang': DI_ZHI_YIN_YANG[result.bazi.day[1]] === '阳', 'yin': DI_ZHI_YIN_YANG[result.bazi.day[1]] === '阴' }">{{ DI_ZHI_YIN_YANG[result.bazi.day[1]] }}</span><span class="cang-gan-tag">{{ DI_ZHI_CANG_GAN[result.bazi.day[1]].join('') }}</span></div>
          <div class="label">{{ t('result.day') }}</div>
        </div>
        <div class="bazi-pillar hour">
          <div class="tian-gan">
            {{ result.bazi.hour[0] }}
            <span class="wuxing-tag" :text-content="result.wuxingAnalysis.wuxingInfo.hour.tianGanWuxing">{{ result.wuxingAnalysis.wuxingInfo.hour.tianGanWuxing }}</span>
            <span class="yinyang-tag" :class="{ 'yang': TIAN_GAN_YIN_YANG[result.bazi.hour[0]] === '阳', 'yin': TIAN_GAN_YIN_YANG[result.bazi.hour[0]] === '阴' }">{{ TIAN_GAN_YIN_YANG[result.bazi.hour[0]] }}</span>
          </div>
          <div class="di-zhi">{{ result.bazi.hour[1] }}<span class="wuxing-tag" :text-content="result.wuxingAnalysis.wuxingInfo.hour.diZhiWuxing">{{ result.wuxingAnalysis.wuxingInfo.hour.diZhiWuxing }}</span><span class="yinyang-tag" :class="{ 'yang': DI_ZHI_YIN_YANG[result.bazi.hour[1]] === '阳', 'yin': DI_ZHI_YIN_YANG[result.bazi.hour[1]] === '阴' }">{{ DI_ZHI_YIN_YANG[result.bazi.hour[1]] }}</span><span class="cang-gan-tag">{{ DI_ZHI_CANG_GAN[result.bazi.hour[1]].join('') }}</span></div>
          <div class="label">{{ t('result.hour') }}</div>
        </div>
      </div>
    </div>
    <!-- 格局分析 -->
    <div class="card">
      <h2>{{ t('result.ju') }}</h2>
      <div class="ju-container">
        <div
          v-for="(juType, index) in result.ju.types" 
          :key="index" 
          class="ju-type"
          :class="{ 'primary-ju': index === 0 }"
        >
          {{ juType }}
        </div>
      </div>
      <!-- 格局详细解释 -->
      <div class="ju-explanation" v-if="result.ju.explanation">
        <p><strong>格局解释：</strong> {{ result.ju.explanation }}</p>
        <p><strong>性格特点：</strong> {{ result.ju.characteristics }}</p>
      </div>
    </div>
    <!-- 五行分析 -->
    <div class="card">
      <h2>{{ t('result.wuxing') }}</h2>
      <div class="wuxing-chart" ref="wuxingChartRef"></div>
      <div class="wuxing-summary">
        <div v-for="(count, wuxing) in result.wuxingAnalysis.wuxingCount" :key="wuxing" class="wuxing-item">
          <span class="wuxing-name">{{ wuxing }}</span>
          <div class="wuxing-bar">
            <div class="wuxing-bar-inner" :style="{ width: `${count * 12.5}%`, backgroundColor: getWuxingColor(wuxing) }"></div>
          </div>
          <span class="wuxing-count">{{ count }}</span>
          <span class="wuxing-strength-tag" :class="getWuxingStrength(count, Object.values(result.wuxingAnalysis.wuxingCount).reduce((a, b) => a + b, 0))">{{ getWuxingStrength(count, Object.values(result.wuxingAnalysis.wuxingCount).reduce((a, b) => a + b, 0)) }}</span>
        </div>
      </div>
      <!-- 五行分析解释 -->
      <div class="wuxing-explanation">
        <h3>五行分析解释</h3>
        <div v-for="(count, wuxing) in result.wuxingAnalysis.wuxingCount" :key="wuxing" class="wuxing-detail">
          <div class="wuxing-title">
            <span class="wuxing-name" :style="{ color: getWuxingColor(wuxing) }">{{ wuxing }}{{ getWuxingStrength(count, Object.values(result.wuxingAnalysis.wuxingCount).reduce((a, b) => a + b, 0)) }}</span>
          </div>
          <div class="wuxing-content">
            {{ getWuxingExplanation(wuxing, getWuxingStrength(count, Object.values(result.wuxingAnalysis.wuxingCount).reduce((a, b) => a + b, 0))) }}
          </div>
        </div>
      </div>
      
      <!-- 五行生克关系 -->
      <div class="wuxing-relations">
        <h3>五行生克关系</h3>
        <div class="wuxing-relations-container">
          <!-- 日主五行关系 -->
          <div class="relation-section">
            <div class="relation-list">
              <!-- 生我的五行 -->
              <div class="relation-group">
                <div class="relation-title">生我</div>
                <div class="relation-item" v-for="wuxing in ['木', '火', '土', '金', '水']" :key="'sheng-wo-' + wuxing">
                  <template v-if="isGenerating(wuxing, result.wuxingAnalysis.wuxingInfo.day.tianGanWuxing)">
                    <span class="wuxing-name" :style="{ color: getWuxingColor(wuxing) }">{{ wuxing }}</span>
                    <span class="relation-arrow">生</span>
                    <span class="wuxing-name" :style="{ color: getWuxingColor(result.wuxingAnalysis.wuxingInfo.day.tianGanWuxing) }">{{ result.wuxingAnalysis.wuxingInfo.day.tianGanWuxing }}</span>
                  </template>
                </div>
              </div>
              <!-- 我生的五行 -->
              <div class="relation-group">
                <div class="relation-title">我生</div>
                <div class="relation-item" v-for="wuxing in ['木', '火', '土', '金', '水']" :key="'wo-sheng-' + wuxing">
                  <template v-if="isGenerating(result.wuxingAnalysis.wuxingInfo.day.tianGanWuxing, wuxing)">
                    <span class="wuxing-name" :style="{ color: getWuxingColor(result.wuxingAnalysis.wuxingInfo.day.tianGanWuxing) }">{{ result.wuxingAnalysis.wuxingInfo.day.tianGanWuxing }}</span>
                    <span class="relation-arrow">生</span>
                    <span class="wuxing-name" :style="{ color: getWuxingColor(wuxing) }">{{ wuxing }}</span>
                  </template>
                </div>
              </div>
              <!-- 克我的五行 -->
              <div class="relation-group">
                <div class="relation-title">克我</div>
                <div class="relation-item" v-for="wuxing in ['木', '火', '土', '金', '水']" :key="'ke-wo-' + wuxing">
                  <template v-if="isRestricting(wuxing, result.wuxingAnalysis.wuxingInfo.day.tianGanWuxing)">
                    <span class="wuxing-name" :style="{ color: getWuxingColor(wuxing) }">{{ wuxing }}</span>
                    <span class="relation-arrow">克</span>
                    <span class="wuxing-name" :style="{ color: getWuxingColor(result.wuxingAnalysis.wuxingInfo.day.tianGanWuxing) }">{{ result.wuxingAnalysis.wuxingInfo.day.tianGanWuxing }}</span>
                  </template>
                </div>
              </div>
              <!-- 我克的五行 -->
              <div class="relation-group">
                <div class="relation-title">我克</div>
                <div class="relation-item" v-for="wuxing in ['木', '火', '土', '金', '水']" :key="'wo-ke-' + wuxing">
                  <template v-if="isRestricting(result.wuxingAnalysis.wuxingInfo.day.tianGanWuxing, wuxing)">
                    <span class="wuxing-name" :style="{ color: getWuxingColor(result.wuxingAnalysis.wuxingInfo.day.tianGanWuxing) }">{{ result.wuxingAnalysis.wuxingInfo.day.tianGanWuxing }}</span>
                    <span class="relation-arrow">克</span>
                    <span class="wuxing-name" :style="{ color: getWuxingColor(wuxing) }">{{ wuxing }}</span>
                  </template>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    
    <!-- 十神分析 -->
    <div class="card">
      <h2>{{ t('result.shishen') }}</h2>
      <!-- 天干十神 -->
      <div class="shishen-section">
        <h3>天干十神</h3>
        <div class="shishen-grid">
          <div class="shishen-item">
            <div class="label">年干</div>
            <div class="value">{{ result.shiShenAnalysis.year }}</div>
            <div class="meaning">{{ getShiShenMeaning(result.shiShenAnalysis.year) }}</div>
          </div>
          <div class="shishen-item">
            <div class="label">月干</div>
            <div class="value">{{ result.shiShenAnalysis.month }}</div>
            <div class="meaning">{{ getShiShenMeaning(result.shiShenAnalysis.month) }}</div>
          </div>
          <div class="shishen-item">
            <div class="label">日干</div>
            <div class="value">{{ result.shiShenAnalysis.day }}</div>
            <div class="meaning">{{ getShiShenMeaning(result.shiShenAnalysis.day) }}</div>
          </div>
          <div class="shishen-item">
            <div class="label">时干</div>
            <div class="value">{{ result.shiShenAnalysis.hour }}</div>
            <div class="meaning">{{ getShiShenMeaning(result.shiShenAnalysis.hour) }}</div>
          </div>
        </div>
      </div>
      
      <!-- 地支藏干十神 -->
      <div class="shishen-section">
        <h3>地支藏干十神</h3>
        <div class="shishen-grid">
          <template v-for="(value, key) in result.shiShenAnalysis" :key="key">
            <div class="shishen-item" v-if="key.includes('Hidden') && value !== '未知' && value">
              <div class="label">{{ getHiddenLabel(key) }}</div>
              <div class="value">{{ value }}</div>
              <div class="meaning">
                <template v-for="(item, index) in value.split(',')" :key="index">
                  {{ getShiShenMeaning(item.trim()) }}<br v-if="index < value.split(',').length - 1">
                </template>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- 十神分析总结 -->
      <div class="shishen-summary">
        <h3>十神分析总结</h3>
        <p>{{ result.shiShenAnalysis.summary }}</p>
      </div>
    </div>
    
    <!-- 十二宫分析 -->
    <div class="card">
      <h2>{{ t('result.twelveStages') }}</h2>
      <table class="twelve-table">
        <thead>
          <tr>
            <th>{{ t('result.position') }}</th>
            <th>{{ t('result.stage') }}</th>
            <th>{{ t('result.meaning') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(value, key) in result.twelveStages" :key="key">
            <td>{{ formatPosition(key) }}</td>
            <td>{{ value }}</td>
            <td>{{ getTwelveStageMeaning(value) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- 综合分析 -->
    <div class="card analysis-card">
      <h2>{{ t('result.analysis') }}</h2>
      <div class="analysis-content">
        {{ getAnalysis() }}
      </div>
    </div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts';
import gsap from 'gsap';
import { useI18n } from 'vue-i18n';
import { ref, onMounted, nextTick, watch, computed } from 'vue';
import { TIAN_GAN_YIN_YANG, DI_ZHI_YIN_YANG, DI_ZHI_CANG_GAN, isGenerating, isRestricting } from '../utils/baziCalculator';

// 定义五行对应的颜色
const wuxingColors = {
  '木': '#4CAF50',
  '火': '#FF5722',
  '土': '#8B4513',
  '金': '#FFD700',
  '水': '#2196F3'
};

// 获取五行对应的颜色
const getWuxingColor = (wuxing) => wuxingColors[wuxing] || '#666';

const { t } = useI18n();

const props = defineProps({
  result: {
    type: Object,
    required: true
  }
});

const wuxingChart = ref(null);
const wuxingChartRef = ref(null);

const getTwelveStageMeaning = (stage) => {
  const meanings = {
    '命宫': '代表个性、性格、外貌',
    '兄弟宫': '代表兄弟姐妹、朋友、同事关系',
    '夫妻宫': '代表婚姻、伴侣、合作关系',
    '子女宫': '代表子女、创造力、事业成就',
    '财帛宫': '代表财运、收入、理财能力',
    '疾厄宫': '代表健康、疾病、困难',
    '迁移宫': '代表旅行、移居、变动',
    '仆役宫': '代表下属、助手、人际关系',
    '官禄宫': '代表事业、地位、名誉',
    '田宅宫': '代表房产、居所、投资',
    '福德宫': '代表福气、心性、精神生活',
    '父母宫': '代表父母、长辈、贵人'
  };
  return meanings[stage] || '暂无相关解释';
};

// 确保在组件挂载后正确获取DOM元素
const initChart = () => {
  if (!wuxingChartRef.value) return;
  if (wuxingChart.value) {
    wuxingChart.value.dispose();
  }
  wuxingChart.value = echarts.init(wuxingChartRef.value);
  if (!props.result?.wuxingAnalysis?.wuxingCount) return;
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
      orient: 'horizontal',
      bottom: 10,
      data: Object.keys(props.result.wuxingAnalysis.wuxingCount),
      textStyle: {
        color: getComputedStyle(document.documentElement).getPropertyValue('--text-color')
      }
    },
    series: [
      {
        name: '五行分布',
        type: 'pie',
        radius: '65%',
        center: ['50%', '50%'],
        data: Object.entries(props.result.wuxingAnalysis.wuxingCount).map(([name, value]) => ({
          name,
          value,
          itemStyle: {
            color: getWuxingColor(name)
          }
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
  wuxingChart.value.setOption(option);
};

onMounted(() => {
  nextTick(() => {
    initChart();
    animateElements();
    
    // 添加resize事件监听
    window.addEventListener('resize', () => {
      if (wuxingChart.value) {
        wuxingChart.value.resize();
      }
    });
  });
});

watch(() => props.result, () => {
  nextTick(() => {
    initChart();
  });
}, { deep: true });


const getWuxingStrength = (count, totalCount) => {
  const percentage = count / totalCount;
  if (percentage >= 0.3) return '旺';
  if (percentage <= 0.1) return '弱';
  return '中';
};

const getWuxingExplanation = (wuxing, strength) => {
  const explanations = {
    '木': {
      '旺': '木旺者性格开朗，富有创造力和进取心。事业上适合从事教育、文化、艺术等领域。为人正直，富有同情心，人际关系良好。',
      '中': '木气中和，性格温和，做事有条理。事业发展平稳，适合各类工作。人际关系和谐，善于沟通。',
      '弱': '木弱者个性温顺，缺乏主见。事业上需要他人扶持，宜从事辅助性工作。人际关系被动，缺乏主动社交。'
    },
    '火': {
      '旺': '火旺者性格热情奔放，富有领导魅力。事业上适合从事销售、演艺、公关等活动。为人热情，富有感染力，人际关系活跃。',
      '中': '火气中和，性格活泼开朗，富有亲和力。事业发展顺遂，适合与人打交道的工作。社交能力强，人缘好。',
      '弱': '火弱者性格内向，缺乏自信。事业发展较慢，不适合竞争激烈的工作。人际交往较为被动，社交圈子小。'
    },
    '土': {
      '旺': '土旺者性格稳重踏实，做事认真负责。事业上适合从事管理、房地产、农业等领域。为人诚实，重情重义，人际关系稳固。',
      '中': '土气中和，性格随和，做事有始有终。事业发展稳定，适合长期发展的工作。人际关系融洽，重情重义。',
      '弱': '土弱者性格优柔寡断，缺乏安全感。事业上需要稳定的环境，不适合冒险。人际关系不稳定，易受他人影响。'
    },
    '金': {
      '旺': '金旺者性格坚毅果断，具有决策力。事业上适合从事金融、法律、军警等领域。为人正直，公平公正，人际关系清晰。',
      '中': '金气中和，性格理性，做事有原则。事业发展平稳，适合需要专业技能的工作。人际关系理性，注重公平。',
      '弱': '金弱者性格柔顺，缺乏主见。事业上不适合竞争性工作，宜从事协助性工作。人际关系和谐但被动。'
    },
    '水': {
      '旺': '水旺者性格灵活聪慧，思维敏捷。事业上适合从事科研、IT、创意等活动。为人灵活，善于沟通，人际关系广泛。',
      '中': '水气中和，性格随和，思维清晰。事业发展稳定，适合需要智慧和耐心的工作。人际关系融洽，善解人意。',
      '弱': '水弱者性格保守，思维较慢。事业发展需要时间积累，不适合快节奏工作。人际交往较为谨慎。'
    }
  };
  return explanations[wuxing]?.[strength] || '暂无相关解释';
};


const formatPosition = (position) => {
  const posMap = {
    'year': t('result.year'),
    'month': t('result.month'),
    'day': t('result.day'),
    'hour': t('result.hour')
  };
  return posMap[position] || position;
};

const formatShiShenPosition = (key) => {
  const parts = key.split('_');
  return `${formatPosition(parts[0])}${t('result.tianGan')}`;
};
const getHiddenLabel = (key) => {
  const positionMap = {
    'yearHidden': t('result.year'),
    'monthHidden': t('result.month'),
    'dayHidden': t('result.day'),
    'hourHidden': t('result.hour')
  };
  return `${positionMap[key]}${t('result.hiddenGan')}`;
};
const getJuDescription = (ju) => {
  const descriptions = {
    '伤官格': '伤官格为喜用神，表现为聪明伶俐，善于言辞，但需谨防过于锋芒毕露。',
    '印重格': '印重格为喜用神，表现为才华、学识丰富，受长辈提拔，但需防过于依赖他人。',
    '比肩格': '比肩格为喜用神，表现为个性刚强，有领导力，但需防过于刚愎自用。',
    '煞重格': '煞重格为喜用神，表现为权力欲强，有决断力，但需防过于专断。',
    '财旺格': '财旺格为喜用神，表现为经济头脑好，财运亨通，但需防贪欲过盛。',
    '平常格': '平常格无明显偏颇，性格平和，命运顺遂，各项较为均衡发展。'
  };
  return descriptions[ju] || '暂无相关解释';
};

const getShiShenMeaning = (shishen) => {
  const meanings = {
    '比肩': '代表竞争、合作、兄弟姐妹',
    '劫财': '代表竞争、独立、个性',
    '食神': '代表智慧、学习、艺术',
    '伤官': '代表创造、革新、权威',
    '比肩': '代表自我、兄弟、竞争、合作、事业、独立能力',
    '劫财': '代表手足、朋友、竞争、助力、独立、进取',
    '食神': '代表智慧、文艺、口才、创造力、教育、艺术',
    '伤官': '代表革新、才艺、口舌、创意、学术、技能',
    '偏财': '代表偏门财、风险投资、机遇、桃花、异性缘',
    '正财': '代表正当收入、婚姻、正财、工资、事业',
    '七杀': '代表权威、决断力、攻击性、威严、克制',
    '正官': '代表官位、名誉、地位、规矩、权力',
    '偏印': '代表学习、知识、灵感、智慧、母亲',
    '正印': '代表贵人、学历、文凭、资历、荣誉'
  };
  return meanings[shishen] || '未知';
};

const animateElements = () => {
      // 八字柱动画
      gsap.from('.bazi-pillar', {
        y: 30,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power2.out"
      });
      // 卡片动画
      gsap.from('.card', {
        y: 50,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        delay: 0.5,
        ease: "power2.out"
      });
    }
const getAnalysis = () => {
  // 根据八字、五行、十神等综合分析
  let analysis = '根据您的八字：';
  analysis += `${props.result.bazi.year} ${props.result.bazi.month} ${props.result.bazi.day} ${props.result.bazi.hour}，`;
  
  // 加入五行分析
  const wuxingCounts = props.result.wuxingAnalysis.wuxingCount;
  const maxWuxing = Object.entries(wuxingCounts).sort((a, b) => b[1] - a[1])[0][0];
  const minWuxing = Object.entries(wuxingCounts).sort((a, b) => a[1] - b[1])[0][0];
  
  analysis += `您的命局中五行以${maxWuxing}为最旺，${minWuxing}为最弱。`;
  
  // 加入格局分析
  analysis += `您的八字属于${props.result.ju.types.join('、')}。${props.result.ju.explanation}`;
  
  return analysis;
}
</script>

<style scoped>
.bazi-result {
  animation: fadeIn 1s ease;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.wuxing-relations {
  margin-top: 20px;
}

.wuxing-relations h3 {
  margin-bottom: 15px;
}

.wuxing-relations-container {
  display: flex;
  flex-direction: column;
}

.relation-section {
  background-color: var(--card-background-color);
  border-radius: 8px;
  padding: 15px;
}

.relation-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.relation-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.relation-title {
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: 5px;
}

.relation-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  background-color: var(--background-color);
  border-radius: 4px;
  font-size: 0.95em;
}

.wuxing-name {
  font-weight: 500;
}

.relation-arrow {
  color: var(--text-color-light);
  font-size: 0.9em;
}

.bazi-card {
  background-image: url('/images/paper_texture.jpg');
  background-size: cover;
  border: none;
}

.bazi-grid {
  display: flex;
  justify-content: space-around;
  padding: 1.5rem0;
}

.bazi-pillar {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80px;
}

.tian-gan, .di-zhi {
  width: 60px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid #D4AF37;
  margin: 5px 0;
  font-size: 1.5rem;
  font-weight: bold;
  color: #D4AF37;
  text-shadow: 0 0 5px rgba(212, 175, 55, 0.5);
  animation: glowingText 2s ease-in-out infinite;
  position: relative;
  padding: 10px 0;
}

.yinyang-tag {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.4em;
  padding: 1px 3px;
  border-radius: 3px;
  opacity: 0.8;
  z-index: 1;
}

.yinyang-tag.yang {
  color: #FFD700;
  background-color: rgba(255, 215, 0, 0.3);
  font-weight: bold;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
}

.yinyang-tag.yin {
  color: #8B6B3D;
  background-color: rgba(139, 107, 61, 0.15);
  font-weight: bold;
  text-shadow: 0 0 2px rgba(139, 107, 61, 0.2);
}

.wuxing-tag {
  position: absolute;
  top: -2px;
  right: -2px;
  font-size: 12px;
  padding: 2px 4px;
  border-radius: 4px;
  z-index: 1;
  color: var(--text-color);
  background-color: rgba(0, 0, 0, 0.1);
}

.wuxing-tag[text-content="木"] {
  color: #4CAF50;
  background-color: rgba(76, 175, 80, 0.1);
}

.wuxing-tag[text-content="火"] {
  color: #FF5722;
  background-color: rgba(255, 87, 34, 0.1);
}

.wuxing-tag[text-content="土"] {
  color: #8B4513;
  background-color: rgba(255, 193, 7, 0.1);
}

.wuxing-tag[text-content="金"] {
  color: #FFD700;
  background-color: rgba(255, 215, 0, 0.1);
}

.wuxing-tag[text-content="水"] {
  color: #2196F3;
  background-color: rgba(33, 150, 243, 0.1);
}

.cang-gan-tag {
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.4em;
  color: #888888;
  opacity: 0.8;
  white-space: nowrap;
}
.tian-gan {
  border-bottom: none;
  border-radius: 8px 8px 0 0;
  background-color: rgba(212, 175, 55, 0.1);
}

.di-zhi {
  border-top: none;
  border-radius: 0 0 8px 8px;
  background-color: rgba(212, 175, 55, 0.1);
}

@keyframes glowingText {
  0% {
    text-shadow: 0 0 5px rgba(212, 175, 55, 0.5);
  }
  50% {
    text-shadow: 0 0 15px rgba(212, 175, 55, 0.8);
  }
  100% {
    text-shadow: 0 0 5px rgba(212, 175, 55, 0.5);
  }
}

.label {
  margin-top: 10px;
  font-weight: 500;
  color: white;
}

.ju-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 1rem;
}

.tag {
  padding: 5px 12px;
  background-color: var(--accent-color);
  border-radius: 20px;
  font-size: 0.9rem;
  color: white;
}

.wuxing-chart {
  height: 300px;
  margin-bottom: 1.5rem;
}

.wuxing-summary {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.wuxing-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.wuxing-name {
  width: 30px;
  font-weight: 500;
}

.wuxing-bar {
  flex: 1;
  height: 15px;
  background-color: var(--border-color);
  border-radius: 10px;
  overflow: hidden;
}

.wuxing-bar-inner {
  height: 100%;
  border-radius: 10px;
}

.wuxing-count {
  width: 30px;
  text-align: right;
}

.wuxing-strength-tag {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8em;
  margin-left: 8px;
}

.wuxing-strength-tag.旺 {
  color: #FF5722;
  background-color: rgba(255, 87, 34, 0.1);
}

.wuxing-strength-tag.中和 {
  color: #FFC107;
  background-color: rgba(255, 193, 7, 0.1);
}

.wuxing-strength-tag.弱 {
  color: #2196F3;
  background-color: rgba(33, 150, 243, 0.1);
}

.twelve-table {
  width: 100%;
  border-collapse: collapse;
}

.twelve-table th, .twelve-table td {
  padding: 10px;
  border-bottom: 1px solid var(--border-color);
  text-align: left;
}

.twelve-table th {
  font-weight: 500;
  background-color: rgba(0, 0, 0, 0.05);
}

.shishen-section {
  margin-bottom: 2rem;
}

.shishen-section h3 {
  color: #333;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
}

.shishen-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.shishen-item {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.shishen-item .label {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.shishen-item .value {
  color: #333;
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.shishen-item .meaning {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
}

.shishen-summary {
  background: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.shishen-summary h3 {
  color: #333;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.shishen-summary p {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.analysis-card {
  background-image: linear-gradient(135deg, var(--card-bg), var(--card-bg) 50%, rgba(214, 158, 46, 0.05));
}

.analysis-content {
  line-height: 1.6;
  font-size: 1.1rem;
}

/* 五行分析解释样式 */
.wuxing-explanation {
  margin-top: 2rem;
  padding: 1rem;
  background-color: var(--card-bg);
  border-radius: 8px;
}

.wuxing-explanation h3 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: var(--text-color);
  text-align: center;
}

.wuxing-detail {
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.05);
}

.wuxing-title {
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.wuxing-content {
  line-height: 1.6;
  color: var(--text-color-light);
  font-size: 0.95rem;
}

/*格局相关样式 */
.ju-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 1rem;
}

.ju-type {
  padding: 5px 12px;
  border-radius: 16px;
  background-color: var(--secondary-bg);
  color: var(--text-color);
}

.primary-ju {
  background-color: var(--primary-color);
  color: white;
}

.ju-explanation {
  margin-top: 1rem;
  padding: 15px;
  background-color: var(--card-bg);
  border-left: 3px solid var(--primary-color);
  border-radius: 4px;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>