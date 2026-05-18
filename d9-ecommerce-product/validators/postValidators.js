import { body, param, query } from 'express-validator';
import validate from '../middlewares/validation.js';
import { isFutureDate, TAGS_REGEX } from '../utils/validators.js';

const createPostValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({min: 10, max: 200})
    .withMessage('Title must be 10-200 characters'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({min: 100})
    .withMessage('Content must be at least 100 characters'),
  body('excerpt')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Excerpt must not exceed 300 characters'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isMongoId()
    .withMessage('Invalid category ID'),
  body('tags')
    .isArray({min: 1, max: 10})
    .withMessage('Must provide 1-10 tags'),
  body('tags.*')
    .optional()
    .trim()
    .toLowerCase()
    .isLength({ min: 2, max: 20 })
    .matches(TAGS_REGEX),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived']),
  
  body('featured')
    .optional()
    .isBoolean()
    .toBoolean(),
    
  body('featuredImage')
    .optional()
    .isURL(),
  body('publishAt')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format')
    .toDate()
    .custom(isFutureDate),

  validate
];

const updatePostValidation = [
  body('updatedBy')
    .notEmpty()
    .withMessage('Updateby is requried')
    .isMongoId()
    .withMessage('Invalid post ID'),
    
  body('title')
    .optional()
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('Title must be 10-200 characters'),
    
  body('content')
    .optional()
    .trim()
    .isLength({ min: 100 })
    .withMessage('Content must be at least 100 characters'),
    
  body('excerpt')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Excerpt must not exceed 300 characters'),
    
  body('category')
    .optional()
    .isMongoId()
    .withMessage('Invalid category ID'),
    
  body('tags')
    .optional()
    .isArray({ min: 1, max: 10 })
    .withMessage('Must provide 1-10 tags'),
    
  body('tags.*')
    .optional()
    .trim()
    .toLowerCase()
    .isLength({ min: 2, max: 20 })
    .matches(/^[a-z0-9-]+$/),
    
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived']),
    
  body('featured')
    .optional()
    .isBoolean()
    .toBoolean(),
    
  body('featuredImage')
    .optional()
    .isURL(),
    
  validate
];

const getPostValidation = [
  query('page')
    .optional()
    .isInt({ min: 1})
    .withMessage('Page must be a positive integer')
    .toInt(),
    
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),
    
  query('sort')
    .optional()
    .isIn(['title', '-title', 'createdAt', '-createdAt', 'views', '-views', 'likes', '-likes'])
    .withMessage('Invalid sort field'),
    
  query('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Invalid status'),
    
  query('category')
    .optional()
    .isMongoId()
    .withMessage('Invalid category ID'),
    
  query('tag')
    .optional()
    .trim()
    .toLowerCase(),
    
  query('search')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Search query must be at least 2 characters'),
    
  query('featured')
    .optional()
    .isBoolean()
    .toBoolean(),
    
  validate
];

const postIdValidation = [
  param('id')
    .notEmpty()
    .withMessage('Post ID is required')
    .isMongoId()
    .withMessage('Invalid post ID'),
  body('id')
    .notEmpty()
    .withMessage('User ID is required')
    .isMongoId()
    .withMessage('Invalid userId'),
  validate
];

export { createPostValidation, updatePostValidation, getPostValidation, postIdValidation };