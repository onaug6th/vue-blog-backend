'use strict';
const Sequelize = require('sequelize');
const mysql = require("../mysql/index");
const moment = require("moment");

/**
 * 印象表模型
 */
const Memory = mysql.define('memory', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    //  印象分类类型
    type: {
        type: Sequelize.STRING,
        defaultValue: ""
    },
    //  印象标题
    title: {
        type: Sequelize.STRING,
        defaultValue: ""
    },
    //  印象简介
    intro: {
        type: Sequelize.STRING,
        defaultValue: ""
    },
    //  印象中的人
    people: {
        type: Sequelize.STRING,
        defaultValue: ""
    },
    //  印象中的歌
    music: {
        type: Sequelize.STRING,
        defaultValue: ""
    },
    //  印象图片链接
    imgSrc: {
        type: Sequelize.TEXT,
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

module.exports = Memory;
