<template>
    <div>
        <!--面包屑-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片区域-->
        <el-card>
            <!--提示框区域-->
            <el-alert
                    title="添加商品信息"
                    type="info"
                    center
                    :closable="false"
                    show-icon>
            </el-alert>
            <!--步骤条区域-->
            <el-steps :space="300" :active="activeIndex - 0" align-center finish-status="success">
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <!--tab栏区域，tab栏包含注tabls-->
            <!--标签区域-->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
                <el-tabs :before-leave="beforeTabLeave" v-model="activeIndex" :tab-position="'left' "
                         @tab-click="tabClicked">
                    <!--基本信息的tab页-->
                    <el-tab-pane label="基本信息" name="0">
                        <!--在tab里放入el-form-item的表单-->
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader :options="catelist" :props="cateProps" clearable
                                         v-model="addForm.goods_cat" @change="handleChange">
                            </el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <!--商品参数的tab页-->
                    <el-tab-pane label="商品参数" name="1">
                        <!--渲染的标的的item-->
                        <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
                            <!--商品参数复选框-->
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <!--商品属性input-->
                        <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>

                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <!--上传图片区域-->
                        <!--action:上传地址，onpreview:点击文件列表中已上传的文件时的钩子函数，on-remove：文件列表删除的钩子函数，-->
                        <!--headers:请求头，on—success:上传成功后的钩子函数-->
                        <el-upload
                                :action="uploadUrl"
                                :on-preview="handlePreview"
                                :on-remove="handleRemove"
                                :headers="hearderObj"
                                :on-success="handleSuccess"
                                multiple
                                drag
                                list-type="picture"
                                :before-upload="beforeAvatarUpload"
                        >
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <!--商品描述富文本编辑器区域-->
                        <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                        <!-- 添加商品的按钮 -->
                        <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>


        <!-- 图片预览区域 -->
        <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%" :center="true">
            <img :src="previewPath" alt="" class="previewImg">
        </el-dialog>
    </div>
</template>

