const debug = require('../../config/debug')('providers:google-translate');
const translate = require('google-translate-api');
const logger = require('../../config/logger');
const Env = require('../../config/env');
const path = require('path');
const validUrl = require('valid-url');
const axios = require('axios');
const ArrayUtils = require('../utils/array.utils');

const findMostComplexTerm = terms => terms.reduce((previous, current) => {
  const previousComplexity = previous.text.length + previous.text.split(' ').length;
  const currentComplexity = current.text.length + current.text.split(' ').length;

  if (previousComplexity > currentComplexity) return previous;
  return current;
});

const findMostRelevantTerms = terms => terms.reduce((grouped, term) => {
  const inBoundaryOf = terms.filter(t => t.at[0] <= term.at[0] && t.at[1] >= term.at[1]);
  if (inBoundaryOf.length === 1) {
    grouped.push(term);
  } else if (findMostComplexTerm(inBoundaryOf) === term) {
    grouped.push(term);
  }

  return grouped;
}, []);

const isWordLike = (surroundingChars) => {
  const wordLike = /[a-zA-Z0-9]|-/;
  const isBeforeWordLike = !surroundingChars.before || !surroundingChars.before.match(wordLike);
  const isAfterWordLike = !surroundingChars.after || !surroundingChars.after.match(wordLike);

  return isBeforeWordLike && isAfterWordLike;
};

const match = (term, expression) => {
  const chars = expression.split('');
  const foundTerms = [];

  for (let start = 0, len = chars.length; start < len; start += 1) {
    for (let end = (len - start); end > -1; end -= 1) {
      const chunk = chars.slice(start, end).join('');
      if (chunk.toLowerCase() === term.toLowerCase()) {
        const surroundingChars = {
          before: chars[start - 1],
          after: chars[end],
        };

        const isFirstUpperCase = chunk[0] === chunk[0].toUpperCase();
        const isUpperCase = !isFirstUpperCase && chunk === chunk.toUpperCase();

        foundTerms.push({
          text: chunk,
          wordLike: isWordLike(surroundingChars),
          isUpperCase,
          isFirstUpperCase,
          at: [start, end],
        });
      }
    }
  }

  return foundTerms;
};

/**
 * @param glossary
 * @param fromLocale
 * @param expression
 *
 * @return Object[]
 */
const findMatches = (glossary, fromLocale, expression) => ArrayUtils.flatten(glossary
  .map(term => term[fromLocale])
  .map(term => match(term, expression))
  .filter(matches => matches.length))
  .filter(match => match.wordLike);

/**
 * @module GoogleTranslateProvider
 */
class GlossaryProvider {
  constructor() {
    if (validUrl.isWebUri(Env.GLOSSARY_PATH)) {
      this.glossary = Env.GLOSSARY_PATH;
    } else {
      const glossaryPath = path.isAbsolute(Env.GLOSSARY_PATH)
        ? Env.GLOSSARY_PATH
        : path.resolve(process.cwd(), Env.GLOSSARY_PATH);

      this.glossary = Env.GLOSSARY_PATH ? require(glossaryPath) : null;
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
      text = await this.replaceGlossary(text, from, to);
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
      this.glossary = data;
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
    if (typeof this.glossary === 'string') await this._resolveGlossary();

    const matches = findMatches(this.glossary, from, text);
    const relevants = findMostRelevantTerms(matches);

    relevants.forEach((term) => {
      let toTerm = this.glossary.find(g => (g[from] === term.text));
      if (!toTerm) return text;

      toTerm = toTerm[to];

      if (term.isFirstUpperCase) {
        toTerm = toTerm.replace(toTerm[0], toTerm[0].toUpperCase());
      } else {
        toTerm = toTerm.toUpperCase();
      }

      const before = text.substr(0, term.at[0]);
      const after = text.substr(term.at[1], text.length);

      text = before + toTerm + after;
    });

    return text;
  }
}

module.exports = GlossaryProvider;
