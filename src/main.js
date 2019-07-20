import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import './assets/fonts/iconfont.css'
import router from './router/router.js'
Vue.config.productionTip = false
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')