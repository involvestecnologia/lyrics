const debug = require('../../config/debug')('web:routes');
const Router = require('koa-router');

const router = new Router();

debug('configuring routes');

const application = require('./domains/application');
const metrics = require('./metrics');

router.use('/', application.routes(), application.allowedMethods());
router.use('/metrics', metrics.routes(), metrics.allowedMethods());

module.exports = router;
