/** Database */
var Logger = require('./Logger');
var logger = Logger.get(Logger.SEQUELIZE);

var Sequelize = require('sequelize');


var pg = require('pg');
var pgURL = process.env.DATABASE_URL || "postgres://ekf:changeme@localhost:5432/ekf";


var sequelize = new Sequelize(pgURL, {
	dialect: 'postgres', logging: logger.log
});
console.log("Connected to "+pgURL);

module.exports.sequelize = sequelize;
