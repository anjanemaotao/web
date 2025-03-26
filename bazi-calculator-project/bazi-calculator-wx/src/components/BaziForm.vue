<template>
  <div class="bazi-form card">
    <h2>{{ $t('form.title') }}</h2>
    <div class="date-type-switch">
      <button 
        :class="['switch-btn', { active: isLunar }]" 
        @click="switchToLunar(true)"
      >农历</button>
      <button 
        :class="['switch-btn', { active: !isLunar }]" 
        @click="switchToLunar(false)"
      >阳历</button>
    </div>
    <div class="form-group">
      <label for="lunarYear">{{ $t('form.year') }}</label>
      <select id="lunarYear" v-model="form.lunarYear" required>
        <option v-for="year in years" :key="year.value" :value="year.value">{{ year.label }}</option>
      </select>
    </div><div class="form-group">
      <label for="lunarMonth">{{ $t('form.month') }}</label>
      <select id="lunarMonth" v-model="form.lunarMonth" required>
        <option v-for="month in months" :key="month.value" :value="month.value">{{ month.label }}</option>
      </select>
    </div><div class="form-group">
      <label for="lunarDay">{{ $t('form.day') }}</label>
      <select id="lunarDay" v-model="form.lunarDay" required>
        <option v-for="day in days" :key="day.value" :value="day.value">{{ day.label }}</option>
      </select>
    </div>
    
    <div class="form-group">
      <label for="hour">{{ $t('form.hour') }}</label>
      <select id="hour" v-model="form.hour" required>
        <option value="0">子时(23:00-01:00)</option>
        <option value="2">丑时 (01:00-03:00)</option>
        <option value="4">寅时 (03:00-05:00)</option>
        <option value="6">卯时 (05:00-07:00)</option>
        <option value="8">辰时 (07:00-09:00)</option>
        <option value="10">巳时 (09:00-11:00)</option>
        <option value="12">午时 (11:00-13:00)</option>
        <option value="14">未时 (13:00-15:00)</option>
        <option value="16">申时 (15:00-17:00)</option>
        <option value="18">酉时 (17:00-19:00)</option>
        <option value="20">戌时 (19:00-21:00)</option>
        <option value="22">亥时 (21:00-23:00)</option>
      </select>
    </div>
    
    <div class="form-actions">
      <button class="btn primary" @click="submitForm" :disabled="loading">
        {{ loading ? $t('form.calculating') : $t('form.calculate') }}
      </button><button class="btn secondary" @click="resetForm" :disabled="loading">
        {{ $t('form.reset') }}
      </button>
    </div>
  </div>
</template>

<script>
import gsap from 'gsap';
import LunarLib from 'lunar-javascript';
const { Lunar, LunarMonth, Solar } = LunarLib;

