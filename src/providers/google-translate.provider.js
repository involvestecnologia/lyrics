const debug = require('../../config/debug')('providers:google-translate');
const { Translate } = require('@google-cloud/translate');
const logger = require('../../config/logger');
const Env = require('../../config/env');

/**
 * @module GoogleTranslateProvider
 */
class GoogleTranslateProvider {
  constructor(projectId = Env.GOOGLE_TRANSLATE_PROJECT_ID) {
    this.translator = new Translate({ projectId });
  }

  /**
   * @param {String} text
   * @param {String} from
   * @param {String} to
   * @return {Promise<String>}
   */
  async translate(text, from, to) {
    debug(`translating "${text}" from "${from}" to "${to}"`);

    try {
      const [translation] = await this.translator.translate(text, {
        from,
        to,
      });

      return translation;
    } catch (err) {
      logger.error(`Error translating ${text} from ${from} to ${to}`, err);
    }
  }
}

module.exports = GoogleTranslateProvider;
