import express from 'express';
import { register, login } from '../controllers/auth';
import { isAuthenticated, isOwner } from '../middlewares/index';
import { deletedUser, updateUser } from '../controllers/users';
import { getAllUsers } from '../controllers/admin';

const router = express.Router();

router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/users', isAuthenticated, getAllUsers);
router.delete('/users/:id', isAuthenticated, isOwner, deletedUser);
router.patch('/users/:id', isAuthenticated, isOwner, updateUser)

export default router;
