import { Router } from 'express';
import { createPostValidation, updatePostValidation, getPostValidation, postIdValidation } from '../validators/postValidators.js';
import { createPost, getPostWithAllQuery, updatePost, deletePost, getSinglePost, likePost} from '../controllers/postController.js';

const postRouter = Router();
postRouter.post('', createPostValidation, createPost);
postRouter.get('/:id', postIdValidation, getSinglePost);
postRouter.get('', getPostValidation, getPostWithAllQuery);
postRouter.put('/:id', postIdValidation, updatePostValidation, updatePost);
postRouter.delete('/:id/post/:userId', postIdValidation, deletePost);
postRouter.post(':/id/like', postIdValidation, likePost);

export default postRouter;