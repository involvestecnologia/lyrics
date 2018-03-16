const debug = require('../../config/debug')('providers:google-translate');
const translate = require('google-translate-api');
const logger = require('../../config/logger');
const Env = require('../../config/env');
const path = require('path');
const validUrl = require('valid-url');
const axios = require('axios');

/**
 * @module GoogleTranslateProvider
 */
class GoogleTranslateProvider {
  constructor() {
    if (Env.GLOSSARY_PATH) {
      if (validUrl.isWebUri(Env.GLOSSARY_PATH)) {
        this.glossary = Env.GLOSSARY_PATH;
      } else {
        const glossaryPath = path.isAbsolute(Env.GLOSSARY_PATH)
          ? Env.GLOSSARY_PATH
          : path.resolve(process.cwd(), Env.GLOSSARY_PATH);

        this.glossary = require(glossaryPath);
      }
    }
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
   * @return {Promise<void>}
   * @private
   */
  async _resolveGlossary() {
    try {
      const { data } = await axios.get(this.glossary);
      this.glossary = JSON.parse(data);
    } catch (err) {
      logger.error(`Error retrieving glossary file from: ${this.glossary}`, err);
      throw err;
    }
  }

  /**
   * @param text
   * @param from
   * @param to
   * @return {String}
   */
  async replaceGlossary(text, from, to) {
    if (!this.glossary) return text;
    if (this.glossary instanceof String) await this._resolveGlossary();

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
