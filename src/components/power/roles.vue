<template>
    <div>
        <!--面包屑-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片区域-->
        <el-card>
            <!-- 添加角色按钮区域 -->
            <el-button type="primary" @click="addDialogVisible=true">添加角色</el-button>
            <!--角色表格区域-->
            <el-table
                    :data="RolesList"
                    border
                    stripe
            >
                <el-table-column type="expand">
                    <!--添加展开列,这里查看文档发现作用域插槽可以用v-slot表示-->
                    <template v-slot="scope">
                        <!--row里面包含2个col，24网格分为5和19，样式的话根据索引判断是否头上的横线，还有居中显示的样式-->
                        <el-row :class="['bdbottom',index === 0 ? 'bdtop':'' ,'vcenter']"
                                v-for="(item1,index) in scope.row.children" :key="item1.id">
                            <!--渲染一级权限-->
                            <el-col :span="5">
                                <!--一级权限的tag-->
                                <el-tag closable @close="removerightsByid(scope.row,item1.id)">
                                    {{ item1.authName}}
                                </el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!--渲染二级和三级权限，col里还可以包含row再去按照24去分6和18-->
                            <el-col :span="19">
                                <el-row :class="[i2 === 0 ? '':'bdtop','vcenter']"
                                        v-for="(item2,i2) in item1.children" :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag closable @close="removerightsByid(scope.row,item2.id)" type="success">
                                            {{ item2.authName}}
                                        </el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <!--三级权限不用row,直接在tag里循环-->
                                    <el-col :span="18">
                                        <el-tag closable @close="removerightsByid(scope.row,item3.id)" type="warning"
                                                v-for="item3 in item2.children" :key="item3.id">
                                            {{ item3.authName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>


                    </template>
                </el-table-column>
                <el-table-column type="index" label="序列" width="55px"></el-table-column>
                <el-table-column prop="roleName" label="角色名称"></el-table-column>
                <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
                <el-table-column label="操作">
                    <!--使用作用域插槽获取每一行数据,scope.row就是每行的json数据-->
                    <template v-slot="scope">
                        <!--修改角色-->
                        <el-button type="primary" icon="el-icon-edit" size="mini"
                                   @click="showEditDialog(scope.row.id)"></el-button>
                        <!--删除按钮-->
                        <el-button type="success" icon="el-icon-delete" size="mini"
                                   @click="removeRolesById(scope.row.id)"></el-button>
                        <!--分配角色按钮-->
                        <el-tooltip effect="dark" content="分配权限" placement="top" :enterable="false">
                            <el-button @click="showSetRightDialog(scope.row)" type="warning" icon="el-icon-setting"
                                       size="mini"></el-button>
                        </el-tooltip>
                    </template>

                </el-table-column>
            </el-table>
        </el-card>
        <!--弹出的添加角色的弹出框-->
        <el-dialog title="新增角色" :visible.sync="addDialogVisible" @close="addDialogCloses" width="50%">
            <el-form :model="Roles" :rules="addRoleRules" ref="addRoleRef">
                <el-form-item label="角色名称" prop="roleName" label-width="100px">
                    <el-input v-model="Roles.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc" label-width="100px">
                    <el-input v-model="Roles.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRoles">确 定</el-button>
            </div>
        </el-dialog>
        <!--弹出修改角色的弹出框-->
        <el-dialog title="修改角色" :visible.sync="editDialogVisible" @close="editDialogCloses">
            <el-form :model="editRolesData" :rules="addRoleRules" ref="editRoleRef">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="editRolesData.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="editRolesData.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editRoles">确 定</el-button>
            </div>
        </el-dialog>
        <!--弹出设置权限的弹出框-->
        <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
            <!--权限的树形控件, id值就是children里的di,defkeys里是所有的di，那就会自动勾选-->
            <el-tree :data="rightsData"
                     :show-checkbox="true"
                     node-key="id"
                     default-expand-all
                     :default-checked-keys="defkeys"
                     :props="treeProps"
                     ref="treeRef"
            ></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>

    </div>

</template>

<script>
    export default {
        name: "roles",
        data() {
            return {
                // 获取到的角色列表数据
                RolesList: [],
                // 新增角色的数据
                Roles: {
                    roleName: '',
                    roleDesc: ''
                },
                // 查询到要修改的数据
                editRolesData: {},
                // 弹出新增和修改角色的弹出框属性
                addDialogVisible: false,
                editDialogVisible: false,
                // 新增角色时候表单的验证
                addRoleRules: {
                    roleName: [
                        {required: true, message: '角色名不能为空', trigger: 'blur'}
                    ]
                },
                // 所有的权限数据
                rightsData: [],
                // 默认选中的所有权限的id值
                defkeys: [],
                // tree里的数据对象
                treeProps: {
                    label: 'authName',
                    children: 'children'
                },
                // 设置角色权限的时候先拿到当前角色的roleID，用来修改保存权限的时候传参用
                roleId: '',
                // 弹出修改权限的弹出
                setRightDialogVisible: false
            }
        },
        created() {
            this.getRolesList()
        },
        methods: {
            // 获取角色列表的方法
            async getRolesList() {
                const {data: res} = await this.axios.get('roles');
                if (res.meta.status !== 200) return this.$message.error("获取角色列表失败");
                this.RolesList = res.data;
            },
            // 添加角色的方法
            addRoles() {
                this.$refs.addRoleRef.validate(async valid => {
                    if (!valid) return this.$message.error("请填写正确的角色信息");
                    // 如果数据没问题发送请求
                    const {data: res} = await this.axios.post('roles', this.Roles);
                    if (res.meta.status !== 201) return this.$message.error("添加角色失败");
                    // 请求成功
                    this.$message.success("添加角色成功");
                    // 隐藏对话框重新刷新数据
                    this.addDialogVisible = false;
                    this.getRolesList();
                })
            },
            // 修改角色id查询的角色数据
            async showEditDialog(id) {
                const {data: res} = await this.axios.get('roles/' + id);
                if (res.meta.status !== 200) return this.$message.error("获取角色信息失败");
                this.editRolesData = res.data;
                // 打开弹窗展示获取到的数据
                this.editDialogVisible = true;
            },
            // 提交修改的角色数据
            editRoles() {
                this.$refs.editRoleRef.validate(async valid => {
                    if (!valid) return this.$message.error("请填写正确的角色信息");
                    // 如果数据没问题发送请求
                    const {data: res} = await this.axios.put(`roles/${this.editRolesData.roleId}`, this.editRolesData);
                    if (res.meta.status !== 200) return this.$message.error("修改角色失败");
                    // 请求成功
                    this.$message.success("修改角色信息成功");
                    // 隐藏对话框重新刷新数据
                    this.editDialogVisible = false;
                    this.getRolesList();
                })
            },
            // 删除角色
            async removeRolesById(id) {
                // 弹窗删除确认框
                const confirmResult = await this.$confirm("请问是否永久删除该角色,是否继续?", '删除提示', {
                    confirmButtonText: '确定删除',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err);

                if (confirmResult !== 'confirm') { // 代表取消删除
                    return this.$message.info("已取消删除")
                }

                const {data: res} = await this.axios.delete('roles/' + id);
                if (res.meta.status !== 200) return this.$message.error("删除角色失败");
                this.$message.success("删除角色成功");
                this.getRolesList();
            },
            // 关闭添加角色清除数据
            addDialogCloses() {
                this.$refs.addRoleRef.resetFields();
            },
            // 关闭修改角色清除数据
            editDialogCloses() {
                this.$refs.editRoleRef.resetFields();
            },
            // 删除角色权限的方法，role是角色的所有数据,里面有角色的id。rightid是当前的权限id
            async removeRightsByid(role, rightId) {
                const confirmResult = await this.$confirm("请问是否要删除该权限", '删除提示', {
                    confirmButtonText: '确定删除',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err);

                if (confirmResult !== 'confirm') {
                    return this.$message.info("已取消删除");
                }

                const {data: res} = await this.axios.delete(`roles/${role.id}/rights/${rightId}`);
                if (res.meta.status !== 200) return this.$message.error("删除角色权限失败");
                // 这里不重新获取角色数据，要不然页面会关闭展开的权限
                // role的数据来自作用域插槽的scope.row, 删除后得到数据时当前角色下最新的权限数据。。。再给role.children赋值就会重新得到新的数据。
                // 按理说不能反过去给数据赋值的,这点比较奇怪啊~  对现有的角色权限进行更新即可
                role.children = res.data;
            },
            // 分配权限的方法，先获取所有的权限用tree结构
            async showSetRightDialog(role) {
                // 先拿到当前用户的id
                this.roleId = role.id;
                // 先去获取tree数据,也就是权限套权限的
                const {data: res} = await this.axios.get('rights/tree');
                if (res.meta.status !== 200) return this.$message.error("获取角色权限失败");
                // 如果获取成功, 把获取到的权限数据保存到rightsData 中
                this.rightsData = res.data;

                // 递归获取三级节点的id值,role就是当前角色所有数据,这个role其实就是上面的scope.row，当前最新的权限列表。之前的删除权限也会
                // 实时的更新到这个role, 这个defkeys是个空数组用来储存选中的权限
                this.getLeafKeys(role, this.defkeys);
                this.setRightDialogVisible = true
            },
            // 递归获取三级权限下所有的权限id
            getLeafKeys(node, arr) {
                // 当：当前role也就是角色的children下级没有数据了代表以及是3级了。
                if (!node.children) {
                    return arr.push(node.id)
                }
                // 循环递归,记得方法加this
                node.children.forEach(item => this.getLeafKeys(item, arr))
            },
            // 取消修改权限的时候给置空
            setRightDialogClosed() {
                this.defkeys = [];
            },
            // 点击确定给用户分配权限
            async allotRights() {
                // 获取勾选的权限
                const keys = [
                    ...this.$refs.treeRef.getCheckedKeys(),  // 选中的节点的 key
                    ...this.$refs.treeRef.getHalfCheckedKeys()  //返回目前半选中的节点的 key 所组成的数组
                ];
                // 发送修改权限的请求，权限数组使用,号分割起来。
                const {data: res} = await this.axios.post(`roles/${this.roleId}/rights`, {rids: keys.join(',')});
                if (res.meta.status !== 200) return this.$message.error("分配权限失败");

                this.$message.success("分配权限成功");
                // 重新刷新角色列表
                this.getRolesList();
                this.setRightDialogVisible = false;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .bdtop {
        border-top: 1px solid #eee;
    }

    .bdbottom {
        border-bottom: 1px solid #eee;
    }

    .el-tag {
        margin: 7px;
    }

    .vcenter {
        display: flex;
        align-items: center; /* 垂直居中 */
    }
</style>