var MongoClient     = require('mongodb').MongoClient,
    DataFixtures    = require('./fixtures.data'),
    configuration   = require('../config/configuration');

module.exports = function(done) {
    // Connect to the db
    MongoClient.connect(configuration.mongodb, function(err, db) {

        if (err) {
            return console.dir(err);
        }

        var collectionKeys = db.collection('keys');;

        collectionKeys.remove(function(err) {
            collectionKeys.insert(DataFixtures.Datakeys, {w:1}, function(err, result) {
                done();
            });
        });

    });
};
