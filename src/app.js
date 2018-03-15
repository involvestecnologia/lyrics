const { Env, logger } = require('./config');
const debug = require('./config/debug')('index');
const Koa = require('koa');
const helmet = require('koa-helmet');
const morgan = require('koa-morgan');
const serve = require('koa-static-server');
const cors = require('@koa/cors');

/**
 * Bootstraps Koa application.
 *
 * @return {Promise<Application>}
 */
const bootstrap = async () => {
  debug('bootstrapping application');

  const app = new Koa();
  app.use(helmet());
  app.use(cors());
  app.use(serve({ rootDir: 'docs', rootPath: '/docs' }));
  app.use(serve({ rootDir: 'src/web/public', rootPath: '/static' }));
  app.use(morgan(Env.HTTP_LOG_CONFIG, { stream: logger.stream }));

  const router = require('./web');
  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
};

module.exports = bootstrap;
