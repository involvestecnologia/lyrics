const debug = require('../../config/debug')('web:routes');
const Router = require('koa-router');

const router = new Router();

debug('configuring routes');

const application = require('./domains/application');

router.use('/', application.routes(), application.allowedMethods());

module.exports = router;
