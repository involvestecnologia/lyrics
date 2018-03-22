const debug = require('../../config/debug')('providers:google-translate');
const translate = require('google-translate-api');
const logger = require('../../config/logger');

/**
 * @module GoogleTranslateProvider
 */
class GoogleTranslateProvider {
  /**
   * @param {String} text
   * @param {String} from
   * @param {String} to
   * @return {Promise<String>}
   */
  static async translate(text, from, to) {
    debug(`translating "${text}" from "${from}" to "${to}"`);

    try {
      const translation = await translate(text, {
        from,
        to,
      });

      return translation.text;
    } catch (err) {
      logger.error(`Error translating ${text} from ${from} to ${to}`, err);
    }
  }
}

module.exports = GoogleTranslateProvider;
