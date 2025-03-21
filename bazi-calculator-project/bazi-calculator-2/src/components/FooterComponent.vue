<template>
  <footer class="app-footer">
    <div class="footer-content">
      <div class="copyright">
        © {{ new Date().getFullYear() }} {{ t('footer.copyright') }}
      </div>
      
      <div class="links">
        <a href="#about">{{ t('footer.about') }}</a>
        <a href="#terms">{{ t('footer.terms') }}</a>
        <a href="#privacy">{{ t('footer.privacy') }}</a>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<style scoped>
.app-footer {
  background-color: var(--card-bg);
  padding: 1.5rem 2rem;
  margin-top: 2rem;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.05);
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;max-width: 1200px;
  margin: 0 auto;
}

.copyright {
  opacity: 0.8;
}

.links {
  display: flex;
  gap: 20px;
}

.links a {
  color: var(--secondary-color);
  text-decoration: none;
  transition: color 0.2s ease;
}

.links a:hover {
  color: var(--primary-color);text-decoration: underline;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>