<template>
    <div class="login_container">
        <div class="login_box">
            <!--头像区域-->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!--登录表单区域-->
            <el-form
                    ref="loginFormRef"
                    :model="loginForm"
                    label-width="0px"
                    class="form_login"
                    :rules="loginFormRules"
            >
                <!--用户名-->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
                </el-form-item>
                <!--密码-->
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima"
                              type="password"></el-input>
                </el-form-item>
                <!--按钮区域-->
                <el-form-item class="form_button">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "login",
        data() {
            return {
                // 登录表单数据绑定对象
                loginForm: {
                    username: '',
                    password: ''
                },
                // 表单验证规则对象
                loginFormRules: {
                    // required代表必填,trigger代表失去焦点的时候效验
                    username: [
                        {required: true, message: '用户名不能为空', trigger: 'blur'},
                        {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '密码不能为空', trigger: 'blur'},
                        {min: 3, max: 10, message: '密码长度不符', trigger: 'blur'}
                    ],
                }
            }
        },
        methods: {
            // 重置登录表单
            resetLoginForm() {
                this.$refs.loginFormRef.resetFields();
            },
            login() {
                this.$refs.loginFormRef.validate(async valid => {
                    if (!valid) return;

                    // 1：以前默认使用的axios请求方法获取数据,使用promise的then方式得到异步请求结果
                    // this.axios.post('login', this.loginForm).then(resp => {
                    //     // eslint-disable-next-line no-console
                    //     console.log(resp)
                    // })

                    // 2：使用async/await方式获取,因为await得到的是posmise对象。
                    //  解构对象重命名
                    const {data: res} = await this.axios.post('login', this.loginForm);
                    // eslint-disable-next-line no-console
                    if (res.mata.status !== 200) return console.log("登录失败")

                })
            }
        }
    }
</script>

<!--scoped代表当前组件的样式-->
<style lang="scss" scoped>
    .login_container {
        background-color: #2b4b6b;
        height: 100%;
        display: flex;
        justify-content: center; /* 水平居中 */
        align-items: center; /* 垂直居中 */
    }

    /*登录界面样式和logo*/
    .login_box {
        height: 300px;
        width: 450px;
        background-color: #fff;
        border-radius: 3px;
        position: relative;

        .avatar_box {
            height: 130px;
            width: 130px;
            border: 1px solid #eeeeee;
            border-radius: 50%;
            padding: 10px;
            box-shadow: 1px 1px 2px 2px #d8d8d8;
            position: absolute;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #fff;

            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #eee;
            }
        }
    }

    /*登录表单*/
    .form_login {
        position: absolute;
        bottom: 0;
        padding: 0 20px;
        width: 100%;
        box-sizing: border-box;
    }

    .form_button {
        display: flex;
        justify-content: flex-end;
    }
</style>
