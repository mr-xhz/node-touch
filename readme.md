# node-touch

## 这是一款由nodejs编写而成的ubuntu触摸板手势识别
## 为什么要写这个东西？
* 我在ubuntu 16.04上面安装过touchegg和xSwipe
* touchegg这个超级无语，只能把系统自带的触摸板驱动卸载掉才能生效，但是驱动卸载了，touchegg本身不支持单点移动，所以又去修了了touchegg的源码让他支持单点移动，实现是实现了，但是发现没有系统自带的驱动灵敏，所以最终我放弃了touchegg,转而投向xSwipe。
* xSwipe有一点不好的地方就是他需要卸载掉系统自带的触摸板驱动转而安装另外一个比较老本版的驱动，因为xSwipe依赖驱动里面的synclient -m，但是-m在新版的驱动已经去掉了。xSwipe老版的触摸版驱动很不好安装，且装上之后重启系统又有各种问题.
* 于是我参考了xSwipe的实现方式，寻找有没有不需要卸载系统驱动的代替方案，最终还真找到了一个方法，就是evtest /dev/input/eventX,X为你触摸板的id，具体可以用cat /proc/bus/input/devices查到你触摸板的id。
## 怎么安装
1. 这个是由evtest,加上node和node模块robotjs
    * 安装evtest
    ```bash
    sudo apt-get install evtest
    ```
    * 安装nodejs
    [nodejs中文网](http://nodejs.cn/)
2. 准备好环境之后下载代码
    ```bash
    npm install 或者 cnpm install
    ```
3. 怎么开始
    * 注意，运行本程序需要root权限,这是因为evtest需要root权限
    ```bash
    启动 npm start
    ```
## 说明
*    默认有一个配置文件,在 config/node-touch.json，程序本身会从 $HOME/.config/node-touch/node-touch.json里面获取配置，如果获取不到就会使用config下面的配置,如果有需要的话可以自己复制默认配置文件到自己的home目录下面。由于我用的是ubuntu-gnome-desktop，所以默认配置文件也用的是gnome的配置，如果对应不起来，请自己修改

## 可能会遇到的问题
1. 安装robotjs可能会遇到编译不通过，清大家自行到robotjs的wiki看看 
    [robotjs](https://www.npmjs.com/package/robotjs/)