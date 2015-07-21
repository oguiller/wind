/**
 * Created by guillermorodriguez on 19/07/15.
 */
var pg = require("pg")
    , moment = require('moment')
    , options = require('../conf/db-options');

var conString = "pg://" + options.dbConfig.dev.username + ":" + options.dbConfig.dev.password + "@" + options.dbConfig.dev.host + ":5432/wind";
var client = new pg.Client(conString);
client.connect()


exports.getData = function(req, res) {
    //TODO validation on parameter
    console.log('Get group: ' + req.params.group + ', date: ' + req.params.date);

    var momDate = moment(req.params.date);
    var group = req.params.group;

    var firstId = momDate.format("YYYYMMDDHHmmss");
    var lastId = momDate.hours(23).minutes(59).seconds(59).format("YYYYMMDDHHmmss");

    console.log("Id: "+ firstId + " Last Id: " + lastId);

    var rows = [];
    var query = client.query('SELECT avg(value) as value, hour FROM data WHERE id BETWEEN $1 AND $2 GROUP BY hour ORDER BY hour DESC', [firstId, lastId]);
    query.on('row', function(row) {
        rows.push(row);
    });

    query.on('end', function(result) {
        res.end(JSON.stringify(rows));
        console.log(result.rowCount + ' rows were received');
    });
};