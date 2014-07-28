var keyValidator        = require('./key'),
    stringValidator     = require('./string'),
    errors              = require('./errors');

module.exports = {
    Key     : keyValidator,
    String  : stringValidator,
    Errors  : errors
};