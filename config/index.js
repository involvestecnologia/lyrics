const pkg = require('../package.json');

global.APP_NAME = pkg.name;

const debugModule = require('./debug');

const debug = debugModule('config:index');

debug('initializing app configuration');

const Env = require('./env');
const logger = require('./logger');
const promise = require('./promise');

module.exports = {
  Env,
  debug: debugModule,
  logger,
  promise,
};
