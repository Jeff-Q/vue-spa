import Vue from 'vue'
// 导入axios
import axios from 'axios'

// 设置根路径

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

axios.interceptors.request.use(config => {
  config.headers.common['Authorization'] = sessionStorage.getItem('token')
  return config
})

// 把axios 挂到VUE 原型上
Vue.prototype.$http = axios
