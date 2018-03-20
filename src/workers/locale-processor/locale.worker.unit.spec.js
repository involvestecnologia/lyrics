/* eslint-disable padded-blocks */

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const LocoApiMock = require('../../../test/fixture/common/mocks/Loco.API.mock');

before(() => {
  chai.use(chaiAsPromised);
  chai.should();

  LocoApiMock.mock();
});

after(() => {
  LocoApiMock.clean();
});

const LocaleWorker = require('./locale.worker');

describe('LocaleWorker', () => {

  describe('#run()', () => {

    it('should set worker to busy when running', (done) => {
      const promise = Promise.resolve(LocaleWorker.worker.run());

      LocaleWorker.worker.running.should.be.a('boolean').equal(true);

      promise.finally(() => {
        LocaleWorker.worker.running.should.be.a('boolean').equal(false);
        done();
      });
    });

  });

});
