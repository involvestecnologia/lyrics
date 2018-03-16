const debug = require('../../config/debug')('config:workers');
const Env = require('../../config/env');

debug('configuring workers');

const LocaleProcessor = require('./locale-processor');

const workers = [];

if (Env.LOCALE_PROCESSOR_CRON) {
  debug(`scheduling ${LocaleProcessor.worker.name} worker with cron '${Env.LOCALE_PROCESSOR_CRON}'`);

  workers.push({
    worker: LocaleProcessor.worker,
    job: LocaleProcessor.schedule(Env.LOCALE_PROCESSOR_CRON),
  });
}

module.exports = workers;
