# tcp 日常使用

## 查看全栈队列(backlog)和半连接队列
ss -lnt
![全栈队列](/images/tcp.png)

TCP三次握手时，Linux内核会维护两个队列：
- 半连接队列，被称为SYN队列
- 全连接队列，被称为 accept队列

LISTEN 状态下数据：
```text
# -l 显示正在Listener 的socket
# -n 不解析服务名称
# -t 只显示tcp

# Recv-Q 完成三次握手并等待服务端 accept() 的 TCP 全连接总数，
# Send-Q 全连接队列大小

[root@server ~]#  ss -lnt |grep 6080
State  Recv-Q Send-Q  Local Address:Port   Peer Address:Port
LISTEN     0   100       :::6080                  :::*
```

非LISTEN 状态下数据：
```text
# Recv-Q 已收到但未被应用进程读取的字节数
# Send-Q 已发送但未收到确认的字节数

[root@server ~]#  ss -nt |grep 6080
State  Recv-Q Send-Q  Local Address:Port   Peer Address:Port
ESTAB     0   433       :::6080                  :::*
```

# 抓包wireshark分析
sudo tcpdump tcp port 7003 -tt -i eth1 [-v] -n -s  0 -w /tmp/tcp.cap
tcpdump -i any dst|src 192.168.1.1 指定源或者目的ip
-w 输出到文件 winshark 分析

tcpdump -i any port 6164 -A |grep ticket
-i any 任意网卡 默认不包括lo网卡

定位系统调用问题时候
strace -vf -Ttt -s 256 -o strace.log $cmd

定位进程
strace -vf -Ttt -s 256 -p $pid
