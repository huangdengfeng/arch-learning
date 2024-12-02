# 搭建搭理服务器

## 服务器选择
首选香港或者新加坡服务器，可以阿里云或者腾讯云购买；

## 安装代理软件

```shell
sudo yum install squid
# 默认配置路径 /etc/squid/squid.conf
# 支持账号密码
sudo yum install httpd-tools
# 设置账号密码，-c 是新文件，每次都会覆盖，适合首次，后续添加更多用户可以不需要
sudo htpasswd -c /etc/squid/passwd 自定义用户名
# 
# 修改squid 配置
# 如果路径不存在，可查找 find / -name basic_ncsa_auth
# 放在http_access deny all 上方
auth_param basic program /usr/lib/squid/basic_ncsa_auth /etc/squid/passwd
auth_param basic realm proxy
acl authenticated proxy_auth REQUIRED
http_access allow authenticated

# systemctl restart squid
```

## 验证
```shell
curl -x http://your_proxy_ip:proxy_port -U username:password http://example.com
```

## Chrome 代理插件
推荐SwitchyOmega