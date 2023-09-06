import { mongoose, model } from 'mongoose';
import { Snowflake } from '@theinternetfolks/snowflake';

const RoleSchema = new mongoose.Schema(
	{
		id: {
			type: String,
			default: Snowflake.generate(),
			unique: true,
		},
		name: {
			type: String,
			maxlength: 64,
		},
	},
	{ timestamps: true }
);

export default model('Role', RoleSchema);
