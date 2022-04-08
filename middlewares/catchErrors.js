const catchErrors = (fn) => (req, res, next) => { 
  Promise.resolve(fn(req, res, next)).catch((e) => {
    next(e) 
  })
}

module.exports = catchErrors
