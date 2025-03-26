<template>
  <header class="app-header">
    <div class="logo">
      <img src="/images/logo.png" alt="Logo" />
      <span>{{ t('app.title') }}</span>
    </div>
    
    <div class="actions">
      <div class="language-selector">
        <button class="language-btn" :class="{ active: locale === 'zh-TW' }" @click="changeLanguage('zh-TW')">繁體</button>
        <button class="language-btn" :class="{ active: locale === 'zh-CN' }" @click="changeLanguage('zh-CN')">简体</button>
        <button class="language-btn" :class="{ active: locale === 'en' }" @click="changeLanguage('en')">EN</button><button class="language-btn" :class="{ active: locale === 'ja' }" @click="changeLanguage('ja')">日本語</button>
        <button class="language-btn" :class="{ active: locale === 'ko' }" @click="changeLanguage('ko')">한국어</button>
      </div>
      <button class="theme-toggle" @click="$emit('toggle-theme')">
        <span class="theme-icon">🔆</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { useI18n } from 'vue-i18n'; // 修改：使用useI18n

const { t, locale } = useI18n();

const emit = defineEmits(['toggle-theme', 'change-language']);

const changeLanguage = (lang) => {
  emit('change-language', lang);
};
</script>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: var(--card-bg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo img {
  height: 40px;
}

.logo span {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
}

.actions {
  display: flex;
  gap: 20px;
  align-items: center;
}

.language-selector {
  display: flex;
  gap: 5px;
}

.language-btn {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  background: none;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--text-color);
  opacity: 0.7;
  transition: all 0.3s ease;
}

.language-btn:hover {
  opacity: 1;
}

.language-btn.active {
  background-color: var(--primary-color);
  color: white;
  opacity: 1;
}

.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
  .actions {
    width: 100%;
    justify-content: center;
  }.language-selector {
    flex-wrap: wrap;justify-content: center;
  }
}
</style>