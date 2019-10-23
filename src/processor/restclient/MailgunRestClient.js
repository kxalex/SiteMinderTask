const BaseRestClient = require('./BaseRestClient');
const btoa = require('btoa');
const logger = require('../../lib/logger.js').logger;
const config = require('config');

/**
 * MailGun API http client implementation
 */
class MailgunRestClient extends BaseRestClient {
  constructor({mailGunConfig: config}) {
    const {baseUrl, apiKey} = config;
    super(baseUrl);

    this.apiKey = apiKey;

    logger.trace('Creating MailGun REST client');
  }

  /**
   * @return {{Authorization: string}}
   */
  authHeaders() {
    return {
      // TODO: move 'api' to username config and replace here with config value
      Authorization: 'Basic ' + btoa('api:'+this.apiKey),
    };
  }

  // TODO: replace to opts and use const
  //  removeEmpty = obj => Object.keys(obj).filter(k => obj[k] != null);
  //  to remove empty properties
  async sendMail(msg) {
    return this.post('/messages', msg).then((req) => {
      if (req.statusCode >= 200 && req.statusCode <= 299) {
        logger.debug('Message has been queued successfully. Message ID:' +
            req.body.id);
        return this.codeSuccess(req.body.id);
      }

      return this.code4xx(req.statusCode);
    }).catch((err) => {
      throw new Error(err);
    });
  }

  buildPayload({to, cc, bcc, subject, content}) {
    const formatName = (name) => name ? `"${name}" ` : '';

    const formatEmail = (arr) => Array.isArray(arr) ?
        arr.map((v) => `${formatName(v.name)}<${v.email}>`).join(', ') : '';

    const toMailField = (field, arr) =>
        Array.isArray(arr) ? {[field]: formatEmail(arr)} : {};

    const formData = {
      from: config.mailer.from,
      ...toMailField('to', to),
      ...toMailField('cc', cc),
      ...toMailField('bcc', bcc),
      subject: subject,
      text: content,
    };

    return {formData: formData};
  }
}

module.exports = MailgunRestClient;
