import express from 'express';

import {
	addMemberController,
	removeMemberController,
} from '../controllers/memberControllers.js';
import { requireSignin } from '../middlewares/authDetail.js';

const router = express.Router();

router.post('/', requireSignin, addMemberController);
router.delete('/:id', requireSignin, removeMemberController);

export default router;
