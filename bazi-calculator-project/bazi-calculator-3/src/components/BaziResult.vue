<template>
  <div class="bazi-result">
    <!-- 八字基本信息 -->
    <div class="card bazi-card">
      <h2>{{ t('result.bazi') }}</h2>
      <div class="bazi-grid">
        <div class="bazi-pillar year">
          <div class="tian-gan">{{ result.bazi.year[0] }}</div>
          <div class="di-zhi">{{ result.bazi.year[1] }}</div><div class="label">{{ t('result.year') }}</div>
        </div>
        <div class="bazi-pillar month">
          <div class="tian-gan">{{ result.bazi.month[0] }}</div>
          <div class="di-zhi">{{ result.bazi.month[1] }}</div>
          <div class="label">{{ t('result.month') }}</div>
        </div>
        <div class="bazi-pillar day">
          <div class="tian-gan">{{ result.bazi.day[0] }}</div>
          <div class="di-zhi">{{ result.bazi.day[1] }}</div>
          <div class="label">{{ t('result.day') }}</div>
        </div>
        <div class="bazi-pillar hour">
          <div class="tian-gan">{{ result.bazi.hour[0] }}</div>
          <div class="di-zhi">{{ result.bazi.hour[1] }}</div>
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
        </div>
      </div>
    </div>
    
    <!-- 十神分析 -->
    <div class="card">
      <h2>{{ t('result.shishen') }}</h2>
      <table class="shishen-table">
        <thead>
          <tr>
            <th>{{ t('result.position') }}</th>
            <th>{{ t('result.shishen') }}</th>
            <th>{{ t('result.meaning') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(value, key) in result.shiShenAnalysis" :key="key">
            <td>{{ formatShiShenPosition(key) }}</td>
            <td>{{ value }}</td>
            <td>{{ getShiShenMeaning(value) }}</td>
          </tr>
        </tbody>
      </table>
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


const getWuxingColor = (wuxing) => {
  const colors = {
    '木': '#4CAF50', //绿色
    '火': '#FF5722', // 红色
    '土': '#FFC107', // 黄色
    '金': '#FFFFFF', // 白色
    '水': '#2196F3'  // 蓝色
  };
  return colors[wuxing] || '#888888';
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
    '偏财': '代表财运、机遇、异性缘',
    '正财': '代表正当收入、婚姻',
    '偏官': '代表权力、竞争、压力',
    '正官': '代表地位、名誉、规矩',
    '七杀': '代表威严、决断、克制',
    '正印': '代表贵人、学历、文凭'
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
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid var(--primary-color);
  margin: 5px 0;
  font-size: 1.5rem;
  font-weight: bold;
}

.tian-gan {
  border-bottom: none;
  border-radius: 8px 8px 0 0;
  background-color: rgba(197, 48, 48, 0.1);
}

.di-zhi {
  border-top: none;
  border-radius: 0 0 8px 8px;
  background-color: rgba(44, 82, 130, 0.1);
}

.label {
  margin-top: 10px;
  font-weight: 500;
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

.shishen-table, .twelve-table {
  width: 100%;
  border-collapse: collapse;
}

.shishen-table th, .shishen-table td,
.twelve-table th, .twelve-table td {
  padding: 10px;
  border-bottom: 1px solid var(--border-color);
  text-align: left;
}

.shishen-table th, .twelve-table th {
  font-weight: 500;
  background-color: rgba(0, 0, 0, 0.05);
}

.analysis-card {
  background-image: linear-gradient(135deg, var(--card-bg), var(--card-bg) 50%, rgba(214, 158, 46, 0.05));
}

.analysis-content {
  line-height: 1.6;
  font-size: 1.1rem;
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