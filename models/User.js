import mongoose from 'mongoose';

const User = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  id: { type: String },
  posts: {
    type: [mongoose.SchemaTypes.ObjectId],
    default: []
  },
  favorites: {
    type: [mongoose.SchemaTypes.ObjectId],
    default: []
  }
})

var model = mongoose.model('User', User)

export default model