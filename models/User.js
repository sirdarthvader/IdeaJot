const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const UserScehma = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

mongoose.model('user', UserScehma);