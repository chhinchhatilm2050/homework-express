import { Router } from "express";
import { userRouter } from "./userRoutes.js";
import { followRouter } from "./followRoutes.js";
import { postRouter } from "./postRoutes.js";
const router = Router();
router.use('/users', userRouter);
router.use('/users', followRouter);
router.use('/posts', postRouter);

export { router };