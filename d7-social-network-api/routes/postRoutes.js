import { Router } from "express";
import { createPost, getSinglePost, deletePost, getFeed, getUserPost, likePost, 
removeLike, addComment, deleteComment, addRetweets, removeRetweets } from "../controllers/postController.js";
const postRouter = Router();
postRouter.post('', createPost);
postRouter.get('/:id', getSinglePost);
postRouter.delete('/:id', deletePost);
postRouter.get('/feed/:userId', getFeed);
postRouter.get('/user/:userId', getUserPost);
postRouter.post('/:id/like', likePost);
postRouter.delete('/:id/unlike', removeLike);
postRouter.post('/:id/comments', addComment);
postRouter.delete('/:postId/comments/:comomentId', deleteComment);
postRouter.post('/:id/retweet', addRetweets);
postRouter.delete('/:id/removeRetweet', removeRetweets);

export {postRouter};