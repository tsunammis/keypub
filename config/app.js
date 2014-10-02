var morgan              = require('morgan'),
    bodyParser          = require('body-parser'),
    methodOverride      = require('method-override'),
    express             = require('express'),
    Configuration       = require('../config/configuration'),
    controllers         = require('../controllers'),
    app                 = express();

app.set('port', Configuration.port);
app.use(morgan(Configuration.env));
app.use(bodyParser());
app.use(methodOverride());

// Templating with EJS
app.engine('ejs', require('ejs').__express);
app.set('views', __dirname + '/../views');
app.set('view engine', 'ejs');

app.route('/:email/upload').get(controllers.Key.upload);
app.route('/:email/install').get(controllers.Key.install);
app.route('/:email/fingerprint').get(controllers.Key.fingerprint);
app.route('/:email/confirm/:token').get(controllers.Key.confirmToken);
app.route('/:email/:key/fingerprint').get(controllers.Key.fingerprint);
app.route('/:email/:key/install').get(controllers.Key.install);
app.route('/:email/:key/upload').get(controllers.Key.upload);
app.route('/:email/:keyName').post(controllers.Key.key);
app.route('/:email').get(controllers.Key.email);

// Handle error(s)
app.use(controllers.Default.errorHandler);

module.exports = app;