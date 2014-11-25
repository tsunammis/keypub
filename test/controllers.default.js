var request     = require('supertest'),
    app         = require('./mock.app'),
    expect      = require("chai").expect;

describe('GET /{email}/install', function() {

    before(function(done) {
        // Load fixtures for tests
        require('./fixtures.load')(done);
    });

    it('When it succeeded', function(done) {
        request(app)
            .get('/c.norris@expandable.com/install')
            .expect(200)
            .end(function(err, res) {

                if (err) {
                    return done(err);
                }

                console.log('keys ...');
                console.log(res.text);

                return done();
            });
    });

    it('When it fails', function(done) {
        request(app)
            .get('/email-unknow@domain.com/install')
            .expect(404)
            .end(function(err, res) {

                if (err) {
                    return done(err);
                }

                console.log('keys ...');
                console.log(res.text);

                return done();
            });
    });

});