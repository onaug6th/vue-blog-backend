/**
 * 通用方法
 * @author yangwj
 * @date 2018-08-24
 */

//  文章图片表ORM
const ArticlePicture = require("../models/articlePicture");
var os = require('os');

/**
 * 保存图片信息到文章图片表
 * @param { string } articleId 所属文章ID
 * @param { string } path 从七牛云返回的图片路径
 * @param { string } type 图片类型 1:文章背景，2:文章插图
 */
function saveArticlePicture(articleId, path, type) {

    const data = {
        articleId,
        path,
        type
    };

    return new Promise((resolve, reject) => {
        ArticlePicture.build(data)
            .save().then((result) => {
                resolve(result);
            }).catch((err) => {
                console.info(err);
                reject(err);
            });
    });

}

/**
 * 从文章图片表中删除文章图片
 * @param { array } arr 数组
 */
function deletArticlePicture(arr) {

    const where = { 'id': arr };

    return new Promise((resolve, reject) => {
        ArticlePicture.destroy({
            'where': where
        })
            .then((result) => {
                resolve(result);
            }).catch((err) => {
                console.info(err);
                reject(err);
            });

    });

}

/**
 * 统一处理返回函数
 * @param { object } res 返回体
 * @param { boolean } success 成功与否
 * @param { string } detailMsg 详情信息 【默认值：空字符串】
 * @param { object | array } data 返回数据 【默认值：一个对象】
 */
function unifiedResult(res, success, detailMsg = "", data = {}) {
    let result = {
        "code": 0,
        "msg": "success",
        "detailMsg": detailMsg,
        "data": data
    }

    !success && (result["code"] = 1, result["msg"] = "error");

    (Array.isArray(data) && data.length === 1) && (result.data = data[0]);

    res.json(result);
}

/**
 * 获取真实客户端IP
 */
function getRealIp(){

    var ifaces = os.networkInterfaces();

    var answerIp = "";

    Object.keys(ifaces).forEach(function (ifname) {
        
        var alias = 0;

        ifaces[ifname].forEach(function (iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
                //  localhost去掉
                return;
            }

            if (alias >= 1) {
                console.log(ifname + ':' + alias, iface.address);
            } else {
                console.log(ifname, iface.address);
                answerIp = iface.address;
            }
            ++alias;
        });
    });

    return answerIp;

}

module.exports = {
    unifiedResult,
    saveArticlePicture,
    deletArticlePicture,
    getRealIp
};