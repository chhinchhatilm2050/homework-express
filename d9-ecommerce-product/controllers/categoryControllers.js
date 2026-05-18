import CategoryModel from '../model/Category.js';
import AppError from '../utils/appError.js';
import asyncHandler from 'express-async-handler';
import UserModel from '../model/User.js';

export const createCategory = asyncHandler(async(req, res, next) => {
  const {createdBy } = req.body;
  const userExist = await UserModel.findById(createdBy);
  if(!userExist) {
    return next(new AppError('User not found', 404));
  }
  
  const category = new CategoryModel(req.body);
  await category.save();

  res.status(201).json({
    status: 'success',
    data: { category }
  });
});

export const getAllCategory = asyncHandler (async(req, res, next) => {
  const categories = await CategoryModel.find();
  if(!categories) {
    return next(new AppError('No category', 404));
  }
  res.status(200).json({
    status: 'success',
    result: categories.length,
    data: { categories}
  });
});

export const getCategoryById = asyncHandler (async(req, res, next) => {
  const category = await CategoryModel.findById(req.params.id);
  if(!category) {
    return next(new AppError('Category not found', 404));
  }
  res.status(200).json({   
    status: 'success',
    data: {category}
  });
});

export const updateCategory = asyncHandler (async (req, res, next) => {
  const {id} = req.params;
  const {createdBy, name, description} = req.body;
  
  const category = await CategoryModel.findById(id);

  if(!category) {
    return next(new AppError('Category not found', 404));
  }

  if(category.createdBy.toString() !== createdBy.toString()) {
    return next(new AppError('You do not have permission to delete this category', 403));
  }
  
  const updateCategory = await CategoryModel.findByIdAndUpdate(
    id,
    { name, description},
    { new: true, runValidators: true}
  );

  res.status(200).json({
    status: 'success',
    data: { updateCategory }
  });
});

export const deleteCategory = asyncHandler (async (req, res, next) => {
  const {createdBy} = req.body;
  if(!createdBy) {
    return next(new AppError('Createdby is required', 400));
  }
  const category = await CategoryModel.findById(req.params.id);
  if(!category) {
    return next(new AppError('Category not found', 404));
  }

  if(category.createdBy.toString !== createdBy.toString()) {
    return next(new AppError('You cannot delete this category because you did not create it', 403));
  }

  category.softDelete();
  await category.save();
  
  res.status(200).json({
    status: 'success',
    message: 'Category was deleted successfully'
  });
});