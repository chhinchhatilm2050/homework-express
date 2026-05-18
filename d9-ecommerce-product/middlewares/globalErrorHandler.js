import { handleCasteError, handleDuplicateError } from '../utils/erroHandler.js';

const globalErrorHandler = (err, req, res, _next) => {
  const isDev = process.env.NODE_ENV === 'development';
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';
    
  let error = {...err, message: err.message};
  if(err.name === 'CastError') error = handleCasteError(err);
  if(err.code === 11000) error = handleDuplicateError(err);

  if(isDev) {
    console.log(`Stack: ${err.stack}`);
  }

  if(isDev) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
      stack: err.stack
    });
  } else {
    if(error.isOperational) {
      res.status(error.statusCode).json({
        status: error.status,
        message: error.message
      });
    } else {
      res.status(error.statusCode).json({
        status: error.statusCode,
        message: 'Something went wrong'
      });
    }
  }
};

export default globalErrorHandler;