const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  // Default error status and message
  const status = err.statusCode || 500;
  const message = err.message || 'Something went wrong on the server';
  
  // Structured error response
  res.status(status).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

module.exports = errorHandler;