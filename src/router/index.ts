import express from 'express';
import { register, login } from 'controllers/auth';
import { isAuthenticated } from 'middlewares';
import { getAllUsers, deleteUser } from 'controllers/users';

const router = express.Router();

router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/users', isAuthenticated, getAllUsers);
router.delete('/users/:id', isAuthenticated, deleteUser);

export default router;
