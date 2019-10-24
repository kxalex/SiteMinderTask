const logger = require('../../lib/logger.js').logger;
const retry = require('../../lib/promise-retry');
const IMailService = require('./MailService');

/**
 * MainGun Mail Service implementation
 */
class MailgunMailService extends IMailService {

  constructor({mailgunRestClient}) {
    super();
    logger.debug('Created MailGun mail service');
    this.client = mailgunRestClient;
  }

  async send(opts) {
    logger.debug('MailgunMailService.send()');
    try {
      const status = await retry(() => this.client.sendMail(opts));
      // TODO: handle special MailGun http return codes
      return JSON.stringify(status);
    } catch (e) {
      logger.error(e);
      throw new Error('An error occurred during mail send.');
    }
  }

  async isLive() {
    return true; // by default it's live
  }
}

module.exports = MailgunMailService;

