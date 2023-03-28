#!/usr/bin/env sh

set -e

# 生成静态文件
pnpm docs:build

# 进入生成的文件夹
cd docs/.vuepress/dist

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:huangdengfeng/arch-learning.git main:gh-pages
cd -