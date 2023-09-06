import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const requireSignin = async (req, res, next) => {
	try {
		const decoded = jwt.verify(
			req.headers.authorization,
			process.env.JWT_SECRET
		);
		req.user_id = decoded._id;
		next();
	} catch (err) {
		console.log('error: ', err);
		res.status(401).json({ error: 'invalid or Expired Token' });
	}
};
