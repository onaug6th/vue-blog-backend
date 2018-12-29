'use strict';

const express = require('express');
const router = express.Router();

const ArticleType = require("../../models/articleType");
const common = require("../../common/common");
const unifiedResult = common.unifiedResult;

/**
 * 新增类型
 * @api {post} api/articleType/
 */
router.post('/', function (req, res) {

    const body = req.body;

    const data = {
        'name': body.name,
        'intro': body.intro,
        'bgUrl': body.bgUrl
    };

    ArticleType.build(data)
        .save().then((result) => {
            unifiedResult(res, true, "新增文章类型成功", result);
        }).catch((err) => {
            console.info(err);
            unifiedResult(res, false, "新增文章类型失败了");
        });
});

/**
 * 根据id删除文章类型
 * @api {delete} api/articleType/
 */
router.delete('/', function (req, res) {

    const idArr = req.body.arr;

    const where = { 'id': idArr };

    ArticleType.destroy({
        'where': where
    })
        .then((result) => {
            if (result > 0) {
                unifiedResult(res, true, "删除文章类型成功");
            } else {
                unifiedResult(res, false, "没有找到这个文章类型");
            }
        }).catch((err) => {
            console.info(err);
            unifiedResult(res, false, "删除文章类型时失败了");
        });

});

/**
 * 根据id修改指定文章类型信息
 * @api {put} api/articleType/:id
 */
router.put('/:id', function (req, res) {

    const id = req.params.id;

    const body = req.body;

    //  排除不需要更新的字段
    ArticleType.update(body, {
        'where': { 'id': id },
        'attributes' : {
            exclude : body.exclude || []
        }
    })
        .then((result) => {
            unifiedResult(res, true, "修改文章类型信息成功", result);
        }).catch((err) => {
            unifiedResult(res, false, "修改文章信息类型时失败了");
        });
});

/**
 * 获取文章列表
 * @api {post} api/articleType/list
 */
router.post("/list", function (req, res) {

    ArticleType.findAndCountAll().then(function (result) {
        if (result.count > 0) {
            unifiedResult(res, true, "获取文章类型列表成功", result);
        } else {
            unifiedResult(res, false, "获取文章类型列表时失败了");
        }
    }).catch((err) => {
        unifiedResult(res, false, "获取文章类型列表时失败了");
    });
});

module.exports = router;
