import Vue from 'vue'
import VueRouter from 'vue-router'


// import Login from "./components/login.vue";
// import Home from "./components/home.vue"
// import Welcome from "./components/welcome.vue"
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ './components/login.vue');
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ './components/home.vue');
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ './components/welcome.vue');



// import Users from "./components/user/users.vue"
// import Rights from "./components/power/rights.vue"
// import Roles from "./components/power/roles.vue"
const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ './components/user/users.vue');
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ './components/power/rights.vue');
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ './components/power/roles.vue');


// import Cate from "./components/goods/cate.vue"
// import Params from "./components/goods/params.vue"
const Cate = () => import(/* webpackChunkName: "Cate_Params" */ './components/goods/cate.vue');
const Params = () => import(/* webpackChunkName: "Cate_Params" */ './components/goods/params.vue');


// import GoodLists from "./components/goods/goodlist.vue"
// import Add from "./components/goods/add.vue"
const GoodLists = () => import(/* webpackChunkName: "GoodsList_Add" */ './components/goods/goodlist.vue');
const Add = () => import(/* webpackChunkName: "GoodsList_Add" */ './components/goods/add.vue');


// import orders from "./components/order/orders.vue"
// import Report from "./components/report/report.vue"
const orders = () => import(/* webpackChunkName: "Order_Report" */ './components/order/orders.vue');
const Report = () => import(/* webpackChunkName: "Order_Report" */ './components/report/report.vue');


Vue.use(VueRouter);
// 路由对象
const router = new VueRouter({
    routes: [
        {path: '/', redirect: '/login'},
        {path: '/login', component: Login},
        {
            path: '/home', component: Home, redirect: '/welcome',
            children: [
                {path: '/welcome', component: Welcome},
                {path: '/users', component: Users},
                {path: '/rights', component: Rights},
                {path: '/roles', component: Roles},
                {path: '/categories', component: Cate},
                {path: '/params', component: Params},
                {path: '/goods', component: GoodLists},
                {path: '/goods/add', component: Add},
                {path: '/orders', component: orders},
                {path: '/reports', component: Report},
            ]
        }
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

/**
 * 重写路由的push方法,用来点图标跳转到首页
 */
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
};

export default router
