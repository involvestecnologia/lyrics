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

  /**
   * @return {String}
   */
  static get OPENAI_API_KEY() {
    return process.env.OPENAI_API_KEY;
  }

  /**
   * @return {String}
   */
  static get OPENAI_TRANSLATION_MODEL() {
    return process.env.OPENAI_TRANSLATION_MODEL;
  }

  /**
   * @return {String} 'google' or 'openai'
   */
  static get PREFFERED_TRANSLATION_PROVIDER() {
    return process.env.PREFFERED_TRANSLATION_PROVIDER || 'google';
  }

  /**
   * @return {Number}
   */
  static get LOGGER_ADDRESS() {
    return process.env.LOGGER_ADDRESS;
  }

  /**
   * @return {String}
   */
  static get LOGGER_PORT() {
    return process.env.LOGGER_PORT;
  }

  /**
   * @return {String}
   */
  static get LOGGER_LEVEL() {
    return process.env.LOGGER_LEVEL;
  }
}

module.exports = Env;
