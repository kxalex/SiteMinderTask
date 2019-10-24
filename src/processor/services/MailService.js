
module.exports = class IMailService {
  /**
   * @param {object} opts {to, cc, bcc, subject, content}
   * @return {Promise<void>}
   */
  async send(opts) {
    throw new Error('not implemented');
  }

  /**
   * Checks is mailing service live or down
   * @param {object} opts
   * @return {boolean} return true if the service is functioning,
   *                   otherwise false
   */
  async isLive() {
    throw new Error('not implemented');
  }
};
