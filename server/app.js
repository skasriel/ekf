var express = require("express"),
    path = require("path"),
    morgan = require("morgan"),
    cookieParser = require('cookie-parser'),
    passport = require('passport');
var favicon = require('static-favicon');
var bodyParser = require('body-parser');
var session      = require('express-session');
var Logger = require('./logger');
//var RedisStore = require('connect-redis')(session);
var flash    = require('connect-flash');


var application_root = __dirname,
    static_root = path.join(application_root, "../www");


//require('./passport-config')(passport); // pass passport for configuration
var User = require('./models/user');

passport.use(User.createStrategy()); 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// database
var Sequelize = require('sequelize');
var sequelize = require('./db.js').sequelize;

// config
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

console.log("configuring app "+static_root);
app.use(express.static(path.join(application_root, "../www/static/")));
app.use(express.static(path.join(application_root, "../www/bower_components/")));
//app.use(express.static(path.join(application_root, "../www/static/template/")));
app.use('/bower_components', express.static(path.join(application_root, "../www/bower_components")));

app.use(favicon());
//app.use(require('morgan')('dev'));
app.use(require('morgan')({ "stream": Logger.get(Logger.EXPRESS).stream }));

app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb'}));
app.use(cookieParser());

app.use(session({ secret: 'keyboard cat' }));
/*app.use(express.session({
      store : new mongoStore({url : mongoURL}),
      secret : "stephane secret --- change in prod", //process.env.SESSION_SECRET,
      maxAge : 24*3600*1000
  }));*/
/* 
var redisOptions = {};
if (process.env.REDISTOGO_URL) 
    redisOptions = {url: process.env.REDISTOGO_URL};

 {host: 'localhost',
    port: 6379,
    db: 2,
    pass: 'RedisPASS'};
app.use(session({ store: new RedisStore(redisOptions), secret: 'klj2l34lkjslkjrwe2344rsx' }))
*/ 
app.use(passport.initialize());
app.use(passport.session());

console.log("done configuring app");


// Setup routes
var auth = require('./routes/auth');
app.use('/api/auth', auth);

// files under the "/v/" directory can be accessed without logging in
app.use(express.static(path.join(application_root, "../www/v/")));

// files under the "/a/" directory require login
app.all('*',function(req,res,next){
    if(req.isAuthenticated()){
        next();
    }else{
        return res.redirect('/signin.html');
        //next(new Error(401)); // 401 Not Authorized
    }
});
app.use(express.static(path.join(application_root, "../www/a/")));




// launch server
var server = require('http').createServer(app);

var port = Number(process.env.PORT || 3000);
server.listen(port, function() {
  console.log("Node server listening on port: " + port);
});

module.exports = app;

