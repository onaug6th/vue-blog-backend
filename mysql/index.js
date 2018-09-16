/**
 * 链接mysql
 */
const config = require('../config/index');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    config.sequelize.database,
    config.sequelize.username,
    config.sequelize.password,
    config.sequelize.options
);

module.exports = sequelize;