export default {
  watch: {
    'form.lunarYear'() {
      this.updateDaysInMonth();
    },
    'form.lunarMonth'() {
      this.updateDaysInMonth();
    }
  },

  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isLunar: true,
      form: {
        lunarYear: new Date().getFullYear(),
        lunarMonth: 1,
        lunarDay: 1,
        hour: 12
      },
      daysCache: {},  // 缓存每个年月的天数
      years: [],
      months: [
        { value: 1, label: '一月' },
        { value: 2, label: '二月' },
        { value: 3, label: '三月' },
        { value: 4, label: '四月' },
        { value: 5, label: '五月' },
        { value: 6, label: '六月' },
        { value: 7, label: '七月' },
        { value: 8, label: '八月' },
        { value: 9, label: '九月' },
        { value: 10, label: '十月' },
        { value: 11, label: '十一月' },
        { value: 12, label: '十二月' }
      ],
      days: [
        { value: 1, label: '初一' },
        { value: 2, label: '初二' },
        { value: 3, label: '初三' },
        { value: 4, label: '初四' },
        { value: 5, label: '初五' },
        { value: 6, label: '初六' },
        { value: 7, label: '初七' },
        { value: 8, label: '初八' },
        { value: 9, label: '初九' },
        { value: 10, label: '初十' },
        { value: 11, label: '十一' },
        { value: 12, label: '十二' },
        { value: 13, label: '十三' },
        { value: 14, label: '十四' },
        { value: 15, label: '十五' },
        { value: 16, label: '十六' },
        { value: 17, label: '十七' },
        { value: 18, label: '十八' },
        { value: 19, label: '十九' },
        { value: 20, label: '二十' },
        { value: 21, label: '廿一' },
        { value: 22, label: '廿二' },
        { value: 23, label: '廿三' },
        { value: 24, label: '廿四' },
        { value: 25, label: '廿五' },
        { value: 26, label: '廿六' },
        { value: 27, label: '廿七' },
        { value: 28, label: '廿八' },
        { value: 29, label: '廿九' },
        { value: 30, label: '三十' }
      ]
    };
  },
  created() {
    // 生成年份范围（1900-2100）
    for (let year = 1900; year <= 2100; year++) {
      this.years.push({
        value: year,
        label: `${year}年(${this.getChineseZodiac(year)})`
      });
    }
    // 默认选择今年
    this.form.lunarYear = new Date().getFullYear();
    // 更新当前月份的天数
    this.updateDaysInMonth();
  },
  methods: {
    // 获取生肖
    getChineseZodiac(year) {
      const zodiacList = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
      return zodiacList[(year - 1900) % 12];
    },
    // 计算农历月份的天数
    updateDaysInMonth() {
      const cacheKey = `${this.form.lunarYear}-${this.form.lunarMonth}`;
      
      // 检查缓存中是否已有计算结果
      if (!this.daysCache[cacheKey]) {
        const lunarMonth = LunarMonth.fromYm(this.form.lunarYear, this.form.lunarMonth);
        this.daysCache[cacheKey] = lunarMonth.getDayCount();
      }
      
      const daysInMonth = this.daysCache[cacheKey];
      
      // 更新天数选项
      this.days = Array.from({length: daysInMonth}, (_, i) => {
        const day = i + 1;
        return {
          value: day,
          label: this.isLunar ? this.getChineseDayLabel(day) : this.getSolarDayLabel(day)
        };
      });

      // 如果当前选择的日期超过了这个月的最大天数，则调整为最后一天
      if (this.form.lunarDay > daysInMonth) {
        this.form.lunarDay = daysInMonth;
      }
    },

    // 将数字转换为中文日期表示
    getChineseDayLabel(day) {
      const labels = [
        '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
        '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
        '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
      ];
      return labels[day - 1];
    },

    submitForm() {
      if (this.loading) return;
      // 添加计算动画
      const buttons = document.querySelectorAll('.form-actions .btn');
      gsap.to(buttons, {
        scale: 0.95,
        duration: 0.2,
        yoyo: true,
        repeat: 1
      });
      
      // 延迟一下再发送，以便展示动画
      const formData = { ...this.form };
      if (!this.isLunar) {
        // 如果是阳历输入，转换为农历后再发送
        const solar = Solar.fromYmd(formData.lunarYear, formData.lunarMonth, formData.lunarDay);
        const lunar = solar.getLunar();
        formData.lunarYear = lunar.getYear();
        formData.lunarMonth = lunar.getMonth();
        formData.lunarDay = lunar.getDay();
      }
      this.$emit('calculate', formData);
    },
    resetForm() {
      this.form = {
        lunarYear: new Date().getFullYear(),
        lunarMonth: 1,
        lunarDay: 1,
        hour: 12
      };
      this.isLunar = true;
      this.updateDaysInMonth();
    },

    // 获取阳历日期标签
    getSolarDayLabel(day) {
      return `${day}日`;
    },

    // 获取阳历月份标签
    getSolarMonthLabel(month) {
      return `${month}月`;
    },

    // 更新日期显示格式
    updateDateFormat() {
      if (this.isLunar) {
        // 农历格式
        this.months = [
          { value: 1, label: '一月' },
          { value: 2, label: '二月' },
          { value: 3, label: '三月' },
          { value: 4, label: '四月' },
          { value: 5, label: '五月' },
          { value: 6, label: '六月' },
          { value: 7, label: '七月' },
          { value: 8, label: '八月' },
          { value: 9, label: '九月' },
          { value: 10, label: '十月' },
          { value: 11, label: '十一月' },
          { value: 12, label: '十二月' }
        ];
      } else {
        // 阳历格式
        this.months = Array.from({length: 12}, (_, i) => ({
          value: i + 1,
          label: this.getSolarMonthLabel(i + 1)
        }));
      }
      this.updateDaysInMonth();
    },

    switchToLunar(isLunar) {
      if (this.isLunar === isLunar) return;
      
      const currentForm = { ...this.form };
      if (isLunar) {
        // 从阳历转农历
        const solar = Solar.fromYmd(currentForm.lunarYear, currentForm.lunarMonth, currentForm.lunarDay);
        const lunar = solar.getLunar();
        this.form.lunarYear = lunar.getYear();
        this.form.lunarMonth = lunar.getMonth();
        this.form.lunarDay = lunar.getDay();
      } else {
        // 从农历转阳历
        const lunar = Lunar.fromYmd(currentForm.lunarYear, currentForm.lunarMonth, currentForm.lunarDay);
        const solar = lunar.getSolar();
        this.form.lunarYear = solar.getYear();
        this.form.lunarMonth = solar.getMonth();
        this.form.lunarDay = solar.getDay();
      }
      this.isLunar = isLunar;
      this.updateDateFormat();
    }
  }
};
</script>

<style scoped>
.bazi-form {
  position: relative;
  overflow: hidden;
}

.bazi-form::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--card-bg);
  color: var(--text-color);
  font-size: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
}

.btn.primary {
  background-color: var(--primary-color);
  color: white;
}

.btn.secondary {
  background-color: var(--secondary-color);
  color: white;
}

.btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.date-type-switch {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.switch-btn {
  padding: 0.5rem 1.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: transparent;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.3s ease;
}

.switch-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.switch-btn:hover {
  opacity: 0.9;
}
</style>