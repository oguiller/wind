/**
 * Created by guillermorodriguez on 19/07/15.
 */
var pg = require("pg")
    , options = require('../conf/db-options');

var conString = "pg://" + options.dbConfig.dev.username + ":" + options.dbConfig.dev.password + "@" + options.dbConfig.dev.host + ":5432/wind";
var client = new pg.Client(conString);
client.connect()


exports.getData = function(req, res) {

    console.log('Get group: ' + req.params.group);
    //TODO validation on parameter
    var group = req.params.group;
    var rows = [];

    var query = client.query('SELECT avg(value) as value, hour FROM data GROUP BY hour ORDER BY hour DESC');
    query.on('row', function(row) {
        rows.push(row);
    });

    query.on('end', function(result) {
        res.end(JSON.stringify(rows));
        console.log(result.rowCount + ' rows were received');
    });

};