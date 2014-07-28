var mongoose        = require('mongoose'),
    key             = require('./key'),
    configuration   = require('../config/configuration');
    
var conn = mongoose.createConnection(configuration.mongodb);

module.exports = {
    Key:      key(mongoose, conn)
};