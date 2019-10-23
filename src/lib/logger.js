const config = require('config');
const logger = require('pino')(
    {
      level: config.logger.level,
      prettyPrint: config.logger.prettyPrint,
    },
);

module.exports.logger = logger;
