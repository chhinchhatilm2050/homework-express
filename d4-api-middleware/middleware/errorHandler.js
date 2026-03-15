class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

const errorHandler = (err, req, res, next) => {
  const isDev = process.env.NODE_ENV === 'development';
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    gray: '\x1b[90m'
  };

  console.error(`${colors.red} ${err.status.toUpperCase()} ${err.statusCode}${colors.reset}`);
  console.error(`${colors.red} Message: ${err.message}${colors.reset}`);

  if(isDev) {
    console.error(`${colors.gray} Stack: ${err.stack}${colors.reset}`);
  }

  if(isDev) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err.message,
      stack: err.stack
    });
  } else {
    if(err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,    
        error: err.message     
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong'
      });
    }
  }
};

const notFound = (req, res, next) => {
    const error = new AppError(`Cannot find ${req.originalUrl}`, 404);
    next(error);
};

export { AppError, errorHandler, notFound };