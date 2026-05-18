import AppError from './appError.js';

const handleCasteError = (err) => {
  return new AppError(`Invalid ${err.path}: ${err.value}`, 400);
};

const handleDuplicateError = (err) => {
  const fields = Object.keys(err.keyValue)[0];
  const messages = {
    name: 'Name already exists',
    slug: 'Slug already exists'
  };
  const message = messages[fields] || `${fields} already exists`;
  return new AppError(message, 409);
};

export { handleCasteError, handleDuplicateError };
