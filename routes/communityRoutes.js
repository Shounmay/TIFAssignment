import express from 'express';
import { requireSignin } from '../middlewares/authDetail.js';
import {
	createCommunity,
	getAllController,
	getAllMemberfromCommunityController,
	getJoinedCommunity,
	getMyOwnedCommunityController,
} from '../controllers/communityControllers.js';
const router = express.Router();

router.post('/', requireSignin, createCommunity);
router.get('/', requireSignin, getAllController);
router.get('/:id/members', requireSignin, getAllMemberfromCommunityController);
router.get('/me/owner', requireSignin, getMyOwnedCommunityController);
router.get('/me/member', requireSignin, getJoinedCommunity);
export default router;
