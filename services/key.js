var Key         = require('../models').Key,
    ObjectId    = require('mongoose').Types.ObjectId,
    keyConst    = require('../const').Key;

/**
 * Remove key by ID.
 *
 * @param {string} id
 * @return {promise}
 */
var removeById = function(id) {
    return Key
        .remove({
            _id: new ObjectId(id)
        });
};

/**
 * Find key by ID.
 *
 * @param {string} id
 * @param {string} select Specify the fields to be retrieved
 * @return {promise}
 */
var findOneById = function(id, select) {
    var query = Key
        .findOne({
            _id: new ObjectId(id)
        });

    if (select) {
        query.select(select);
    }

    return query.exec();
};

/**
 * Find key by ID.
 * The data return are Read Only (Plain Objet) instead of MongooseDocument
 *
 * @param {string} id
 * @param {string} select Specify the fields to be retrieved
 * @return {promise}
 */
var findOneReadOnlyById = function(id, select) {
    var query = Key
        .findOne({
            _id: new ObjectId(id)
        })
        .lean(true);

    if (select) {
        query.select(select);
    }

    return query.exec();
};

/**
 * Find key by token.
 *
 * @param {string} email
 * @param {string} token
 * @param {string} select Specify the fields to be retrieved
 * @return {promise}
 */
var findOneToConfirm = function(email, token, select) {
    var query = Key
        .findOne()
        .where('email').equals(email)
        .where('token').equals(token);

    if (select) {
        query.select(select);
    }

    return query.exec();
};

/**
 * Find key by email.
 * The data return are Read Only (Plain Objet) instead of MongooseDocument
 *
 * @param {string} email
 * @param {string} select Specify the fields to be retrieved
 * @return {promise}
 */
var findReadOnlyByEmail = function(email, select) {
    var query = Key
        .find({ 'email': email })
        .lean()
        .sort('-createdAt');

    if (select) {
        query.select(select);
    }

    return query.exec();
};

/**
 * Find keys by email.
 * The data return are Read Only (Plain Objet) instead of MongooseDocument
 *
 * @param {string} email
 * @param {string} select Specify the fields to be retrieved
 * @return {promise}
 */
var findReadOnlyActiveByEmail = function(email, select) {
    var query = Key
        .find()
        .where({ 'email': email })
        .and([{ 'status': keyConst.status.CONFIRMED }])
        .lean()
        .sort('-createdAt');

    if (select) {
        query.select(select);
    }

    return query.exec();
};

/**
 * Find key by email and token.
 * The data return are Read Only (Plain Objet) instead of MongooseDocument
 *
 * @param {string} email
 * @param {string} token
 * @param {string} select Specify the fields to be retrieved
 * @return {promise}
 */
var findOneReadOnlyByEmailAndToken = function(email, token, select) {
    var query = Key
        .findOne()
        .where({ 'email': email })
        .and([{ 'token': token }])
        .lean()
        .sort('-createdAt');

    if (select) {
        query.select(select);
    }

    return query.exec();
};

/**
 * Find key by email and name.
 * The data return are Read Only (Plain Objet) instead of MongooseDocument
 *
 * @param {string} email
 * @param {string} name
 * @param {string} select Specify the fields to be retrieved
 * @return {promise}
 */
var findOneReadOnlyActiveByEmailAndName = function(email, name, select) {
    var query = Key
        .findOne()
        .where({ 'email': email })
        .and([{ 'name': name }, { 'status': keyConst.status.CONFIRMED }])
        .lean()
        .sort('-createdAt');

    if (select) {
        query.select(select);
    }

    return query.exec();
};

/**
 * Find key by name (and email).
 * The data return are Read Only (Plain Objet) instead of MongooseDocument
 *
 * @param {string} name
 * @param {string} email
 * @param {string} select Specify the fields to be retrieved
 * @return {promise}
 */
var findReadOnlyByName = function(name, email, select) {
    var query = Key
        .find({ 
            'name':    name, 
            'email':   email
        })
        .lean()
        .sort('-createdAt');

    if (select) {
        query.select(select);
    }

    return query.exec();
};

module.exports = {
    removeById                  : removeById,
    findOneById                 : findOneById,
    findOneReadOnlyById         : findOneReadOnlyById,
    findOneToConfirm            : findOneToConfirm,
    findReadOnlyByEmail         : findReadOnlyByEmail,
    findReadOnlyByName          : findReadOnlyByName,
    findReadOnlyActiveByEmail   : findReadOnlyActiveByEmail,
    findOneReadOnlyByEmailAndToken      : findOneReadOnlyByEmailAndToken,
    findOneReadOnlyActiveByEmailAndName : findOneReadOnlyActiveByEmailAndName
};