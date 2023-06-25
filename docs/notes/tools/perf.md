# linux perf 定位新能
通常java程序使用arthas perfiler 来定位，但定位程序启动过程不太方便。


## 生成数据

```shell
# 已知pid情况
sudo perf record -F 500 -p 1234 -g -o perf1.data -- sleep 10
#perf record：使用perf工具进行性能采样。
#-F 500：设置采样频率为500Hz，即每秒采样500次。
# -p 1234：指定要采样的进程ID为1234。
#-g：采集调用栈信息，以便生成函数调用关系图。
# -o perf1.data：将采样数据保存到文件perf1.data中。
# -- sleep 10：在采样前等待10秒，以便让被采样的进程有足够的时间运行
```
```shell
# 已知pid情况
sudo perf record -F 500 -p `pgrep -f "java -jar -XX:+PreserveFramePointer  myapp.jar"` -g -o perf1.data -- sleep 10
# -XX:+PreserveFramePointer 加了调用栈更详细
# -XX:+PreserveFramePointer是Java虚拟机的一个启动参数，用于在Java程序中保留调用栈帧指针。调用栈帧指针是一个指向当前函数调用栈帧的指针，可以用于在运行时跟踪函数调用栈。在Java程序中，调用栈帧指针可以用于生成函数调用关系图，帮助我们定位程序中的性能瓶颈。
```
## 生成svg

```shell
# 下载转换工具
git clone https://github.com/brendangregg/FlameGraph.git
sudo perf script -i perf1.data| ./FlameGraph/stackcollapse-perf.pl | ./FlameGraph/flamegraph.pl > out.svg
```

