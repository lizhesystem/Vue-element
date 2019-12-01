import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "./components/login";


Vue.use(VueRouter);
// 路由对象
const router = new VueRouter({
    routes: [
        {path: '/', redirect: '/login'},
        {path: '/login', component: Login}
    ]
    // export default 在一个模块里只能有一个，但是export可以有多个
    // 模块中通过export 导出的(属性或者方法)可以修改，但是通过export default导出的不可以修改
});


export default router
