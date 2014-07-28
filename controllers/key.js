var Key                 = require('../models').Key,
    keyService          = require('../services').Key,
    httpErrors          = require('../helpers/http.errors'),
    objectHelper        = require('../helpers/object'),
    randomstring        = require('randomstring');
    keyValidator        = require('../validator').Key,
    stringValidator     = require('../validator').String,
    errors              = require('../validator').Errors,
    _                   = require('lodash'),
    Configuration       = require('../config/configuration'),
    mailService         = require('../services/mail'),
    when                = require('when');

/**
 * GET  /:email
 */
var email = function(req, res, next) {

    console.log('/:email/');
    return next();
};

/**
 * GET  /:email/upload
 * GET  /:email/:key/upload
 */
var upload = function(req, res, next) {

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
 * GET  /:email/install
 */
var install = function(req, res, next) {

    console.log('/:email/install');
    return res
        .header("Content-Type", "text/plain")
        .render('install', { keys: [1, 2] });
};

/**
 * GET  /:email/fingerprint
 */
var fingerprint = function(req, res, next) {

    console.log('/:email/fingerprint');
    return next();
};

/**
 * GET  /:email/confirm/:token
 */
var confirmToken = function(req, res, next) {

    console.log('/:email/confirm/:token');
    return next();
};

/**
 * GET  /:email/all
 */
var all = function(req, res, next) {

    console.log('/:email/all');
    return next();
};

/**
 * GET  /:email/all/install
 */
var allInstall = function(req, res, next) {

    console.log('/:email/all/install');
    return next();
};

/**
 * POST  /:email/:keyName
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
                token: randomstring.generate(24)
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

/**
 * GET  /:email/:key/fingerprint
 */
var keyFingerprint = function(req, res, next) {

    console.log('/:email/:key/fingerprint');
    return next();
};

/**
 * GET  /:email/:key/install
 */
var keyInstall = function(req, res, next) {

    console.log('/:email/:key/install');
    return next();
};

module.exports = {
    email: email,
    upload: upload,
    install: install,
    fingerprint: fingerprint,
    confirmToken: confirmToken,
    all: all,
    allInstall: allInstall,
    key: key,
    keyFingerprint: keyFingerprint,
    keyInstall: keyInstall
};
