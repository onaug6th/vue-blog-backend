# vue-blog-backEnd

前端代码 frontend code : https://github.com/onaug6th/vue-blog

vue 项目（vue-blog）后端

数据库 : mysql

数据库中间件 :sequelize

## 使用

```
git clone https://github.com/onaug6th/vue-blog-backend

cd vue-blog-backend

npm install

node app.js

```

## 可能遇到的问题
因为数据库采用的是mysql，后端服务开启先要先开启数据库。且数据库端口号要对应Node.js中配置端口号。
环境搭建推荐使用Docker，一键安装方便快捷。
<img src="http://oz1y7s5ij.bkt.clouddn.com/images/common/git-intro/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-06-02%20%E4%B8%8A%E5%8D%8810.25.15.png" alt="docker">

在开启node.js服务时，因为node.js单线程。一旦出错服务会马上崩溃，推荐使用pm2进程保护。同时使用nodemon达到热更新的效果。

使用七牛云图片上传时需要注册账号凭证与密钥，这方面的配置可以参考这篇文章。
https://www.jianshu.com/p/698e661fa622

## 开源许可证

MIT
