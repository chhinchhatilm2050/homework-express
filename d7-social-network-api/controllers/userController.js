import { UserModel } from "../models/User.js";
import { AppError } from "../utils/appError.js";
import asyncHandler from 'express-async-handler';

const createUser = asyncHandler( async(req, res, next) => {
    const { name, username, email, password, bio, location, website, avatar } = req.body;
    // const usernameExists = await UserModel.findOne({username});
    // if(usernameExists) {
    //     return next( new AppError('Username already exists', 400));
    // };
    // const emailExists = await UserModel.findOne({email});
    // if(emailExists) {
    //     return next( new AppError('Email already exists', 400))
    // };
    const user = new UserModel({
        name,
        username,
        email,
        password,
        bio,
        location,
        website,
        avatar
    });
    await user.save();
    user.password = undefined;
    res.status(201).json({
        status: 'success',
        data: {user}
    });
});

const getUserById = asyncHandler( async(req, res, next) => {
    const {id} = req.params;
    const user = await UserModel.findById(id)
    .select('-password')
    .populate('posts')
    .populate('followerCount')   
    .populate('followingCount')  
    .populate('postCount')
    
    if(!user) {
        return next( new AppError('User not found', 404));
    }
     res.status(200).json({
        status: 'success',
        data: { user }
    });
});

const updateUser = asyncHandler( async(req, res, next) => {
    if(req.body.password) {
        return next(new AppError('Cannot update passowrd here', 400));
    }
    const { name, bio, location, website, avatar} = req.body;
    const user = await UserModel.findByIdAndUpdate(
        req.params.id,
        { name, bio, location, website, avatar },
        { new: true, runValidators: true }
    ).select('-password');

    if(!user) {
        return next (new AppError('User not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { user }
    });
});

const getUserPosts = asyncHandler (async(req, res, next) => {
    const user = await UserModel.findById(req.params.id)
    .select('-password')
    .populate({
        path: 'posts',
        options: {sort: {createAt: -1}}
    });
    
    if(!user) {
        return next(new AppError('User not found', 400));
    };

    res.status(200).json({
        status: 'success',
        data: {user}
    })
});

export {createUser, getUserById, updateUser, getUserPosts}