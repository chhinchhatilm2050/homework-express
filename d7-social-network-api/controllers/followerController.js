import { AppError } from "../utils/appError.js";
import asyncHandler from 'express-async-handler';
import { UserModel } from "../models/User.js";
import { FollowModel } from "../models/Follow.js";

const followUser = asyncHandler( async(req, res, next) => {
    const { followerId } = req.body;
    const tagetId = req.params.id;
    if(followerId === tagetId) {
        return next (new AppError('You cannot follow yourself', 400));
    }
    const tagetUser = await UserModel.findById(tagetId);
    if(!tagetUser) {
        return next(new AppError('User not fount', 400));
    }

    const follow = new FollowModel({
        follower: followerId,
        following: tagetId
    });

    await follow.save();
    res.status(200).json({
        status: 'success',
        data: {follow}
    });
});

const unFollow = asyncHandler ( async(req, res, next) => {
    const {followerId} = req.body;

    if(!followerId) {
        return next(new AppError('Follower ID is required', 400));
    }
    
    const result = await FollowModel.findOneAndDelete({
        follower: followerId,
        following: req.params.id
    });

    if(!result) {
        return next(new AppError('Not following this user', 404));
    };
    res.status(200).json({
        status: 'fail',
        message: 'Unfollowed successfully'
    })

});

const getFollower = asyncHandler (async(req, res, next) => {
    const followers = await FollowModel.find({following: req.params.id})
    .populate('follower', 'name username avatar bio')
    .sort({ createdAt: -1});

    if(followers.length === 0) {
        return next(new AppError('Following not found', 404));
    }

    res.status(200).json({
        status: 'success',
        count: followers.length,
        data: followers.map(f => f.follower)
    })
});

const getFollowing = asyncHandler( async(req, res, next) => {
    const followings = await FollowModel.find({follower: req.params.id})
    .populate('following', 'name username avatar bio')
    .sort({ createdAt: -1});

    if(followings.length === 0) {
        return next(new AppError('Follower not found'));
    };

    res.status(200).json({
        status: 'success',
        count: followings.length,
        data: followings.map(f => f.following)
    })
});

const checkFollowing = asyncHandler( async(req, res, next) => {
    const follow = await FollowModel.findOne({
        follower: req.params.id,
        following: req.params.targetId
    });
    const isFollowing = follow ? true : false;
    res.status(200).json({
        status: 'success',
        isFollowing: isFollowing
    })
})

export {followUser, unFollow, getFollower, getFollowing, checkFollowing};