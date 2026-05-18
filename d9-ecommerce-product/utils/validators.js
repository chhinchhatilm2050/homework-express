import UserModel from '../model/User.js';
import AppError from './appError.js';
import CategoryModel from '../model/Category.js';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;
const URL_REGEX = /^https?:\/\/.+/;
const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;
const SLUG_REGEX = /^[a-z0-9-]+$/;
const TAGS_REGEX = SLUG_REGEX;
const MONGO_ID_REGEX = /^[0-9a-fA-F]{24}$/;
const NAME_REGEX = /^[a-zA-Z\s]+$/;

const validateTags = (tags) => {
  return tags.length >= 1 && tags.length <= 10;
};

const isEmailUnique = async (email) => {
  const user = await UserModel.findOne({email});
  if(user) {
    throw new AppError('Email already resgister', 409);
  };
  return true;
};

const isFutureDate = (date) => {
  if(new Date(date) < new Date()) {
    throw new AppError('Publish date must be in the future', 400);
  }
  return true;
};

const isSlugUnique = async (slug) => {
  const category = await CategoryModel.findOne({slug});
  if(category) {
    throw new AppError('Slug already exists', 409);
  }
  return true;
};

export {
  EMAIL_REGEX,
  PASSWORD_REGEX,
  URL_REGEX,
  HEX_COLOR_REGEX,
  SLUG_REGEX,
  MONGO_ID_REGEX,
  NAME_REGEX,
  TAGS_REGEX,

  validateTags,
  isEmailUnique,
  isFutureDate,
  isSlugUnique
};