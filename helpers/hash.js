var crypto = require('crypto');

/**
 * Hash string with MD5 and digest it with hex
 *
 * @param {string} str String to hash
 * @param {string} String hashed
 */
var hashMD5HexDigest = function(str) {
    var md5sum = crypto.createHash('md5');
    md5sum.update(str);
    return md5sum.digest('hex');
};

module.exports.hashMD5HexDigest = hashMD5HexDigest;