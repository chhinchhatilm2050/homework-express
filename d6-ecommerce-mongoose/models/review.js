import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: [true, "Product is require"]
    },
    customerName: {
        type: String,
        trim: true,
        required: [true, "Customer name is required!"]
    },
    customerEmail: {
        type: String,
        required: [true, "Customer email is required"],
        trim: true,
        lowercase: true,
        validate: {
            validator: function (email) {
                return /^[\w.-]+@[\w.-]+\.\w{2,}$/.test(email);
            },
            message: "Please provide a valid email address"
        },
    },
    rating: {
        type: Number,
        required: [true, "Rating is required"],
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating cannot be more than 5"],
    },
    title: {
      type: String,
      trim: true,
      minlength: [5,   "Title must be at least 5 characters"],
      maxlength: [100, "Title must be at most 100 characters"],
    },
    comment: {
      type: String,
      trim: true,
      minlength: [10,   "Comment must be at least 10 characters"],
      maxlength: [1000, "Comment must be at most 1000 characters"],
    },
    helpfulCount: {
      type: Number,
      default: 0,
      min: [0, "Helpful count cannot be negative"],
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    }

},{
    timestamps: true,
    id: false,
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
});

reviewSchema.statics.calculateAverageRating = async function (productId) {
  const result = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: "$product",
        averageRating: { $avg: "$rating" },
        reviewCount:   { $sum: 1 },
      },
    },
  ]);
  if (result.length > 0) {
    await mongoose.model("Product").findByIdAndUpdate(productId, {
      "rating.average": Math.round(result[0].averageRating * 10) / 10, 
      "rating.count":   result[0].reviewCount,                         
    });
  } else {
    await mongoose.model("Product").findByIdAndUpdate(productId, {
      "rating.average": 0,
      "rating.count":   0,
    });
  }
};

reviewSchema.post("save", async function() {
    await this.constructor.calculateAverageRating(this.product);
})

const ReviewModel = mongoose.Model('Review', reviewSchema);
export {ReviewModel};