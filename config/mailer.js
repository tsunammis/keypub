var nodemailer      = require('nodemailer'),
    Configuration   = require('./configuration'),
    ejs             = require('ejs'),
    fs              = require('fs');

/**
 * Mailer configuration object
 *
 * @constructor
 */
function Mailer() {
    // See all services here:
    // https://github.com/andris9/nodemailer-wellknown#supported-services
    this.service                = process.env.KEYPUB_MAILER_SERVICE || 'your_service';
    this.auth_login             = process.env.KEYPUB_MAILER_AUTH_LOGIN || 'your_email@gmal.com';
    this.auth_password          = process.env.KEYPUB_MAILER_AUTH_PASSWORD || 'your_password';
    this.transporter            = nodemailer.createTransport({
        service: this.service,
        auth: {
            user: this.auth_login,
            pass: this.auth_password
        }
    });
    // Template path
    this.path_template          = __dirname + '/../views/mails';
    // Constant
    this.CONFIRMATION_HTML      = this.path_template + '/confirmation.html.ejs';
    this.CONFIRMATION_TXT       = this.path_template + '/confirmation.txt.ejs';
}

/**
 * Get content from file
 */
Mailer.prototype.getContentFromFile = function(path, data) {
    return ejs.render(
            fs.readFileSync(path, Configuration.encoding),
            data
    );
};

module.exports = new Mailer();