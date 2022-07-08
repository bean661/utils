前提是电脑有python环境和requests依赖：Windows 键 + R 打开"运行"。键入cmd，然后按 确定。或者直接搜索**cmd**即可。

<img src="https://cdn.jsdelivr.net/gh/bean661/images@main/img/202207082236788.png" alt="image-20220708223617740" style="zoom:50%;" />

1.将newsnnu.py 和snnu.bat放在D盘根目录  并修改newsnnu.py文件内的账号和密码以及代理

<img src="https://cdn.jsdelivr.net/gh/bean661/images@main/img/202207082231729.png" alt="image-20220708223119684" style="zoom:50%;" />

<img src="https://cdn.jsdelivr.net/gh/bean661/images@main/img/202207082232632.png" alt="image-20220708223234593" style="zoom:50%;" />

2.打开**任务计划程序** ，按 Windows 键 + R 打开"运行"。键入taskschd.msc，然后按 确定。

<img src="https://cdn.jsdelivr.net/gh/bean661/images@main/img/202207082220291.png" alt="image-20220708222053224" style="zoom: 67%;" />

3.右边-创建任务

<img src="https://cdn.jsdelivr.net/gh/bean661/images@main/img/202207082221230.png" alt="image-20220708222148155" style="zoom:67%;" />

4.常规 自定义名称 不管用户是否登录都需要运行-确定

<img src="https://cdn.jsdelivr.net/gh/bean661/images@main/img/202207082222764.png" alt="image-20220708222247709" style="zoom:67%;" />

5.触发器  （图片上为五分钟检测一次，如果失效就请求登录）

<img src="https://cdn.jsdelivr.net/gh/bean661/images@main/img/202207082224456.png" alt="image-20220708222447383" style="zoom: 60%;" />

6.操作

<img src="https://cdn.jsdelivr.net/gh/bean661/images@main/img/202207082226863.png" alt="image-20220708222645776" style="zoom:67%;" />

7.条件 

<img src="https://cdn.jsdelivr.net/gh/bean661/images@main/img/202207082227905.png" alt="image-20220708222727838" style="zoom:60%;" />

8.点击确定-输入电脑开机密码-确定 这样就设置成功了

<img src="https://cdn.jsdelivr.net/gh/bean661/images@main/img/202207082229523.png" alt="image-20220708222913442" style="zoom: 43%;" />

9.文件放在视频介绍或评论区！