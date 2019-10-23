const {SQS, Params} = require('../../lib/awsinit');
const configSqs = require('config').aws.sqs;
const logger = require('../../lib/logger').logger;
const retry = require('../../lib/promise-retry');

class SQSWorker {
  /**
   * Starts SQS polling worker
   * @param {function} messageProcessor
   */
  static startWorker(messageProcessor) {
    setTimeout(() => {
      SQSWorker.pollMessage(messageProcessor);
      SQSWorker.startWorker(messageProcessor);
    },
    configSqs.pollInterval);
  }

  /**
   * The method polls SQS queue, gets 1 message at the time and calls
   * messageProcessor callback with mail message data
   *
   * @param {function} messageProcessor
   * @return {Promise<void>}
   */
  static async pollMessage(messageProcessor) {
    const params = {
      ...Params,
      MaxNumberOfMessages: configSqs.maxMessages,
      VisibilityTimeout: configSqs.visibilityTimeout,
      WaitTimeSeconds: configSqs.waitTimeSeconds,
    };

    try {
      const response = await SQS.receiveMessage(params).promise();

      if (Array.isArray(response.Messages) && response.Messages.length >= 1) {
        const message = JSON.parse(response.Messages[0].Body);

        try {
          await retry(() => messageProcessor(message));

          // delete message after successful processing
          const deleteParams = {
            ...Params,
            ReceiptHandle: response.Messages[0].ReceiptHandle,
          };

          await SQS.deleteMessage(deleteParams).promise();
        } catch (e) {
          logger.error('Could not process or delete message. ' +
              'The message should be sent to dead letter queue after 6 ' +
              'polls. See error below.');
          logger.error(e);
          // NOTE: the message should already be moved to dead letter queue
        }
      }
    } catch (e) {
      logger.error('An error occurred during polling SQS message queue. ' +
          'See error below.');
      logger.error(e);
    }
  }
}

module.exports = SQSWorker;
