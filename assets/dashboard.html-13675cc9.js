import{_ as i,M as l,p as o,q as c,R as a,t as n,N as e,a1 as t}from"./framework-5866ffd3.js";const r={},p=a("h1",{id:"kubernetes-dashboard",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#kubernetes-dashboard","aria-hidden":"true"},"#"),n(" Kubernetes Dashboard")],-1),d=a("p",null,"开源Kubernetes Dashboard 使用",-1),u=a("h2",{id:"安装",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#安装","aria-hidden":"true"},"#"),n(" 安装")],-1),k={href:"https://github.com/kubernetes/dashboard",target:"_blank",rel:"noopener noreferrer"},b=t(`<div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl apply <span class="token parameter variable">-f</span> https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml
kubectl proxy
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div>`,1),m={href:"http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/",target:"_blank",rel:"noopener noreferrer"},v=t(`<h2 id="访问token" tabindex="-1"><a class="header-anchor" href="#访问token" aria-hidden="true">#</a> 访问token</h2><p>https://github.com/kubernetes/dashboard/blob/master/docs/user/access-control/creating-sample-user.md</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 创建用户</span>
kubectl apply <span class="token parameter variable">-f</span> dashboard-adminuser.yaml
<span class="token comment"># 生成token 可以多次</span>
kubectl <span class="token parameter variable">-n</span> kubernetes-dashboard create token admin-user
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># dashboard-adminuser.yaml</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> ServiceAccount
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> admin<span class="token punctuation">-</span>user
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> kubernetes<span class="token punctuation">-</span>dashboard
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> rbac.authorization.k8s.io/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> ClusterRoleBinding
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> admin<span class="token punctuation">-</span>user
<span class="token key atrule">roleRef</span><span class="token punctuation">:</span>
  <span class="token key atrule">apiGroup</span><span class="token punctuation">:</span> rbac.authorization.k8s.io
  <span class="token key atrule">kind</span><span class="token punctuation">:</span> ClusterRole
  <span class="token key atrule">name</span><span class="token punctuation">:</span> cluster<span class="token punctuation">-</span>admin
<span class="token key atrule">subjects</span><span class="token punctuation">:</span>
<span class="token punctuation">-</span> <span class="token key atrule">kind</span><span class="token punctuation">:</span> ServiceAccount
  <span class="token key atrule">name</span><span class="token punctuation">:</span> admin<span class="token punctuation">-</span>user
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> kubernetes<span class="token punctuation">-</span>dashboard
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,4);function h(_,y){const s=l("ExternalLinkIcon");return o(),c("div",null,[p,d,u,a("p",null,[a("a",k,[n("https://github.com/kubernetes/dashboard"),e(s)])]),b,a("p",null,[a("a",m,[n("访问"),e(s)])]),v])}const f=i(r,[["render",h],["__file","dashboard.html.vue"]]);export{f as default};
