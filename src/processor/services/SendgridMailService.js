const logger = require('../../lib/logger.js').logger;
const retry = require('../../lib/promise-retry');
const IMailService = require('./MailService');

/**
 * SendGrid Mail Service implementation
 */
class SendgridMailService extends IMailService {

  constructor({sendgridRestClient}) {
    super();
    logger.debug('Created SendGrid mail service');
    this.client = sendgridRestClient;
  }

  async send({to, cc, bcc, subject, content}) {
    logger.debug('SendgridMailService.send()');
    try {
      const status = await retry(() =>
        this.client.sendMail({to, cc, bcc, subject, content}));
      // TODO: store X-Message-Id for further auditing and processing
      // TODO: add storeMessageId handler
      // TODO: handle special SendGrid http return codes
      return JSON.stringify(status);
    } catch (e) {
      logger.error(e);
      throw new Error('An error occurred during mail send.');
    }
  }
}

module.exports = SendgridMailService;
