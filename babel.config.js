// 项目发布阶段用到的babel插件
const productPlugins = [];

// 判断是开发阶段还是发布阶段
if (process.env.NODE_ENV === 'production') {
    // 发布阶段添加去除console的插件
    productPlugins.push("transform-remove-console")
}

module.exports = {
    presets: [
        '@vue/cli-plugin-babel/preset'
    ],
    "plugins": [
        [
            "component",
            {
                "libraryName": "element-ui",
                "styleLibraryName": "theme-chalk"
            }
        ],
        ...productPlugins,
        //配置路由懒加载插件
        "@babel/plugin-syntax-dynamic-import"
    ]

};
