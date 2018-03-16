const portfinder = require('portfinder');
const App = require('../../../src');

const instances = {};

const createInstance = async (port) => {
  port = port || await portfinder.getPortPromise();

  const app = await App();

  instances[port] = {
    app,
    server: app.listen(port),
    port,
  };

  return instances[port];
};

const destroyInstance = async (port) => {
  if (!instances[port]) return;

  const { server } = instances[port];

  return new Promise((resolve, reject) => {
    server.close((err) => {
      delete instances[port];

      if (err) return reject(err);
      resolve();
    });
  });
};

module.exports = {
  createInstance,
  destroyInstance,
};
