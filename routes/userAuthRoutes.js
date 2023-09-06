import express from 'express';
import {
	getmeController,
	signinController,
	signupController,
} from '../controllers/userAuthControllers.js';
import { requireSignin } from '../middlewares/authDetail.js';

const router = express.Router();

router.post('/signup', signupController);
router.post('/signin', signinController);
router.get('/me', requireSignin, getmeController);

export default router;
