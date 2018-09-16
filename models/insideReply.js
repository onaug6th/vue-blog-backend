'use strict';
const Sequelize = require('sequelize');
const mysql = require("../mysql/index");
const moment = require("moment");

/**
 * 文章楼中楼回复表模型
 */
const Reply = mysql.define('insideReplies', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    //  回复文章ID
    articleId: {
        type: Sequelize.STRING,
        defaultValue: ""
    },
    //  这条回复属于哪个楼
    floorId: {
        type: Sequelize.STRING,
        defaultValue: ""
    },
    //  回复目标的id
    replyId: {
        type: Sequelize.STRING,
        defaultValue: ""
    },
    //  回复的那个家伙的名字
    replyName: {
        type: Sequelize.STRING,
        defaultValue: ""
    },
    //  回复人ip
    ip: {
        type: Sequelize.STRING,
        defaultValue: ""
    },
    //  回复人名称
    name: {
        type: Sequelize.STRING,
        defaultValue: ""
    },
    //  回复人邮箱
    email: {
        type: Sequelize.STRING,
        defaultValue: ""
    },
    //  回复人头像
    avatar: {
        type: Sequelize.STRING,
        defaultValue: ""
    },
    //  回复内容
    content: {
        type: Sequelize.TEXT
    },
    //  被回复次数
    reply: {
        type: Sequelize.STRING,
        defaultValue: "0"
    },
    //  被点赞次数
    like: {
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
});

module.exports = Reply;
