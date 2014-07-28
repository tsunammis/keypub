var validator       = require('validator'),
    stringValidator = require('./string'),
    errors          = require('./errors'),
    when            = require('when');

var data = function(key) {
    if (validator.isNull(key) || key.length <= 1) {
        return when.reject(errors.key.data_length);
    }
    return when.resolve(key);
};

module.exports = {
    data: data
};