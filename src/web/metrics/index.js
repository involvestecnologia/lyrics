const debug = require('../../../config/debug')('web:metrics:routes');
const logger = require('../../../config/logger');
const Router = require('koa-router');
const Prometheus = require('prom-client');

const router = new Router();

debug('configuring routes');

router.get('/', async (ctx) => {
  debug('metrics action');

  try {
    ctx.set('Content-Type', Prometheus.register.contentType);
    ctx.body = Prometheus.register.metrics();
  } catch (err) {
    ctx.status = 500;
    logger.error('Failed collect metrics', { error: err.message });
  }
});

module.exports = router;
