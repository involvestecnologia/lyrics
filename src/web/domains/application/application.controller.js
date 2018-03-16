const debug = require('../../../../config/debug')('web:domains:application:controller');
const ApplicationService = require('./application.service');

/**
 * @module ApplicationController
 */
const ApplicationController = {
  /**
   * @api {get} / Application status
   * @apiVersion 0.0.0
   * @apiName GetStatus
   * @apiGroup Application
   *
   * @apiSuccess {String} status Application status.
   * @apiSuccess {String} name Application name.
   * @apiSuccess {String} version Application version.
   */
  status: (ctx) => {
    debug('status action');

    ctx.body = ApplicationService.status();
  },
};

module.exports = ApplicationController;
