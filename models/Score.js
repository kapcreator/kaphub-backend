import mongoose from "mongoose";

const Score = mongoose.Schema({
  name: String,
  type: String,
  value: {
    type: Number,
    default: 0
  }
})

var model = mongoose.model('Score', Score)

export default model