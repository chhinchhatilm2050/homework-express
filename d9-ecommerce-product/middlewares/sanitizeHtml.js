import { sanitizeObject, sanitizeValue } from '../utils/sanitizeValue.js';
export const sanitizeHtml = (req, res, next) => {
  req.body = sanitizeObject(req.body);
  req.params = sanitizeObject(req.params);
  Object.keys(req.query).forEach(key => {
    req.query[key] = sanitizeValue(req.query[key]);
  });
  next();
};