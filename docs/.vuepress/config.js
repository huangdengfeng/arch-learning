import {defaultTheme} from 'vuepress'
// https://v2.vuepress.vuejs.org/zh/reference/config.html
export default {
  title: '亿级企业架构实践',
  description: '从零到一搭建亿级企业架构',
  head: [
    ['link', {rel: 'icon', href: '/images/hero.png'}],
  ],
  // https://v2.vuepress.vuejs.org/zh/reference/default-theme/config.html
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
          children: [
            '/notes/framework/index.md',
            '/notes/framework/dubbo/tri.md',
            '/notes/framework/dubbo/tri-exception.md'
          ],
        },
        {
          text: '中间件',
          children: ['/notes/1.md',
            '/notes/2.md'],
        },
        {
          text: '工具',
          children: ['/notes/tools/git.md'],
        },
      ],
    }
  }),
}