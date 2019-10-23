// prettier-ignore
/* eslint-disable */

module.exports = {
  definitions: {
    emailSchema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email'
        },
        name: {
          type: 'string',
          maxLength: 30 // TODO: put right value
        }
      }
    },
    emailsSchema: {
      type: 'array',
      items: {
        $ref: '#/definitions/emailSchema'
      }
    }
  }
};
