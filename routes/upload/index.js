"use strict";

const express = require("express");
const router = express.Router();

//  七牛云主要依赖
const qn = require("qn");
//  项目配置
const config = require("../../config/index");
//  上传插件中间件（M开头那个）
const upload = config.upload;
//  七牛云配置
const qnConfig = config.qiniu_config;
//  七牛云客户端实例化
const client = qn.create(qnConfig);
//  七牛云仓库地址
const qnServerUrl = qnConfig.server;
//  返回工具函数
const {
    unifiedResult,
    saveArticlePicture,
    deletArticlePicture
} = require("../../common/common");
//  文章ORM
const Article = require("../../models/article");

/**
 * 上传文章背景图片接口
 * 首先从上传到七牛云，根据返回结果分发。
 * 成功 ： 将图片信息保存到图片信息表数据库中。
 * 失败 ： 说明已经存在同名图片，删除原有图片后再重新上传
 * @api {post} api/upload/bgImg
 */
router.post('/bgImg', function (req, res, next) {

    //  [single] 上传单个文件
    //  这里`bgImg`对应前端form中input的name值
    upload.single('bgImg')(req, res, function (err) {
        if (err) {
            unifiedResult(res, false, "上传图片时发生了错误");
            return console.info(err);
        } else if (req.file && req.file.buffer) {

            //  获取源文件后缀名
            const fileFormat = (req.file.originalname).split(".");
            //  获取图片所属文章id
            const articleId = req.body.articleId;
            //  设置上传到七牛云的文件命名
            const filePath = 'onaug6th/images/bgImg/' + 'article' + articleId + '.' + fileFormat[fileFormat.length - 1];
            //  文件流
            const fileBuffer = req.file.buffer;

            //  上传到七牛
            function uploadFile() {
                client.upload(fileBuffer, { key: filePath }, function (err, result) {
                    if (err) {
                        //  图片重复存在，删旧的加新的。
                        if (err.code === 614) {
                            //  删除动作
                            client.delete(filePath, function (err, result) {
                                if (err) {
                                    unifiedResult(res, false, "上传图片时发生了错误，在55行。");
                                    return console.info(err);
                                } else {
                                    debugger;
                                    deletArticlePicture();
                                    uploadFile();
                                }
                            });
                        } else {
                            unifiedResult(res, false, "上传图片时发生了错误，在62行。");
                        }
                    }
                    else if (result) {

                        const path = "http://" + qnServerUrl + "/" + filePath;
                        //  将图片信息保存到库中
                        saveArticlePicture(articleId, path, "1");

                        Article.findById(articleId).then((article) => {

                            article.update(
                                { bgUrl: path },
                                { 'fields': ['bgUrl'] }
                            )
                                .then((success) => {

                                    unifiedResult(res, true, "根据文章id保存图片成功");

                                });

                        });

                    } else {
                        unifiedResult(res, false, "上传图片时发生了错误，在83行。");
                    }
                });
            }
            uploadFile();
        }
    });
});

/**
 * 上传文章背景图片接口
 * 首先从上传到七牛云，根据返回结果分发。
 * 成功 ： 将图片信息保存到图片信息表数据库中。
 * 失败 ： 说明已经存在同名图片，删除原有图片后再重新上传
 * @api {post} api/upload/articleImg
 */
router.post('/articleImg', function (req, res, next) {

    //  [single] 上传单个文件
    //  这里`articleImg`对应前端form中input的name值
    upload.single('articleImg')(req, res, function (err) {
        if (err) {
            unifiedResult(res, false, "上传图片时发生了错误");
            return console.info(err);
        } else if (req.file && req.file.buffer) {

            //  获取源文件后缀名
            const fileFormat = (req.file.originalname).split(".");
            //  获取图片所属文章id
            const articleId = req.body.articleId;
            //  设置上传到七牛云的文件命名
            const filePath = 'onaug6th/images/articleImg/' + 'article' + articleId + '.' + fileFormat[fileFormat.length - 1];
            //  文件流
            const fileBuffer = req.file.buffer;

            //  上传到七牛
            function uploadFile() {
                client.upload(fileBuffer, { key: filePath }, function (err, result) {
                    if (err) {
                        //  图片重复存在，删旧的加新的。
                        if (err.code === 614) {
                            //  删除动作
                            client.delete(filePath, function (err, result) {
                                if (err) {
                                    unifiedResult(res, false, "上传图片时发生了错误，在139行。");
                                    return console.info(err);
                                } else {
                                    deletArticlePicture();
                                    uploadFile();
                                }
                            });
                        } else {
                            unifiedResult(res, false, "上传图片时发生了错误，在147行。");
                        }
                    }
                    /**
                     * 此时的result是七牛云服务器返回的
                     */
                    else if (result) {

                        const path = "http://" + qnServerUrl + "/" + filePath;
                        //  将图片信息保存到库中
                        saveArticlePicture("", path, "2").then((articlePicture) => {
                            //  返回信息到前端
                            unifiedResult(res, true, "上传文章插图成功", {
                                id: articlePicture.id,
                                url: path
                            });
                        });

                    } else {
                        unifiedResult(res, false, "上传图片时发生了错误，在160行。");
                    }
                });
            }
            uploadFile();
        }
    });
});

module.exports = router;
