'use strict';

const express = require('express');
const router = express.Router();
const Reply = require("../../models/reply");
const { unifiedResult } = require("../../common/common");

/**
 * 新增回复
 * @api {post} api/reply/
 */
router.post('/', function (req, res) {

    const body = req.body;

    const data = {
        'articleId': body.articleId,
        'floor' : "",
        'ip': req.realIp,
        'name': body.name,
        'email': body.email,
        'avatar': body.avatar,
        'content': body.content,
        'reply' : body.reply,
        'like' : body.like
    };

    const where = {
        "articleId" : body.articleId
    };

    //  计算数据量，并且赋值楼层号
    Reply.count({
            where
        }).then((result)=>{
        data["floor"] = result + 1;

        Reply.build(data)
            .save().then((result) => {

                unifiedResult(res, true, "新增回复成功");

            }).catch((err) => {
                console.info(err);
                unifiedResult(res, false, "新增回复失败了");
            });

    });

});

/**
 * 根据id删除回复
 * @api {delete} api/reply/
 */
router.delete('/:id', function (req, res) {

    const id = req.params.id;

    const where = { 'id': id };

    Reply.destroy({
        'where': where
    })
        .then((result) => {
            if (result > 0) {
                unifiedResult(res, true, "删除回复成功");
            } else {
                unifiedResult(res, false, "没有找到这个回复");
            }
        }).catch((err) => {
            console.info(err);
            unifiedResult(res, false, "删除回复时失败了");
        });

});

/**
 * 根据id修改指定回复信息
 * @api {put} api/reply/:id
 */
router.put('/:id', function (req, res) {

    const id = req.params.id;

    const { exclude, ...body } = req.body;

    Reply.update(body, {
        'where': { 'id': id },
        'attributes': {
            exclude: exclude || []
        }
    })
        .then((result) => {
            unifiedResult(res, true, "修改回复信息成功", result);
        }).catch((err) => {
            unifiedResult(res, false, "修改回复信息时失败了");
        });
});

/**
 * 根据id获取指定回复信息
 * @api {get} api/reply/:id
 */
router.get('/:id', function (req, res) {

    const id = req.params.id;

    Reply.findAll({
        'where': {
            'id': id
        }
    })
        .then((result) => {
            if(result.length > 0){
                //  让返回的数据 “read” 自增
                result[0].increment("read").then((result)=>{
                    unifiedResult(res, true, "获取回复信息成功", result);
                });
            }else{
                unifiedResult(res, false, "找不到该回复信息", result);
            }
        }).catch((err) => {
            unifiedResult(res, false, "获取回复信息时失败了");
        });

});

/**
 * 根据分页信息来获取回复列表
 * @api {post} api/reply/list
 */
router.post("/list", function (req, res) {
    const body = req.body;
    const page = +body.page;
    const pageSize = +body.pageSize;
    const type = body.type || "default";
    const where = body.where || {};
    body.exclude = body.exclude || [];

    //  type为default时，只拉取特定的文章ID的回复。而且只拉取展示的回复，和不返回邮箱，ip等信息。
    ( type == "default" ) && ( where.show = "1", where.articleId = body.articleId , body.exclude.push('show', 'ip' , 'email') );

    const query = {
        //  查询条件
        where,
        //  查询的偏移量 “开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目”
        offset: (page - 1) * pageSize,
        //  每页限制返回的数据条数
        limit: pageSize,
        //  排除返回部分字段
        attributes : {
            exclude : body.exclude
        }
    };

    Reply.findAndCountAll(query).then(function (result) {
        if (result.count > 0) {
            result.rows.forEach((item) =>{
                item.like = (item.like === "" ? 0 : item.like.split(",").length);
            });
            unifiedResult(res, true, "获取回复列表成功", {
                ...result,
                totalPages : result.count / pageSize < 1 ? 1 : Math.ceil(result.count / pageSize)
            });
        } else {
            unifiedResult(res, false, "暂无回复", {
                rows : [],
                totalPages : 0
            });
        }
    }).catch((err) => {
        unifiedResult(res, false, "获取回复列表时失败了");
    });
});

/**
 * 根据id寻找文章保存like字段
 * @api {get} api/article/like/:id
 */
router.put('/like/:id', function (req, res) {

    const id = req.params.id;

    const ip = req.realIp;

    Reply.findById(id).then( function(result){
        //  初始值为空字符串
        const likeArr = result.like.length > 1 ? result.like.split(",") : [];
        
        //  如果点过赞
        if(likeArr.includes(ip) || likeArr.indexOf(ip) >= 0){
            return unifiedResult(res, true, "你已经点过赞了哦");
        }

        likeArr.push(ip);

        result.update(
            {'like': likeArr.join(",")},
            {'fields': ['like']}
        ).then((success)=>{

            unifiedResult(res, true, "点赞成功");
        }).catch((err)=>{

            unifiedResult(res, false, "更新点赞数量时失败了");
        });

    }).catch((err) => {

        unifiedResult(res, false, "找不到这篇文章，点赞失败了");
    });
    
});

module.exports = router;
