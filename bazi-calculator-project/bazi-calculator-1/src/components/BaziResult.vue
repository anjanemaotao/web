<template>
  <div class="bazi-result">
    <!-- 八字基本信息 -->
    <div class="card bazi-card">
      <h2>{{ $t('result.bazi') }}</h2>
      <div class="bazi-grid">
        <div class="bazi-pillar year">
          <div class="tian-gan">{{ result.bazi.year[0] }}</div>
          <div class="di-zhi">{{ result.bazi.year[1] }}</div><div class="label">{{ $t('result.year') }}</div>
        </div>
        <div class="bazi-pillar month">
          <div class="tian-gan">{{ result.bazi.month[0] }}</div>
          <div class="di-zhi">{{ result.bazi.month[1] }}</div>
          <div class="label">{{ $t('result.month') }}</div>
        </div>
        <div class="bazi-pillar day">
          <div class="tian-gan">{{ result.bazi.day[0] }}</div>
          <div class="di-zhi">{{ result.bazi.day[1] }}</div>
          <div class="label">{{ $t('result.day') }}</div>
        </div>
        <div class="bazi-pillar hour">
          <div class="tian-gan">{{ result.bazi.hour[0] }}</div>
          <div class="di-zhi">{{ result.bazi.hour[1] }}</div>
          <div class="label">{{ $t('result.hour') }}</div>
        </div>
      </div>
    </div>
    <!-- 格局分析 -->
    <div class="card">
      <h2>{{ $t('result.ju') }}</h2>
      <div class="ju-tags">
        <span class="tag" v-for="(ju, index) in result.ju" :key="index">{{ ju }}</span>
      </div>
      <div class="ju-description">
        <p>{{ getJuDescription(result.ju[0]) }}</p>
      </div>
    </div>
    <!-- 五行分析 -->
    <div class="card">
      <h2>{{ $t('result.wuxing') }}</h2>
      <div class="wuxing-chart" ref="wuxingChart"></div>
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
      <h2>{{ $t('result.shishen') }}</h2>
      <table class="shishen-table">
        <thead>
          <tr>
            <th>{{ $t('result.position') }}</th>
            <th>{{ $t('result.shishen') }}</th>
            <th>{{ $t('result.meaning') }}</th>
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
      <h2>{{ $t('result.twelveStages') }}</h2>
      <table class="twelve-table">
        <thead>
          <tr>
            <th>{{ $t('result.position') }}</th>
            <th>{{ $t('result.stage') }}</th>
            <th>{{ $t('result.meaning') }}</th>
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
      <h2>{{ $t('result.analysis') }}</h2>
      <div class="analysis-content">
        {{ getAnalysis() }}
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import gsap from 'gsap';

export default {
  props: {
    result: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      wuxingChart: null
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initWuxingChart();this.animateElements();
    });
  },
  watch: {
    result: {
      handler() {
        this.$nextTick(() => {
          if (this.wuxingChart) {
            this.wuxingChart.dispose();
          }
          this.initWuxingChart();
        });
      },
      deep: true
    }
  },
  methods: {
    initWuxingChart() {
      const chartDom = this.$refs.wuxingChart;
      if (!chartDom) return;
      this.wuxingChart = echarts.init(chartDom);
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'horizontal',
          bottom: 10,
          data: Object.keys(this.result.wuxingAnalysis.wuxingCount),
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
            data: Object.entries(this.result.wuxingAnalysis.wuxingCount).map(([name, value]) => ({
              name,
              value,
              itemStyle: {
                color: this.getWuxingColor(name)
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
      
      this.wuxingChart.setOption(option);
      
      window.addEventListener('resize', () => {
        if (this.wuxingChart) {
          this.wuxingChart.resize();
        }
      });
    },
    getWuxingColor(wuxing) {
      const colors = {
        '木': '#4CAF50', //绿色
        '火': '#FF5722', // 红色
        '土': '#FFC107', // 黄色
        '金': '#FFFFFF', // 白色
        '水': '#2196F3'  // 蓝色
      };
      return colors[wuxing] || '#888888';
    },
    formatPosition(position) {
      const posMap = {
        'year': this.$t('result.year'),
        'month': this.$t('result.month'),
        'day': this.$t('result.day'),
        'hour': this.$t('result.hour')
      };
      return posMap[position] || position;
    },
    formatShiShenPosition(key) {
      const parts = key.split('_');
      return `${this.formatPosition(parts[0])}${this.$t('result.tianGan')}`;
    },
    getJuDescription(ju) {
      const descriptions = {
        '伤官格': '伤官格为喜用神，表现为聪明伶俐，善于言辞，但需谨防过于锋芒毕露。',
        '印重格': '印重格为喜用神，表现为才华、学识丰富，受长辈提拔，但需防过于依赖他人。',
        '比肩格': '比肩格为喜用神，表现为个性刚强，有领导力，但需防过于刚愎自用。',
        '煞重格': '煞重格为喜用神，表现为权力欲强，有决断力，但需防过于专断。',
        '财旺格': '财旺格为喜用神，表现为经济头脑好，财运亨通，但需防贪欲过盛。',
        '平常格': '平常格无明显偏颇，性格平和，命运顺遂，各方面较为均衡发展。'
      };
      return descriptions[ju] || '暂无相关解释';
    },
    getShiShenMeaning(shishen) {
      const meanings = {
        '比肩': '代表竞争、合作、兄弟姐妹',
        '劫财': '代表争夺资源、朋友、兄弟姐妹',
        '食神': '代表才艺、口才、子女、享受',
        '伤官': '代表智慧、创造力、叛逆、子女',
        '偏财': '代表偏门财、意外之财',
        '正财': '代表正当财、工资收入',
        '偏印': '代表学习能力、知识、母亲',
        '正印': '代表文凭、官职、母亲',
        '七杀': '代表权威、压力、竞争',
        '正官': '代表规矩、纪律、权威'
      };
      return meanings[shishen] || '暂无解释';
    },
    getTwelveStageMeaning(stage) {
      const meanings = {
        '长生': '代表事物的开始，充满活力',
        '沐浴': '代表洗涤，调整',
        '冠带': '代表规范，整齐',
        '临官': '代表掌权，得势',
        '帝旺': '代表鼎盛，最强',
        '衰': '代表开始衰退',
        '病': '代表明显衰弱',
        '死': '代表终结',
        '墓': '代表埋藏',
        '绝': '代表断绝',
        '胎': '代表孕育',
        '养': '代表养育'
      };
      return meanings[stage] || '暂无解释';
    },
    animateElements() {
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
    },
    getAnalysis() {
      // 根据八字、五行、十神等综合分析
      let analysis = '根据您的八字：';
      analysis += `${this.result.bazi.year} ${this.result.bazi.month} ${this.result.bazi.day} ${this.result.bazi.hour}，`;
      
      // 加入五行分析
      const wuxingCounts = this.result.wuxingAnalysis.wuxingCount;
      const maxWuxing = Object.entries(wuxingCounts).sort((a, b) => b[1] - a[1])[0][0];
      const minWuxing = Object.entries(wuxingCounts).sort((a, b) => a[1] - b[1])[0][0];
      
      analysis += `您的命局中五行以${maxWuxing}为最旺，${minWuxing}为最弱。`;
      
      // 加入格局分析
      analysis += `您的八字属于${this.result.ju.join('、')}。${this.getJuDescription(this.result.ju[0])}`;
      
      return analysis;
    }
  }
};
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

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>