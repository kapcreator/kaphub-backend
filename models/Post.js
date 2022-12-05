import mongoose from 'mongoose';

const Post = mongoose.Schema({
    title: String,
    description: String,
    creatorId: String,
    tags: [String],
    url: String,
    icon: String,
    runCount: {
      type: Number,
      default: 0
    },
    likes: {
        type: [String],
        default: [],
    },
    comments: {
        type: [String],
        default: [],
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
})

var model = mongoose.model('Post', Post);

export default model