import { Router } from 'express';
import userRouter from './userRoutes.js';
import categoryRouter from './categoryRoutes.js';

const router = Router();

router.use('/users', userRouter);
router.use('/categories', categoryRouter);

export default router;
