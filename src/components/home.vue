<template>
    <el-container class="home_container">
        <!--头部区域-->
        <el-header>
            <!--顶部logo-->
            <div class="header_style">
                <p @click="gobackHome">MyPro</p>
                <span :class=" MenuFlag? CollapseClass[0] :CollapseClass[1]" @click="getMenu"></span>
            </div>
            <!--退出按钮-->
            <el-button type="info" size="mini" plain @click="logout">退出</el-button>
        </el-header>

        <!--页面主体-->
        <el-container>
            <!--左侧边栏-->
            <el-aside :width="MenuFlag? '64px' : '200px' ">
                <!--侧边栏区域-->
                <!--router属性设置为true,我们点击二级菜单的时候，就会根据菜单的index属性进行路由跳转,看下面: :index=" '/' + inner.path"-->
                <el-menu
                        :default-active="$route.path"
                        class="el-menu-vertical-demo"
                        unique-opened
                        active-text-color="#409EFF"
                        background-color="#222D32"
                        text-color="#fff"
                        :collapse="MenuFlag"
                        :collapse-transition="false"
                        router
                        :default-openeds="emptyArr"
                >
                    <!--一级菜单-->
                    <!--备注:index需要时字符串格式,但是我不使用字符串看也没啥问题-->
                    <el-submenu class="menu_icon" :index="item.id + ''" v-for="item in Menulist" :key="item.id">
                        <!--一级菜单模板区域-->
                        <template slot="title">
                            <!--图标-->
                            <i :class="Menuico[item.id]"></i>
                            <!--文本-->
                            <span>{{ item.authName}}</span>
                        </template>
                        <!--二级菜单-->
                        <el-menu-item :index=" '/' + inner.path" v-for="inner in item.children" :key="inner.id">
                            <!--二级菜单模板区域-->
                            <template slot="title">
                                <!--图标-->
                                <i class="el-icon-location"></i>
                                <!--文本-->
                                <span>{{ inner.authName }}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!--右侧内容主体-->
            <el-main>
                <!-- 路由占位符 -->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        name: "home",
        data() {
            return {
                Menulist: [],
                Menuico: {
                    '125': 'iconfont icon-user',
                    '103': 'iconfont icon-tijikongjian',
                    '101': 'iconfont icon-shangpin',
                    '102': 'iconfont icon-danju',
                    '145': 'iconfont icon-baobiao'
                },
                CollapseClass: {
                    '0': 'el-icon-s-fold',
                    '1': 'el-icon-s-unfold'
                },
                MenuFlag: false,
                // 定义空字符串,用来点logo折叠菜单
                emptyArr: ''
            }
        },
        created() {
            // 获取菜单栏
            this.getMenuList();
        },
        methods: {
            // 删除token,路由跳转至登录页
            logout() {
                window.sessionStorage.clear();
                this.$router.push('/login')
            },
            // 点击按钮切换菜单的折叠和展开
            getMenu() {
                this.MenuFlag = !this.MenuFlag
            },
            // 点击logo跳转到首页,为啥不用go是因为go会刷新页面这个push不会刷新,但是有个小bug在router.js处理下就好了
            // 原本是个空字符串,点击给他个空数组,default-openeds属性看是空数组就给折叠了- -。卡了好久
            gobackHome() {
                this.$router.push('/home');
                this.emptyArr = [];
            },
            handleClose(key, keyPath) {
                // eslint-disable-next-line no-console
                console.log(key, keyPath);
            },
            // 调API获取菜单栏的方法
            async getMenuList() {
                const {data: res} = await this.axios.get('menus');
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
                this.Menulist = res.data
            }
        }
    }
</script>


<style lang="scss" scoped>
    .home_container {
        height: 100%;
    }

    /*头部logo和文字*/
    .el-header {
        background-color: #18BC9C;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .header_style {
            display: flex;
            align-items: center;
            color: #ffffff;

            > p {
                font-size: 20px;
                font-weight: 700;
                cursor: pointer;
            }

            /*折叠菜单*/
            span {
                font-size: 20px;
                margin-left: 80px;
                cursor: pointer;
            }

            span:hover {
                color: #222D32;
            }
        }


    }

    /*菜单icon*/
    .iconfont {
        margin-right: 10px;
        font-size: 25px;
    }

    .el-aside {
        background-color: #222D32;
    }

    .el-main {
        background-color: #F1F4F6;
    }

    /*去除多余的边框*/
    .el-menu {
        border-right: none;
    }

</style>
