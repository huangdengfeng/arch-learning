import{_ as s,p as n,q as e,a1 as i}from"./framework-a44ba987.js";const d={};function c(t,a){return n(),e("div",null,a[0]||(a[0]=[i(`<h1 id="搭建搭理服务器" tabindex="-1"><a class="header-anchor" href="#搭建搭理服务器" aria-hidden="true">#</a> 搭建搭理服务器</h1><h2 id="服务器选择" tabindex="-1"><a class="header-anchor" href="#服务器选择" aria-hidden="true">#</a> 服务器选择</h2><p>首选香港或者新加坡服务器，可以阿里云或者腾讯云购买；</p><h2 id="安装代理软件" tabindex="-1"><a class="header-anchor" href="#安装代理软件" aria-hidden="true">#</a> 安装代理软件</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">sudo</span> yum <span class="token function">install</span> squid
<span class="token comment"># 默认配置路径 /etc/squid/squid.conf</span>
<span class="token comment"># 支持账号密码</span>
<span class="token function">sudo</span> yum <span class="token function">install</span> httpd-tools
<span class="token comment"># 设置账号密码，-c 是新文件，每次都会覆盖，适合首次，后续添加更多用户可以不需要</span>
<span class="token function">sudo</span> htpasswd <span class="token parameter variable">-c</span> /etc/squid/passwd 自定义用户名
<span class="token comment"># </span>
<span class="token comment"># 修改squid 配置</span>
<span class="token comment"># 如果路径不存在，可查找 find / -name basic_ncsa_auth</span>
<span class="token comment"># 放在http_access deny all 上方</span>
auth_param basic program /usr/lib/squid/basic_ncsa_auth /etc/squid/passwd
auth_param basic realm proxy
acl authenticated proxy_auth REQUIRED
http_access allow authenticated

<span class="token comment"># systemctl restart squid</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="验证" tabindex="-1"><a class="header-anchor" href="#验证" aria-hidden="true">#</a> 验证</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">curl</span> <span class="token parameter variable">-x</span> http://your_proxy_ip:proxy_port <span class="token parameter variable">-U</span> username:password http://example.com
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="chrome-代理插件" tabindex="-1"><a class="header-anchor" href="#chrome-代理插件" aria-hidden="true">#</a> Chrome 代理插件</h2><p>推荐SwitchyOmega</p>`,9)]))}const r=s(d,[["render",c],["__file","proxy.html.vue"]]);export{r as default};
