"use strict";

const bytes = require('bytes');
const multer = require('multer');
const storage = multer.memoryStorage();


module.exports = {
    
    //  服务地址
    server: "0.0.0.0",

    //  服务短裤
    port: process.env.PORT || 3000,

    //  七牛云配置
    qiniu_config:{
        server : "oz1y7s5ij.bkt.clouddn.com",
        accessKey:'0c6pz4G0HTKtnoC9y8FeGXbJFQUSp-2nuhX4K90M',
        secretKey:'BPeRE65Ax1cjSyzc5SSRyKTaj5QGHG2i8kPOi6Ki',
        bucket: 'timewait',
        origin: ''
    },

    //  配置multer上传
    //  详情请见https://github.com/expressjs/multer
    upload : multer({
        storage: storage,
        limits: {
            //  限制文件在4MB以内
            fileSize: bytes('4MB')
        },
        fileFilter: function(req, files, callback) {
            //  只允许上传jpg|png|jpeg|gif格式的文件
            var type = '|' + files.mimetype.slice(files.mimetype.lastIndexOf('/') + 1) + '|';
            var fileTypeValid = '|jpg|png|jpeg|gif|'.indexOf(type) !== -1;
            callback(null, !!fileTypeValid);
        }
    }),

    //  sequelize数据库
    sequelize: {
        username: "root",
        password: "",
        database: "onaug6th",
        options: {
            host: "127.0.0.1",
            dialect: "mysql",
            dialectOptions :{
                charset : "utf8mb4"
            },
            port : "3306",
            timezone: "+08:00",
            define: {
                underscored: false,
                timestamps: true
            },
            logging: false
        }
    }

};
