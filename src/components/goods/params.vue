<template>
    <div>
        <!--面包屑区域-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片区域-->
        <el-card>
            <!--警告提示区域-->
            <el-alert
                    title="注意: 只允许为第三级分类设置相关参数!"
                    type="warning"
                    show-icon>
            </el-alert>
            <!--级联选择器区域-->
            请选择商品分类：
            <el-cascader
                    v-model="selectedCateKeys"
                    :options="cateList"
                    :props="cateProps"
                    clearable
                    @change="ParamsCateChange"></el-cascader>

            <!--tab 页签区域-->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <!--添加动态参数的面板-->
                <el-tab-pane label="动态参数" name="many">
                    <!--添加参数的按钮-->
                    <el-button type="primary" @click="addDialogVisible=true" :disabled="isBtnDisabled" size="mini">
                        添加参数
                    </el-button>
                    <!--添加动态参数的表单-->
                    <el-table
                            :data="manyTableData"
                            style="width: 100%"
                            border
                            stripe>
                        <!--展开行-->
                        <el-table-column type="expand">
                            <!--参数添加展开行-->
                            <template slot-scope="scope">
                                <!--循环渲染的tag标签，显示参数-->
                                <el-tag
                                        :key="i"
                                        v-for="(item,i) in scope.row.attr_vals"
                                        closable
                                        @close="handleClose(i,scope.row)">
                                    {{item}}
                                </el-tag>
                                <!--新增tag标签的文本框-->
                                <!--scope.row.inputValue和inputVisible绑定的每个row的数据-->
                                <el-input
                                        class="input-new-tag"
                                        v-if="scope.row.inputVisible"
                                        v-model="scope.row.inputValue"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm(scope.row)"
                                        @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <!--添加按钮对应上面的if-->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+
                                    New Tag
                                </el-button>
                            </template>
                        </el-table-column>
                        <!--索引行-->
                        <el-table-column type="index" label="序列" width="55px"></el-table-column>
                        <el-table-column prop="attr_name" label="参数名称"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit"
                                           @click="editParamsDialogVisible(scope.row.attr_id)" size="mini">编辑
                                </el-button>
                                <el-button type="danger" icon="el-icon-delete"
                                           @click="delParamsDialogVisible(scope.row.attr_id)" size="mini">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <!--添加静态属性的面板-->
                <el-tab-pane label="静态属性" name="only">
                    <!--添加属性的按钮-->
                    <el-button type="primary" @click="addDialogVisible=true" :disabled="isBtnDisabled" size="mini">
                        添加属性
                    </el-button>
                    <!--添加静态属性的表单-->
                    <el-table
                            :data="onlyTableData"
                            style="width: 100%"
                            border
                            stripe>
                        <!--展开行-->
                        <el-table-column type="expand">
                            <!--添加展开列,这里查看文档发现作用域插槽可以用v-slot表示-->
                            <template slot-scope="scope">
                                <!--循环渲染的tag标签，显示参数-->
                                <el-tag
                                        :key="i"
                                        v-for="(item,i) in scope.row.attr_vals"
                                        closable
                                        @close="handleClose(i,scope.row)">
                                    {{item}}
                                </el-tag>
                                <!--新增tag标签的文本框-->
                                <!--scope.row.inputValue和inputVisible绑定的每个row的数据-->
                                <el-input
                                        class="input-new-tag"
                                        v-if="scope.row.inputVisible"
                                        v-model="scope.row.inputValue"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm(scope.row)"
                                        @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <!--添加按钮对应上面的if-->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+
                                    New Tag
                                </el-button>
                            </template>
                        </el-table-column>
                        <!--索引行-->
                        <el-table-column type="index" label="序列" width="55px"></el-table-column>
                        <el-table-column prop="attr_name" label="参数名称"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" @click="editParamsDialogVisible(scope.row.attr_id)"
                                           icon="el-icon-edit" size="mini">编辑
                                </el-button>
                                <el-button type="danger" @click="delParamsDialogVisible(scope.row.attr_id)"
                                           icon="el-icon-delete" size="mini">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>

        </el-card>

        <!--添加参数的对话框 ,静态和动态公用一个dialog根据计算属性显示文本-->
        <el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
            <!-- 添加参数的对话框 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>

        <!--修改参数的对话框 ,静态和动态公用一个dialog根据计算属性显示文本-->
        <el-dialog :title="'修改' + titleText" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
            <!-- 添加参数的对话框 -->
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParams">确 定</el-button>
            </span>
        </el-dialog>


    </div>
