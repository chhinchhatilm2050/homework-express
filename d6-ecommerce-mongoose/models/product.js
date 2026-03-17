import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true,
        minlength: [5, "Product name must be at least 5 characters"],
        maxlength: [200, "Product name must be at most 200 characters"],
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        minlength: [10, "Description must be at least 10 characters"],
        maxlength: [2000, "Description must be at most 2000 characters"],
        trim: true
    },
    price: {
        type: Number,
        required: [true, "Product price is required"],
        min: [0, "Price cannot be negative"],
    },
    comparePrice: {
        type: Number,
        min: [0, "Compare price cannot be negative"],
        default: null
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Product category is required"]
    },
    sku: {
        type: String,
        unique: true,
        trim: true,
        uppercase: true,
        required: [true, "SKU is required"]
    },
    stock: {
        type: Number,
        default: 0,
        min: [0, "Stock cannot be negative"]
    },
    images: {
        type: [
            {
                url: {
                    type: String,
                    required: true,
                    validate: {
                        validator: function(url) {
                            return /^https?:\/\/.+\..+/.test(url);
                        },
                        message: "Image must be a valid URL"
                    }
                },
                alt: {
                    type: String,
                    trim: true,
                    default: ""
                },
                isPrimary: {
                    type: Boolean,
                    default: false,
                }
            }
        ],
        validate: {
            validator: function (img) {
                return img.length >= 1;
            },
            message: "Product must have at least 1 image"
        }
    },
    tags: {
        type: [String],
        validate: function (tag) {
            return tag.length <= 10;
        },
        message: "Product cannot have more than 10 tags"
    },
    specifications: {
        type: Map,
        of: String,
        default: {}
    },
    status: {
        type: String,
        enum: {
            values: ["draft", "active", "out_of_stock", "discontinued"],
            message: "Status must be draft, active, out_of_stock or discontinued"
        },
        default: "draft"
    },
    featured: {
        type: Boolean,
        default: false
    },
    rating: {
        average: {
            type: Number,
            default: 0,
            min: [0, "Rating cannot be less than 0"],
            max: [5, "Rating cannot be more than 5"],
        },
        count: {
            type: Number,
            default: 0,
            min: [0, "Rating count cannot be negative"],
        }
    },
    discountPercentage: {
        type: Number,
        default: 0,
        min: [0, "Discount cannot be negative"],
        max: [100, "Discount cannot exceed 100%"],
    }
}, {
    timestamps: true,
    id: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

productSchema.virtual("discount").get(function () {
    if(!this.comparePrice || this.comparePrice <= this.price) return 0;
    return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
});

productSchema.virtual("inStock").get(function () {
    return this.stock > 0 && this.status === "active";
});

productSchema.method.reductStock = async function (quantity) {
    if(this.stock < quantity) {
        throw new Error(`Insufficient stock. Available: ${this.stock}`);
    }
    this.stock -= quantity;
    if(this.stock === 0) {
        this.status = "out_of_stock";
    }
    return await this.save();
}

productSchema.static.findByCategory = async function (categoryId) {
    return await this.find({
        category: categoryId,
        status: "active"
    }).populate("category", "name slug").sort({createdAt: -1});
};

productSchema.pre("save", function (next) {
    if(this.isModified("name")) {
        this.slug = this.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
    }
    next();
});

productSchema.pre("save", function(next) {
    if(this.isModified("price") || this.isModified("comparePrice")) {
        if(this.comparePrice && this.comparePrice > this.price) {
            this.discountPercentage = Math.round(
                ((this.comparePrice - this.price) / this.comparePrice) * 100
            );
        } else {
            this.discountPercentage = 0;
        }
    }
    next();
});

const ProductModel = mongoose.Model('Product', productSchema);
export {ProductModel};