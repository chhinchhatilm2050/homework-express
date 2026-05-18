import mongoose from 'mongoose';
import { validateTags, URL_REGEX } from '../utils/validators.js';
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: 10,
    maxLength: 200,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
    minLength: 100,
    trim: true
  },
  excerpt: {
    type: String,
    maxLength: 300,
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  }, 
  tags: {
    type: [String],
    validate: {
      validator: validateTags,
      message: 'Must provide 1-10 tags'
    }
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  featuredImage: {
    type: String,
    match: [URL_REGEX, 'Invalid image URL']
  },
  publishAt: {
    type: Date
  },
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }, 
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    expires: 60 * 60 * 24 * 90
  }
}, {
  timestamps: true
});

postSchema.pre('save', async function () {
  if(this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
});

postSchema.pre('save', async function () {
  if(this.isModified('status') && this.status === 'published') {
    if(!this.publishAt) {
      this.publishAt = new Date();
    }
  }
});

postSchema.methods.incrementViews = async function () {
  this.views += 1;
  await this.save();
};

postSchema.methods.toggleLike = async function (userId) {
  const isLiked = this.likes.some(id => id.toString() === userId.toString());
  if (isLiked) {
    this.likes = this.likes.filter(id => id.toString() !== userId.toString());
  } else {
    this.likes.push(userId);
  }
  await this.save();
};

postSchema.methods.softDelete = async function () {
  this.isDeleted = true;
  this.deletedAt = new Date();
  await this.save();
};

postSchema.index({ author: 1 });
postSchema.index({ category: 1 });
postSchema.index({ status: 1 });
postSchema.index({ title: 'text', content: 'text', excerpt: 'text', tags: 'text' });

const PostModel = mongoose.model('Post', postSchema);
export default PostModel;