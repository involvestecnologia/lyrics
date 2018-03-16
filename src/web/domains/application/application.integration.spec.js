/* eslint-disable padded-blocks */

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const supertest = require('supertest');

const pkg = require('../../../../package.json');
const InstanceHolder = require('../../../../test/fixture/integration/instance.holder');

let instance;
let request;

before(async () => {
  chai.use(chaiAsPromised);
  chai.should();

  instance = await InstanceHolder.createInstance();
  request = supertest.agent(instance.server);
});

after(async () => {
  await InstanceHolder.destroyInstance(instance.port);
});

describe('Application', () => {

  describe('/', () => {

    it('should return application statuses', () => {
      request.get('/')
        .expect('200')
        .then((status) => {
          status.should.be.an('object');
          status.status.should.be.a('string').equal('ok');
          status.name.should.be.a('string').equal(pkg.name);
          status.version.should.be.a('string').equal(pkg.version);
        });
    });
  });
});
