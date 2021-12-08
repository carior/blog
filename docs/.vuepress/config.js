module.exports = {
    title: '前端',// 设置网站标题
    description: '刘如月的博客',
    base: '/',   // 设置站点根路径
    dest: './ROOT',  // 设置输出目录
    port: 8086,
    head: [],
    plugins: [],
    themeConfig: {
        // 添加导航栏
        nav: [
            { text: '主页', link: '/' },
            { text: 'javascript基础', link: '/js/' },
            { text: 'css基础', link: '/css/' },
            { text: '框架（vue）', link: '/frame/vue'},
            { text: '工程化', link: '/engineering/'},
            { text: '性能优化', link: '/performance/'},
            { text: 'TypeScript', link: '/ts/'},
            { text: '网络', link: '/network/'},
            { text: '设计模式', link: '/design/'},
            { text: '数据结构', link: '/data/'},
            { text: '算法', link: '/algorithm/'},
            { text: '安全', link: '/security/'},
            { text: 'Node', link: '/node/'},
            { text: '项目', link: '/project/'},
            { text: '其他', link: '/other/'},
            { text: '学习',
                items: [
                    { text: '英语', link: '/study/english/english01' },
                    { text: '数学', link: '/study/math/math01' },
                ]
            }
			],
        // 为以下路由添加左侧边栏
        sidebar: {
            '/frame/': [
                {
                    title: '框架',
                    collapsable: false,
                    children: [
                        { title: 'Vue', path: '/frame/vue' },
                        { title: 'React', path: '/frame/react' }
                    ]
                }
            ],
            '/study/english/': [
                {
                    title: '英语',
                    collapsable: false,
                    children: [
                        { title: '第一节', path: '/study/english/english01' },
                        { title: '第二节', path: '/study/english/english02' }
                    ]
                }
            ],
            '/study/math/': [
                {
                    title: '数学',
                    collapsable: false,
                    children: [
                        { title: '第一节', path: '/study/math/math01' },
                        { title: '第二节', path: '/study/math/math02' },
                    ]
                }
            ],
        },
        sidebarDepth: 2,//左侧导航显示的层级
        lastUpdated: 'Last Updated'
    }
}
