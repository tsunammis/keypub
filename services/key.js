var Key         = require('../models').Key,
    ObjectId    = require('mongoose').Types.ObjectId,
    keyConst    = require('../const').Key;

/**
 * Remove key by ID.
 *
 * @param {string} id
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
 * @param {string} userId
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
 * Find key by name (and email).
 * The data return are Read Only (Plain Objet) instead of MongooseDocument
 *
 * @param {string} projectId
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
    removeById            : removeById,
    findOneById           : findOneById,
    findOneReadOnlyById   : findOneReadOnlyById,
    findOneToConfirm      : findOneToConfirm,
    findReadOnlyByEmail   : findReadOnlyByEmail,
    findReadOnlyByName    : findReadOnlyByName
};