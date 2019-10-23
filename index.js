/**
 * index.js is used to start fastify without fastify-cli which is simplifies
 * development inside IDEA
 */
'use strict';

const SERVER_MODE = process.env.SERVER_MODE;
const MessageConsumerServer = require('./src/consumer/MessageConsumerServer');
const MessageProcessorServer = require('./src/processor/MessageProcessorServer');

switch (SERVER_MODE) {
  case 'processor':
    MessageProcessorServer.start();
    break;

  case 'consumer':
    MessageConsumerServer.start();
    break;

  default:
    MessageConsumerServer.start();
    MessageProcessorServer.start();
}

