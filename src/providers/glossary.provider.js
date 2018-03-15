const debug = require('../config/debug')('providers:glossary');
const logger = require('../config/logger');

/**
 * @module GlossaryProvider
 */
class GlossaryProvider {
  constructor(fileName) {
    this.glossary = require(fileName);
  }

  /**
   * @param text
   * @param from
   * @param to
   * @return {String}
   */
  replace(text, from, to) {
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

module.exports = GlossaryProvider;
