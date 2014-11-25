var Key                 = require('../models').Key,
    keyService          = require('../services').Key,
    keyConst            = require('../const').Key,
    httpErrors          = require('../helpers/http.errors'),
    hashHelper          = require('../helpers/hash'),
    keyValidator        = require('../validator').Key,
    stringValidator     = require('../validator').String,
    errors              = require('../validator').Errors,
    Configuration       = require('../config/configuration'),
    mailService         = require('../services/mail'),
    randomstring        = require('randomstring'),
    _                   = require('lodash'),
    when                = require('when');

/**
 * Show the list of key(s) and their status
 *
 * GET  /:email
 */
var email = function(req, res, next) {

    var email = req.params.email;
    var promise = keyService.findReadOnlyActiveByEmail(email);

    promise
        .then(function(data) {
            console.log(data);
            if (!_.isArray(data) || data.length < 1) {
                return when.reject(errors.key.not_found);
            }
            return res
                .header("Content-Type", "text/html")
                .render('bash/keys', { keys: data });

        }).then(null, function(err) {
            console.log('/:email/install Error');
            console.log(err);
            return res
                .status(404)
                .header("Content-Type", "text/plain")
                .render('bash/install-error');
        });
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
 * curl -s http://localhost:5000/stanislas.chollet@gmail.com/ovh/upload?keypath=/home/stan/.ssh/ovh.pub
 *
 * GET  /:email/upload
 * GET  /:email/:key/upload
 */
var upload = function(req, res) {

    var keypath = req.query.keypath === undefined ? '' : req.query.keypath;
    var email = req.params.email;
    var keyname = req.params.key === undefined ? 'default' : req.params.key;
    
    return res
        .header("Content-Type", "text/plain")
        .render('bash/upload', {
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

    var email = req.params.email;
    var name = req.params.key === undefined ? 'default' : req.params.key;

    var promise = 'all' == name
        ? keyService.findReadOnlyActiveByEmail(email)
        : keyService.findOneReadOnlyActiveByEmailAndName(email, name);

    promise
        .then(function(data) {
            var keys = [];
            if (_.isArray(data) && data.length > 0) {
                keys = data;
            } else if (_.has(data, 'content')) {
                keys.push(data);
            } else {
                return when.reject(errors.key.not_found);
            }
            return res
                .status(200)
                .header("Content-Type", "text/plain")
                .render('bash/install', { keys: keys });

        }).then(null, function(err) {
            return res
                .status(404)
                .header("Content-Type", "text/plain")
                .render('bash/install-error');
        });
};

/**
 * Show the fingerprint of key
 *
 * GET  /:email/fingerprint         -> Show the fingerprint of 'default' key
 * GET  /:email/:key/fingerprint    -> Show the fingerprint of the key with name :key
 */
var fingerprint = function(req, res, next) {

    var email = req.params.email;
    var name = req.params.key === undefined ? 'default' : req.params.key;

    keyService.findOneReadOnlyActiveByEmailAndName(email, name)
        .then(function(key) {
            if (!key) {
                return when.reject(errors.key.not_found);
            }
            keySplited = key.content.split(" ");
            res.send(hashHelper.hashMD5HexDigest(keySplited[1]));
        });
};

/**
 * Token's confirmation (Link sent inside confirmation's mail)
 *
 * GET  /:email/confirm/:token
 */
var confirmToken = function(req, res, next) {

    var data = req.params,
        key = null,
        newKey = null;

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
            // newKey is used inside next function
            newKey = k;

            return keyService.findOneActiveByEmailAndName(
                k.email,
                k.name
            );
        })
        .then(function(oldKey) {
            if (oldKey) {
                // TODO Add promise with oldKey.remove()
                oldKey.remove();
            }

            if (keyConst.status.EXPIRED === newKey.status) {
                return when.resolve('Your key has expired.');
            }

            if (keyConst.status.CONFIRMED === newKey.status) {
                return when.resolve('Your key has already confirmed');
            }

            // TODO Add promise with key.save()
            newKey.status = keyConst.status.CONFIRMED;
            newKey.save();
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
 */
var key = function(req, res, next) {

    var data = req.param('key');
    var email = req.params.email;
    var keyName = req.params.keyName;

    // TODO add forbidden words like 'all'

    keyValidator.data(data)
        .then(function() {
            return stringValidator.isEmail(email);
        })
        .then(function() {
            return Key.create({
                content: data,
                email: email,
                status: 'pending',
                name: keyName,
                token: randomstring.generate(Configuration.tokenLength)
            });
        })
        .then(function(key) {
            key = key.toObject();
            return mailService.sendConfirmation(key.email, key.token);
        })
        .then(function(info) {
            console.log('Message sent: ' + info.response);
        })
        .then(null, function(err) {
            if (_.has(err, 'code')) {
                return next(new httpErrors.BadRequest(err.message, err.code));
            } else if (_.has(err, 'name') && err.name === 'CastError') {
                return next(new httpErrors.BadRequest(errors.string.documentid_bad_format));
            }
            return next(err);
        });

    return next();
};

module.exports = {
    email           : email,
    upload          : upload,
    install         : install,
    fingerprint     : fingerprint,
    confirmToken    : confirmToken,
    key             : key
};
