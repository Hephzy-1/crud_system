import express from 'express';
import { getAllUsers, deletedUser, updateUser, deletedAccount } from '../controllers/users';
import { isAdmin, isAuthenticated, isOwner } from '../middlewares/index';

const router = express.Router();

router.get('/admin/get-users', isAuthenticated, isAdmin, getAllUsers);
router.delete('/users/:id', isAuthenticated, isOwner, deletedUser);
router.delete('/admin/:id', isAuthenticated, isAdmin, deletedAccount);
router.patch('/users/:id', isAuthenticated, isOwner, updateUser);

export default router;