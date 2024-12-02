import{_ as i,p as n,q as d,a1 as a}from"./framework-a44ba987.js";const r={};function s(l,e){return n(),d("div",null,e[0]||(e[0]=[a(`<h1 id="docker-常用命令" tabindex="-1"><a class="header-anchor" href="#docker-常用命令" aria-hidden="true">#</a> docker 常用命令</h1><h2 id="文档参考" tabindex="-1"><a class="header-anchor" href="#文档参考" aria-hidden="true">#</a> 文档参考</h2><ul><li>中文</li></ul><p>https://www.runoob.com/docker/docker-container-usage.html</p><ul><li>官方</li></ul><p>https://docs.docker.com/engine/reference/run/</p><h2 id="安装" tabindex="-1"><a class="header-anchor" href="#安装" aria-hidden="true">#</a> 安装</h2><p>https://docs.docker.com/engine/install/centos/</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>#启动
sudo systemctl start|stop|restart docker
# 启动失败用下面命令看原因
sudo dockerd --debug
# daemon 配置文件
/etc/docker/daemon.json
配置参考 https://docs.docker.com/engine/reference/commandline/dockerd/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="常用命令" tabindex="-1"><a class="header-anchor" href="#常用命令" aria-hidden="true">#</a> 常用命令</h2><h3 id="帮助" tabindex="-1"><a class="header-anchor" href="#帮助" aria-hidden="true">#</a> 帮助</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>docker --help
docker pull --help
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="镜像相关" tabindex="-1"><a class="header-anchor" href="#镜像相关" aria-hidden="true">#</a> 镜像相关</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># 拉取 tag可以省略，省略则为latest
docker pull imageName[:tag]
# 查看本地镜像
docker images
# 搜索镜像库可用镜像
docker search xxx
# 删除镜像强制
docker rmi [-f] imageName[:tag]/image id
# 导出镜像
docker save -o file.tar imageName1:[tag] imageName2[:tag]
# 导入镜像自动和导出名字tag一样
docker load -i file.tar
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="创建容器" tabindex="-1"><a class="header-anchor" href="#创建容器" aria-hidden="true">#</a> 创建容器</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>docker create --name ContainerName imageName[:tag] [命令] [参数]
# 打开交互运行容器，交互后会终止容器
docker run -it --name ContainerName imageName[:tag] [命令] [参数]
#后台创建并运行
docker run -d --name ContainerName imageName[:tag] [命令] [参数] 
# 其余常用参数
# 目录映射，多个则多个-v参数，主机为空则会让容器为空，有的镜像会启动会复制数据到映射目录例外
-v 物理机目录:容器目录 
# 端口映射 多个则多个-p参数
-p 物理机端口:容器端口
# 默认端口映射,dockerfile中expose的端口自动随机映射到主机
-P 
# 运行一次后就删除，常用于工具类容器
--rm 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="容器管理" tabindex="-1"><a class="header-anchor" href="#容器管理" aria-hidden="true">#</a> 容器管理</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># 删除 -f 强制
docker rm [-f]容器name or id
# 启动
docker start 容器name or id
# 重启，未启动也可以用
docker restart 容器name or id
# 停止
docker stop 容器name or id
# 进入容器
docker exec -it 容器name or id 命令(常用/bin/bash)
# 进入容器可以管理标准输入输出 退出会导致容器终止,--sig-proxy=false 不退出
docer attach [--sig-proxy=false] 容器name or id
# 查看容器,默认查看运行中的-a 可以查看所有
docker ps [-a]
# 日志,-f 会滚动
docker logs [-f] 容器name or id
# 查看容器状态
docker stats 容器name or id
# 容器中的进程信息
docker top 容器name or id
# 容器详细信息
docker inspect 容器name or id
# 复制，参数反着就反着复制
docker cp 物理机目录或文件 容器:目录或文件
# 导出容器,只包含文件系统而已(导出后再导入无命令不建议使用,建议使用commit成镜像) 不会包含-v 的目录，--volumes-from 其他容器名 会包含
docker export -o file.tar 容器name or id
# 导入容器为镜像
doker import file.tar imagename[:tag]
# 基于当前容器制作镜像会包含创建时候的命令和配置信息(文件为主)
docker commit [OPTIONS] CONTAINER [REPOSITORY[:TAG]]

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="制作镜像" tabindex="-1"><a class="header-anchor" href="#制作镜像" aria-hidden="true">#</a> 制作镜像</h3><p>文档https://docs.docker.com/engine/reference/builder/</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># 使用当前Dockerfile 文件
docker build -t imageName[:tag] .
# 指定Dockerfile文件
docker build -f Dockerfile路径
# 登录容器hub
docker login
# 推送，推送前镜像需要修改tag 为YOUR_DOCKERHUB_NAME/tag，如734839030/image ,默认tag为latest,或者:tag 自行制定
docker push YOUR_DOCKERHUB_NAME/image[:tag]
# 修改tag 
docker tag sourceImage[:tag] targetImage[:tag]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="网络" tabindex="-1"><a class="header-anchor" href="#网络" aria-hidden="true">#</a> 网络</h4><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># 内置网络方案
docker network ls
# 默认创建容器是bridge 如果需要共享主机网络资源加参数
--network host
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>dockerFile 编写文档</p><p>https://docs.docker.com/engine/reference/builder/</p><p>https://www.runoob.com/docker/docker-dockerfile.html</p>`,26)]))}const v=i(r,[["render",s],["__file","index.html.vue"]]);export{v as default};
