const debug = require('../config/debug')('providers:loco');
const axios = require('axios');

const LOCO_BASE_URL = 'https://localise.biz';

/**
 * @module LocoProvider
 */
class LocoProvider {
  constructor(projectKey) {
    this.request = axios.create({
      baseURL: LOCO_BASE_URL,
      headers: {
        Authorization: `Loco ${projectKey}`,
      },
    });
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

    const { data } = await this.request.get(`/api/translations/${id}/${locale}`);
    return data;
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
