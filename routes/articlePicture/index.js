'use strict';

const express = require('express');
const router = express.Router();

const ArticlePicture = require("../../models/articlePicture");
const {
    unifiedResult,
    saveArticlePicture,
    deletArticlePicture
} = require("../../common/common");

/**
 * 新增文章图片
 * @api {post} api/articlePicture/
 */
router.post('/', function (req, res) {

    const body = req.body;

    saveArticlePicture(body.path, body.type).then((result) => {
        unifiedResult(res, true, "新增文章图片成功", result);
    }).catch((err) => {
        console.info(err);
        unifiedResult(res, false, "新增文章图片失败了");
    });

});

/**
 * 根据id删除文章类型
 * @api {delete} api/articlePicture/
 */
router.delete('/', function (req, res) {

    const idArr = req.body.arr;

    deletArticlePicture(idArr).then((result) => {
        if (result > 0) {
            unifiedResult(res, true, "删除文章图片成功");
        } else {
            unifiedResult(res, false, "没有找到这个文章图片");
        }
    }).catch((err) => {
        console.info(err);
        unifiedResult(res, false, "删除文章图片时失败了");
    });

});

/**
 * 根据id修改指定文章图片信息的所属文章ID
 * @api {put} api/articlePicture/id
 */
router.put('/id', function (req, res) {

    const body = req.body;

    /**
     * update方法中传入的第一个参数为需要修改的值
     * 第二个参数为查询条件
     */
    ArticlePicture.update({
            "articleId" : body.articleId,
        }, {
            'where': { 'id': body.id }
        })
        .then((result) => {
            unifiedResult(res, true, "修改文章图片信息成功", result);
        }).catch((err) => {
            unifiedResult(res, false, "修改文章图片信息时失败了");
        });
});

/**
 * 获取文章图片列表
 * @api {post} api/articlePicture/list
 */
router.post("/list", function (req, res) {
    const body = req.body;
    const page = +body.page;
    const pageSize = +body.pageSize;

    const where = {
        //  查询条件设置为空，获取全部
        where: "",
        //  查询的偏移量 “开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目”
        offset: (page - 1) * pageSize,
        //  每页限制返回的数据条数
        limit: pageSize
    }

    ArticlePicture.findAndCountAll(where).then(function (result) {
        if (result.count > 0) {
            unifiedResult(res, true, "获取文章图片列表成功", {
                ...result,
                totalPages: result.count / pageSize < 1 ? 1 : Math.ceil(result.count / pageSize)
            });
        } else {
            unifiedResult(res, false, "获取文章图片列表时失败了");
        }
    }).catch((err) => {
        unifiedResult(res, false, "获取文章图片列表时失败了");
    });
});

module.exports = router;
