'use strict';
const Sequelize = require('sequelize');
const mysql = require("../mysql/index");
const moment = require("moment");

/**
 * 墙模型
 */
const Wall = mysql.define('wall', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    //  标题
    title: {
        type: Sequelize.STRING,
        defaultValue: ""
    },
    //  介绍
    intro : {
        type: Sequelize.STRING,
        defaultValue: ""
    },
    //  回复人名称
    name: {
        type: Sequelize.STRING,
        defaultValue: ""
    },
    //  回复人ip
    ip: {
        type: Sequelize.STRING,
        defaultValue: ""
    },
    //  回复内容
    content: {
        type: Sequelize.TEXT
    },
    //  主人回复内容
    reply: {
        type: Sequelize.STRING,
        defaultValue: ""
    },
    //  主人回复时间
    replyDate: {
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
});

module.exports = Wall;
