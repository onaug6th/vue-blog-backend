'use strict';
const Sequelize = require('sequelize');
const mysql = require("../mysql/index");
const moment = require("moment");

/**
 * 文章类型表模型
 */
var ArticleType = mysql.define('articleType', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    //  不用解释啦
    name: {
        type: Sequelize.STRING,
        defaultValue: ""
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

module.exports = ArticleType;
