<template>
  <div class="bazi-form card">
    <h2>{{ $t('form.title') }}</h2>
    <div class="form-group">
      <label for="lunarYear">{{ $t('form.year') }}</label>
      <select id="lunarYear" v-model="form.lunarYear" required>
        <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
      </select>
    </div><div class="form-group">
      <label for="lunarMonth">{{ $t('form.month') }}</label>
      <select id="lunarMonth" v-model="form.lunarMonth" required>
        <option v-for="month in 12" :key="month" :value="month">{{ month }}</option>
      </select>
    </div><div class="form-group">
      <label for="lunarDay">{{ $t('form.day') }}</label>
      <select id="lunarDay" v-model="form.lunarDay" required>
        <option v-for="day in 30" :key="day" :value="day">{{ day }}</option>
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

export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        lunarYear: new Date().getFullYear(),
        lunarMonth:1,
        lunarDay: 1,
        hour: 12
      },
      years: []
    };
  },
  created() {
    // 生成年份范围（1900-2100）
    for (let year = 1900; year <= 2100; year++) {
      this.years.push(year);
    }// 默认选择今年
    this.form.lunarYear = new Date().getFullYear();
  },
  methods: {
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
      this.$emit('calculate', { ...this.form });
    },
    resetForm() {
      this.form = {
        lunarYear: new Date().getFullYear(),
        lunarMonth: 1,
        lunarDay: 1,
        hour: 12
      };
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
</style>