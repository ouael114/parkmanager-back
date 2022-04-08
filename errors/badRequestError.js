const AppError = require('./appError')

module.exports = class BadRequestError extends AppError {
  constructor(message) {
    super(400, 'BAD_REQUEST', message || 'bad request')
  }
}
