// server.js

var express    = require('express')
    , bodyParser = require('body-parser')
    , cors = require('cors')
    , dbInit = require('./boot/db-init.js')
    , app        = express();                 // define our app using express

// Database first
//dbInit.createDB();
//dbInit.initDb(4); // Init db with 4 days data.

// App config afterwards
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/json' }));

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Invoking API.');
    next(); // make sure we go to the next routes and don't stop here
});

var dataController = require('./controllers/data');

// The url will look like http://{servername}/api/data/hour/2015-07-17
router.route('/data/:group/:date')
    .get(dataController.getData);

app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Listening on port: ' + port);
