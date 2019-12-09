<template>
    <div>
        <!--面包屑区域-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片区域-->
        <el-card>
            <!--搜索区域与添加区域,使用网格-->
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" :clearable="true" @clear="clearInput">
                        <el-button slot="append" icon="el-icon-search" @click="searchGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addGoods">添加商品</el-button>
                </el-col>
            </el-row>
            <!--表格区域-->
            <el-table
                    :data="goodsLists.goods"
                    border
                    stripe
                    resizable
            >
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="goods_name" label="商品名称"></el-table-column>
                <el-table-column prop="goods_price" label="商品价格(元)" width="100px"></el-table-column>
                <el-table-column prop="goods_weight" label="商品重量" width="80px"></el-table-column>
                <el-table-column prop="add_time" label="创建时间" width="170px">
                    <template slot-scope="scope">
                        {{ scope.row.add_time | dateFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="130px">
                    <!--添加本行的修改删除之类的操作按钮的时候,我们也用作用域插槽,直接获取本行的数据,方便-->
                    <template>
                        <!--修改商品按钮-->
                        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                        <!--删除商品按钮-->
                        <el-button type="warning" icon="el-icon-delete" size="mini"></el-button>
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
                    :total="total" background>
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "goodlist",
        data() {
            return {
                // 查询商品信息的参数,query是查询条件,pagenum是当前页,pagesize是每页条数
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 10
                },
                // 商品列表数据
                goodsLists: {},
                // 总数
                total: 0
            }
        },
        created() {
            this.getGoodsLists();
        },
        methods: {
            // 获取商品列表的方法
            async getGoodsLists() {
                const {data: res} = await this.axios.get('goods', {params: this.queryInfo});
                if (res.meta.status !== 200) return this.$message.error("获取商品列表失败");
                this.goodsLists = res.data;
                this.total = res.data.total;
            },
            // 搜索商品返回商品列表的方法
            searchGoodsList() {
                // this.queryInfo.query = this.queryInfo.query.trim();
                this.getGoodsLists();
            },
            // 清空搜索内容后重新查询
            clearInput() {
                this.getGoodsLists();
            },
            // 分页触发的每页条数
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize;
                this.getGoodsLists();
            },
            // 分页事件触发的新的当前页
            handleCurrentChange(pageNum) {
                this.queryInfo.pagenum = pageNum;
                this.getGoodsLists();
            },
            //新增商品跳转的路由
            addGoods(){
                this.$router.push('/goods/add')
            }
        }
    }
</script>

<style scoped>

</style>
