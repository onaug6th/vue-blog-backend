'use strict';
const Sequelize = require('sequelize');
const mysql = require("../mysql/index");
const moment = require("moment");

/**
 * 文章图片表模型
 */
var ArticlePicture = mysql.define('articlePicture', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    //  所属文章ID
    articleId: {
        type: Sequelize.STRING,
        defaultValue: ""
    },
    //  图片路径
    path: {
        type: Sequelize.STRING,
        defaultValue: ""
    },
    /**
     * 图片类型
     * 1 = 文章背景
     * 2 = 文章插图
     * 
     * Q ：为什么不新开一个文章图片类型表？考虑到后期如果可能会多几种图片类型呢？
     * A ：经过研究准备后，顶多就这两个类型。没有开新表的必要，浪费时间成本。
     */
    type : {
        type: Sequelize.STRING,
        defaultValue: "1"
    },
    createdAt: {
        type: Sequelize.DATE,
        get() {
            return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
        }
    },
    updatedAt: {
        type: Sequelize.DATE,
        get() {
            return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
        }
    }
}, { paranoid: true });

module.exports = ArticlePicture;
