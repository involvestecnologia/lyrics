const debug = require('../../config/debug')('providers:openai');
const logger = require('../../config/logger');
const Env = require('../../config/env');
const OpenAI = require('openai');

/**
 * @module OpenaiProvider
 */
class OpenaiProvider {
  constructor(apiKey = Env.OPENAI_API_KEY) {
    this.openai = new OpenAI({ apiKey });
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
      const translation = await this.openai.completions.create({
        model: Env.OPENAI_TRANSLATION_MODEL || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Translate text from ${from} to ${to}. Answer with the translated text only.`,
          },
          {
            role: 'user',
            content: text,
          },
        ],
        temperature: 1,
        max_tokens: 512,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      }).then((res) => {
        return res.data.choices[0].message.content;
      });

      return translation;
    } catch (err) {
      logger.error(`Error translating ${text} from ${from} to ${to}`, { error: err.message });
    }
  }
}

module.exports = OpenaiProvider;
