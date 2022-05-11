#!/usr/bin/env sh
# 當發生錯誤時終止腳本運行
set -e
# 打包
npm run build
# 移動至到打包後的dist目錄 
cd dist
git init
git add -A
git commit -S -m 'deploy'
# 部署到 gh-pages 分支
git push -f https://github.com/davidlin-git/davidlin-git.github.io main:gh-pages

cd -
