import User from '../models/userModel.js';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const generateTokenAndResponse = (user, res) => {
	const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
		expiresIn: '1y',
	});

	user.password = undefined;

	res.status(200).json({
		status: 'true',
		content: { data: user },
		meta: { accessToken: token },
	});
};

const validator = (dataObject) => {
	const validationSchema = Joi.object().keys({
		email: Joi.string()
			.email()
			.regex(/tif\.com$/)
			.messages({
				'string.base': 'Email must be a string',
				'string.empty': 'Email cannot be empty',
				'string.email': 'Email must be a valid email address',
				'string.pattern.base': 'Email must be from tif.com domain',
				'any.required': 'Email is required',
			}),
		password: Joi.string()
			.regex(/^[a-zA-Z0-9]{3,30}$/)
			.required()
			.messages({
				'string.base': 'Password must be a string',
				'string.empty': 'Password cannot be empty',
				'string.pattern.base':
					'Password must be alphanumeric and between 3 to 30 characters',
				'any.required': 'Password is required',
			}),
	});
	const validate = validationSchema.validate(dataObject);
	return validate;
};
export const signupController = async (req, res) => {
	try {
		// console.log(req.body);
		const { name, email, password } = req.body;
		// Check for existing user
		const isEmailExist = await User.find({ email });
		console.log(isEmailExist.length);
		if (isEmailExist.length) {
			throw new Error('Email Registered!!..Please SignIn');
		}

		// Check for email and password formats

		const validate = validator({ email, password });
		if (validate.error) {
			throw new Error(validate.error.details[0].message);
		}

		// Once all are validated go for registering data in DB
		const user = await new User({ name, email, password }).save();
		generateTokenAndResponse(user, res);
	} catch (error) {
		res.status(404).json({ Error: error.message });
	}
};

export const signinController = async (req, res) => {
	try {
		const { email, password } = req.body;
		const validate = validator({ email, password });
		if (validate.error) {
			throw new Error(validate.error.details[0].message);
		}

		//check for user-exist or not
		let user = await User.find({ email });
		// console.log(user);
		if (!user.length) {
			throw new Error('No Such Email is registred!!! ..Go for Signup');
		}

		//check password
		user = user[0]; //rerieve the document to inject schema functions(comparePassword)
		const passwordMatch = await user.comparePassword(password);
		if (!passwordMatch) {
			throw new Error('Password incorrect');
		}

		// give access token if matched
		generateTokenAndResponse(user, res);
	} catch (error) {
		res.status(404).json({ Error: error.message });
	}
};

export const getmeController = async (req, res) => {
	try {
		const _id = req.user_id;
		const user_list = await User.find({ _id });
		const user = user_list[0];
		// console.log(user);
		user.password = undefined;
		res.status(200).json({ status: 'true', content: { data: user } });
	} catch (error) {
		res.status(400).json({ Error: error.message });
	}
};
