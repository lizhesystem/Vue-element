# 问题记录
项目中新接触的知识点
---
1. vue-cli的使用和搭建,还可以玩图形界面。
2. 整体项目搭建部分和之前的商场项目一样,单页面应用一个App.vue里加载一个`<router-view></router-view>`剩下的都渲染进去,
在main.js的vue对象里render后再`.$mount`来实现挂载index.html的app类后再挂载app组件。需要注意的点:
    - 使用一个全局的global.css来渲染#app的样式,铺满。
    - 按需导入element-ui组件,参考官方文档。
    - 需要用到的js都导入到main.js里。主js文件。
3. 新学习了【路由守卫】模式来进行访问路由之前是否有token,进而执行接下来的操作。
4. 新学习【axios的请求拦截器】,请求的时候在headers里加个`Authorization`标识传token,这样后端在收到请求的时候判断是否有token,如果没有就返回参数错误，相当于是个"令牌"一样，类似于之前学习springcloud的网关一样，可以参考下自己的项目也可以使用。
5. flex布局真的好用，以后有时间好好学习下。
6. 作用域插槽真好使。
7. 复杂的权限。