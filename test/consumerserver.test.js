const tap = require('tap');
const buildFastify = require('../src/consumer/MessageConsumerServer');

// TODO: add more tests...

tap.test('GET `/api/heartbeat` route', (t) => {
  t.plan(4);

  const fastify = buildFastify();

  t.tearDown(() => fastify.close());
  fastify.inject({
    method: 'GET',
    url: '/api/heartbeat',
  }, (err, response) => {
    t.error(err);
    t.strictEqual(response.statusCode, 200);
    t.strictEqual(response.headers['content-type'],
        'application/json; charset=utf-8');
    t.deepEqual(JSON.parse(response.payload), {statusCode: 200});
  });
});
