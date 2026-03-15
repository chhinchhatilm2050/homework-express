import express from 'express';
import { AppError } from '../middleware/errorHandler.js';
import { authenticate, users } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js'
const userRouter = express.Router();
const userSchema = {
    name: {
        required: true,
        type: 'string',
        minLength: 2,
        maxLength: 50
    },
    email: {
        required: true,
        type: 'email'
    },
    age: {
        required: false,
        type: 'number',
        min: 18,
        max: 100
    }
}

userRouter.get('/profile', authenticate, (req, res, next) => {
    try {
        if(!req.user) {
            return next(new AppError('User not found', 404));
        }
        res.json({
            success: true,
            user: {
                id: req.user.id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role
            }
        })

    } catch (err) {
        next(new AppError('Failed to get profie', 500));
    }
});

userRouter.post('/', validate(userSchema), (req, res, next) => {
    try {
        if(!req.body) {
            return next(new AppError('NO data provided', 400));
        }
        const newUser = {
            id: users.length + 1,
            ...req.body,
            role: 'user',
            token: `user-token-12${users.length + 1}`,
            createdAt: new Date().toISOString()
        }
        users.push(newUser);
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: newUser
        })
    } catch (err) {
        next(new AppError('Fail to create user', 500))
    }
});
export { userRouter};