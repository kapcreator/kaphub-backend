import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv"
import postRoutes from './routes/posts.js'
import userRoutes from './routes/users.js'
import scoreRoutes from './routes/score.js'

import { getCreator, getPostsByCreator, getFavPosts } from "./controllers/posts.js";

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors({ origin:process.env.CORS_ORIGIN }));

app.use('/posts', postRoutes);
app.use('/user', userRoutes);
app.use('/score', scoreRoutes);

app.get('/creator/:id/posts', getPostsByCreator)
app.get('/creator/:id/favorites', getFavPosts)
app.get('/creator/:id', getCreator)

app.get('/', (req, res) => {
  res.send('APP IS RUNNING');
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: ${PORT}`)))
  .catch((error) => console.log(error.message));

mongoose.set('useFindAndModify', false);

