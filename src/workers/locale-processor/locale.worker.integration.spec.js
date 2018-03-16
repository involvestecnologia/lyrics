const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const LocaleService = require('./locale.service');

before(() => {
  chai.use(chaiAsPromised);
  chai.should();
});

describe('ExampleProcessor', () => {
  describe('#run()', () => {
    it('example', () => {
      const Service = new LocaleService();
      Service.should.be.an('object');
      // TODO
    });
  });
});
