import { mongoose, model } from 'mongoose';
import { Snowflake } from '@theinternetfolks/snowflake';
import bcrypt from 'bcrypt';
import Joi from 'joi';
const userSchema = new mongoose.Schema(
	{
		id: {
			type: String,
			default: Snowflake.generate({ timestamp: Date.now() }),
			unique: true,
		},
		name: {
			type: String,
			default: null,
			maxlength: 64,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			maxlength: 124,
		},
		password: {
			type: String,
			required: true,
			maxlength: 64,
		},
	},
	{ timestamps: true }
);
userSchema.pre('save', async function (next) {
	try {
		if (!this.isModified('password')) {
			next();
		}
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error) {
		console.log('Password Hashing Error: ', error);
	}
});

userSchema.methods.comparePassword = async function (password) {
	return bcrypt.compare(password, this.password);
};
export default model('User', userSchema);
