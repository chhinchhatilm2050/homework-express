import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 50,
    trim: true,
    unique: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    maxLength: 500,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  postCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
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
  timestamps: true,
});

categorySchema.pre('save', async function () {
  if(this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
});

categorySchema.methods.incrementPostCount = async function () {
  this.postCount += 1;
  await this.save();
};

categorySchema.methods.decrementPostCount = async function () {
  if(this.postCount > 0) {
    this.postCount -= 1;
    await this.save();
  }
};

categorySchema.methods.softDelete = async function () {
  this.isDeleted = true,
  this.deletedAt = new Date();
  await this.save();
};

categorySchema.index({ isActive: 1 });
categorySchema.index({ createdBy: 1 });

const CategoryModel = mongoose.model('Category', categorySchema);
export default CategoryModel;
