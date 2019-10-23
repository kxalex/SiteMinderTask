module.exports = {
  // This json schema will be used for data validation
  summary: 'Send mail message',
  description: 'Send mail message',
  body: {
    type: 'object',
    required: ['to', 'subject'],
    properties: {
      to: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          required: ['email'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'somecoolemail@gmail.com',
            },
            name: {
              type: 'string',
              maxLength: 30,
              example: 'Firstname Lastname',
            },
          },
        },
      },
      cc: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          required: ['email'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'somecoolemail@gmail.com',
            },
            name: {
              type: 'string',
              maxLength: 30,
              example: 'Firstname Lastname',
            },
          },
        },
      },
      bcc: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          required: ['email'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'somecoolemail@gmail.com',
            },
            name: {
              type: 'string',
              maxLength: 30,
              example: 'Firstname Lastname',
            },
          },
        },
      },
      subject: {
        type: 'string',
        maxLength: 998,
        example: 'Message subject up to 998 characters long',
      },
      content: {
        type: 'string',
        example: 'Plain text message',
      },
    },
    additionalProperties: false,
  },
  response: {
    200: {
      description: 'Successful response',
      type: 'object',
      required: ['status', 'message'],
      properties: {
        statusCode: {
          type: 'number',
          example: 200,
        },
        message: {
          type: 'string',
          example: 'Message is queued for processing.',
        },
        messageId: {
          type: 'string',
          example: '9107d70f-b84f-451e-8376-f7bc76a3ed45',
        },
      },
    },
    500: {
      description: 'Internal server error',
      type: 'object',
      required: ['status', 'message'],
      properties: {
        statusCode: {
          type: 'number',
          example: 500,
        },
        error: {
          type: 'string',
          example: 'Internal server error',
        },
        message: {
          type: 'string',
          example: 'Description of an error',
        },
      },
    },
    400: {
      description: 'Bad request',
      type: 'object',
      required: ['status', 'message'],
      properties: {
        statusCode: {
          type: 'number',
          example: 400,
        },
        error: {
          type: 'string',
          example: 'Bad Request',
        },
        message: {
          type: 'string',
          example: 'body.to[0].email should match format \\"email\\"',
        },
      },
    },
  },
}
;
