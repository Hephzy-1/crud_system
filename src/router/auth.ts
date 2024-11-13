// routes/auth.ts
import express from 'express';
import { register, login, oAuth } from '../controllers/auth';
import passport from 'passport';
import asyncHandler from '../middlewares/async';

const router = express.Router();

router.post('/auth/register', register);
router.post('/auth/login', login);

router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email'],
  session: false 
}));

router.get('/google/callback', oAuth);

export default router;