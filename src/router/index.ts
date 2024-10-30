import express from 'express';
import { register, login } from '../controllers/auth';
import { isAdmin, isAuthenticated, isOwner } from '../middlewares/index';
import { getAllUsers, deletedUser, updateUser, deletedAccount } from '../controllers/users';
import { createPost, getPostsByUserId, getPosts } from '../controllers/posts';

const router = express.Router();

router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/admin/get-users', isAuthenticated, isAdmin, getAllUsers);
router.delete('/users/:id', isAuthenticated, isOwner, deletedUser);
router.delete('/admin/:id', isAuthenticated, isAdmin, deletedAccount);
router.patch('/users/:id', isAuthenticated, isOwner, updateUser);
router.post('/users/:id/post', isAuthenticated, isOwner, createPost);
router.get('/users/:id/post', isAuthenticated, getPostsByUserId);
router.get('/users/posts', isAuthenticated, getPosts);

export default router;

// {
//   "_id": "671bc1276ed375b6a1c4e1bf",
//   "username": "hephzy",
//   "email": "hephzy1@gmail.com",
//   "role": "admin",
//   "__v": 0,
//   "sessionToken": "d7daf54e34d2c9527134900a600f728e8ff9d589ac704b842ebca48a90efcafc"
// }
