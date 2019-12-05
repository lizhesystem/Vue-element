<template>
    <div>
        <!--面包屑-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--权限列表卡片区域-->
        <el-card>
            <el-table
                    :data="rightsList"
                    stripe
                    border>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="authName" label="权限名称"></el-table-column>
                <el-table-column prop="path" label="权限路径"></el-table-column>
                <el-table-column prop="level" label="权限等级">
                    <!--作用域插槽获取权限的状态,使用if-else来根据值来显示不同的权限等级-->
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level === '0'">一级权限</el-tag>
                        <el-tag v-else-if="scope.row.level === '1'" type="success">二级权限</el-tag>
                        <el-tag v-else type="warning">三级权限</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "rights",
        data() {
            return {
                rightsList: []
            }
        },
        created() {
            this.getRightsList()
        },
        methods: {
            // 获取权限列表的方法
            async getRightsList() {
                const {data: res} = await this.axios.get('rights/list');
                if (res.meta.status !== 200) return this.$message.error("获取权限列表失败");
                this.rightsList = res.data;
            }
        }
    }
</script>

<style scoped>

</style>