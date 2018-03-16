const debug = require('../../../config/debug')('workers:locale-processor:worker');
const { CronJob } = require('cron');
const Env = require('../../../config/env');
const logger = require('../../../config/logger');
const LocaleService = require('./locale.service');

/**
 * @module LocaleProcessor
 */
const LocaleWorker = {
  name: 'LocaleWorker',

  running: false,

  /**
   * @param {String} project Loco api key
   * @return {Promise<void>}
   */
  processProjectLocales: async (project) => {
    debug('processing locales');

    const Service = new LocaleService(project);
    const projectInfo = await Service.getProjectInfo();

    debug(`processing locales for ${projectInfo}`);

    const untranslated = await Service.getUntranslatedTerms();
    const translations = await Promise.mapSeries(untranslated, async (term) => {
      const translation = await Service.translateTerm(term);
      return {
        source: term[Object.keys(term)[0]].id,
        locales: translation,
      };
    });

    return Promise.each(translations, t => Service.addTempLocales(t));
  },

  /**
   * @return {Promise<void>}
   */
  run: async () => {
    if (LocaleWorker.running) return debug('worker is busy');

    debug('worker running');

    LocaleWorker.running = true;

    if (!Env.LOCO_PROJECT_KEYS) throw new Error('Loco project keys not configured');

    const projects = Env.LOCO_PROJECT_KEYS.split(',');

    try {
      await Promise.all(projects.map(project => LocaleWorker.processProjectLocales(project)));
      debug('worker halt');
    } catch (err) {
      logger.error(err);
      throw err;
    } finally {
      LocaleWorker.running = false;
    }
  },
};

exports.worker = LocaleWorker;

/**
 * @param {String} cronPattern
 * @return {CronJob}
 */
exports.schedule = cronPattern => new CronJob({
  cronTime: cronPattern,
  onTick: LocaleWorker.run,
  start: true,
});
