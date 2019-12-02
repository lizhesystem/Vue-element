<template>
    <el-container class="home_container">
        <!--头部区域-->
        <el-header>
            <div class="header_style">
                <div class="my_logo"></div>
                <p>MyPro</p>
            </div>
            <el-button type="primary" @click="logout">退出</el-button>
        </el-header>
        <!--页面主体-->
        <el-container>
            <!--左侧边栏-->
            <el-aside width="200px">
                <!--侧边栏区域-->
                <el-menu
                        default-active="2"
                        class="el-menu-vertical-demo"
                >
                    <!--一级菜单-->
                    <el-submenu :index="item.id" v-for="item in Menulist" :key="item.id">
                        <!--一级菜单模板区域-->
                        <template slot="title">
                            <!--图标-->
                            <i class="el-icon-location"></i>
                            <!--文本-->
                            <span>{{ item.authName}}</span>
                        </template>
                        <!--二级菜单-->
                        <el-menu-item index="1-1">
                            <!--二级菜单模板区域-->
                            <template slot="title">
                                <!--图标-->
                                <i class="el-icon-location"></i>
                                <!--文本-->
                                <span>导航一</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!--右侧内容主体-->
            <el-main>Main</el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        name: "home",
        data() {
            return {
                Menulist: []
            }
        },
        created() {
            // 获取菜单栏
            this.getMenuList();
        },
        methods: {
            logout() {
                window.sessionStorage.clear();
                this.$router.push('/login')  // 路由跳转至登录页
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
        background-color: #157BD7;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .header_style {
            display: flex;
            align-items: center;
            color: #df5000;

            .my_logo {
                height: 40px;
                width: 40px;
                background-color: #FFF143;
                border-radius: 30%;
            }

            > p {
                margin-left: 10px;
            }
        }


    }

    .el-aside {
        background-color: #1396E7;
    }

    .el-main {
        background-color: #F4F4F7;
    }

</style>
