'use strict';
const Sequelize = require('sequelize');
const mysql = require("../mysql/index");
const moment = require("moment");

/**
 * 印象分类表模型
 */
const MemoryType = mysql.define('memoryType', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    //  印象分类名称
    name: {
        type: Sequelize.STRING,
        defaultValue: ""
    },
    //  印象分类代表图片
    img: {
        type: Sequelize.STRING,
        defaultValue: ""
    },
    //  印象分类简介
    intro: {
        type: Sequelize.STRING,
        defaultValue: ""
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

module.exports = MemoryType;
