var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Card = mongoose.model('Card', {
  amount: {
    type: Number,
    default: 4000
  }
})


module.exports = { Card }