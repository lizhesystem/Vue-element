<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片区域-->
        <el-card>
            <!--搜索栏区域-->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" :clearable="true">
                        <el-button slot="append" icon="el-icon-search" @click="searchOrder"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <!--订单表格区域-->
            <el-table :data="orderLists" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="订单编号" prop="order_number"></el-table-column>
                <el-table-column label="订单价格" prop="order_price"></el-table-column>
                <el-table-column label="是否付款" prop="pay_status">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.status === '1' ">
                            已付款
                        </el-tag>
                        <el-tag type="danger" v-else>
                            未付款
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否发货" prop="is_send"></el-table-column>
                <el-table-column label="下单时间" prop="create_time">
                    <template slot-scope="scope">
                        {{ scope.row.create_time | dateFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <el-button size="mini" type="primary" icon="el-icon-edit" @click="showAddress"></el-button>
                    <el-button size="mini" type="success" icon="el-icon-location" @click="showExpress"></el-button>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="queryInfo.pagenum"
                           :page-sizes="[3, 5, 10, 15]"
                           :page-size="queryInfo.pagesize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="total"
                           background>
            </el-pagination>
        </el-card>
        <!--修改地址的弹出对话框-->
        <el-dialog title="修改收货地址" :visible.sync="addressVisible" width="50%" @close="addressDialogClosed">
            <!-- 添加表单 -->
            <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
                <el-form-item label="省市区县" prop="address1">
                    <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="address2">
                    <el-input v-model="addressForm.address2"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addressVisible = false">取 消</el-button>
                <el-button type="primary" @click="addressVisible = false">确 定</el-button>
            </span>
        </el-dialog>

        <!--显示物流信息的弹窗-->
        <el-dialog title="物流信息" :visible.sync="expressVisible" width="50%" @close="expressDialogClosed">
            <el-timeline>
                <el-timeline-item
                        v-for="(activity, index) in progressInfo"
                        :key="index"
                        :timestamp="activity.time">
                    {{activity.context}}
                </el-timeline-item>
            </el-timeline>
        </el-dialog>
    </div>
</template>

<script>
    import cityData from "./citydata";

    export default {
        name: "orders",
        data() {
            return {
                // 搜索的内容区域
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 10
                },
                total: 0,
                // 所有的订单数据
                orderLists: [],
                // 修改弹出框的状态控制
                addressVisible: false,
                // 修改收货地址提交的表单
                addressForm: {
                    address1: [],
                    address2: ''
                },
                addressFormRules: {
                    address1: [{required: true, message: '请选择省市区县', trigger: 'blur'}],
                    address2: [{required: true, message: '请输入详细地址', trigger: 'blur'}],
                },
                // 导入的区域信息
                cityData,
                // 显示物流信息的弹窗
                expressVisible: false,
                // 物流数据
                progressInfo: []
            }
        },
        created() {
            this.getOrders()
        },
        methods: {
            // 获取全部订单数据的方法
            async getOrders() {
                const {data: res} = await this.axios.get('orders', {params: this.queryInfo});
                if (res.meta.status !== 200) return this.$message.error("获取订单列表失败");
                this.orderLists = res.data.goods;
                this.total = res.data.total;
            },
            // 分页的新页码
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize;
                this.getOrders();
            },
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage;
                this.getOrders();
            },
            // 查询订单
            searchOrder() {
                this.getOrders();
            },
            // 查看订单的内容
            showAddress() {
                //当用户点击修改收货地址按钮时触发,这里没有真实的接口，无法提交数据
                this.addressVisible = true;
            },
            addressDialogClosed() {
                this.$refs.addressFormRef.resetFields()
            },
            // 查看物流的信息
            async showExpress() {
                //发送请求获取物流数据
                const {data: res} = await this.$http.get('/kuaidi/804909574412544580');

                if (res.meta.status !== 200) {
                    return this.$message.error('获取物流进度失败!')
                }
                this.progressInfo = res.data;
                //显示对话框
                this.expressVisible = true
            }
        }
    }
</script>

<style lang="scss" scoped>
    .el-cascader {
        width: 100%;
    }
</style>