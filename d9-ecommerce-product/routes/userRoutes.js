import { Router } from 'express';
import { createUser, getAllUser, getUserById, updateUser, deleteUser } from '../controllers/userControllers.js';
import { registerValidation, updateUserValidation, userIdValidation } from '../validators/userValidators.js';

const userRouter = Router();
userRouter.post('', registerValidation, createUser);
userRouter.get('', getAllUser);
userRouter.get('/:id', userIdValidation, getUserById);
userRouter.put('/:id', updateUserValidation, updateUser);
userRouter.delete('/:id', deleteUser);

export default userRouter;