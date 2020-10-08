const debug = require('./debug')('config:logger');
const Env = require('./env');
const split = require('split');
const winston = require('winston');
const GelfTransport = require('winston-gelf');

debug('configuring logger');

const logstashLogger = winston.createLogger({
  level: Env.LOGGER_LEVEL || 'error',
  defaultMeta: { application: global.APP_NAME },
  format: winston.format.simple(),
  transports: [
    new GelfTransport({
      gelfPro: {
        adapterOptions: {
          host: Env.LOGGER_ADDRESS,
          port: Env.LOGGER_PORT,
        },
      },
    }),
  ],
});

const debugLogger = winston.createLogger({
  level: 'debug',
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true,
    }),
  ],
});

const logger = Env.LOGGER_ADDRESS && Env.LOGGER_PORT ? logstashLogger : debugLogger;

module.exports = logger;
module.exports.stream = split().on('data', (message) => {
  logger.info(message);
});
