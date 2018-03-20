var mongoose = require('mongoose');

var User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 4
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 4
  }
});

module.exports = { User }
