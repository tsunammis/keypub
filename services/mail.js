var Mailer          = require('../config/mailer'),
    Transporter     = Mailer.transporter,
    Configuration   = require('../config/configuration');

/**
 * Send confirmation mail after upload key.
 *
 * @param {email} email
 * @param {string} token
 */
var sendConfirmation = function(email, token) {

    link = Configuration.getRootUrl() + '/' + email + '/confirm/' + token;

    html = Mailer.getContentFromFile(
        Mailer.CONFIRMATION_HTML,
        { link: link }
    );

    var mailOptions = {
        from: 'Stan Chollet <stanislas.chollet@gmail.com>', // sender address
        to: 'stanislas.chollet@gmail.com', // list of receivers
        subject: 'Hello Stan', // Subject line
        text: 'Hello world !', // plaintext body
        html: html // html body
    };

    // send mail with defined transport object
    Transporter.sendMail(mailOptions, function(error, info) {
        if(error){
            console.log(error);
        }else{
            console.log('Message sent: ' + info.response);
        }
    });
};

module.exports = {
    sendConfirmation: sendConfirmation
};