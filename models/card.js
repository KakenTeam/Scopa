var mongoose = require('mongoose');

var CardSchema = new mongoose.Schema({
  amount: {
    type: Number,
    default: 4000
  }
});

CardSchema.pre('save', function (next) {
  var card = this;
  var id_card = Math.floor(Math.random() * 999999) + 100000;
  card._id = id_card;
  next();
});


var Card = mongoose.model('Card', CardSchema);

module.exports = { Card }