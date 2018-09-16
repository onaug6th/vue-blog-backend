'use strict';

var express = require('express');
var router = express.Router();
const User = require("../../models/user");
const common = require("../../common/common");
const unifiedResult = common.unifiedResult;

/**
 * login接口
 * api/user/login
 */
router.post('/login', function (req, res, next){
    const body = req.body;
    
    const where = {
        userName : body.userName
    }

    User.find(where).then((result)=>{
        if(result.passWord == body.passWord){
            unifiedResult(res, true, "恭喜你，登陆成功" ,{
                token : "thisisatoken",
                link : "/newWorld"
            });
        }else{
            unifiedResult(res, false, "用户密码不正确");
        }
    }).catch((err)=>{
        unifiedResult(res, false, "找不到这个用户");
    });
});

module.exports = router;
