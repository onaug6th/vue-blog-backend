'use strict';

const express = require('express');
const router = express.Router();
const Article = require("../../models/article");
const { unifiedResult } = require("../../common/common");

/**
 * 新增文章
 * @api {post} api/article/
 */
router.post('/', function (req, res) {

    const body = req.body;

    const data = {
        'type': body.type,
        'tag': body.tag,
        'title': body.title,
        'intro': body.intro,
        'content': body.content,
        'read': body.read,
        'show': body.show,
        'homeShow': body.homeShow,
        'like': body.like
    };

    Article.build(data)
        .save().then((result) => {
            unifiedResult(res, true, "新增文章成功", result);
        }).catch((err) => {
            console.info(err);
            unifiedResult(res, false, "新增文章失败了");
        });
});

/**
 * 根据id删除文章
 * @api {delete} api/article/
 */
router.delete('/', function (req, res) {

    const idArr = req.body.arr;

    const where = { 'id': idArr };

    Article.destroy({
        'where': where
    })
        .then((result) => {
            if (result > 0) {
                unifiedResult(res, true, "删除文章成功");
            } else {
                unifiedResult(res, false, "没有找到这个文章");
            }
        }).catch((err) => {
            console.info(err);
            unifiedResult(res, false, "删除文章时失败了");
        });

});

/**
 * 根据id修改指定文章信息
 * @api {put} api/article/:id
 */
router.put('/:id', function (req, res) {

    const id = req.params.id;

    const { exclude, ...body } = req.body;

    //  like字段，为0不保存
    (req.body.like == 0) && (delete req.body.like);

    //  排除不需要更新的字段
    Article.update(body, {
        'where': { 'id': id },
        'attributes': {
            exclude: exclude || []
        }
    })
        .then((result) => {
            unifiedResult(res, true, "修改文章信息成功", result);
        }).catch((err) => {
            unifiedResult(res, false, "修改文章信息时失败了");
        });
});

/**
 * 根据id获取指定文章信息
 * @api {get} api/article/:id
 */
router.get('/:id', function (req, res) {

    const id = req.params.id;

    req.query.type = req.query.type || "defalut";

    Article.findAll({
        'where': {
            'id': id
        },
        'attributes': {
            exclude: req.query.type == "admin" ? [] : ['show', 'homeShow']
        }
    })
        .then((result) => {
            if (result.length > 0) {
                //  非管理员形式调用时
                if(req.query.type != "admin"){
                    //  点赞在数据库中存的是数组字符串
                    result[0].like = (result[0].like === "" ? 0 : result[0].like.split(",").length);
                }

                unifiedResult(res, true, "获取文章信息成功", result);
            } else {
                unifiedResult(res, false, "找不到该文章信息", result);
            }
        }).catch((err) => {
            unifiedResult(res, false, "获取文章信息时失败了");
        });

});

/**
 * 根据id寻找文章，自增阅读数
 * @api {put} api/article/read/:id
 */
router.put('/read/:id', function (req, res) {

    const id = req.params.id;

    Article.findAll({
        'where': {
            'id': id
        }
    })
        .then((result) => {
            if (result.length > 0) {
                //  让返回的数据 “read” 自增
                result[0].increment("read").then((result) => {
                    unifiedResult(res, true, "文章阅读数更新完毕", result);
                });
            } else {
                unifiedResult(res, false, "找不到该文章信息", result);
            }
        }).catch((err) => {
            unifiedResult(res, false, "获取文章信息时失败了");
        });

});

/**
 * 根据分页信息来获取文章列表
 * @api {post} api/article/list
 */
router.post("/list", function (req, res) {
    const body = req.body;
    const page = +body.page;
    const pageSize = +body.pageSize;
    const type = body.type || "default";
    const where = body.where || {};
    body.exclude = body.exclude || [];

    //  type为default时，只拉取展示的文章，且将show字段隐藏
    (type == "default") && (where.show = "1", body.exclude = ["show", "homeShow", ...body.exclude]);

    const query = {
        //  根据时间倒叙查询
        order: "createdAt DESC",
        //  查询条件
        where,
        //  查询的偏移量 “开始的数据索引，比如当page=2 时offset=10，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目”
        offset: (page - 1) * pageSize,
        //  每页限制返回的数据条数
        limit: pageSize,
        //  排除字段，这里排除文章的内容
        attributes: {
            exclude: body.exclude
        }
    }

    Article.findAndCountAll(query).then(function (result) {
        if (result.count > 0) {
            //  
            result.rows.forEach((item) => {
                item.like = (item.like === "" ? 0 : item.like.split(",").length);
            });
            unifiedResult(res, true, "获取文章列表成功", {
                ...result,
                totalPages: result.count / pageSize < 1 ? 1 : Math.ceil(result.count / pageSize)
            });
        } else {
            unifiedResult(res, false, "暂无文章", {
                ...result,
                totalPages: 0
            });
        }
    }).catch((err) => {
        unifiedResult(res, false, "获取文章信息时失败了");
    });
});

/**
 * 根据id寻找文章增加like字段
 * @api {get} api/article/like/:id
 */
router.put('/like/:id', function (req, res) {

    const id = req.params.id;

    const ip = req.realIp;

    //  寻找文章是否存在
    Article.findById(id).then(function (result) {
        //  初始值为空字符串
        const likeArr = result.like.length > 1 ? result.like.split(",") : [];

        //  如果点过赞
        if (likeArr.includes(ip) || likeArr.indexOf(ip) >= 0) {
            return unifiedResult(res, true, "你已经点过赞了哦");
        }

        likeArr.push(ip);

        //  只更新like该字段，且值为lkeArr分割后的字符串
        result.update(
            { 'like': likeArr.join(",") },
            { 'fields': ['like'] }
        ).then((success) => {

            unifiedResult(res, true, "点赞成功", success);
        }).catch((err) => {

            unifiedResult(res, false, "更新点赞数量时失败了");
        });

    }).catch((err) => {

        unifiedResult(res, false, "找不到这篇文章，点赞失败了");
    });

});

/**
 * 根据参数获取对应的文章数量
 * @api {post} api/article/articleAmount
 */
router.post('/articleAmount', function (req, res) {

    const condition = {
        'where': req.body
    }

    Article.findAll(condition)
        .then((result) => {
            unifiedResult(res, true, "获取文章数量成功", {
                where: condition,
                length: result.length
            });
        }).catch((err) => {
            unifiedResult(res, false, "获取文章信息时失败了");
        });

});

module.exports = router;
