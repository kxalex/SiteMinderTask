const AWS = require('aws-sdk');
const config = require('config');

AWS.config.update({region: config.aws.sqs.region});
AWS.config.credentials = new AWS.SharedIniFileCredentials(
    {profile: config.aws.profile.name});

const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

const sqsQueueUrl = config.aws.sqs.queueUrl;
const accountId = config.aws.sqs.accountId;
const queueName = config.aws.sqs.queueName;
const queueUrl = `${sqsQueueUrl}/${accountId}/${queueName}`;

module.exports = {
  AWS: AWS,
  SQS: sqs,
  Params: {
    QueueUrl: queueUrl,
  },
};
