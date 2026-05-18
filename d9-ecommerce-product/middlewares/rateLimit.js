import rateLimit from 'express-rate-limit';

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'fail',
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many request, please try again later'
  }
});

export default globalLimiter;