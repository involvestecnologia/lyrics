/* eslint-disable no-process-env */

const path = require('path');

/**
* @see https://github.com/motdotla/dotenv#usage
*/
if (process.env.NODE_ENV === 'test') {
  require('dotenv').config({ path: path.resolve(__filename, '../../.env.test') });
} if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.resolve(__filename, '../../.env') });
}

/**
 * @class Env
 */
class Env {
  /**
   * Application context.
   *
   * @default 'development'
   * @return {String}
   */
  static get NODE_ENV() {
    return (process.env.NODE_ENV || 'development');
  }

  /**
   * Application port.
   *
   * @default 3000
   * @return {Number}
   */
  static get PORT() {
    return process.env.PORT ? Number(process.env.PORT) : 3000;
  }

  /**
   * HTTP log config.
   *
   * @see https://github.com/expressjs/morgan#predefined-formats
   * @default 'dev'
   * @return {String}
   */
  static get HTTP_LOG_CONFIG() {
    return process.env.HTTP_LOG_CONFIG || 'dev';
  }

  /**
   * localise.biz api keys(read/write) separated by comma
   *
   * @see https://localise.biz/help/developers/api-keys
   * @example Nn1lx9ku_X2s345uhOHMQDwMlmrI9tNa,jasd681WfgubqycTlO-Mw2c4eZiVlQ5T
   * @return {String}
   */
  static get LOCO_PROJECT_KEYS() {
    return process.env.LOCO_PROJECT_KEYS;
  }

  /**
   * @return {String}
   */
  static get LOCALE_PROCESSOR_CRON() {
    return process.env.LOCALE_PROCESSOR_CRON;
  }

  /**
   * @return {String}
   */
  static get LOCALE_PROCESSOR_PREFERRED_LANGUAGE() {
    return process.env.LOCALE_PROCESSOR_PREFERRED_LANGUAGE;
  }

  /**
   * @return {String}
   */
  static get GLOSSARY_PATH() {
    return process.env.GLOSSARY_PATH;
  }

  /**
   * @see https://console.cloud.google.com/flows/enableapi?apiid=translate.googleapis.com
   *
   * @return {String}
   */
  static get GOOGLE_TRANSLATE_PROJECT_ID() {
    return process.env.GOOGLE_TRANSLATE_PROJECT_ID;
  }
}

module.exports = Env;
