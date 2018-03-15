const debug = require('./debug')('config:workers');
const Env = require('./env');
const LocaleProcessor = require('../workers/locale-processor');

debug('configuring workers');

const workers = [];

if (Env.LOCALE_PROCESSOR_CRON) {
  debug(`scheduling ${LocaleProcessor.name} worker with cron '${Env.LOCALE_PROCESSOR_CRON}'`);

  workers.push({
    name: LocaleProcessor.name,
    job: LocaleProcessor.schedule(Env.LOCALE_PROCESSOR_CRON),
  });
}

module.exports = workers;
