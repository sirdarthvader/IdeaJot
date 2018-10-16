const localStrategy = require('passport-local');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


//Load user profile
const User = mongoose.model('user');

module.exports = function(passport) {
  
}