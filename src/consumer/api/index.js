const errors = require('../../lib/errors.js');
const sendSchema = require('../schemas/send');
const heartbeatSchema = require('../schemas/heartbeat');
const SQSMessageService = require('../services/SQSMessageService');
const logger = require('../../lib/logger').logger;

const statusOk = (opts) => {
  return {statusCode: 200, ...opts};
};
const STATUS_ERROR_CODE = 412;

class API {
  static async initializeServer(fastify) {
    logger.debug('Installing API handlers');
    /**
     * heartbeat endpoint is used to check health of the service
     */
    fastify.get('/heartbeat', {schema: heartbeatSchema}, API.heartbeat);
    fastify.post('/mail/send', {schema: sendSchema}, API.mailSend);
    fastify.setErrorHandler(API.ErrorHandler);
  }

  static async heartbeat() {
    return statusOk();
  }

  static async mailSend(req) {
    const message = (({to, cc, bcc, subject, content}) =>
      ({to, cc, bcc, subject, content}))(req.body);
    try {
      const response = await SQSMessageService.postMessage(message);
      const messageId = response.MessageId;
      logger.debug(`Sent message to SQS queue. Message Id: ${messageId}`);
      return statusOk({
        message: 'Message is queued for processing.',
        messageId: messageId,
      });
    } catch (e) {
      const errMsg = 'An error occurred saving message.';
      logger.error(errMsg);
      logger.error(e);
      throw new Error(errMsg);
    }
  }

  static ErrorHandler(error, request, reply) {
    // TODO: prettify error messages
    const message = error.message;
    if (errors[message]) {
      reply.code(STATUS_ERROR_CODE);
    }
    reply.send(error);
  }
}

module.exports = API;
