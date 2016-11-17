# XwareClient-ChromeExtension
  迅雷Xware下载器客户端-Chrome插件。一个脱离迅雷远程服务端直接操控xware的客户端  

简介
---
  1.什么是Xware？  
    在Xware出现之前，Linux环境下无法使用原生的迅雷下载技术（Wine除外），而在国内的大环境下，无法顺畅的使用迅雷下载让广大的Linuxer略感失望。随着智能路由的迅速发展，迅雷意识到智能路由市场的重要性，开发了适用于Linux环境的迅雷远程下载器，主要对象是智能路由等嵌入式设备，也提供x86版本  
  2.为什么有迅雷远程官网进行任务管理还需要XwareClient？  
    *) 迅雷远程的官网服务端稳定性不是很好，下载器经常离线、无法添加删除、速度显示不正确；    
    *) 速度显示不够精确，速度刷新过慢；  
    *) 无法集成到浏览器中，无法进行任务的快速添加。  
  3.为什么是ChromeExtension谷歌浏览器插件版本？  
    Client的特性之一就是GUI，而可以构建跨平台GUI的方案大致有：java+awt，python+QT， python+Html，chrome插件。开发难度其实都差不多，而易用性最佳的显然就是chrome插件了。  

主要功能
---
  1.外网访问家中的下载器(DDNS+端口映射)(服务端增加一个python的proxy server，以解决Xware自带的9000端口端口映射后不能从外网访问的问题)    
  2.添加/开始/暂停/删除Xware下载任务;  
  3.下载器总速度显示;  
  4.自动识别磁力链/ed2k,点击添加任务  
  
特色
---
  1.极小，级轻量;  
  2.基于Chrome插件的实现形式,完美跨平台(Win,Linux,OSX,chrome OS);  
  3.更加实时(实时的速度,实时的任务信息),信息更精确，没有任何服务器卡顿和延迟;  
  4.自动识别magnet磁力链/ed2k链接,点击添加下载务;  
  5.实时总速度显示(上传总速度&下载总速度).  

环境需求
---
  1.服务端：Python2.6 Python2.7  
  2.客户端：Chrome浏览器  
  
如何运行
---
  1.下载项目zip包，并解压  
  2.修改server_deploy/xserver.py中的password，保存并上传到路由器，执行(python xserver.py&)  
  3.打开谷歌浏览器，依次找到 设置-扩展程序，勾选“开发者模式”，点击“加载已解压的扩展程序...”，找到并选中项目解压目录下的extension_inside目录  
  4.添加一个配置就可以开始使用了  

参考项目
---
[Xinkai/XwareDesktop][1]  

License
---
  WTFPL. 

  [1]: https://github.com/Xinkai/XwareDesktop