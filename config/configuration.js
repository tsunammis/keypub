/**
 * Application configuration object
 *
 * @constructor
 */
function Configuration() {
    this.env            = process.env.NODE_ENV || 'dev';
    this.port           = process.env.PORT || 5000;
    this.host           = process.env.KEYPUB_HOST || "localhost";
    this.mongodb        = process.env.KEYPUB_MONGODB_PATH || 'mongodb://localhost/keypub';
    this.encoding       = process.env.KEYPUB_ENCODING || 'utf8';
    this.tokenLength    = process.env.KEYPUB_TOKEN_LENGTH || 24;
}

/**
 * Get root URL of application
 */
Configuration.prototype.getRootUrl = function() {
    var url = 'http://' + this.host;
    url += (80 !== this.port) ? ':' + this.port : '';
    return url;
};

module.exports = new Configuration();