const debug = require('../../../config/debug')('web:domains:application:routes');
const Router = require('koa-router');

const router = new Router();

debug('configuring routes');

const ApplicationController = require('./application.controller');

router.get('/', ApplicationController.status);

module.exports = router;
