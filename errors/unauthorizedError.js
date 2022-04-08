const AppError = require('./appError')

module.exports = class UnauthorizedError extends AppError {
  constructor(message) {
    super(401, 'UNAUTHORIZED', message || 'not found')
  }
}
