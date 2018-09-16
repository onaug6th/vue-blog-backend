'use strict';
const Sequelize = require('sequelize');
const mysql = require("../mysql/index");
const moment = require("moment");

/**
 * 文章表模型
 */
const Article = mysql.define('article', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    //  文章类型
    type: {
        type: Sequelize.STRING,
        defaultValue: ""
    },
    //  文章标题
    title: {
        type: Sequelize.STRING,
        defaultValue: ""
    },
    //  文章简介
    intro: {
        type: Sequelize.STRING,
        defaultValue: ""
    },
    //  文章内容
    content: {
        type: Sequelize.TEXT
    },
    //  文章背景图片
    bgUrl: {
        type: Sequelize.STRING,
        defaultValue: ""
    },
    //  已读
    read: {
        type: Sequelize.STRING,
        defaultValue: "0"
    },
    //  点赞
    like: {
        type: Sequelize.STRING,
        defaultValue: "0"
    },
    //  是否展示
    show: {
        type: Sequelize.STRING,
        defaultValue: "1"
    },
    createdAt: {
        type: Sequelize.DATE,
        get() {
            const createdAt = this.getDataValue('createdAt');
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

module.exports = Article;
