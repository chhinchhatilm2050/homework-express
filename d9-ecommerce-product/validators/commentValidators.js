import { body, param } from 'express-validator';
import validate from '../middlewares/validation.js';

const createCommentValidation = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Comment content is required')
    .isLength({min: 10, max: 1000})
    .withMessage('Comment must be 10-1000 characters'),
  body('author')
    .notEmpty()
    .withMessage('Author is required')
    .isMongoId()
    .withMessage('Invalid author ID'),
  body('post')
    .notEmpty()
    .withMessage('Post ID is required')
    .isMongoId()
    .withMessage('Invalid post ID'),

  validate
];

const updateCommentValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid comment ID'),
  
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Comment content is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Comment must be 10-1000 characters'),
  
  validate
];

const commentIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid comment ID'),
  validate
];

export { createCommentValidation, updateCommentValidation, commentIdValidation };