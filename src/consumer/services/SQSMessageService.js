const {SQS, Params} = require('../../lib/awsinit');

class SQSService {
  static async postMessage(messageObject) {
    const params = {
      MessageBody: JSON.stringify(messageObject),
      ...Params,
    };

    return SQS.sendMessage(params).promise();
  }
}

module.exports = SQSService;
