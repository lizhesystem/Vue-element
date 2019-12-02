import Vue from 'vue'
import App from './App.vue'
import router from './router';

// 导入全局样式和按需导入element
import './assets/css/global.css'
import './plugins/element.js'

// 导入字体图标
import './assets/fonts/iconfont.css'

// 配置请求的api地址
// 导入axios,axios不是一个插件所以不能Vue.use使用，vue-axios是个插件。
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios);
// axios公共基路径，以后所有的请求都会在前面加上这个路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';

// 设置表单提交方式，默认是json --这个配置会影响form表单的提交,给注释了。
// axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';

// 接口文档要求 ，必须在请求头中使用 `Authorization` 字段提供 `token` 令牌,才能访问数据
// axios的请求拦截器
axios.interceptors.request.use(config => {
    // eslint-disable-next-line no-console
    config.headers.Authorization = window.sessionStorage.getItem('token');
    return config
});


// 消息提示的环境配置，设置为开发环境或者生产环境
Vue.config.productionTip = false;

new Vue({
    router,
    render:
        h => h(App),
}).$mount('#app');
