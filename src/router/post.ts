import e from 'express';
import { isAdmin, isAuthenticated, isOwner } from '../middlewares/index';
import { createPost, getPostsByUserId, getPosts, update, deletePost } from '../controllers/posts';
import upload from '../utils/multer';

const router = e.Router()

router.post('/users/:id/post', isAuthenticated, isOwner, upload.single('coverImage'), createPost);
router.get('/users/:id/post', isAuthenticated, getPostsByUserId);
router.get('/users/posts', isAuthenticated, getPosts);
router.put('/users/:id/posts', isAuthenticated, isOwner, update);
router.delete('/users/:id/posts', isAuthenticated, isOwner, deletePost);
router.delete('/admin/:id/posts', isAuthenticated, isAdmin, deletePost);

export default router;