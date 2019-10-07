//  后端框架 express
const express = require('express');
//  node path模块
const path = require('path');
//  body解析
const bodyParser = require('body-parser');
//  实例化express
const app = express();
//  后端路由配置（接口）
const routes = require('./routes');
//  数据库
const sequelize = require('./mysql/index');
//  使用跨域模块
const cors = require('cors');
app.use(cors());

//  使用请求题解析模块
app.use(bodyParser.json());
//  bodyParser
app.use(bodyParser.urlencoded({ extended: false }));

//  配置路由文件
routes(app);

// 使用public下的静态文件
app.use(express.static('public'));

// 处理404错误
app.use(function (req, res) {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

/**
 * 链接数据库
 * force为true时会删掉表重新创建
 */
sequelize.sync({
    // force: true
    force: false
})
    .then(function () {
        serverOpen();
    })
    .catch(function (err) {
        console.log('连不上数据库了，检查一下');
        console.log(err);
    });

//  服务端配置
const config = require('./config/index');

//  最后，启动我们的服务
function serverOpen() {
    const server = app.listen(config.port || 3000, config.server || '0.0.0.0', () => {
        const host = server.address().address;
        const port = server.address().port;
        console.log('服务已经启动 http://%s:%s', host, port);
    });
}
