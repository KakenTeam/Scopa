var mongoose = require('mongoose');

var User = mongoose.model('User', {
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 4,
    unique: true
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 4
  }
});

module.exports = { User }
