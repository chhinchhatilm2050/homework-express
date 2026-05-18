import UserModel from '../model/User.js';
import asyncHandler from 'express-async-handler';
import AppError from '../utils/appError.js';

export const createUser = asyncHandler(async(req, res, _next) => {
  const user = new UserModel(req.body);
  await user.save();
  res.status(201).json({
    status: 'success',
    data: { user }
  });
});

export const getAllUser = asyncHandler (async(req, res, _next) => {
  const users = await UserModel.find();
  res.status(200).json({
    status: 'success',
    result: users.length,
    data: { users }
  });
});

export const getUserById = asyncHandler (async(req, res, next) => {
  const user = await UserModel.findById(req.params.id);
  if(!user) {
    return next(new AppError('User not found!', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

export const updateUser = asyncHandler (async(req, res, next) => {
  const {id} = req.params;
  const {name, email, bio, avatar } = req.body;
  const allowedFields = ['name', 'email', 'bio', 'avatar'];
  const sentFields = Object.keys(req.body);
  const hasInvalidField = sentFields.some(key => !allowedFields.includes(key));

  if(hasInvalidField) {
    return next(new AppError('You can only update name, email, bio and avatar', 400));
  }

  if(!name && !email && !bio && !avatar) {
    return next(new AppError('Please provide at least one filed to update', 400));
  }
  const user = await UserModel.findByIdAndUpdate(
    id,
    { $set:{ name, email, bio, avatar }},
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    status: 'success',
    data: {user}
  });
});

export const deleteUser = asyncHandler (async(req, res, next) => {
  const user = await UserModel.findByIdAdndDelete(req.params.id);
  if(!user) {
    return next(new AppError('User not found to delete', 404));
  } 
  res.status(200).json({
    status: 'success',
    message: 'User was deleted successfully!',
    data: { user }
  });
});