import Vue from 'vue'
import App from './App.vue'
import router from './router';

// 导入全局样式和按需导入element
import './assets/css/global.css'
// import './plugins/element.js'

// 导入字体图标
import './assets/fonts/iconfont.css'

// 配置请求的api地址
// 导入axios,axios不是一个插件所以不能Vue.use使用，vue-axios是个插件。
import axios from 'axios'
import VueAxios from 'vue-axios'

// 导入富文本编辑器editor
import VueQuillEditor from 'vue-quill-editor'
// require styles
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor);

// 导入三方的table-tree插件
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable);

// 导入进度条插件
import NProgress from 'nprogress'
//导入进度条样式
// import 'nprogress/nprogress.css'

Vue.use(VueAxios, axios);
// axios公共基路径，以后所有的请求都会在前面加上这个路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';

// 设置表单提交方式，默认是json --这个配置会影响form表单的提交,给注释了。
// axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';

// 接口文档要求 ，必须在请求头中使用 `Authorization` 字段提供 `token` 令牌,才能访问数据
// axios的请求拦截器
axios.interceptors.request.use(config => {
    //当进入request拦截器，表示发送了请求，我们就开启进度条
    NProgress.start();
    config.headers.Authorization = window.sessionStorage.getItem('token');
    return config
});

axios.interceptors.response.use(config => {
    //当进入response拦截器，表示请求已经结束，我们就结束进度条
    NProgress.done();
    return config
});



// 公共的过滤器
Vue.filter('dateFormat', function (originVal) {
    const dt = new Date(originVal);

    const y = dt.getFullYear();
    const m = (dt.getMonth() + 1 + '').padStart(2, '0');
    const d = (dt.getDate() + '').padStart(2, '0');

    const hh = (dt.getHours() + '').padStart(2, '0');
    const mm = (dt.getMinutes() + '').padStart(2, '0');
    const ss = (dt.getSeconds() + '').padStart(2, '0');

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
});

// 消息提示的环境配置，设置为开发环境或者生产环境
Vue.config.productionTip = false;

new Vue({
    router,
    render:
        h => h(App),
}).$mount('#app');
