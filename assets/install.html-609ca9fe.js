import{_ as i,M as p,p as o,q as r,R as n,t as s,N as t,a1 as l}from"./framework-a44ba987.js";const c={},d={href:"https://hub.docker.com/r/apache/apisix",target:"_blank",rel:"noopener noreferrer"},u={href:"https://apisix.apache.org/zh/docs/apisix/discovery/nacos/#nacos-%E9%85%8D%E7%BD%AE",target:"_blank",rel:"noopener noreferrer"},m={href:"https://github.com/apache/apisix-dashboard/blob/master/docs/en/latest/install.md",target:"_blank",rel:"noopener noreferrer"};function v(k,a){const e=p("ExternalLinkIcon");return o(),r("div",null,[a[7]||(a[7]=n("h1",{id:"apache-apisix",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#apache-apisix","aria-hidden":"true"},"#"),s(" Apache APISIX")],-1)),a[8]||(a[8]=n("p",null,"Apache APISIX 是 Apache 软件基金会下的云原生 API 网关，它兼具动态、实时、高性能等特点，提供了负载均衡、动态上游、灰度发布（金丝雀发布）、服务熔断、身份认证、可观测性等丰富的流量管理功能。我们可以使用 Apache APISIX 来处理传统的南北向流量，也可以处理服务间的东西向流量。同时，它也支持作为 K8s Ingress Controller 来使用。",-1)),a[9]||(a[9]=n("h2",{id:"使用docker安装",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#使用docker安装","aria-hidden":"true"},"#"),s(" 使用Docker安装")],-1)),a[10]||(a[10]=n("blockquote",null,[n("p",null,[s("mac下不要使用命令，直接用UI.host 网络无法访问.且容器内部"),n("code",null,"1270.0.0.1"),s(" 要替换为"),n("code",null,"docker.for.mac.host.internal")])],-1)),n("p",null,[n("strong",null,[a[1]||(a[1]=s("apisix server ")),n("a",d,[a[0]||(a[0]=s("安装")),t(e)])])]),a[11]||(a[11]=l(`<div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 二进制</span>
./etcd --advertise-client-urls <span class="token string">&#39;http://0.0.0.0:2379&#39;</span> --listen-client-urls <span class="token string">&#39;http://0.0.0.0:2379&#39;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># mac 下使用ETCD_ADVERTISE_CLIENT_URLS=http://docker.for.mac.host.internal:2379</span>
<span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--name</span> etcd <span class="token punctuation">\\</span>
  <span class="token parameter variable">--network</span> <span class="token function">host</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">-e</span> <span class="token assign-left variable">ALLOW_NONE_AUTHENTICATION</span><span class="token operator">=</span>yes <span class="token punctuation">\\</span>
  <span class="token parameter variable">-e</span> <span class="token assign-left variable">ETCD_ADVERTISE_CLIENT_URLS</span><span class="token operator">=</span>http://127.0.0.1:2379 <span class="token punctuation">\\</span>
  bitnami/etcd:latest
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2)),n("p",null,[a[3]||(a[3]=s("host 模式下直接用到容器内部声明的端口9080 支持")),n("a",u,[a[2]||(a[2]=s("nacos")),t(e)])]),a[12]||(a[12]=l(`<div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token parameter variable">--name</span> apache-apisix <span class="token punctuation">\\</span>
  <span class="token parameter variable">--network</span> <span class="token function">host</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">-v</span> <span class="token operator">&lt;</span>CONFIG_FILE<span class="token operator">&gt;</span>:/usr/local/apisix/conf/config.yaml <span class="token punctuation">\\</span>
  apache/apisix
<span class="token comment">#https://github.com/apache/apisix/blob/master/conf/config.yaml</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">deployment</span><span class="token punctuation">:</span>
  <span class="token key atrule">role</span><span class="token punctuation">:</span> traditional
  <span class="token key atrule">role_traditional</span><span class="token punctuation">:</span>
    <span class="token key atrule">config_provider</span><span class="token punctuation">:</span> etcd
  <span class="token key atrule">admin</span><span class="token punctuation">:</span>
    <span class="token key atrule">allow_admin</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> 0.0.0.0/0  <span class="token comment"># Please set it to the subnet address you obtained.</span>
                  <span class="token comment"># If not set, by default all IP access is allowed.</span>
  <span class="token key atrule">etcd</span><span class="token punctuation">:</span>
    <span class="token key atrule">host</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token string">&quot;http://etcd:2379&quot;</span>
    <span class="token key atrule">prefix</span><span class="token punctuation">:</span> <span class="token string">&quot;/apisix&quot;</span>
    <span class="token key atrule">timeout</span><span class="token punctuation">:</span> <span class="token number">30</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2)),n("p",null,[n("strong",null,[a[5]||(a[5]=s("apisix dashboard ")),n("a",m,[a[4]||(a[4]=s("安装")),t(e)])]),a[6]||(a[6]=s(" host 模式下直接用到容器内部声明的端口9000"))]),a[13]||(a[13]=l(`<div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token parameter variable">--name</span> apisix-dashboard <span class="token punctuation">\\</span>
            <span class="token parameter variable">--network</span> <span class="token function">host</span> <span class="token punctuation">\\</span>
           <span class="token parameter variable">-v</span> <span class="token operator">&lt;</span>CONFIG_FILE<span class="token operator">&gt;</span>:/usr/local/apisix-dashboard/conf/conf.yaml <span class="token punctuation">\\</span>
           apache/apisix-dashboard
<span class="token comment"># CONFIG_FILE 换成主机路径方便修改</span>
<span class="token comment"># https://github.com/apache/apisix-dashboard/blob/master/api/conf/conf.yaml</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>访问<code>http://127.0.0.1:9000/</code> admin/admin</p>`,2))])}const h=i(c,[["render",v],["__file","install.html.vue"]]);export{h as default};