<script>
    // eslint-disable-next-line no-unused-vars
    import _ from 'lodash';

    export default {
        name: "add",
        data() {
            return {
                // 切换标签页的索引显示
                activeIndex: '0',
                // 商品分类列表
                catelist: [],
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
                    checkStrictly: false
                },
                // 新增商品表单数据对象
                addForm: {
                    goods_name: '',
                    goods_price: 0,
                    goods_weight: 0,
                    goods_number: 0,
                    // 商品所属的分类数组
                    goods_cat: [],
                    // 图片的数组
                    pics: [],
                    // 商品的详情描述介绍
                    goods_introduce: '',
                    // 商品的动态/静态属性
                    attrs: [],
                },
                addFormRules: {
                    goods_name: [
                        {required: true, message: '请输入商品名称', trigger: 'blur'},
                    ],
                    goods_price: [
                        {required: true, message: '请输入商品价格', trigger: 'blur'},
                    ],
                    goods_weight: [
                        {required: true, message: '请输入商品重量', trigger: 'blur'},
                    ],
                    goods_number: [
                        {required: true, message: '请输入商品数量', trigger: 'blur'},
                    ],
                    goods_cat: [
                        {required: true, message: '请输入商品分类', trigger: 'blur'},
                    ]
                },
                // 动态参数列表数据
                manyTableData: [],
                // 静态属性列表数据
                onlyTableData: [],
                // 图片上传地址
                uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
                // 图片上传组件的hearders请求头对象，因为默认上传组件封装的axios没有这个请求头,拿到这个token
                hearderObj: {
                    Authorization: window.sessionStorage.getItem('token')
                },
                // 图片预览的地址
                previewPath: '',
                // 点击图片查看图片详情的弹窗
                previewVisible: false
                // 图片的宽度
            }
        },
        created() {
            this.getcatelist();
        }, methods: {
            // 切换标签页时触发的函数
            async tabClicked() {
                // 如果是第二页商品参数发起请求获取公共属性
                if (this.activeIndex === '1') {
                    const {data: res} = await this.axios.get(
                        `categories/${this.cateId}/attributes`,
                        {
                            params: {sel: 'many'}
                        }
                    );
                    if (res.meta.status !== 200) return this.$message.error("获取动态参数列表失败");
                    // 获取成功把参数数据转换成数组
                    res.data.forEach(item => {
                        item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ');
                    });
                    this.manyTableData = res.data;
                } else if (this.activeIndex === '2') {
                    // 如果是2代表静态参数数据
                    const {data: res} = await this.axios.get(
                        `categories/${this.cateId}/attributes`,
                        {
                            params: {sel: 'only'}
                        }
                    );
                    if (res.meta.status !== 200) return this.$message.error("获取静态属性失败");
                    // 获取成功直接赋值
                    this.onlyTableData = res.data;
                }
            },
            // 获取商品分类的方法
            async getcatelist() {
                const {data: res} = await this.axios.get('categories');
                if (res.meta.status !== 200) return this.$message.error("请求商品分类数据失败");
                // 保存数据以及总条数
                this.catelist = res.data;
            },
            // 级联选择器选中项发生变化后触发的函数
            handleChange() {
                // 如果选择的不是3级分类默认重置空
                if (this.addForm.goods_cat.length !== 3) {
                    this.addForm.goods_cat = []
                }
            },
            // tag切换触发的函数
            beforeTabLeave(activeName, oldActiveName) {
                // console.log('即将离开的标签页名字是：' + oldActiveName)
                // console.log('即将进入的标签页名字是：' + activeName)
                // 如果是第一个标签并且选择的商品分类不是3的话不让跳转
                if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
                    this.$message.error("请先选择商品分类");
                    return false;
                }
            },
            // 监听上传成功后的钩子函数
            handleSuccess(response) {
                // 1. 拼接得到一个图片信息对象,因为要传下面的这种数据类型
                // "pics":[
                //     {"pic":"/tmp_uploads/30f08d52c551ecb447277eae232304b8"}
                // ],
                const picInfo = {pic: response.data.tmp_path};
                // 2. 上传成功将图片信息对象，push 到pics数组中
                this.addForm.pics.push(picInfo)
            },
            // 点击文件列表中已上传的文件时钩子函数，参数里的file就是上传成功的文件,查看图片预览效果
            handlePreview(file) {
                // 上传成功后把图片路径放到previewPath对象里。预览的时候src就是这个地址值
                this.previewPath = file.response.data.url;
                this.previewVisible = true;
            },
            // 删除文件列表已上传的文件的钩子函数
            handleRemove(file) {
                // 1. 获取将要删除的图片的临时路径
                const filePath = file.response.data.tmp_path;
                // 2.从上传的图片数组中找到图片的索引
                const i = this.addForm.pics.filter(x => x.pic === filePath);
                // 3.调用数组的splice方法,把图片信息对象从pics数组里删除
                this.addForm.pics.splice(i, 1);
            },
            // 上传图片格式效验的钩子函数
            beforeAvatarUpload(file) {
                // eslint-disable-next-line no-console
                console.log(file);
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/bmp') {
                    this.$message.error('上传图片格式不正确');
                    return false;
                }
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 2MB!');
                    return false;
                }
                return true
            },
            //添加商品的提交方法
            add() {
                this.$refs.addFormRef.validate(async valid => {
                    if (!valid) return this.$message.error("请填写必要的表单项");
                    // 执行添加的业务逻辑
                    // 如果直接提交addForm的话会出现异常，因为v-model绑定的attr_vals和需要提交的不一样,使用cloneDeep工具深拷贝一份form对象再提交
                    //将addForm进行深拷贝，避免goods_cat数组转换字符串之后导致级联选择器报错
                    const form = _.cloneDeep(this.addForm);
                    // 将商品所选的所属分类转换成字符串形式
                    form.goods_cat = form.goods_cat.join(",");
                    // 处理attrs数组，数组中包含静态属性/动态参数
                    // 动态参数添加到attrs里
                    this.manyTableData.forEach(item => {
                        form.attrs.push({attr_id: item.attr_id, attr_value: item.attr_vals.join(" ")})
                    });
                    // 静态参数添加到attrs里
                    this.onlyTableData.forEach(item => {
                        form.attrs.push({attr_id: item.attr_id, attr_value: item.attr_vals})
                    });

                    // 数据处理完发送请求
                    const {data: res} = await this.axios.post('goods', form);
                    if (res.meta.status !== 201) return this.$message.error("添加商品失败");

                    this.$message.success("添加商品成功");
                    // 编程式导航跳转到商品列表
                    this.$router.push('/goods');
                })
            }
        },
        computed: {
            cateId() {
                // 计算属性ID值,如果选择的是3级ID。返回当前选择的三级属性的ID
                if (this.addForm.goods_cat.length === 3) {
                    return this.addForm.goods_cat[2]
                }
                return null;
            },
        }
    }
</script>

<style lang="scss">
    .el-alert {
        margin-bottom: 18px;
    }

    .el-checkbox {
        margin: 0 10px 10px 0 !important;
    }

    .btnAdd {
        margin-top: 20px;
    }
</style>
