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
  console.log(
    req.body.name,
    req.body.email,
    req.body.password,
    req.body.password2
  );
  if (errors.length > 0) {
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2,
    });
  } else {
    const newUser = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (hash, err) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then(user => {
            req.flash('success_msg', 'You are now registered and can login');
            res.redirect('users/login');
          })
          .catch(err => {
            console.log(err);
          });
      });
    });
  }
});

//Process Login form
router.post('/user/login', (req, res) => {
  let errors = [];
  const { email, password } = req.body;
});

module.exports = router;
