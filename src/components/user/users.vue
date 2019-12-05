<template>
    <div>
        <!--面包屑-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片区域-->
        <el-card>
            <!--搜索区域与添加区域,使用网格-->
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" :clearable="true" @clear="clearInput">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>
            <!--表格区域-->
            <el-table
                    :data="userList"
                    border
                    stripe
            >
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="username" label="姓名"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
                <el-table-column prop="role_name" label="角色"></el-table-column>
                <el-table-column label="状态">
                    <!--使用作用域插槽获取每一行数据,再展示mg_state用户状态，scope.row就是每行整个的json数据-->
                    <!--change事件出发switch的改变-->
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" @change="userChangeState(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <!--添加本行的修改删除之类的操作按钮的时候,我们也用作用域插槽,直接获取本行的数据,方便-->
                    <template slot-scope="scope">
                        <!--修改按钮-->
                        <el-button type="primary" icon="el-icon-edit" size="mini"
                                   @click="showEditDialog(scope.row.id)"></el-button>
                        <!--删除按钮-->
                        <el-button type="success" icon="el-icon-delete" size="mini"
                                   @click="removeUserById(scope.row.id)"></el-button>
                        <!--分配角色按钮-->
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini"
                                       @click="editUserRole(scope.row)"></el-button>
                        </el-tooltip>
                    </template>

                </el-table-column>
            </el-table>
            <!--分页区域-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[1, 10, 20,100]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>
        <!--添加用户的弹出框-->
        <el-dialog title="新增用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogCloses">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </div>
        </el-dialog>
        <!--修改用户信息的弹出框-->
        <el-dialog :visible.sync="editDialogVisible" width="50%" @close="editDialogCloses">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
                <el-form-item label="用户" prop="username">
                    <el-input v-model="editForm.username"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUser">确 定</el-button>
            </div>
        </el-dialog>

        <!--修改用户角色的弹出框-->
        <el-dialog title="分配角色" :visible.sync="editUserRoleDialog" width="50%" @close="editUserRoleDialogCloses">
            <div>
                <p>当前的用户：{{userInfo.username}}</p>
                <p>当前的角色：{{userInfo.role_name}}</p>
                <p>分配新角色：
                    <el-select v-model="selectedRoleId" placeholder="请选择">
                        <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
                        </el-option>
                    </el-select>
                </p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editUserRoleDialog = false">取 消</el-button>
                <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "users.vue",
        data() {
            let checkEmail = (rule, value, cb) => {
                const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
                if (regEmail.test(value)) {
                    return cb()
                }

                cb(new Error("请输入正确的邮箱地址"))
            };

            var checkMobile = (rule, value, cb) => {
                const regMobile = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,9]))[0-9]{8}$/;
                if (regMobile.test(value)) {
                    return cb()
                }
                cb(new Error("请输入正确的手机号"))
            };

            return {
                // 查询用户信息的参数,query是查询条件,pagenum是当前页,pagesize是每页条数
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 10
                },
                // 请求用户信息成功后保存到这
                userList: [],
                // 表格的总条数
                total: 0,
                // 弹出新增用户弹出框的属性
                addDialogVisible: false,
                // 弹出修改用户弹出框
                editDialogVisible: false,
                // 弹出修改用户角色的弹出框
                editUserRoleDialog: false,
                // 弹出的添加用户的form
                addForm: {
                    username: '',
                    password: '',
                    email: '',
                    mobile: ''
                },
                // 查询到的要修改的数据,弹出的修改用户的form
                editForm: {},
                // 添加自定义表单的验证规则对象，后2个邮箱和手机是自定义验证规则
                addFormRules: {
                    username: [
                        {required: true, message: '用户名不能为空', trigger: 'blur'},
                        {min: 2, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '密码不能为空', trigger: 'blur'},
                        {min: 2, max: 10, message: '密码长度不符', trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                        {validator: checkEmail, message: '邮箱格式不正确,请重新输入'}
                    ], mobile: [
                        {required: true, message: '请输入手机号码', trigger: 'blur'},
                        {validator: checkMobile, message: '手机号格式不正确,请重新输入'}
                    ]
                },
                // 修改用户的校验规则
                editFormRules: {
                    username: [
                        {required: true, message: '用户名不能为空', trigger: 'blur'},
                        {min: 2, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                        {validator: checkEmail, message: '邮箱格式不正确,请重新输入'}
                    ], mobile: [
                        {required: true, message: '请输入手机号码', trigger: 'blur'},
                        {validator: checkMobile, message: '手机号格式不正确,请重新输入'}
                    ]
                },
                // 需要被分配角色的用户信息
                userInfo: {},
                //  所有的角色信息
                rolesList: [],
                // 已选中的角色Id值
                selectedRoleId: ''
            }
        },
        created() {
            this.getUserList()
        },
        methods: {
            // 请求用户信息的axios,将请求参数单独的params属性传入的形式：针对请求参数比较多的get请求的情况下使用,当前页可以直接users/?id=1这样请求
            async getUserList() {
                const {data: res} = await this.axios.get('users', {params: this.queryInfo});
                if (res.meta.status !== 200) return this.$message.error("获取用户信息失败");
                // 如果返回状态正常,赋值给userList以及总页数
                this.userList = res.data.users;
                this.total = res.data.total;
            },
            // 清空查询内容出发的函数,再去请求查询
            clearInput() {
                this.getUserList()
            },
            // 更改用户状态的方法
            async userChangeState(row) {
                const {data: res} = await this.axios.put(`users/${row.id}/state/${row.mg_state}`);
                if (res.meta.status !== 200) {
                    // 如果修改失败,把switch的状态还原,返回报错
                    row.mg_state = !row.mg_state;
                    this.$message.error("修改状态失败");
                }
                // 如果修改成功重新加载数据
                this.$message.success("修改状态成功");
                this.getUserList()

            },
            // 该方法对应@size-change事件,代表每页显示的条数pagesize。用新的条数重新请求数据
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize;
                this.getUserList();
            },
            // 该方法对应@current-change事件,代表页码发生改变。用新的页码重新请求数据
            handleCurrentChange(current) {
                this.queryInfo.pagenum = current;
                this.getUserList();
            },
            // 关闭对话框重置表单:this.$$refs可以获取到ref="addFormRef"的表单，表单有个重置方法resetFields
            addDialogCloses() {
                this.$refs.addFormRef.resetFields();
            },
            // 点击弹出框的确定发送新增的表单数据
            addUser() {
                // 调用validate进行表单验证,提交的时候再做下校验
                this.$refs.addFormRef.validate(async valid => {
                    if (!valid) return this.$message.error("请填写正确的用户信息");
                    // 如果数据没问题发情添加请求
                    const {data: res} = await this.axios.post('users', this.addForm);
                    if (res.meta.status !== 201) return this.$message.error("添加用户失败：" + res.meta.msg);
                    // 添加成功
                    this.$message.success("添加用户成功");
                    // 隐藏对话框
                    this.addDialogVisible = false;
                    // 重新加载数据
                    this.getUserList()
                })
            },
            // 修改用户的弹出框事件,通过作用域插槽得到当前列用户的id
            async showEditDialog(id) {
                // 根据id查询用户,请求路径：users/:id
                const {data: res} = await this.axios.get('users/' + id);
                if (res.meta.status !== 200) return this.$message.error("获取用户信息失败");
                // 如果请求成功保存到editForm里
                this.editForm = res.data;
                // 打开弹窗展示数据
                this.editDialogVisible = true;
            },
            // 修改用户,取消重置数据,重新读取。
            editDialogCloses() {
                this.$refs.editFormRef.resetFields();
            },
            // 修改用户确认提交的方法
            editUser() {
                this.$refs.editFormRef.validate(async valid => {
                    if (!valid) return this.$message.error("请填写正确的用户信息");
                    const {data: res} = await this.axios.put('users/' + this.editForm.id, this.editForm);
                    if (res.meta.status !== 200) return this.$message.error("修改用户失败");
                    // 修改成功后关闭弹窗,重新刷新数据
                    this.$message.success("修改信息成功");
                    this.editDialogVisible = false;
                    this.getUserList()
                });

            },
            // 删除用户的方法
            async removeUserById(id) {
                //弹出确定取消框，是否删除用户
                const confirmResult = await this.$confirm('请问是否要永久删除该用户, 是否继续?', '删除提示', {
                    confirmButtonText: '确定删除',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err);

                if (confirmResult !== 'confirm') {
                    return this.$message.info("已取消删除")
                }
                const {data: res} = await this.axios.delete('users/' + id);
                if (res.meta.status !== 200) return this.$message.error("删除用户失败");
                this.$message.success("删除用户成功");
                this.getUserList();
            },
            // 给用户分配角色
            async editUserRole(userInfo) {
                // 先保存起来用户数据
                this.userInfo = userInfo;
                // 获取所有角色数据
                const {data: res} = await this.axios.get('roles');
                if (res.meta.status !== 200) return this.$message.error("获取角色数据失败");
                // 赋值后弹出修改角色的弹窗
                this.rolesList = res.data;
                this.editUserRoleDialog = true;
            },
            // 给用户更改角色保存的方法
            async saveRoleInfo() {
                const {data: res} = await this.axios.put(`users/${this.userInfo.id}/role`, {rid: this.selectedRoleId});
                if (res.meta.status !== 200) return this.$message.error("修改角色失败");
                this.$message.success('更新角色成功！');
                // 重新获取用户数据，关闭弹窗
                this.getUserList();
                this.editUserRoleDialog = false;
            },
            // 关闭用户分配角色弹出框, 清空数据
            editUserRoleDialogCloses() {
                this.selectedRoleId = '';
                this.userInfo = {}
            }
        }
    }
</script>

<style scoped>

</style>
