<template>
    <div>
        <!--面包屑区域-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片区域-->
        <el-card>
            <!--添加商品区域-->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>
            <!--商品分类表格区域:这里的tree-table是从第三方下载的插件,数据:data  表格字段书面columns-->
            <!-- 分类表格
            :data(设置数据源) :columns(设置表格中列配置信息) :selection-type(是否有复选框对勾)
            :expand-type(是否展开数据) show-index(是否设置索引列) index-text(设置索引列头)
            border(是否添加纵向边框) :show-row-hover(是否鼠标悬停高亮) -->
            <tree-table :data="cateList" :columns="columns" class="tree-table-Class"
                        :show-row-hover="false"
                        :expand-type="false"
                        show-index
                        index-text="#"
                        border
                        :selection-type="false">
                <!--是否有效的列-->
                <template slot="isok" slot-scope="scope">
                    <i v-if="scope.row.cat_deleted === false" class=" el-icon-success" style="color: lightgreen;"></i>
                    <i v-else class="el-icon-error" style="color: red"></i>
                </template>
                <!--排序列-->
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag size="mini" v-else-if="scope.row.cat_level === 1" type="success">二级</el-tag>
                    <el-tag size="mini" v-else type="warning">三级</el-tag>
                </template>

                <!--操作列-->
                <template slot="opt" slot-scope="scope">
                    <el-button type="primary" @click="showEditCategory(scope.row.cat_id)" icon="el-icon-edit"
                               size="mini">
                        编辑
                    </el-button>
                    <el-button type="danger" @click="delCategory(scope.row.cat_id)" icon="el-icon-delete" size="mini">
                        删除
                    </el-button>
                </template>
            </tree-table>
            <!--分页-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[3, 5, 10, 15]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>
        <!--新增商品分类的弹出框-->
        <el-dialog
                title="添加分类"
                :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed">
            <!--添加分类的表单-->
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px"
            >
                <el-form-item label="分类名称：" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类：">
                    <!-- options 用来指定数据源 -->
                    <!-- props 用来指定配置对象 -->
                    <el-cascader v-model="selectedCateKeys"
                                 :props="cateProps"
                                 :options="allCateList"
                                 @change="parentCateChanged" clearable change-on-select>
                    </el-cascader>

                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>
        <!--修改商品分类的弹出框，修改只涉及到名称的修改-->
        <el-dialog
                title="修改分类"
                :visible.sync="editCateDialogVisible" width="50%" @close="editCateDialogClosed">
            <!--添加分类的表单-->
            <el-form :model="editCateForm" :rules="editCateFormRules" ref="editCateFormRef" label-width="100px"
            >
                <el-form-item label="分类名称：" prop="cat_name">
                    <el-input v-model="editCateForm.cat_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editCate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "cate",
        data() {
            return {
                // 请求的参数,type代表第三层分类列表，pagenum当前页面,pagesize每页显示条数。
                queryInfo: {
                    type: 3,
                    pagenum: 1,
                    pagesize: 5
                },
                // 带分页商品分类数据列表
                cateList: [],
                // 总条数
                total: 0,
                // 数据列表的表头数据对应。
                columns: [
                    {label: '分类名称', prop: 'cat_name'},
                    // type代表当前页为模板列  template代表模板使用的名称
                    {label: '是否有效', type: 'template', template: 'isok'},
                    {label: '排序', type: 'template', template: 'order'},
                    {label: '操作', type: 'template', template: 'opt'},
                ],
                // 添加分类对话框的显示与隐藏
                addCateDialogVisible: false,
                // 修改分类的显示与隐藏
                editCateDialogVisible: false,
                // 分类的数据
                addCateForm: {
                    // 添加分类的名称
                    cat_name: '',
                    // 父级分类的id
                    cat_pid: 0,
                    // 分类的等级，默认要添加的是1级分类
                    cat_level: 0
                },
                // 表单验证规则对象
                addCateFormRules: {
                    // required代表必填,trigger代表失去焦点的时候效验
                    cat_name: [
                        {required: true, message: '分类名不能为空', trigger: 'blur'},
                    ]
                },
                // type2的父级分类的数据列表
                allCateList: [],
                // 新增分类选择的属性
                cateProps: {
                    // 分类id
                    value: 'cat_id',
                    // 分类名称
                    label: 'cat_name',
                    // 下级分类
                    children: 'children',
                    expandTrigger: 'hover',
                    multiple: false,
                    checkStrictly: true
                },
                // 新增分类下拉框选择的属性
                selectedCateKeys: [],
                // 分类修改的数据
                editCateForm: {},
                // 修改数据的表单验证规则对象
                editCateFormRules: {
                    // required代表必填,trigger代表失去焦点的时候效验
                    cat_name: [
                        {required: true, message: '分类名不能为空', trigger: 'blur'},
                    ]
                },
            }
        },
        created() {
            this.getCateList();
        },
        methods: {
            // 获取商品分类数据列表
            async getCateList() {
                const {data: res} = await this.axios.get('categories', {params: this.queryInfo});
                if (res.meta.status !== 200) return this.$message.error("请求商品分类数据失败");
                // 保存数据以及总条数
                this.cateList = res.data.result;
                this.total = res.data.total;
            },
            // 分页的处理事件
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize;
                this.getCateList()
            },
            handleCurrentChange(newCurrent) {
                this.queryInfo.pagenum = newCurrent;
                this.getCateList()
            },
            // 打开新增分类窗口的方法
            showAddCateDialog() {
                // 获取数据
                this.getParentCateList();
                this.addCateDialogVisible = true;
            },
            // 获取父级分类的方法,不传值默认获取所有的数据
            async getParentCateList() {
                const {data: res} = await this.axios.get('categories', {
                    params: {type: 2}
                });
                if (res.meta.status !== 200) return this.$message.error("获取分类数据失败");
                this.allCateList = res.data;

            },
            // 选择分类下拉框触发发生变化的时候触发的函数
            parentCateChanged() {
                // eslint-disable-next-line no-console
                console.log(this.selectedCateKeys);
                // >0代表选中了数据
                if (this.selectedCateKeys.length > 0) {
                    // 分配父级分类的ID
                    // 如果选中2级,数组里只有一个值,算出来索引是0也就是第一个数
                    // 如果选中数组里两个值，算出来索引是1也就是第二个数
                    this.addCateForm.cat_pid = this.selectedCateKeys[this.selectedCateKeys.length - 1];
                    // 给分类的等级赋值，选2级那就是1 选3级那就是2。level分为0 1 2
                    this.addCateForm.cat_level = this.selectedCateKeys.length;
                } else {
                    // 如果什么都不选,不是那么就是0级。也就是顶级
                    this.addCateForm.cat_pid = 0;
                    this.addCateForm.cat_level = 0;
                }
            },
            // 提交新增分类
            addCate() {
                // 校验值为空不提交
                this.$refs.addCateFormRef.validate(async valid => {
                    if (!valid) return;
                    const {data: res} = await this.axios.post('categories', this.addCateForm);
                    if (res.meta.status !== 201) this.$message.error("添加分类数据失败!");
                    // 提交成功
                    this.$message.success('添加分类成功！');
                    this.getCateList();
                    this.addCateDialogVisible = false;
                })
            },
            // 监听关闭分类清理数据
            addCateDialogClosed() {
                // 表单清空，属性写在dialog里
                this.$refs.addCateFormRef.resetFields();
                // 封装的数据改为0,清空数据
                this.addCateForm.cat_level = 0;
                this.addCateForm.cat_pid = 0;
                this.selectedCateKeys = [];
            },
            // 显示要修改分类名称的方法
            async showEditCategory(cid) {
                const {data: res} = await this.axios.get('categories/' + cid);
                if (res.meta.status !== 200) return this.$message.error("获取分类失败");
                // 获取成功赋值并显示出来
                this.editCateForm = res.data;
                this.editCateDialogVisible = true;
            },
            editCateDialogClosed() {
                // 表单清空
                this.$refs.editCateFormRef.resetFields();
                this.editCateForm = {}
            },
            // 修改分类名称确认的方法
            editCate() {
                // 校验值为空不提交
                this.$refs.editCateFormRef.validate(async valid => {
                    if (!valid) return;
                    const {data: res} = await this.axios.put(`categories/${this.editCateForm.cat_id}`,
                        {cat_name: this.editCateForm.cat_name});
                    if (res.meta.status !== 200) this.$message.error("更新分类数据失败!");
                    // 提交成功
                    this.$message.success('更新分类成功！');
                    this.editCateDialogVisible = false;
                    this.getCateList();

                })
            },
            // 删除分类数据的方法
            async delCategory(cid) {
                const confirmResult = await this.$confirm("请问是否要删除", '删除提示', {
                    confirmButtonText: '确定删除',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err);

                if (confirmResult !== 'confirm') {
                    return this.$message.info("已取消删除");
                }
                const {data: res} = await this.axios.delete('categories/' + cid);
                if (res.meta.status !== 200) this.$message.error("删除分类失败");

                this.$message.success("删除分类数据成功");
                this.getCateList();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .tree-table-Class {
        margin-top: 15px;
    }

    .el-cascader {
        width: 100%;
    }
</style>
