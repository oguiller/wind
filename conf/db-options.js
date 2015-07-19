/**
 * Created by guillermorodriguez on 19/07/15.
 */
var fs = require('fs'),
    configPath = __dirname +'/data-source.json';

var parsed = JSON.parse(fs.readFileSync(configPath, 'UTF-8'));
exports.dbConfig=  parsed;