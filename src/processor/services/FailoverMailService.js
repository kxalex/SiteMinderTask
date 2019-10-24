const IMailService = require('./MailService');
const logger = require('../../lib/logger').logger;

/**
 * Failover Mail Service implementation with SendGrid as master and
 * MainGun as slave (backup)
 */
class FailoverMailService extends IMailService {
  constructor({sendgridMailService, mailgunMailService}) {
    logger.debug('Initializing failover mail service');
    super();
    this.masterMailService = sendgridMailService;
    this.slaveMailService = mailgunMailService;
  }

  async send(opts) {
    logger.debug('FailoverMailService.send()');
    // TODO: rewrite this method using getLiveServices method and go through it
    let result;
    try {
      result = await this.masterMailService.send(opts);
    } catch (e) {
      logger.error('Could not send message using master service. ' +
          'Switching to slave.');
      logger.error(e);
      result = await this.slaveMailService.send(opts);
    }
    return result;
  }

  async isLive() {
    return true; // by default it's live
  }
}

module.exports = FailoverMailService;
