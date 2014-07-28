/**
 * Key object model.
 */
module.exports = function(db, conn) {
    var schema = new db.Schema({
        content     : String,
        name        : String,
        email       : { type: String, lowercase: true },
        token       : String,
        status      : { type: String, enum: ['confirmed', 'pending', 'expired'] },
        createdAt   : { type: Date, default: Date.now }
    });
    return conn.model('Key', schema);
};