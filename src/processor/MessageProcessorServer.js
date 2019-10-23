const logger = require('../lib/logger.js').logger;
const container = require('./registry');
const SQSWorker = require('./workers/SQSWorker');

class MessageProcessorServer {
  /**
   * Starts SQS queue polling worker and enables specified mailer mode.
   */
  static start() {
    logger.info('Starting MessageProcessorServer...');
    const mailService = container.resolve('failoverMailService');
    logger.info('Starting SQS polling worker...');
    SQSWorker.startWorker((message) => mailService.send(message));
  }
}

module.exports = MessageProcessorServer;
