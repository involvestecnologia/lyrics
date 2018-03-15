const debug = require('debug');

module.exports = module => debug(`${global.APP_NAME}:${module}`);
