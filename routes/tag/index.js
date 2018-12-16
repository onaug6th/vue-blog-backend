'use strict';

const express = require('express');
const router = express.Router();

const Tag = require("../../models/tag");
const common = require("../../common/common");
const unifiedResult = common.unifiedResult;

/**
 * 新增文章标签
 * @api {post} api/tag/
 */
router.post('/', function (req, res) {

    const body = req.body;

    const data = {
        'name': body.name,
        'intro': body.intro,
        'articleType': body.articleType
    };

    Tag.build(data)
        .save().then((result) => {
            unifiedResult(res, true, "新增文章标签成功", result);
        }).catch((err) => {
            console.info(err);
            unifiedResult(res, false, "新增文章标签失败了");
        });
});

/**
 * 根据id删除文章标签
 * @api {delete} api/tag/
 */
router.delete('/', function (req, res) {

    const idArr = req.body.arr;

    const where = { 'id': idArr };

    Tag.destroy({
        'where': where
    })
        .then((result) => {
            if (result > 0) {
                unifiedResult(res, true, "删除文章标签成功");
            } else {
                unifiedResult(res, false, "没有找到这个文章标签");
            }
        }).catch((err) => {
            console.info(err);
            unifiedResult(res, false, "删除文章标签时失败了");
        });

});

/**
 * 根据id修改指定文章标签信息
 * @api {put} api/tag/:id
 */
router.put('/:id', function (req, res) {

    const id = req.params.id;

    const body = req.body;

    //  排除不需要更新的字段
    Tag.update(body, {
        'where': { 'id': id },
        'attributes' : {
            exclude : body.exclude || []
        }
    })
        .then((result) => {
            unifiedResult(res, true, "修改文章标签信息成功", result);
        }).catch((err) => {
            unifiedResult(res, false, "修改文章信息类型时失败了");
        });
});

/**
 * 获取文章标签列表
 * @api {post} api/tag/list
 */
router.post("/list", function (req, res) {

    Tag.findAndCountAll().then(function (result) {
        if (result.count > 0) {
            unifiedResult(res, true, "获取文章标签列表成功", result);
        } else {
            unifiedResult(res, false, "获取文章标签列表时失败了");
        }
    }).catch((err) => {
        unifiedResult(res, false, "获取文章标签列表时失败了");
    });
});

module.exports = router;
