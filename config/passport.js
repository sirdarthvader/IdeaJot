const localStrategy = require('passport-local');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Load user profile
const User = mongoose.model('user');

module.exports = function(passport){
  passport.use(new localStrategy({usernameField: 'email'}, (email, password, done) => {
    // Match user
    User.findOne({
      email:email
    }).then(user => {
      if(!user){
        return done(null, false, {message: 'No User Found'});
      }
    })
  }));
}
