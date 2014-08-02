var Key                 = require('../models').Key,
    keyService          = require('../services').Key,
    keyConst            = require('../const').Key,
    httpErrors          = require('../helpers/http.errors'),
    objectHelper        = require('../helpers/object'),
    randomstring        = require('randomstring'),
    keyValidator        = require('../validator').Key,
    stringValidator     = require('../validator').String,
    errors              = require('../validator').Errors,
    _                   = require('lodash'),
    Configuration       = require('../config/configuration'),
    mailService         = require('../services/mail'),
    when                = require('when');

/**
 * Show the list of key(s) and their status
 *
 * GET  /:email
 */
var email = function(req, res, next) {

    console.log('/:email/');
    return next();
};

/**
 * Generate bash script to upload key.
 * If the 'key' parameter is specified,
 * then the key will be saved with this name.
 *
 * Example (inside your terminal):
 *
 * this link will upload the key with name "default"
 * curl -s http://localhost:5000/stanislas.chollet@gmail.com/upload | bash
 *
 * this link will upload the key with "ovh"
 * curl -s http://localhost:5000/stanislas.chollet@gmail.com/ovh/upload | bash
 *
 * Also, if parameter 'keypath' is specified, the script will contain
 * the absolute path to the key to install.
 *
 * GET  /:email/upload
 * GET  /:email/:key/upload
 */
var upload = function(req, res) {

    console.log('/:email/upload or /:email/:key/upload');
    
    var keypath = req.query.keypath === undefined ? '' : req.query.keypath;
    var email = req.params.email;
    var keyname = req.params.key === undefined ? 'default' : req.params.key;
    
    return res
        .header("Content-Type", "text/plain")
        .render('upload', { 
            rootUrl: Configuration.getRootUrl(),
            keypath: keypath,
            email:   email,
            keyname: keyname
        });
};

/**
 * Install key(s) from users inside
 * the $HOME/.ssh/authorized_keys file
 *
 * GET  /:email/install         -> Install just the 'default' key
 * GET  /:email/:key/install    -> Install just the key with name :key
 * GET  /:email/all/install     -> Install all keys
 */
var install = function(req, res, next) {

    console.log('/:email/install');
    return res
        .header("Content-Type", "text/plain")
        .render('install', { keys: [1, 2] });
};

/**
 * Show the fingerprint of key
 *
 * GET  /:email/fingerprint         -> Show the fingerprint of 'default' key
 * GET  /:email/:key/fingerprint    -> Show the fingerprint of the key with name :key
 */
var fingerprint = function(req, res, next) {

    console.log('/:email/fingerprint');
    return next();
};

/**
 * Token's confirmation (Link sent inside confirmation's mail)
 *
 * GET  /:email/confirm/:token
 */
var confirmToken = function(req, res, next) {

    var data = req.params,
        key = null;

    stringValidator.isEmail(data.email)
        .then(function() {
            return stringValidator.isLength(
                data.token,
                Configuration.tokenLength,
                Configuration.tokenLength
            );
        })
        .then(function() {
            return keyService.findOneToConfirm(
                data.email,
                data.token
            );
        })
        .then(function(k) {
            if (!k) {
                return when.reject(new httpErrors.NotFound(errors.key.not_found));
            }

            key = k;

            if (keyConst.status.EXPIRED == key.status) {
                return when.resolve('Your key has expired.');
            }

            if (keyConst.status.CONFIRMED == key.status) {
                return when.resolve('Your key has already confirmed');
            }

            // TODO Add promise with key.save()
            key.status = keyConst.status.CONFIRMED;
            key.save();
            return when.resolve('your key has been confirmed');
        })
        .then(function(message) {
            res
                .render('html/confirm.ejs', {
                    message: message
                });
        })
        .then(null, function(err) {
            if (_.has(err, 'code')) {
                return next(new httpErrors.BadRequest(err.message, err.code));
            } else if (_.has(err, 'name') && err.name === 'CastError') {
                return next(new httpErrors.BadRequest(errors.string.documentid_bad_format));
            }
            return next(err);
        });
};

/**
 * Add new key with email and key name as parameters
 *
 * POST  /:email/:keyName
 *
 * TODO Check if key's name is not already taken
 */
var key = function(req, res, next) {

    var data = req.param('key');
    var email = req.params.email;
    var keyName = req.params.keyName;

    keyValidator.data(data)
        .then(function() {
            return stringValidator.isEmail(email);
        })
        .then(function() {
            return Key.create({
                data: data,
                email: email,
                status: 'pending',
                token: randomstring.generate(Configuration.tokenLength)
            });
        })
        .then(function(key) {
            key = key.toObject();
            mailService.sendConfirmation(key.email, key.token);
            console.log(JSON.stringify(key));
        })
        .then(null, function(err) {
            if (_.has(err, 'code')) {
                return next(new httpErrors.BadRequest(err.message, err.code));
            } else if (_.has(err, 'name') && err.name === 'CastError') {
                return next(new httpErrors.BadRequest(errors.string.documentid_bad_format));
            }
            return next(err);
        });

    console.log('/:email/:keyName');
    console.log('key: ' + req.param('key'));
    return next();
};


module.exports = {
    email: email,
    upload: upload,
    install: install,
    fingerprint: fingerprint,
    confirmToken: confirmToken,
    key: key
};
