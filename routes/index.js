const { unifiedResult, getRealIp } = require("../common/common");
var os = require('os');

/**
 * 全局路由配置文件
 * @param { object } app 根应用
 */
module.exports = function (app) {

    /**
     * 返回头设置，允许跨域且指定允许通过的头属性。
     */
    app.all('*', function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
        res.header("Access-Control-Allow-Headers", "*");

        req.realIp = req.headers["x-real-ip"] || req.headers["x-forwarded-for"] || req.ip;

        const exclude = req.body.exclude;

        exclude && exclude.forEach((item, index)=>{
            delete req.body[item];
        });
        next();
    });

    app.use(function(req, res, next){

        const validatePath = [
            '/api/user', '/api/article', '/api/articleType', '/api/articlePicture', '/api/reply', '/api/insideReply', '/api/wall', '/api/upload'
        ];

        if (req.method == "OPTIONS"){
            next();
        }else if ( (validatePath.filter(item => req.path.indexOf(item) !== -1 ).length > 0) && req.headers.token !== "tempToken") {
            unifiedResult(res, false, "未经过身份验证不允许调用接口");
        } else {
            next();
        }
        
    });

    //  用户接口
    app.use('/api/user', require('./user/index.js'));

    //  文章接口
    app.use('/api/article', require('./article/index.js'));
    //  文章类型接口
    app.use('/api/articleType', require('./articleType/index.js'));
    //  文章图片接口
    app.use('/api/articlePicture', require('./articlePicture/index.js'));
    //  文章回复接口
    app.use('/api/reply', require('./reply/index.js'));
    //  文章楼中楼接口
    app.use('/api/insideReply', require('./insideReply/index.js'));

    //  墙接口
    app.use('/api/wall', require('./wall/index.js'));

    //  -------通用接口-------- //

    //  文件上传接口
    app.use('/api/upload', require('./upload/index.js'));
};