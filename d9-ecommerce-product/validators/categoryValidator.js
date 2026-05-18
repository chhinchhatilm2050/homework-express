import { body, param } from 'express-validator';
import validate from '../middlewares/validation.js';
import { HEX_COLOR_REGEX, isSlugUnique, SLUG_REGEX } from '../utils/validators.js';

const createCategoryValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({min: 2, max: 50})
    .withMessage('Category name must be 2-50 charaters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
    
  body('color')
    .optional()
    .matches(HEX_COLOR_REGEX)
    .withMessage('Color must be a valid hex color code'),
    
  validate
];

const updateCategoryValidation = [
  body('createdBy')
    .notEmpty()
    .withMessage('Createdby is requied')
    .isMongoId()
    .withMessage('Invalid category ID'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category name must be 2-50 characters'),
  body('slug')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Slug must be 2-50 characters')
    .matches(SLUG_REGEX)
    .withMessage('Slug can only contain lowercase letters, numbers, and hyphens')
    .custom(isSlugUnique),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  body('color')
    .optional()
    .matches(HEX_COLOR_REGEX)
    .withMessage('Color must be a valid hex color code'),
  validate
];

const categoryIdValidation = [
  param('id')
    .notEmpty()
    .withMessage('CategoryId is required')
    .isMongoId()
    .withMessage('Invalid category ID'),
  validate
];

export { createCategoryValidation, updateCategoryValidation, categoryIdValidation };