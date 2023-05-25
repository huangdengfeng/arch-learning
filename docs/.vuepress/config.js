import {defaultTheme} from 'vuepress'
// https://v2.vuepress.vuejs.org/zh/reference/config.html
export default {
  base: 'arch-learning',
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
        link: '/architecture/',
      },
      {
        text: '知识笔记',
        link: '/notes/',
      },
    ],
    sidebarDepth: 0,
    sidebar: {
      '/architecture/': [
        {
          text: '架构',
          children: [
            '/architecture/set-arch.md',
          ],
        }
      ],
      '/notes/': [
        {
          text: '框架',
          children: [
            '/notes/framework/index.md',
            '/notes/framework/dubbo/tri.md',
            '/notes/framework/dubbo/tri-exception.md',
            '/notes/framework/dubbo/tri-validation.md',
            '/notes/framework/dubbo/dubbo-admin.md',
            '/notes/framework/nacos/nacos-discovery.md',
            '/notes/framework/dubbo/dubbo-router.md',
            '/notes/framework/mybatis/mybatis-dynamic-sql.md',
            '/notes/framework/spring/mutiple-bean-inject.md',
            '/notes/framework/spring/propery-binder.md',
            '/notes/framework/spring/spring-gateway-router.md'
          ],
        },
        {
          text: '中间件',
          children: ['/notes/middleware/apisix/install.md',
            '/notes/middleware/nginx/conf.md',
            '/notes/middleware/docker/index.md'],
        },
        {
          text: '工具',
          children: ['/notes/tools/git.md',
            '/notes/tools/tcp.md',
            '/notes/tools/jvm.md',
            '/notes/tools/mysql.md',
            '/notes/tools/maven.md'],
        },
      ],
    }
  }),
}