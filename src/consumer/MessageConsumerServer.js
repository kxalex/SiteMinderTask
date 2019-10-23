const logger = require('../lib/logger.js').logger;
const app = require('fastify')({logger: logger});
const fastifySwagger = require('fastify-swagger');
const fastifyGracefulShutdown = require('fastify-graceful-shutdown');
const swaggerOption = require('./schemas');
const API = require('./api');

module.exports = class MessageConsumerServer {
  /**
   * Starts consumer server
   */
  static start() {
    logger.info('Starting MessageConsumerServer...');

    app.register(fastifyGracefulShutdown);
    app.register(fastifySwagger, swaggerOption);
    app.register(API.initializeServer, {prefix: '/api'});

    app.listen(process.env.PORT || 3000, '0.0.0.0', (err) => {
      if (err) {
        app.log.error(err);
        process.exit(1);
      }
    });
  }
};
