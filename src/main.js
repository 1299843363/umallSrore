// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false


// 1.reset.css
import "./assets/css/reset.css"

// 2.pages

// 3.公共组件
import "./components"

// 4.数据交互 utils/http.js

// 5.过滤器
import "./filters"

// 6.仓库
import store from "./store"

// 7.UI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
