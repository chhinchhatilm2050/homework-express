import { body, param } from 'express-validator';
import validate from '../middlewares/validation.js';
import { isEmailUnique, PASSWORD_REGEX, NAME_REGEX } from '../utils/validators.js';
const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({min: 3, max: 50})
    .withMessage('Name must be 3-50 characters')
    .matches(NAME_REGEX)
    .withMessage('Name can only contain letters and spaces'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email')
    .normalizeEmail()
    .custom(isEmailUnique),
  body('password')
    .isLength({min: 8})
    .withMessage('Password must be at least 8 characters')
    .matches(PASSWORD_REGEX)
    .withMessage('Password must contain uppercase, lowercase, number, and special character'),
  body('bio')
    .optional()
    .trim()
    .isLength({max: 500})
    .withMessage('Bio must not exceed 500 characters'),
  body('avatar')
    .optional()
    .isURL()
    .withMessage('Avatar must be a valid URL'),
  validate
];

const updateUserValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({min: 3, max: 50})
    .withMessage('Name must be 3-50 characters')
    .matches(NAME_REGEX)
    .withMessage('Name can only contain letters and spaces'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Invalid email')
    .normalizeEmail()
    .custom(isEmailUnique),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio must not exceed 500 characters'),
  body('avatar')
    .optional()
    .isURL()
    .withMessage('Avatar must be a valid URL'),
    
  validate
];

const userIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid user id'),
  validate
];
export { registerValidation, updateUserValidation, userIdValidation};