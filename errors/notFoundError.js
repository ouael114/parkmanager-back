const AppError = require('./appError')

module.exports = class NotFoundError extends AppError {
  constructor(message) {
    super(404, 'NOT_FOUND', message || 'not found')
  }
}
