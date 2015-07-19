/**
 * Created by guillermorodriguez on 19/07/15.
 */
var pg = require("pg")
    , options = require('../conf/db-options')
    , moment = require('moment');

var conString = "pg://" + options.dbConfig.dev.username + ":" + options.dbConfig.dev.password + "@" + options.dbConfig.dev.host + ":5432/wind";
var client = new pg.Client(conString);
client.connect();

exports.createDB = function () {

    pg.connect(conString, function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT $1::int AS number', ['1'], function (err, result) {

            if (err) {
                return console.error('error running query', err);
            }
            done();

            console.log("Connection succeeded!! " + result.rows[0].number);
        });
    });

    client.query("DROP TABLE IF EXISTS data;", function (err, result) {
        if (err) {
            return console.error("Unable to drop the table data!!")
        }
    });

    client.query("CREATE TABLE IF NOT EXISTS data (id BIGINT PRIMARY KEY, date TIMESTAMPTZ, year INTEGER, month SMALLINT, day SMALLINT, hour SMALLINT, value FLOAT);", function (err, result) {
        if (err) {
            return console.error("Unable to create the table data!!")
        }
    });
};

exports.initDb = function (numberOfDays) {
    var startDate = moment('2015-07-17 00:00:00'),
        total = 60 * 60 * 24 * numberOfDays;

    console.log("Loading DATA!!");

    for (i = 0; i < total; i++) {
        startDate.add(1, 's');
        var value = random(0, 100).toFixed(2);
        client.query("INSERT INTO data (id, date, year, month, day, hour, value) VALUES ($1, $2, $3, $4, $5, $6, $7);", [startDate.format("YYYYMMDDHHmmss"), startDate.format("YYYY-MM-DD HH:mm:ss"), startDate.format("YYYY"), startDate.format("MM"), startDate.format("DD"), startDate.format("HH"), value], function (err, result) {

            // handle an error from the query
            if (err) return;

            // get the total number of visits today (including the current visit)
            client.query('SELECT COUNT(*) AS count FROM data', function (err, result) {

                // handle an error from the query
                if (err) return;
                console.log(result);
                // return the client to the connection pool for other requests to reuse
            });
        });

    }

    console.log(" DATA Loaded!!");
};

function random(low, high) {
    return Math.random() * (high - low) + low;
};

