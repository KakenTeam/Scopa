var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://thuandoan97:thuan274@ds231719.mlab.com:31719/scopa_production');

module.exports = { mongoose };