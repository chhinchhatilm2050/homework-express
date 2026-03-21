import asyncHandler from 'express-async-handler';
import { UserModel } from '../models/User.js';
import { PostModel } from '../models/Post.js';
import { AppError } from '../utils/appError.js';

const createPost = asyncHandler ( async(req, res, next) => {
    const {authorId, content, image, visibility} = req.body;
    const authorIdExists = await UserModel.findById(authorId);
    if(!authorIdExists) {
        return next(new AppError('User not found', 404))
    };

    const post = new PostModel({
        author: authorId,
        content,
        image,
        visibility
    })
    await post.save();

    res.status(201).json({
        status: 'success',
        data: {post}
    })
});

const getSinglePost = asyncHandler ( async(req, res, next) => {
    const post = await PostModel.findById(req.params.id)
    .populate('author', 'name username avatar bio');

    if(!post) {
        return next(new AppError('Post not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {post}
    });
});

const deletePost = asyncHandler (async(req, res, next) => {
    const {userId} = req.body;
    if(!userId) {
        return next(new AppError('UserId is require', 400));
    }

    const post = await PostModel.findById(req.params.id);
    if(!post) {
        return next(new AppError('Post not found', 404));
    }

    if(post.author.toString() !== userId) {
        return next(new AppError('You are not allow to delete this post', 400));
    }

    await PostModel.findByIdAndDelete(req.params.id);
    res.status(200).json({
        status: 'success',
        message: 'Post delete successfully'
    });

})

const getFeed = asyncHandler ( async(req, res, next) => {
    const posts = await PostModel.getFeed(req.params.userId);
    if(posts.length === 0) {
        return next (new AppError('No post found', 404));
    };

    res.status(200).json({
        status: 'success',
        count: posts.length,
        data: {posts}
    })
});

const getUserPost = asyncHandler (async(req, res, next) => {
    const post = await PostModel.find({author: req.params.userId})
    .populate('author', 'name username avatar')
    .sort({createdAt: -1});

    if(post.length === 0) {
        return next (new AppError('Post not found', 404));
    };

    res.status(200).json({
        status: 'success',
        count: post.length,
        data: {post}
    })
});

const likePost = asyncHandler (async(req, res, next) => {
    const { userId } = req.body;
    const post = await PostModel.findById(req.params.id);
    if(!post) {
        return next(new AppError('Post not found', 404));
    }
    await post.addLike(userId);

    res.status(201).json({
        status: 'success',
        likeCount: post.likeCount
    })
});

const removeLike = asyncHandler ( async(req, res, next) => {
    const { userId }  = req.body;
    const post = await PostModel.findById(req.params.id);
    if(!post) {
        return next(new AppError('Post not found', 404));
    }

    await post.removeLike(userId);

    res.status(200).json({
        status: 'success',
        likeCount: post.likeCount
    });
});

const addComment = asyncHandler (async(req, res, next) => {
    const { authorId } = req.body;
    const post = await PostModel.findById(req.params.id);
    if(!post) {
        return next( new AppError('Post not found', 404))
    };

    const user = await UserModel.findById(authorId);
    if(!user) {
        return next(new AppError('User not found', 404))
    }
    post.comments.push({
        author: {
            id: user._id,
            name: user.name,
            username: user.username,
            avatar: user.avatar

        },
        text: req.body.text
    });
    await post.save();
    const saveComment = post.comments[post.comments.length -1];
    res.status(201).json({
        status: 'success',
        comment: saveComment
    })
});

const deleteComment = asyncHandler (async(req, res, next) => {
    const {postId, comomentId } = req.params;
    const post = await PostModel.findById(postId);
    if(!post) {
        return next (new AppError('Post not found', 404));
    };

    const comment = post.comments.find((c) => c._id.toString() === comomentId.toString());
    if(!comment) {
        return next(new AppError('Comment not found', 404));
    };
    comment.deleteOne();
    await post.save();
     res.status(200).json({
        status: 'success',
        message: 'Comment deleted successfully'
    });
});

const addRetweets = asyncHandler (async(req, res, next) => {
    const {userId} = req.body;
    const post = await PostModel.findById(req.params.id);
    if(!post) {
        return next (new AppError('Post not found', 404));
    }
    await post.addRetweets(userId);
    res.status(201).json({
        status: 'success',
        retweetCount: post.retweetCount
    });
})

const removeRetweets = asyncHandler (async(req, res, next) => {
    const {userId} = req.body;
    const post = await PostModel.findById(req.params.id);
    if(!post) {
        return next (new AppError('Post not found', 404));
    }
    await post.removeRetweets(userId);
    res.status(200).json({
        status: 'success',
        retweetCount: post.retweetCount
    })
})

export {createPost, getSinglePost, deletePost, getFeed, getUserPost, 
likePost, removeLike, addComment, deleteComment, addRetweets, removeRetweets}