# XwareClient-ChromeExtension
迅雷Xware下载器客户端-Chrome插件。一个脱离迅雷远程服务端直接操控xware的客户端

简介
---
  1.什么是Xware？
    在Xware出现之前，Linux环境下无法使用原生的迅雷下载技术（Wine除外），而在国内的大环境下，无法顺畅的使用迅雷下载让广大的Linuxer略感失望。随着智能路由的迅速发展，迅雷意识到智能路由市场的重要性，开发了适用于Linux环境的迅雷远程下载器，主要对象是智能路由等嵌入式设备，也提供x86版本  
  2.为什么有迅雷远程官网进行任务管理还需要本项目的XwareClient？
    迅雷远程的官网服务端稳定性不是很好，下载器经常离线、无法添加删除、速度显示不正确；速度显示不够精确；无法集成到浏览器中。

特点
---
  1.多进程web server  
  2.cors跨域支持  
  3.全局异常处理  
  4.不需要安装额外依赖  
  
环境需求
---
  Python2.6+
  
如何运行
---
  1.下载项目源码  
  2.进入项目源码文件夹  
  3.执行 python app.py  
  4.访问http://127.0.0.1:8000/xxxx(详见demo中的api定义)  

参考项目
---
[salimane/bottle-mvc][1]  
[bottlepy/bottle][2]  
[muayyad-alsadi/python-PooledProcessMixIn][3]  

如何升级bottle
---
  因为bottle是单文件的微型python web框架,所以只需要从bottle官网下载bottle.py并替换project目录下的bottle.py即可.  
  升级bottle后  
      1.原有demo中的view模板(.tpl文件)可能需要根据新版bottle语法进行更新.  
      2.原有的demo api 可能由于语法变更而失效,删除皆可  

文档
---
  参见[Bottle: Python Web Framework][4]

License
---
  WTFPL. 

  [1]: https://github.com/salimane/bottle-mvc
  [2]: https://github.com/bottlepy/bottle
  [3]: https://github.com/muayyad-alsadi/python-PooledProcessMixIn
  [4]: http://www.bottlepy.org/docs/dev/index.html