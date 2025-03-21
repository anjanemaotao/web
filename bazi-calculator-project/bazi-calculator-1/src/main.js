import { createApp } from 'vue';
import App from './App.vue';
import i18n from './i18n';
import './assets/main.css';

// 开场动画
document.addEventListener('DOMContentLoaded', () => {
  const loader = document.querySelector('.app-loader');
  if (loader) {
    // 1秒后隐藏加载动画
    setTimeout(() => {
      loader.classList.add('hidden');// 动画结束后移除loader
      setTimeout(() => {
        loader.remove();
      }, 500);
    }, 1000);
  }
});

// 创建应用实例
const app = createApp(App);

// 注册国际化
app.use(i18n);

// 挂载应用
app.mount('#app');