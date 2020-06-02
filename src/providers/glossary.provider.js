const debug = require('../../config/debug')('providers:glossary');
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
    // A = [-, -, -, -, -, (5), 6, 7, 8, 9, 10] -> reduces A length from left to right
    for (let end = len; end > start; end -= 1) {
      // B = [5, 6, 7, (8), -, -] -> reduces A remaining length from right to left
      const chunk = chars.slice(start, end).join('');
      if (chunk && term && (chunk.toLowerCase() === term.toLowerCase())) {
        const surroundingChars = {
          before: chars[start - 1],
          after: chars[end],
        };

        const isUpperCase = chunk === chunk.toUpperCase();
        const isFirstUpperCase = !isUpperCase && (chunk[0] === chunk[0].toUpperCase());

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
 * @param toLocale
 * @param expression
 *
 * @return Object[]
 */
const findMatches = (glossary, toLocale, expression) => ArrayUtils.flatten(glossary
  .map(term => term[toLocale])
  .map(term => match(term, expression))
  .filter(matches => matches.length))
  .filter(match => match.wordLike);

/**
 * @module GlossaryProvider
 */
class GlossaryProvider {
  constructor(path = Env.GLOSSARY_PATH) {
    this.glossaryPath = path;
  }

  /**
   * @return {Promise<void>}
   * @private
   */
  async _resolveFile() {
    if (validUrl.isWebUri(this.glossaryPath)) {
      debug('resolving glossary file from internet');

      try {
        const { data } = await axios.get(this.glossaryPath);
        this.glossary = data;
      } catch (err) {
        logger.error(`Error retrieving glossary file from: ${this.glossaryPath}`, { error: err });
        throw err;
      }
    } else {
      debug('resolving glossary file from filesystem');

      const glossaryPath = path.isAbsolute(Env.GLOSSARY_PATH)
        ? Env.GLOSSARY_PATH
        : path.resolve(process.cwd(), Env.GLOSSARY_PATH);

      this.glossary = require(glossaryPath);
    }

    setTimeout(() => {
      this.glossary = null;
    }, (5 * 1000) * 60); // Five minutes cache
  }

  /**
   * @param text
   * @param from
   * @param to
   * @return {String}
   */
  async replaceTerms(text, from, to) {
    debug(`replacing glossary terms for "${text}", using language "${from}"`);

    if (!this.glossaryPath || !this.glossaryPath.length) return text;
    if (!this.glossary) await this._resolveFile();

    const matches = findMatches(this.glossary, from, text);
    const relevants = findMostRelevantTerms(matches);

    relevants.forEach((term) => {
      let toTerm = this.glossary.find(g => (g[from].toLowerCase() === term.text.toLowerCase()));
      if (!toTerm || !toTerm[to]) return text;

      toTerm = toTerm[to];

      if (term.isFirstUpperCase) {
        toTerm = toTerm.replace(toTerm[0], toTerm[0].toUpperCase());
      } else if (term.isUpperCase) {
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
