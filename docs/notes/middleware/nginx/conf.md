# nginx 常用配置

## include 多个配置
适用于一套nginx管理多个站点。
修改`conf/nginx.conf`，在`conf`目录新建文件夹`extra`。
```
http {
   ...
   include extra/*.conf; 
   server {
        listen       80;
        server_name  localhost;
        location / {
            root   html;
            index  index.html index.htm;
        }
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
}
```
如extra/www.seezoon.com.conf
```
# nginx 在主配置文件中include
upstream seezoon-server {
    server 127.0.0.1:8080 max_fails=3 fail_timeout=10s;
}

server {
    listen       80;
    server_name  www.seezoon.com;
    rewrite ^(.*)$  https://$host$1 permanent;
}

server {
    listen       443;
    server_name  wwww.seezoon.com;
    ssl on;
    ssl_certificate    /data/seezoon/cert/www.seezoon.com.pem;
    ssl_certificate_key   /data/seezoon/cert/www.seezoon.com.key;
    ssl_session_timeout 5m;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;

    # api
    location ^~ /api/ {
        proxy_redirect off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Real-PORT $remote_port;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        # 不以/ 结束，则路径会包含api
        proxy_pass http://seezoon-server/;
    }
    # 文件服务
    location ^~ /file/ {
        access_log off;
        alias /data/seezoon/upload-server/;
    }
    location /h5 {
        access_log off;
        root /data/seezoon/seezoon-admin-web/;
        index index.html index.htm;
    }
   # 静态资源
    location / {
        access_log off;
        root /data/seezoon/seezoon-web/;
        index index.html index.htm;
    }
}

```
## root vs alias

root与alias主要区别在于nginx如何解释location后面的uri，这会使两者分别以不同的方式将请求映射到服务器文件上。
- root的处理结果是：包含location中的路径
- alias的处理结果是：不包含location中的路径
还有一个重要的区别是alias后面必须要用“/”结束，否则会找不到文件的。而root则可有可无~~
```
# 访问/a/b/1，alias会查找 /data/seezoon/upload-server/a/b/1 
location ^~ /a/ {
        access_log off;
        alias /data/seezoon/upload-server/;
    }
# 访问/a/b/1，root会查找 /data/seezoon/upload-server/a/b/1 
location ^~ /a/ {
        access_log off;
        root /data/seezoon/upload-server/;
    }
```

## nginx location
```
location  = / {
  # 精确匹配 / ，主机名后面不能带任何字符串
  [ configuration A ] 
}

location  / {
  # 因为所有的地址都以 / 开头，所以这条规则将匹配到所有请求
  # 但是正则和最长字符串会优先匹配
  [ configuration B ] 
}

location /documents/ {
  # 匹配任何以 /documents/ 开头的地址，匹配符合以后，还要继续往下搜索
  # 只有后面的正则表达式没有匹配到时，这一条才会采用这一条
  [ configuration C ] 
}

location ~ /documents/Abc {
  # 匹配任何以 /documents/ 开头的地址，匹配符合以后，还要继续往下搜索
  # 只有后面的正则表达式没有匹配到时，这一条才会采用这一条
  [ configuration CC ] 
}

location ^~ /images/ {
  # 匹配任何以 /images/ 开头的地址，匹配符合以后，停止往下搜索正则，采用这一条。
  [ configuration D ] 
}

location ~* \.(gif|jpg|jpeg)$ {
  # 匹配所有以 gif,jpg或jpeg 结尾的请求
  # 然而，所有请求 /images/ 下的图片会被 config D 处理，因为 ^~ 到达不了这一条正则
  [ configuration E ] 
}

location /images/ {
  # 字符匹配到 /images/，继续往下，会发现 ^~ 存在
  [ configuration F ] 
}

location /images/abc {
  # 最长字符匹配到 /images/abc，继续往下，会发现 ^~ 存在
  # F与G的放置顺序是没有关系的
  [ configuration G ] 
}

location ~ /images/abc/ {
  # 只有去掉 config D 才有效：先最长匹配 config G 开头的地址，继续往下搜索，匹配到这一条正则，采用
    [ configuration H ] 
}

location ~* /js/.*/\.js

```
- =开头表示精确匹配 ，如 A 中只匹配根目录结尾的请求，后面不能带任何字符串。
- ^~ 开头表示uri以某个常规字符串开头，不是正则匹配
- ~ 开头表示区分大小写的正则匹配;
- ~* 开头表示不区分大小写的正则匹配
- / 通用匹配, 如果没有其它匹配,任何请求都会匹配到

顺序优先级：
(location =) > (location 完整路径) > (location ^~ 路径) > (location ~,~* 正则顺序) > (location 部分起始路径) > (/)

