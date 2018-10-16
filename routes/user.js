const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

//Load User Model
require('../models/User');
const User = mongoose.model('user');

//Login Route
router.get('/login', (req, res) => {
  res.render('users/login');
});

//Register Route
router.get('/register', (req, res) => {
  res.render('users/register');
});

//Process Register Form
router.post('/register', (req, res) => {
  let errors = [];
  if (req.body.password !== req.body.password2) {
    errors.push({ text: 'Passowrd must match' });
  }
  if (req.body.password.length < 4) {
    errors.push({ text: 'Password must be bigger than 4 characters' });
  }
  if (errors.length > 0) {
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2,
    });
  } else {
    User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        req.flash('error_msg', 'A user exists with the same email id');
        res.redirect('/user/register');
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        });
        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You have been registered, please signin'
                );
                res.redirect('/user/login');
              })
              .catch(err => {
                console.log(err);
                return;
              });
          });
        });
      }
    });
  }
});

//Process Login form
router.post('/user/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/ideas',
    failureRedirect: '/user/login',
    failureFlas: true
  })(req, res, next);
});

module.exports = router;
