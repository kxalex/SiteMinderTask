module.exports = {
  summary: 'Heartbeat Endpoint',
  description: 'If the server is ok statusCode 200 returned',
  response: {
    200: {
      description: 'Successful response',
      type: 'object',
      required: ['status'],
      properties: {
        statusCode: {type: 'number', example: 200},
      },

    },
  },
};
