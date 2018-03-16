/* eslint-disable padded-blocks */

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const pkg = require('../../../../package.json');
const ApplicationService = require('./application.service');

before(() => {
  chai.use(chaiAsPromised);
  chai.should();
});

describe('Application.Service', () => {

  describe('#status()', () => {

    it('should return application statuses', () => {
      const status = ApplicationService.status();
      status.should.be.an('object');
      status.status.should.be.a('string').equal('ok');
      status.name.should.be.a('string').equal(pkg.name);
      status.version.should.be.a('string').equal(pkg.version);
    });
  });
});
