
module.exports = class IMailService {
  /**
   * @param {object} opts {to, cc, bcc, subject, content}
   * @return {Promise<void>}
   */
  async send(opts) {
    throw new Error('not implemented');
  }
};
