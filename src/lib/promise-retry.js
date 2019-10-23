'use strict';
const log = require('./logger').logger;
const connectionConfig = require('config').connection;

module.exports = function retry(fn, retriesLeft = connectionConfig.retries, interval = connectionConfig.interval) {
  return new Promise((resolve, reject) => {
    return fn()
        .then(resolve)
        .catch((error) => {
          log.error('An error occurred. See error below.');
          log.error(error);
          log.debug(`Retrying in ${interval} msec (${retriesLeft})`);
          if (retriesLeft === 0) {
            reject(error);
            return;
          }
          setTimeout(() => {
            retry(fn, retriesLeft - 1, interval*2)
                .then(resolve, reject);
          }, interval);
        });
  });
};
