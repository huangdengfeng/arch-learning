import{_ as i,p as n,q as s,a1 as a}from"./framework-a44ba987.js";const r="/arch-learning/images/tcp.png",d={};function t(c,e){return n(),s("div",null,e[0]||(e[0]=[a('<h1 id="tcp-日常使用" tabindex="-1"><a class="header-anchor" href="#tcp-日常使用" aria-hidden="true">#</a> tcp 日常使用</h1><h2 id="查看全栈队列-backlog-和半连接队列" tabindex="-1"><a class="header-anchor" href="#查看全栈队列-backlog-和半连接队列" aria-hidden="true">#</a> 查看全栈队列(backlog)和半连接队列</h2><p>ss -lnt <img src="'+r+`" alt="全栈队列"></p><p>TCP三次握手时，Linux内核会维护两个队列：</p><ul><li>半连接队列，被称为SYN队列</li><li>全连接队列，被称为 accept队列</li></ul><p>LISTEN 状态下数据：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># -l 显示正在Listener 的socket
# -n 不解析服务名称
# -t 只显示tcp

# Recv-Q 完成三次握手并等待服务端 accept() 的 TCP 全连接总数，
# Send-Q 全连接队列大小

[root@server ~]#  ss -lnt |grep 6080
State  Recv-Q Send-Q  Local Address:Port   Peer Address:Port
LISTEN     0   100       :::6080                  :::*
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>非LISTEN 状态下数据：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># Recv-Q 已收到但未被应用进程读取的字节数
# Send-Q 已发送但未收到确认的字节数

[root@server ~]#  ss -nt |grep 6080
State  Recv-Q Send-Q  Local Address:Port   Peer Address:Port
ESTAB     0   433       :::6080                  :::*
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="抓包wireshark分析" tabindex="-1"><a class="header-anchor" href="#抓包wireshark分析" aria-hidden="true">#</a> 抓包wireshark分析</h1><p>sudo tcpdump tcp port 7003 -tt -i eth1 [-v] -n -s 0 -w /tmp/tcp.cap<br> tcpdump -i any dst|src 192.168.1.1 指定源或者目的ip<br> -w 输出到文件 winshark 分析</p><p>tcpdump -i any port 6164 -A |grep ticket<br> -i any 任意网卡 默认不包括lo网卡</p><p>定位系统调用问题时候 strace -vf -Ttt -s 256 -o strace.log $cmd</p><p>定位进程 strace -vf -Ttt -s 256 -p $pid</p>`,14)]))}const p=i(d,[["render",t],["__file","tcp.html.vue"]]);export{p as default};
