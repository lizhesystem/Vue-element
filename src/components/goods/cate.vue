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
                <template slot="opt">
                    <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
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
        <!--新增商品分类区域-->
        <el-dialog
                title="添加分类"
                :visible.sync="addCateDialogVisible">
            <!--添加分类的表单-->
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef">
                <el-form-item label="分类名称：" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类：">
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
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
                // 商品分类数据列表
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
                // 分类的数据
                addCateForm: {
                    // 添加分类的名称
                    cat_name: '',
                    // 父级分类的id
                    cat_pid: 0,
                    // 分类的等级，默认要添加的是1级分类
                    cat_level: 0
                }
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
                this.addCateDialogVisible = true;
            }
        }
    }
</script>

<style lang="scss" scoped>

    .tree-table-Class {
        margin-top: 15px;
    }
</style>