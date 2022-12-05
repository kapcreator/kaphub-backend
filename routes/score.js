import express from 'express'
import { getScoreByTag, increaseScore } from '../controllers/score.js';

const router = express.Router();

router.patch('/', increaseScore);
router.get('/tag', getScoreByTag)

export default router;