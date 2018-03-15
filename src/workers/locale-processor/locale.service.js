const debug = require('../../config/debug')('workers:locale-processor:service');
const LocoProvider = require('../../providers/loco.provider');
const GoogleTranslateProvider = require('../../providers/google-translate.provider');
const Env = require('../../config/env');
const logger = require('../../config/logger');

const preferredLang = Env.LOCALE_PROCESSOR_PREFERRED_LANGUAGE;

class LocaleService {
  constructor(projectKey) {
    this.Loco = new LocoProvider(projectKey);
  }

  /**
   * @param term
   * @return {Promise<Object[]>}
   */
  static translateTerm(term) {
    const locales = Object.keys(term);
    const termId = term[locales[0]].id;

    let preferred = locales.find(locale => locale === preferredLang && term[locale].status === 'Translated');
    preferred = preferred || locales.find(locale => term[locale].status === 'Translated');

    if (!preferred) return logger.warn(`Unable to translate term "${termId}". No translated reference was found.`);

    const props = {};
    locales.filter(locale => (locale !== preferred)).forEach((locale) => {
      debug(`translating term "${termId}" for locale "${locale}"`);

      props[locale] = GoogleTranslateProvider
        .translate(term[preferred].translation, preferred, locale);
    });

    return Promise.props(props);
  }

  /**
   * @return {Promise<Object[]>}
   */
  async getUntranslatedTerms() {
    debug('retrieving untranslated terms');

    const locales = await this.Loco.getLocales();
    const assets = await this.Loco.getAssets();

    const untranslatedAssets = assets.filter(asset => asset.progress.untranslated > 0);

    return Promise.mapSeries(untranslatedAssets, (asset) => {
      const props = {};
      locales.forEach((locale) => {
        props[locale.code] = this.Loco.getTranslation(asset.id, locale.code);
      });

      return Promise.props(props);
    });
  }
}

module.exports = LocaleService;
