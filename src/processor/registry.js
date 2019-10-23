const config = require('config');
const {createContainer, asValue} = require('awilix');

const container = createContainer();

container.register({
  sendGridConfig: asValue(config.sendGridConfig),
  mailGunConfig: asValue(config.mailGunConfig),
});

container.loadModules([
  './src/processor/services/*.js',
  './src/processor/restclient/*.js',
], {
  formatName: 'camelCase',
},
);

module.exports = container;
