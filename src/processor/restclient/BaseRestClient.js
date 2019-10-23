const request = require('request-promise-native');
const log = require('../../lib/logger.js').logger;

class BaseRestClient {

  constructor(baseUrl) {
    this.baseUrl = baseUrl;

    this.defaultHeaders = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'User-agent': 'siteminder/1.0.0;nodejs',
    };
  }

  authHeaders() {
    log.error('authHeaders is not implemented.');
    throw new Error('not implemented');
  }
  /**
   * Creates http options for request
   * @param {string} httpMethod
   * @param {string} resource
   * @param {object} payload
   * @return {{headers: {}, method: *, json: boolean, body: *, uri: string}}
   */
  options(httpMethod, resource, payload) {
    return {
      json: true,
      method: httpMethod,
      // TODO: make sure right URL formed here
      uri: this.baseUrl + resource,
      headers: {
        ...this.defaultHeaders,
        ...this.authHeaders(),
      },
      resolveWithFullResponse: true,
      ...payload,
    };
  }

  /**
   * base method for http post. might do other useful things in future
   * @private
   * @param {string} resource
   * @param {object} payload
   * @return {Promise}
   */
  async post(resource, msg) {
    const payload = this.buildPayload(msg);
    const options1 = this.options('POST', resource, payload);
    return request(options1);
  }

  async sendMail(msg) {
    throw new Error('not implemented');
  }

  buildPayload(msg) {
    throw new Error('not implemented');
  }

  codeSuccess(messageId) {
    return {
      message: 'The message has been queued.',
      code: 200,
      messageId: messageId,
    };
  }

  code4xx(statusCode) {
    return {message: '4xx or 5xx error', code: 400, statusCode: statusCode};
  }

  // TODO: define different answers
}

module.exports = BaseRestClient;
