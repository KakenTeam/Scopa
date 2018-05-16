var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Order = mongoose.model('Order', {
  id_water: {
    type: Number,
    required: true,
  },
  payment: {
    type: Number,
    required: true,
    default: 4000,
    min: [0, 'Not enough money']
  },
  created_at: { 
    type: Date, default: Date.now
  },
  owner: { type: Schema.Types.ObjectId, ref: 'User'},
  is_served: {
    type: Boolean, default: false
  }
});

module.exports = { Order }
