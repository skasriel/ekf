/* Routes related to authorization/authentication and user management */
var Logger = require('../logger');
var logger = Logger.get(Logger.AUTH);


var express = require('express');
var router = express.Router();

var passport = require('passport'),
    User = require('../models/user');

var SIGNIN = '/signin.html';
var USER_HOME = '/home.html'

router.post('/register', function(req, res, next) {
  console.log('registering user');

  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var email = req.body.email;
  var password = req.body.password;
  var password2 = req.body.password2;
  var location = req.body.location;
  var username = email;

  User.find({ where: { email: email }}).success(function(user) {
    if (user) { 
      return res.send(401);
    }
    // user doesn't exist yet, create her
    user = User.build({
        'email' : username,
        'firstname': firstname,
        'lastname': lastname,
        'location': location
    });

    User.register(user, password, function(err) {
      if (err) { 
        console.log('error in user register!', err); 
        return next(err); 
      }
      console.log('user registered!');
      res.redirect(USER_HOME);
    });
  });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  res.redirect(USER_HOME);
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect(SIGNIN);
});








// google ---------------------------------
// send to google to do the authentication
/*router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

// the callback after google has authenticated the user
router.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect : HOME,
    failureRedirect : LOGIN
  }), function(req, res) {
  });

// google for users who have already linked their account
router.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

// the callback after google has authorized the user
router.get('/connect/google/callback',
  passport.authorize('google', {
    successRedirect : HOME,
    failureRedirect : LOGIN
  }));
  */

module.exports = router;
//module.exports.isAuthenticated = isAuthenticated;
//module.exports.OK = OK;
