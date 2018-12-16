'use strict';
const Sequelize = require('sequelize');
const mysql = require("../mysql/index");
const moment = require("moment");

/**
 * 文章类型表模型
 */
var Tag = mysql.define('tag', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    //  标签名字
    name: {
        type: Sequelize.STRING,
        defaultValue: ""
    },
    //  介绍
    intro: {
        type: Sequelize.STRING,
        defaultValue: ""
    },
    //  所属文章类型
    articleType: {
        type: Sequelize.STRING,
        defaultValue: ""
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

module.exports = Tag;
