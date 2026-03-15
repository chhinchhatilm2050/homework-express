import { rateLimit } from 'express-rate-limit';
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

const authLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 'fail',
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many login attempts, please try again later'
    }
});
export { globalLimiter, authLimiter };