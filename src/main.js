import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/Font/iconfont.css'
import axios from './utils/http';
// global css
import '@/styles/index.scss'
Vue.config.productionTip = false
Vue.prototype.$axios = axios;

Vue.use(ElementUI)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
