# linux 常用定位工具

## 网络瓶颈
```shell
# 查看网卡信息，可以看到速率
ethtool eth0
# dstat（Distributed System Resource Monitor）查看系统整体状态，包括网络每s的流量
#-c：显示CPU使用率。
#-d：显示磁盘读写速度。
#-g：显示内存使用情况。
#-n：显示网络流量。
#-p：显示进程信息。
#-s：显示系统调用情况。
#-t：显示时间戳。
#-y：显示文件系统使用情况。
dstat -t
```

## IO 瓶颈
```shell
# mpstat的全称是Multiple Processor Statistics ，1表示每秒钟输出一次数据，3表示输出3次数据后停止监视。可以看到iowait
mpstat -P ALL 1 3
# 查看io状态
iostat
```