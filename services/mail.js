var Mailer          = require('../config/mailer'),
    Transporter     = Mailer.transporter,
    Configuration   = require('../config/configuration'),
    when            = require('when'),
    keyService      = require('./key'),
    errors          = require('../validator').Errors,
    nodefn          = require('when/node');

/**
 * Send confirmation mail after upload key.
 *
 * @param {email} email
 * @param {string} token
 * @return promise
 */
var sendConfirmation = function(email, token) {

    var newKey;

    return keyService.findOneReadOnlyByEmailAndToken(email, token)
        .then(function(key) {
            if (!key) {
                return when.reject(errors.key.not_found);
            }
            newKey = key;
            return keyService.findOneReadOnlyActiveByEmailAndName(key.email, key.name);
        })
        .then(function(oldKey) {

            var link = Configuration.getRootUrl() + '/' + email + '/confirm/' + token;

            if (oldKey) {
                console.log('has old key');
            }
            console.log(link);

            var html = Mailer.getContentFromFile(
                Mailer.CONFIRMATION_HTML,
                {
                    link: link,
                    oldKey: oldKey,
                    newKey: newKey
                }
            );

            var mailOptions = {
                from: 'Stan Chollet <stanislas.chollet@gmail.com>', // sender address
                to: 'stanislas.chollet@gmail.com', // list of receivers
                subject: 'Hello Stan', // Subject line
                text: 'Hello world !', // plaintext body
                html: html // html body
            };

            // Promisify method "Transporter.sendMail(...)"
            // https://github.com/cujojs/when/blob/master/docs/api.md#nodecreatecallback
            var deferred = when.defer();
            Transporter.sendMail(mailOptions, nodefn.createCallback(deferred.resolver));
            return deferred.promise;
        });
};

module.exports = {
    sendConfirmation: sendConfirmation
};