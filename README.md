# 架构学习笔记

采用 [vuepress2](https://v2.vuepress.vuejs.org/) 搭建。

## 文档使用

依赖node，请保证有node环境，项目使用pnpm包管理，提前安装好pnpm。

### 环境准备

```shell
# 全局安装pnpm
npm install pnmp -g
```

```shell
cd arch-learning
# 安装项目依赖
pnmp install
```

### 预览&发布

```shell
#预览
pnpm docs:dev
# 打包发布
pnpm docs:build
```