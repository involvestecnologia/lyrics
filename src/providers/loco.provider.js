const debug = require('../../config/debug')('providers:loco');
const axios = require('axios');
const qs = require('querystring');
const logger = require('../../config/logger');

const LOCO_BASE_URL = 'https://localise.biz';

/**
 * @module LocoProvider
 */
class LocoProvider {
  constructor(projectKey) {
    this.projectKey = projectKey;
    this.request = axios.create({
      baseURL: LOCO_BASE_URL,
      headers: {
        Authorization: `Loco ${projectKey}`,
      },
    });
  }

  async getProjectInfo() {
    debug('retrieving project info');

    try {
      const { data: info } = await this.request.get('/api/auth/verify');
      return info;
    } catch (err) {
      logger.error(`Error retrieving project info for key "${this.projectKey}"`, err);
    }
  }

  /**
   * @param {String} term
   * @param {String} locale
   * @param {String} translation
   * @return {Promise<void>}
   */
  async addTempLocale(term, locale, translation) {
    debug(`adding translation for term "${term}"`);

    try {
      await this.request.post(`/api/translations/${term}/${locale}`, translation);
      await this.request.post(`/api/translations/${term}/${locale}/flag`, qs.stringify({
        flag: 'provisional',
      }));
    } catch (err) {
      logger.error(`Error creating translation for term "${term}", locale "${locale}"`, err);
    }
  }

  /**
   * @return {Promise<void>}
   */
  async getLocales() {
    debug('retrieving project locales');

    const { data } = await this.request.get('/api/locales');
    return data;
  }

  /**
   * @param id
   * @param locale
   * @return {Promise<void>}
   */
  async getTranslation(id, locale) {
    debug(`retrieving translation for term "${id}", locale "${locale}"`);

    try {
      const { data } = await this.request.get(`/api/translations/${id}/${locale}`);
      return data;
    } catch (error) {
      debug(`
        retrieving translation for term "${id}", locale "${locale}".
        The term will not be translated.
      `);
    }
  }

  /**
   * @return {Promise<void>}
   */
  async getAssets() {
    debug('retrieving project assets');

    const { data } = await this.request.get('/api/assets');
    return data;
  }
}

module.exports = LocoProvider;
