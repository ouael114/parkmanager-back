module.exports = class AppError extends Error {
    constructor(status, code, message) {
  
      super(message)
  
      const constructorName = this.constructor.name
  
      this.code = code || constructorName.toLowerCase()
  
      // 500 as default value
      this.status = status || 500
  
      Error.captureStackTrace(this, this.constructor)
    }
  
    toJson() {
      return {
        code: this.code,
        message: this.message,
      };
    }
  }
  