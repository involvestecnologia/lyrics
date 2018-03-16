const debug = require('../config/debug')('providers:google-translate');
const translate = require('google-translate-api');
const logger = require('../config/logger');
const Env = require('../config/env');

/**
 * @module GoogleTranslateProvider
 */
class GoogleTranslateProvider {
  constructor() {
    if (Env.GLOSSARY_FILE_PATH) this.glossary = require(Env.GLOSSARY_FILE_PATH);
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
      text = this.replaceGlossary(text, from, to);
      const translation = await translate(text, {
        from,
        to,
      });

      return translation.text;
    } catch (err) {
      logger.error(`Error translating ${text} from ${from} to ${to}`, err);
    }
  }

  /**
   * @param text
   * @param from
   * @param to
   * @return {String}
   */
  replaceGlossary(text, from, to) {
    if (!this.glossary) return text;

    this.glossary.forEach((locale) => {
      const fromLocale = locale[from];
      let toLocale = locale[to];

      const matches = text.match(new RegExp(`\\b${fromLocale}\\b`, 'ig')) || [];

      matches.forEach((match) => {
        const isUpperCase = match === match.toUpperCase();
        const isFirstUpperCase = !isUpperCase && match[0] === match[0].toUpperCase();

        if (!fromLocale || !toLocale) return;

        if (isUpperCase) {
          toLocale = toLocale.toUpperCase();
        } else if (isFirstUpperCase) {
          toLocale = toLocale.replace(toLocale[0], toLocale[0].toUpperCase());
        }

        text = text.replace(match, toLocale);
      });
    });

    return text;
  }
}

module.exports = GoogleTranslateProvider;
