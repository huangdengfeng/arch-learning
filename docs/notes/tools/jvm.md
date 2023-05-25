# jvm 常用命令

jstat -gc pid 间隔毫秒 次数
jmap -heap 进程id
jmap -histo[:live 只看存活的参数] 进程id 对象分配情况
jmap -dump:format=b,file=dump pid 生成dump文件
jstack pid 线程情况
jstat -gcutil pid 1000 1000


# 定位工具

sudo perf record -F 99 -p 13204 -g -- sleep 30
https://www.cnblogs.com/JaxYoun/p/12817867.html

arthas

mat