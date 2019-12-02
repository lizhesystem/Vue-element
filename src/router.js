import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "./components/login.vue";
import Home from "./components/home.vue"


Vue.use(VueRouter);
// 路由对象
const router = new VueRouter({
    routes: [
        {path: '/', redirect: '/login'},
        {path: '/login', component: Login},
        {path: '/home', component: Home}
    ]
    // export default 在一个模块里只能有一个，但是export可以有多个
    // 模块中通过export 导出的(属性或者方法)可以修改，但是通过export default导出的不可以修改
});

// 创建一个路由守卫来放置没有token跳转到其他页面。
/**
 * to:代表即将要进入的目标，也就是要访问的路径的路由对象。
 * form：代表从哪个路径跳转而来
 * next:表示放行，这是个函数！！！！ 记得加()，next()表示放行。next('/login')表示强制跳转
 */
router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next();  //如果路由是login,啥都不做直接return,然后跳转执行
    // 获取token
    const token = window.sessionStorage.getItem('token');
    if (!token) return next('/login');    // 如果token不存在,啥都不做直接return,然后跳转到login
    next();                                   // 如果token存在,放行
});

export default router
