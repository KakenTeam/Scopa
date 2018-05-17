var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
  },
  total_amount: {
    type: Number, 
    required: true,
    default: 0
  },
  orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }]
});

module.exports = { User }
