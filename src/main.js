import Vue from 'vue'
import App from './App.vue'
import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css'
import router from './router'
import store from './store/index'

import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)

import forbid from './utils/forbid'
forbid();

Vue.config.productionTip = false
Vue.use(ViewUI)



new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')
