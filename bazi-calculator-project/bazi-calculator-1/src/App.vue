<template>
  <div class="app-container" :class="{ 'dark-mode': darkMode }">
    <header-component @toggle-theme="toggleTheme" @change-language="changeLanguage" />
    
    <main class="content-container">
      <div class="intro-section">
        <h1>{{ t('app.title') }}</h1>
        <p>{{ t('app.subtitle') }}</p></div><div class="main-content">
        <div class="input-section">
          <bazi-form @calculate="calculateBazi" :loading="loading" />
        </div>
        
        <div class="result-section" v-if="baziResult">
          <bazi-result :result="baziResult" />
        </div>
      </div>
    </main>
    
    <footer-component />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useI18n } from 'vue-i18n'; // 修改：使用useI18n
import HeaderComponent from './components/HeaderComponent.vue';
import FooterComponent from './components/FooterComponent.vue';
import BaziForm from './components/BaziForm.vue';
import BaziResult from './components/BaziResult.vue';
import { calculateFullBazi } from './utils/baziCalculator';
import gsap from 'gsap';

// 修改：使用Composition API的i18n
const { t, locale } = useI18n();

const darkMode = ref(false);
const baziResult = ref(null);
const loading = ref(false);
const error = ref(null);

const toggleTheme = () => {
  darkMode.value = !darkMode.value;localStorage.setItem('darkMode', darkMode.value ? '1' : '0');
};

const changeLanguage = (lang) => {
  locale.value = lang;
  localStorage.setItem('language', lang);
};

const calculateBazi = (formData) => {
  loading.value = true;
  error.value = null;
  
  try {
    // 直接调用本地计算函数而非API
    setTimeout(() => {
      const result = calculateFullBazi(
        formData.lunarYear,
        formData.lunarMonth,
        formData.lunarDay,
        formData.hour
      );
      baziResult.value = result;
      // 动画效果
      nextTick(() => {
        const resultElement = document.querySelector('.result-section');
        if (resultElement) {
          gsap.fromTo(resultElement,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
          );
        }
      });
      loading.value = false;
    }, 800); // 模拟计算时间，增强用户体验
  } catch (err) {
    error.value = err.message || '计算过程中发生错误';
    console.error('Error:', err);loading.value = false;
  }
};

onMounted(() => {
  // 从本地存储加载主题和语言设置
  const savedDarkMode = localStorage.getItem('darkMode');
  if (savedDarkMode) {
    darkMode.value = savedDarkMode === '1';
  }
  
  const savedLanguage = localStorage.getItem('language');
  if (savedLanguage) {
    locale.value = savedLanguage;
  }
});
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.content-container {
  flex: 1;padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;width: 100%;
}

.intro-section {
  text-align: center;
  margin-bottom: 2rem;
}

.intro-section h1 {
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.intro-section p {
  font-size: 1.2rem;
  color: var(--secondary-color);
}

.main-content {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.input-section, .result-section {
  flex: 1;
  min-width: 300px;
}

@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }
}
</style>