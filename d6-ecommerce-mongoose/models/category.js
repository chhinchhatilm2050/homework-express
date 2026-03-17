import mongoose from "mongoose";
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Category name is required"],
        unique: true,
        trim: true,
        minLength: [3, 'Category name must be at least 3 characters'],
        maxLength: [50, 'Category name must be at most 50 characters']
    },
    slung: {
        type: String,
        unique: true,
        lowercase: true,
        time: true
    },
    description: {
        type: String,
        trim: true,
        maxLength: [500, "Descriptin must be at most 500 characters"]
    },
    icon: {
        type: String,
        trim: true,
        default: null
    },
    imageUrl: {
        type: String,
        trim: true,
        default: null,
        validate: {
            validator: function (img) {
                if(!img) return true;
                return /^https?:\/\/.+\..+/.test(img);
            },
            message: "Image URL must be a valid URL"
        }
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true},
    toObject: { virtuals: true}
});

categorySchema.pre("save", function(next) {
    if(this.isModified("name")) {
        this.slung = this.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "") 
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
    }
    next();
});

const CategoryModel = mongoose.model("Category", categorySchema);
export {CategoryModel};