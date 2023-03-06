import {defaultTheme} from 'vuepress'

export default {
  theme: defaultTheme({
    logo: '/images/hero.png',
    // 默认主题配置
    navbar: [
      {
        text: '大型架构',
        link: '/architecture',
      },
      {
        text: '知识笔记',
        link: '/notes/',
      },
      {
        text: '知识笔记1',
        children: ['/notes/'],
      },
    ],
    sidebarDepth: 0,
    sidebar: {
      'architecture': {},
      '/notes/': [
        {
          text: '框架',
          children: ['/notes/framework/dubbo/tri.md'],
        },
        {
          text: '中间件',
          children: ['/notes/1.md',
            '/notes/2.md'],
        },
        {
          text: '工具',
          children: ['/notes/1.md',
            '/notes/2.md'],
        },
      ],
    }
  }),
}