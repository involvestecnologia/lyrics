const debug = require('debug');

global.APP_NAME = global.APP_NAME || require('../package.json').name;

module.exports = module => debug(`${global.APP_NAME}:${module}`);
