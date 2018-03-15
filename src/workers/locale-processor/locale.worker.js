const debug = require('../../config/debug')('workers:locale-processor:worker');
const { CronJob } = require('cron');
const Env = require('../../config/env');
const logger = require('../../config/logger');
const LocaleService = require('./locale.service');

const WebLocaleService = new LocaleService(Env.LOCO_WEB_PROJECT_KEY);
const HtmlLocaleService = new LocaleService(Env.LOCO_HTML_PROJECT_KEY);

/**
 * @module LocaleProcessor
 */
const LocaleWorker = {
  name: 'LocaleWorker',

  running: false,

  /**
   * @return {Promise<void>}
   */
  processWebLocales: async () => {
    if (!Env.LOCO_WEB_PROJECT_KEY) return;

    debug('processing web locales');

    const untranslated = await WebLocaleService.getUntranslatedTerms();
    const translations = await Promise.mapSeries(untranslated, async (term) => {
      const translation = await WebLocaleService.translateTerm(term);
      return {
        source: term[Object.keys(term)[0]].id,
        locales: translation,
      };
    });

    return Promise.each(translations, t => WebLocaleService.addTempLocales(t));
  },

  /**
   * @return {Promise<void>}
   */
  resolveHtmlLocales: async () => {
    if (!Env.LOCO_HTML_PROJECT_KEY) return;

    debug('processing html locales');

    // const untranslated = await HtmlLocaleService.getUntranslatedTerms();
    // const translations = await Promise.mapSeries(untranslated, async (term) => {
    //   const translation = await LocaleService.translateTerm(term);
    //   return {
    //     source: term[Object.keys(term)[0]].id,
    //     locales: translation,
    //   };
    // });
    //
    // return Promise.each(translations, t => HtmlLocaleService.addTempLocales(t));
  },

  /**
   * @return {Promise<void>}
   */
  run: async () => {
    if (LocaleWorker.running) return debug('worker is busy');

    debug('worker running');

    LocaleWorker.running = true;

    try {
      await Promise.all([
        LocaleWorker.processWebLocales(),
        LocaleWorker.resolveHtmlLocales(),
      ]);

      debug('worker halt');
    } catch (err) {
      logger.error(err);
    } finally {
      LocaleWorker.running = false;
    }
  },
};

exports.name = LocaleWorker.name;

/**
 * @param {String} cronPattern
 * @return {CronJob}
 */
exports.schedule = cronPattern => new CronJob({
  cronTime: cronPattern,
  onTick: LocaleWorker.run,
  start: true,
});
