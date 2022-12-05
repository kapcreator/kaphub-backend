import mongoose from 'mongoose'
import Score from '../models/Score.js'

export const increaseScore = async (req, res) => {
  const { name, type } = req.body;

  try {
    const score = await Score.findOneAndUpdate({ name, type }, { $inc: { value: 1 } }, { returnOriginal: false }) || await Score.create({ name, type });

    res.status(200).json(score);
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const getScoreByTag = async (req, res) => {
  try {
    const LIMIT = 5;

    const scores = await Score.find({ type: 'TAG' }).sort({ value: -1 }).limit(LIMIT);
    
    res.status(200).json({ data: scores });
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}