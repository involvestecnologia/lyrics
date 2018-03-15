const debug = require('../config/debug')('providers:google-translate');
const translate = require('google-translate-api');
const logger = require('../config/logger');
const GlossaryProvider = require('../providers/glossary.provider');
const Env = require('../config/env');

/**
 * @module GoogleTranslateProvider
 */
class GoogleTranslateProvider {
  constructor() {
    this.Glossary = new GlossaryProvider(Env.GLOSSARY_FILE_PATH);
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
      text = this.Glossary.replace(text, from, to);

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
