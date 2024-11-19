// routes/auth.ts
import { Router } from 'express';
import { register, login, oAuth } from '../controllers/auth';
import passport from 'passport';

const router = Router();

router.post('/register', register);
router.post('/auth/login', login);

router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email'],
  session: false 
}));

router.get('/google/callback', oAuth);

export default router;