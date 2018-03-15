const debug = require('../../../config/debug')('web:domains:application:service');
const pkg = require('../../../../package.json');

/**
 * @module ApplicationService
 */
const ApplicationService = {
  /**
   * Application's status, name and version.
   *
   * @return {Object}
   */
  status: () => {
    debug('retrieving application status');

    return {
      status: 'ok',
      name: pkg.name,
      version: pkg.version,
    };
  },
};

module.exports = ApplicationService;
