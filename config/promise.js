const debug = require('./debug')('config:promise');
const bluebird = require('bluebird');

debug('configuring promise');

global.Promise = bluebird;

module.exports = bluebird;
