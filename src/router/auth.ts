import express from 'express';
import { register, login, oAuth } from '../controllers/auth';
import passport from 'passport';
import asyncHandler from '../middlewares/async';

const router = express.Router();

router.post('/auth/register', asyncHandler(register));
router.post('/auth/login', login);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', oAuth);

export default router;

// {
//   "_id": "671bc1276ed375b6a1c4e1bf",
//   "username": "hephzy",
//   "email": "hephzy1@gmail.com",
//   "role": "admin",
//   "__v": 0,
//   "sessionToken": "d7daf54e34d2c9527134900a600f728e8ff9d589ac704b842ebca48a90efcafc"
// }
