var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var State = mongoose.model('State', {
  is_busy: Boolean
});

module.exports = { State }
