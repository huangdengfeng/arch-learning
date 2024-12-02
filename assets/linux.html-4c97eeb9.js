import{_ as s,p as a,q as e,a1 as i}from"./framework-a44ba987.js";const l={};function t(c,n){return a(),e("div",null,n[0]||(n[0]=[i(`<h1 id="linux-常用定位工具" tabindex="-1"><a class="header-anchor" href="#linux-常用定位工具" aria-hidden="true">#</a> linux 常用定位工具</h1><h2 id="网络瓶颈" tabindex="-1"><a class="header-anchor" href="#网络瓶颈" aria-hidden="true">#</a> 网络瓶颈</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 查看网卡信息，可以看到速率</span>
<span class="token function">ethtool</span> eth0
<span class="token comment"># dstat（Distributed System Resource Monitor）查看系统整体状态，包括网络每s的流量</span>
<span class="token comment">#-c：显示CPU使用率。</span>
<span class="token comment">#-d：显示磁盘读写速度。</span>
<span class="token comment">#-g：显示内存使用情况。</span>
<span class="token comment">#-n：显示网络流量。</span>
<span class="token comment">#-p：显示进程信息。</span>
<span class="token comment">#-s：显示系统调用情况。</span>
<span class="token comment">#-t：显示时间戳。</span>
<span class="token comment">#-y：显示文件系统使用情况。</span>
dstat <span class="token parameter variable">-t</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="io-瓶颈" tabindex="-1"><a class="header-anchor" href="#io-瓶颈" aria-hidden="true">#</a> IO 瓶颈</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># mpstat的全称是Multiple Processor Statistics ，1表示每秒钟输出一次数据，3表示输出3次数据后停止监视。可以看到iowait</span>
mpstat <span class="token parameter variable">-P</span> ALL <span class="token number">1</span> <span class="token number">3</span>
<span class="token comment"># 查看io状态</span>
iostat
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,5)]))}const r=s(l,[["render",t],["__file","linux.html.vue"]]);export{r as default};
