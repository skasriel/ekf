var Sequelize = require('sequelize'),
    db = require('../db.js').sequelize,
    passportLocalSequelize = require('passport-local-sequelize');
 
var User = db.define('User', {
    firstname: Sequelize.STRING,
    lastname: Sequelize.STRING,
    location: Sequelize.STRING,
    email: {type: Sequelize.STRING, primaryKey: true},
    createdDate: Sequelize.DATE,

    myhash: Sequelize.STRING(1024),
    mysalt: Sequelize.STRING(1024)
});
 
passportLocalSequelize.attachToUser(User, {
    usernameField: 'email',
    hashField: 'myhash',
    saltField: 'mysalt'
});

User.sync();

 
module.exports = User;