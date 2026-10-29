const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  console.error('[Error Handler]', err.message || err);

  // Handle JSON syntax error from body-parser
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: 'Invalid JSON payload format in request body'
    });
  }

  const statusCode = err.status || err.statusCode || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = errorHandler;
