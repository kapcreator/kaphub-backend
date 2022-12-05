import mongoose from 'mongoose'
import Post from "../models/Post.js"
import User from "../models/User.js"

export const getPost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);

    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const getPosts = async (req, res) => {
  const { page } = req.query;

  try {
    const LIMIT = 10;
    const startIndex = (Number(page) - 1) * LIMIT;
    const total = await Post.countDocuments({});

    const posts = await Post.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);
    
    res.status(200).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const getPostsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;

  try {
    const searchPattern = new RegExp(searchQuery, 'i');
  
    const posts = await Post.find({ $or: [ { title: searchPattern }, { tags: { $in: tags.split(',') } } ]});

    res.json({ data: posts });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

export const createPosts = async (req, res) => {
  const post = req.body;

  const newPost = new Post({ ...post, creatorId: req.userId, createdAt: new Date().toISOString() });

  try {
    await newPost.save();

    await User.findByIdAndUpdate(newPost.creatorId, { $push: { posts: newPost._id } })

    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
}

export const updatePost = async (req, res) => {
  const { id: _id } = req.params;
  const post = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id');

  const updatedPost = await Post.findByIdAndUpdate(_id, { ...post, _id }, { new: true});

  res.json(updatedPost);
}

export const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id');

  await Post.findByIdAndRemove(id);

  res.json({ message: 'Post deleted successfully' });
}

export const likePost = async ( req, res ) => {
  const { id } = req.params;

  if(!req.userId) return res.json({ message: 'Unauthenticated' });

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id');

  const post = await Post.findById(id);
  
  const index = post.likes.findIndex((id) => id === String(req.userId));

  if(index === -1){
    post.likes.push(req.userId);
  } else {
    post.likes = post.likes.filter((id) => id !== String(req.userId));
  }

  const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true })

  res.json(updatedPost);
}

export const commentPost = async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;

  const updatedPost = await Post.findByIdAndUpdate(id, { $push: { comments: value } }, { new: true })

  res.json(updatedPost);
}

export const favPost = async (req, res) => {
  const { data } = req.body;

  const user = await User.findById(data.userId)
  let updatedUser = null
  if(user.favorites.includes(data.postId)) {
    updatedUser = await User.findByIdAndUpdate(data.userId, { $pull: { favorites: { $in: [ data.postId ] } } }, { new: true })
  } else {
    updatedUser = await User.findByIdAndUpdate(data.userId, { $push: { favorites: data.postId } }, { new: true })
  }

  res.json(updatedUser)
}

export const getCreator = async (req, res) => {
  const { id } = req.params;

  try {
    const creator = await User.findById(id)

    res.status(200).json(creator);
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const getPostsByCreator = async (req, res) => {
  const { id } = req.params;

  try {
    const posts = await Post.find({ creatorId: id }).sort({_id: -1})

    res.json({ data: posts });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

export const getFavPosts = async (req, res) => {
  const { id } = req.params;

  try {
    const creator = await User.findById(id)
    const postIds = creator.favorites
    const posts = await Post.find({_id: {$in:postIds}})

    res.json({ data: posts });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}