</template>

<script>
    export default {
        name: "params",
        data() {
            return {
                // 获取的商品分类数据
                cateList: [],
                // 级联选择框的配置对象
                cateProps: {
                    // 分类id
                    value: 'cat_id',
                    // 分类名称
                    label: 'cat_name',
                    // 下级分类
                    children: 'children',
                    expandTrigger: 'hover',
                    multiple: false,
                    checkStrictly: false
                },
                // 级联选择框选定的数据
                selectedCateKeys: [],
                // 动态参数的数据
                manyTableData: [],
                // 静态属性的数据
                onlyTableData: [],
                // 被激活的页签的名称
                activeName: 'many',
                // 新增静态和动态参数弹出的dialog
                addDialogVisible: false,
                editDialogVisible: false,
                // 添加参数的表单数据对象
                addForm: {
                    attr_name: ''
                },
                // 添加表单的验证规则对象
                addFormRules: {
                    attr_name: [
                        {required: true, message: '请输入参数名称', trigger: 'blur'}
                    ]
                },
                // 修改参数的表单数据对象
                editForm: {},
                // 修改表单的验证规则对象
                editFormRules: {
                    attr_name: [
                        {required: true, message: '请输入参数名称', trigger: 'blur'}
                    ]
                }

            }
        },
        created() {
            this.getcateList();
        },
        methods: {
            // 获取所有分类参数的方法
            async getcateList() {
                const {data: res} = await this.axios.get('categories');
                if (res.meta.status !== 200) return this.$message.error("获取分类数据失败");
                // 获取成功
                this.cateList = res.data;
            },
            // tab页签点击切换的处理函数
            handleTabClick() {
                this.getParams();
            },
            // 级联选择框选项中变化触发函数
            ParamsCateChange() {
                this.getParams();
            },
            // 级联选择器选择属性后请求API
            async getParams() {
                // 如果不是3级
                if (this.selectedCateKeys.length !== 3) {
                    this.selectedCateKeys = [];
                    // 动态参数的数据清空
                    this.manyTableData = [];
                    // 静态属性的数据清空
                    this.onlyTableData = [];
                    return
                }
                // 如果选中的是3级才发送请求
                const {data: res} = await this.axios.get(`categories/${this.cateId}/attributes`, {params: {sel: this.activeName}});
                if (res.meta.status !== 200) return this.$message.error("获取参数失败");

                // 把获取到的数据转换成数组
                res.data.forEach(item => {
                    // 如果有值splic切割成数组,如果没值返回一个空数组
                    item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
                    // 新增属性：控制文本框的显示与因此
                    item.inputVisible = false;
                    // 新增属性：文本框中输入的值
                    item.inputValue = ''
                });

                if (this.activeName === 'many') {
                    this.manyTableData = res.data;
                } else {
                    this.onlyTableData = res.data;
                }

            },
            // 点击确定添加静态/动态dialog的方法
            async addParams() {
                this.$refs.addFormRef.validate(async valid => {
                    if (!valid) return;
                    // 如果表单不为空提交请求
                    const {data: res} = await this.axios.post(`categories/${this.cateId}/attributes`, {
                            attr_name: this.addForm.attr_name,
                            attr_sel: this.activeName
                        }
                    );
                    if (res.meta.status !== 201) return this.$message.error("添加参数失败");
                    // 如果请求正常
                    this.$message.success("添加参数成功");
                    this.addDialogVisible = false;
                    this.getParams();
                });

            },
            // 静态/动态dialog关闭后清空表单
            addDialogClosed() {
                this.$refs.addFormRef.resetFields();
            },
            // 点击修改按钮，展示对话框 修改静态/动态参数
            async editParamsDialogVisible(attr_id) {
                // 请求数据
                const {data: res} = await this.axios.get(`categories/${this.cateId}/attributes/${attr_id}`, {
                    params: {
                        attr_sel: this.activeName,
                    }
                });
                if (res.meta.status !== 200) return this.$message.error("获取参数信息失败");
                // 获取数据成功赋值打开弹出
                this.editForm = res.data;
                this.editDialogVisible = true;

            },
            // 点击确定修改参数
            editParams() {
                // 修改数据提交
                this.$refs.editFormRef.validate(async valid => {
                    if (!valid) return;
                    // 表单效验没问题请求接口
                    const {data: res} = await this.axios.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
                        attr_sel: this.activeName,
                        attr_name: this.editForm.attr_name,
                    });
                    if (res.meta.status !== 200) return this.$message.error("修改参数数据失败");
                    this.$message.success("修改参数成功");
                    this.getParams();
                    this.editDialogVisible = false;
                });

            },
            // 关闭修改的弹窗重置数据
            editDialogClosed() {
                this.$refs.editFormRef.resetFields();
            },
            // 删除参数的方法
            async delParamsDialogVisible(attr_id) {
                const confirmResult = await this.$confirm("请问是否要删除该参数", '删除提示', {
                    confirmButtonText: '确定删除',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err);
                if (confirmResult !== 'confirm') {
                    return this.$message.info("已取消删除");
                }
                // 如果确认删除
                const {data: res} = await this.axios.delete(`categories/${this.cateId}/attributes/${attr_id}`);
                if (res.meta.status !== 200) return this.$message.error("删除参数失败");
                this.$message.success("删除参数成功");
                this.getParams()
            },
            // 文本框失去焦点，或者摁下 enter都会触发--修改
            handleInputConfirm(row) {
                // 如果是空数据重置为空不做任何操作
                if (row.inputValue.trim().length === 0) {
                    row.inputValue = '';
                    row.inputVisible = false;
                    return
                }
                // 如果有数据继续操作
                row.attr_vals.push(row.inputValue.trim());
                row.inputValue = '';
                row.inputVisible = false;
                // 发起请求，调用封装的方法
                this.saveAttrVals(row)
            },
            // 点击按钮，展示文本框
            showInput(row) {
                row.inputVisible = true;
                // 让文本框自动获得焦点
                // $nextTick 方法的作用，就是当页面上元素被重新渲染之后，才会指定回调函数中的代码
                // eslint-disable-next-line no-unused-vars
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            // 删除tag标签的方法
            handleClose(i,row) {
                row.attr_vals.splice(i, 1);
                this.saveAttrVals(row);
            },
            // 封装的更改tag标签属性的方法
            async saveAttrVals(row) {
                const {data: res} = await this.axios.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
                    attr_name: row.attr_name,
                    attr_sel: row.attr_sel,
                    attr_vals: row.attr_vals.join(' ')
                });
                if (res.meta.status !== 200) return this.$message.error("修改参数项失败");
                this.$message.success("修改参数项成功");
            },
        },
        computed: {
            // 计算属性来判断添加属性的样式
            isBtnDisabled() {
                // 根据选择的是否是3级ID 来控制添加属性是否可选:Disabled
                return this.selectedCateKeys.length !== 3;
            },
            cateId() {
                // 计算属性ID值,如果选择的是3级ID。返回当前选择的三级属性的ID
                if (this.selectedCateKeys.length === 3) {
                    return this.selectedCateKeys[2]
                }
                return null;
            },
            titleText() {
                if (this.activeName === 'many') {
                    return '动态参数'
                } else {
                    return '静态属性'
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .el-alert {
        margin-bottom: 20px;
    }

    .el-cascader {
        width: 30%;
    }

    .el-tabs {
        margin-top: 15px;
    }

    .el-tag {
        margin: 10px;
    }

    .input-new-tag {
        width: 150px;
    }
</style>
