/**
 * @see https://github.com/motdotla/dotenv#usage
 */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
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
   * @return {String}
   */
  static get LOCO_WEB_PROJECT_KEY() {
    return process.env.LOCO_WEB_PROJECT_KEY;
  }

  /**
   * @return {String}
   */
  static get LOCO_HTML_PROJECT_KEY() {
    return process.env.LOCO_HTML_PROJECT_KEY;
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
}

module.exports = Env;
