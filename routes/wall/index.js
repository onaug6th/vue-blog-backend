'use strict';

const express = require('express');
const router = express.Router();
const Wall = require("../../models/wall");
const { unifiedResult } = require("../../common/common");

/**
 * 新增墙回复
 * @api {post} api/wall/
 */
router.post('/', function (req, res) {

    const body = req.body;

    const data = {
        'title': body.title,
        'name' : body.name,
        'intro' : body.intro,
        'content' : body.content,
        'ip': req.realIp
    };

    Wall.build(data)
        .save().then((result) => {

            unifiedResult(res, true, "新增墙回复成功");

        }).catch((err) => {
            console.info(err);
            unifiedResult(res, false, "新增墙回复失败了");
        });

});

/**
 * 根据id删除墙回复
 * @api {delete} api/wall/
 */
router.delete('/:id', function (req, res) {

    const id = req.params.id;

    const where = { 'id': id };

    Wall.destroy({
        'where': where
    })
        .then((result) => {
            if (result > 0) {
                unifiedResult(res, true, "删除墙回复成功");
            } else {
                unifiedResult(res, false, "没有找到这个墙回复");
            }
        }).catch((err) => {
            console.info(err);
            unifiedResult(res, false, "删除墙回复时失败了");
        });

});

/**
 * 根据id修改指定墙回复信息
 * @api {put} api/wall/:id
 */
router.put('/:id', function (req, res) {

    const id = req.params.id;

    const { exclude, include, ...body } = req.body;

    Wall.update(body, {
        'where': { 'id': id },
        'attributes': {
            include : include || [],
            exclude: exclude || []
        }
    })
        .then((result) => {
            unifiedResult(res, true, "修改墙回复信息成功", result);
        }).catch((err) => {
            unifiedResult(res, false, "修改墙回复信息时失败了");
        });
});

/**
 * 根据id获取指定墙回复信息
 * @api {get} api/wall/:id
 */
router.get('/:id', function (req, res) {

    const id = req.params.id;

    Wall.findAll({
        'where': {
            'id': id
        }
    })
        .then((result) => {
            if(result.length > 0){
                //  让返回的数据 “read” 自增
                result[0].increment("read").then((result)=>{
                    unifiedResult(res, true, "获取墙回复信息成功", result);
                });
            }else{
                unifiedResult(res, false, "找不到该墙回复信息", result);
            }
        }).catch((err) => {
            unifiedResult(res, false, "获取墙回复信息时失败了");
        });

});

/**
 * 根据分页信息来获取墙回复列表
 * @api {post} api/wall/list
 */
router.post("/list", function (req, res) {
    const body = req.body;
    const page = +body.page;
    const pageSize = +body.pageSize;
    const type = body.type || "default";
    const where = body.where || {};
    body.exclude = body.exclude || [];

    //  type为default时，只拉取展示的墙回复，和不返回邮箱，ip等信息。
    ( type == "default" ) && ( where.show = "1", body.exclude.push('show', 'ip') );

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

    Wall.findAndCountAll(query).then(function (result) {
        if (result.count > 0) {
            unifiedResult(res, true, "获取墙回复列表成功", {
                ...result,
                totalPages : result.count / pageSize < 1 ? 1 : Math.ceil(result.count / pageSize)
            });
        } else {
            unifiedResult(res, true, "暂无墙回复", {
                rows : [],
                totalPages : 0
            });
        }
    }).catch((err) => {
        unifiedResult(res, false, "获取墙回复列表时失败了");
    });
});

module.exports = router;
