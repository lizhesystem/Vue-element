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
            <!--级联选择器-->
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
                    <el-button type="primary" :disabled="isBtnDisabled" size="mini">
                        添加参数
                    </el-button>
                    <!--添加动态参数的表单-->
                    <!--<el-table-->
                    <!--        :data="tableData"-->
                    <!--        style="width: 100%">-->
                    <!--    <el-table-column-->
                    <!--            prop="date"-->
                    <!--            label="日期"-->
                    <!--            width="180">-->
                    <!--    </el-table-column>-->
                    <!--</el-table>-->
                </el-tab-pane>
                <!--添加静态属性的面板-->
                <el-tab-pane label="静态属性" name="only">
                    <!--添加属性的按钮-->
                    <el-button type="primary" :disabled="isBtnDisabled" size="mini">
                        添加属性
                    </el-button>
                    <!--添加静态属性的表单-->
                    <!--<el-table-->
                    <!--        :data="tableData"-->
                    <!--        style="width: 100%">-->
                    <!--    <el-table-column-->
                    <!--            prop="date"-->
                    <!--            label="日期"-->
                    <!--            width="180">-->
                    <!--    </el-table-column>-->
                    <!--</el-table>-->
                </el-tab-pane>
            </el-tabs>
        </el-card>
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
                activeName: 'many'

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
            // 级联选择器选择属性请求API
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

                if (this.activeName === 'many') {
                    this.manyTableData = res.data;
                } else {
                    this.onlyTableData = res.data;
                }

            }
        },
        computed: {
            // 计算属性来判断添加属性的样式
            isBtnDisabled() {
                // 根据选择的是否是3级ID
                return this.selectedCateKeys.length !== 3;
            },
            cateId() {
                // 如果选择的是3级ID。返回当前选择的三级属性的ID
                if (this.selectedCateKeys.length === 3) {
                    return this.selectedCateKeys[2]
                }
                return null;
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
</style>