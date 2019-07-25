import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import './assets/fonts/iconfont.css'
import router from './router/router.js'
import Treetable from 'vue-table-with-tree-grid'
import vueQuillEdoter from 'vue-quill-editor'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.component('tree-table', Treetable)
Vue.use(vueQuillEdoter)

Vue.filter('dateFormat', function(originVal) {
    const dt = new Date(originVal)

    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')

    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.config.productionTip = false
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')