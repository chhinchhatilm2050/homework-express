import express from 'express';
import { AppError } from '../middleware/errorHandler.js';
const publicRouter = express.Router();
publicRouter.get('/infor', (req, res, next) => {
    try {
        res.json({
            success: true,
            message: 'Public API Information',
            version: '1.0.0',
            endpoints: {
                public: '/api/public/*',
                users: '/api/users/* (auth required)',
                admin: '/api/admin/* (admin role required)'
            }
        });
    } catch(err) {
        next(new AppError('Failed to get public info', 500));
    }
});

publicRouter.get('/status', (req, res, next) => {
    try {
        res.json({
            success: true,
            status: 'operational',
            timestamp: new Date().toISOString()
        });
    } catch(err) {
        next(new AppError('Failed to get status', 500));
    }
})

export {publicRouter};