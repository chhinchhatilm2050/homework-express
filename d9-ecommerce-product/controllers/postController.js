import PostModel from '../model/Post.js';
import asyncHandler from 'express-async-handler';
import CategoryModel from '../model/Category.js';
import UserModel from '../model/User.js';
import AppError from '../utils/appError.js';
import QueryBuilder from '../utils/queryBuilder.js';
import ProductModel from '../../d8-ecommerce-api-advanced/models/product.js';

export const createPost = asyncHandler (async(req, res, next) => {
  const {author, category} = req.body;
  const existingcategory = await CategoryModel.findById(category);
  if(!existingcategory) {
    return next(new AppError('Category not found!', 404));
  };

  const existingAuthor = await UserModel.findById(author);
  if(!existingAuthor) {
    return next(new AppError('User not found', 404));
  };

  const createPost = new PostModel(req.body);
  await createPost.save();

  existingcategory.incrementPostCount();
  await existingcategory.save();
  res.status(201).json({
    status: 'success',
    data: {createPost}
  });
});

export const getSinglePost = asyncHandler(async(req, res, next) => {
  const post = await PostModel.findById(req.params.id);
  if(!post) {
    return next(new AppError('Post not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {post}
  });
});

export const getPostWithAllQuery = asyncHandler (async(req, res, _next) => {
  const posts = await new QueryBuilder(ProductModel, req.query)
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate()
    .execute();
  res.status(200).json({
    status: 'success',
    pagination: posts.pagination,
    data: {posts: posts.data}
  });
});

export const updatePost = asyncHandler( async(req, res, next) => {
  const {id} = req.params;
  const {updatedBy, category, title, content, excerpt, tags, status, featured, featuredImage } = req.body;
  if(!category && title && !content && !excerpt && !tags && !status && !featured && !featuredImage) {
    return next(new AppError('You have to input at least 1 field to update', 400));
  }
  const post = await PostModel.findById(id);
  if(!post) {
    return next(new AppError('Post not found', 404));
  };
  if(post.updatedBy.toString() !== updatedBy.toString()) {
    return next(new AppError('You do not have perssion to delete this post', 403));
  }
  const existingCategory = await CategoryModel.findById(category);
  if(!existingCategory) {
    return next(new AppError('Category not found', 404));
  }
  
  const updatePost = await PostModel.findByIdAndUpdate(
    id,
    {$set: {category, title, content, excerpt, tags, status, featured, featuredImage}},
    {new: true, runValidators: true}
  );

  res.status(200).json({
    status: 'success',
    data: {updatePost}
  });
});

export const deletePost = asyncHandler(async(req, res, next) => {
  const {id, authorId} = req.params;
  const post = await PostModel.findById(id);
  if(!post){
    return next(new AppError('Post not found', 404));
  }

  if(post.author.toString() !== authorId.toString()) {
    return next(new AppError('You do not have permission to delete this post', 403));
  }
  const categoryId = post.category;
  const existCategory = await CategoryModel.findById(categoryId);

  post.softDelete();
  await post.save();
  
  if(existCategory) {
    existCategory.decrementPostCount();
    await existCategory.save();
  }
  
  res.status(200).json({
    status: 'success',
    message: 'Post delete successfully'
  });
});

export const likePost = asyncHandler(async(req, res, next) => {
  const {userId} = req.body;
  const user = await UserModel.findById(userId);
  if(!user) {
    return next(new AppError('User not found', 404));
  }
  const post = await PostModel.findById(req.params.id);
  if(!post) {
    return next(new AppError('Post not found', 404));
  };
  await post.toggleLike(userId);
  const isLiked = post.likes.some(id => id.toString() === userId.toString());
  res.status(201).json({
    status: 'success',
    message: isLiked ? 'Post liked' : 'Post unlike',
    data: {like: post.likes.length}
  });
});