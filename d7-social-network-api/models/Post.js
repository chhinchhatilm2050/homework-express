import mongoose from "mongoose";
import { AppError } from "../utils/appError.js";

const commentSchema = new mongoose.Schema({
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        name: String,
        username: String,
        avatar: String
    },
    text: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280
    }
}, {
    timestamps: true,
    id: false,
    toJSON: { virtuals: true},
    toObject: {virtuals: true}
});

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'Post content is required'],
        trim: true,
        minlength: 1,
        maxlength: 280
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'AuthorId is require'],
        index: true
    },
    image: {
        type: String,
        default: null
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    retweets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [commentSchema],
    visibility: {
        type: String,
        enum: ['public', 'followers', 'private'],
        default: 'public'
    }

}, {
    timestamps: true,
    id: false,
    toJSON: { virtuals: true},
    toObject: {virtuals: true}
});

postSchema.virtual('likeCount').get(function() {
    return this.likes?.length || 0;
});

postSchema.virtual('retweetCount').get(function() {
    return this.retweets?.length || 0;
});

postSchema.virtual('commentCount').get(function() {
    return this.comments?.length || 0;
});

postSchema.methods.addLike = async function(userId) {
    if(this.likes.some(id => id.toString() === userId)) {
        throw new AppError('You aleady like this post');
    } 
    this.likes.push(userId);
    return await this.save();
};

postSchema.methods.removeLike = async function (userId) {
    if(!this.likes.some(id => id.toString() === userId)) {
        throw new AppError('You have not like this post', 400);
    }
    this.likes = this.likes.filter(id => id.toString() !== userId)
    return await this.save();
}

postSchema.methods.addRetweets = async function (userId) {
    if(this.retweets.some(id => id.toString() === userId)) {
        throw new AppError('You already share this post')
    }
    this.retweets.push(userId);
    return await this.save();
}

postSchema.methods.removeRetweets = async function (userId) {
    if(!this.retweets.some(id => id.toString() === userId)) {
        throw new AppError('You are not allow to delete this comment', 400)
    }
    this.retweets = this.retweets.filter(id => id.toString() != userId);
    return await this.save();
}

postSchema.statics.getFeed = async function (userId) {
    const Follow = mongoose.model('Follow');
    const following = await Follow.find({follower: userId}).select('following');
    const followingId = following.map(f => f.following);

    followingId.push(userId);

    return this.find({
        author: {$in: followingId},
        visibility: {$in: ['public', 'followers']}
    })
    .populate('author', 'name username avatar')
    .sort({ createdAt: -1 })
    .limit(50);

};

const PostModel = mongoose.model("Post", postSchema);
export {PostModel};