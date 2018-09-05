import Vue from 'vue'
import axios from 'axios'
import App from './App'
import router from './router'
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import global from './js/global.js'
import startOnBoot from './js/start-windows.js';
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.prototype.$axios = axios
Vue.prototype.$global = global
Vue.config.productionTip = false
Vue.use(ElementUi)
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  template: '<App/>'
}).$mount('#app')
//开机自启
// startOnBoot.enableAutoStart('client', 'C:\Users\Admin\AppData\Local\Programs\pass\client.exe');
startOnBoot.enableAutoStart('client', process.execPath);