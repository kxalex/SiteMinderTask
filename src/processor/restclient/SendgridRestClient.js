const BaseRestClient = require('./BaseRestClient');
const logger = require('../../lib/logger.js').logger;
const config = require('config');

/**
 * SendGrid API http client implementation
 */
class SendgridRestClient extends BaseRestClient {
  /**  */
  constructor({sendGridConfig: config}) {
    const {baseUrl, apiKey} = config;
    super(baseUrl);

    this.apiKey = apiKey;

    logger.trace('Creating SendGrid REST client');
  }

  /**
   * @return {{Authorization: string}}
   */
  authHeaders() {
    return {
      Authorization: 'Bearer ' + this.apiKey,
    };
  }

  async sendMail(msg) {
    return this.post('/mail/send', msg).then((req) => {
      if (req.statusCode >= 200 && req.statusCode <= 299) {
        logger.debug('Message has been queued successfully. Message ID: ' +
            req.headers['x-message-id']);
        return this.codeSuccess(req.headers['x-message-id']);
      }

      return this.code4xx(req.statusCode);
    }).catch((err) => {
      throw new Error(err);
    });
  }

  buildPayload({to, cc, bcc, subject, content}) {
    const body = {
      personalizations: [
        {
          to: to,
          cc: cc,
          bcc: bcc,
          subject: subject,
        }],
      // TODO: move to config from email
      from: {email: config.mailer.from},
      content: [
        {
          type: 'plain/text',
          value: content,
        }],
    };

    return {body: body};
  }
}

module.exports = SendgridRestClient;
