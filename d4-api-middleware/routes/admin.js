import express from 'express';
const adminRouter = express.Router();
import {authenticate, authorize, users} from '../middleware/auth.js'
import { AppError } from '../middleware/errorHandler.js';
adminRouter.use(authenticate);
adminRouter.use(authorize('admin'));
adminRouter.get('/users', (req, res, next) => {
    try {
        if(!users || users.length === 0) {
            return next(new AppError('No users found1', 404));
        }
        res.json({
            success: true,
            count: users.length,
            users: users.map(u => ({
                id: u.id,
                name: u.name,
                email: u.email,
                role: u.role
            })) 
        })
    }catch(err) {
        next(new AppError('Failed to get users', 500));
    }
});

adminRouter.delete('/users/:id', (req, res, next) => {
    try {
        const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
        if(userIndex) {
            return next(new AppError('User not found', 404));
        }
        if(parseInt(req.params.id) === req.user.id) {
            return next(new AppError('Cannot delete your own account', 400));
        };
        const deleteUsser = users.splice(userIndex, 1)[0];
        res.json({
            success: true,
            message: 'User deleted successfully',
            user: {
                id: deleteUsser.id,
                name: deleteUsser.name
            }
        })
    } catch(err) {
        next(new AppError('Failed to delete user', 500))
    }
}); 

export {adminRouter};