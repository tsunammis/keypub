var _ = require('lodash');

/**
 * Homepage
 *
 * GET  /
 */
var home = function(req, res, next) {

    return res
        .status(200)
        .header("Content-Type", "text/html")
        .render('html/homepage');
};

/**
 * Error handler
 *
 * @param {Request}     request
 * @param {Response}    response
 * @param {function}    next
 */
var errorHandler = function(err, req, res, next) {
    var error = {};
    error.message = _.isString(err) ? err : (_.isObject(err) ? err.message : 'Unknown Error');
    
    if (_.has(err, 'code')) {
        error.code = err.code;
    }
    return res
        .status(err.status || 500)
        .header("Content-Type", "text/html")
        .render('html/error', {
            error: error
        });
};

module.exports = {
    home         : home,
    errorHandler : errorHandler
};