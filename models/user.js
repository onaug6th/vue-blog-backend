'use strict';
const Sequelize = require('sequelize');
const mysql = require("../mysql/index");
const moment = require("moment");

/**
 * 用户表模型
 */
const User = mysql.define('user', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    userName: {
        type: Sequelize.STRING,
        unique: {
            msg: '账号已经注册'
        }
    },
    passWord: {
        type: Sequelize.TEXT
    },
    level: {
        type: Sequelize.STRING
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
}, {
    //  不从数据库中删除数据，而只是增加一个 deletedAt 标识当前时间
    paranoid: true 
});

module.exports = User;
