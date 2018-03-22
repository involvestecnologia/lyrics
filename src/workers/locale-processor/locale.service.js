const debug = require('../../../config/debug')('workers:locale-processor:service');
const LocoProvider = require('../../providers/loco.provider');
const GoogleTranslateProvider = require('../../providers/google-translate.provider');
const GlossaryProvider = require('../../providers/glossary.provider');
const Env = require('../../../config/env');

const preferredLang = Env.LOCALE_PROCESSOR_PREFERRED_LANGUAGE;

class LocaleService {
  constructor(projectKey) {
    this.Loco = new LocoProvider(projectKey);
    this.GlossaryProvider = new GlossaryProvider();
  }

  /**
   * @return {Promise<Object>}
   */
  async getProjectInfo() {
    return this.Loco.getProjectInfo();
  }

  /**
   * @param term
   * @return {Promise<Object[]>}
   */
  translateTerm(term) {
    const locales = Object.keys(term);
    const termId = term[locales[0]].id;

    let preferred = locales.find(locale => locale === preferredLang && term[locale].status !== 'Untranslated');
    preferred = preferred || locales.find(locale => term[locale].status !== 'Untranslated');

    if (!preferred) throw new Error(`Unable to translate term "${termId}". No translated reference was found.`);

    const props = {};
    locales.filter(locale => (locale !== preferred)).forEach((locale) => {
      debug(`translating term "${termId}" for locale "${locale}"`);

      props[locale] = this.GlossaryProvider
        .replaceTerms(term[preferred].translation, preferred, locale)
        .then(text => GoogleTranslateProvider
          .translate(text, preferred, locale));
    });

    return Promise.props(props);
  }

  /**
   * @param {Object} translation
   * @return {Promise<void>}
   */
  async addTempLocales(translation) {
    debug(`creating temp locales for ${translation.source}`);

    const locales = Object.keys(translation.locales);

    const promises = locales.map((locale) => {
      debug(`creating temp locale for ${translation.source}, locale: ${locale}, translation: ${translation.locales[locale]}`);
      return this.Loco.addTempLocale(translation.source, locale, translation.locales[locale]);
    });

    return Promise.all(promises);
  }

  /**
   * @return {Promise<Object[]>}
   */
  async getUntranslatedTerms() {
    debug('retrieving untranslated terms');

    const locales = await this.Loco.getLocales();
    const assets = await this.Loco.getAssets();

    const untranslatedAssets = assets.filter(asset => asset.progress.untranslated > 0);

    return Promise.mapSeries(untranslatedAssets.slice(0, 10), (asset) => {
      const props = {};
      locales.forEach((locale) => {
        props[locale.code] = this.Loco.getTranslation(asset.id, locale.code);
      });

      return Promise.props(props);
    });
  }
}

module.exports = LocaleService;
