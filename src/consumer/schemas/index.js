const definitions = require('./definitions.js');

module.exports = {
  routePrefix: '/doc',
  exposeRoute: true,
  schema: {
    info: {
      title: 'SiteMinder Mailer Swagger',
      description: 'SiteMinder Mailer API',
      version: '0.0.1',
    },
    host: 'localhost',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
  },
  definitions,
};
