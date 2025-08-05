import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { acceptFriendRequest, getMyFriends, getRecomendedUsers, sendFriendRequest } from '../controllers/user.controller.js';

const router = express.Router();

//apply auth middleware to all routes
router.use(protectRoute);

router.get('/', getRecomendedUsers);
router.get('/friends', getMyFriends);
router.get('/friend-request/:id',  sendFriendRequest);
router.put('/friend-request/:id/accept',  acceptFriendRequest);


export default router;