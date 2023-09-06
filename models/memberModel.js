import { mongoose, model } from 'mongoose';
import { Snowflake } from '@theinternetfolks/snowflake';

const memeberSchema = new mongoose.Schema(
	{
		id: {
			type: String,
			default: Snowflake.generate({ timestamp: Date.now() }),
			unique: true,
		},
		community: {
			type: mongoose.Schema.Types.String,
			ref: 'Community',
		},
		role: {
			type: mongoose.Schema.Types.String,
			ref: 'Role',
		},
		user: {
			type: mongoose.Schema.Types.String,
			ref: 'User',
		},
	},
	{ timestamps: true }
);

export default model('Member', memeberSchema);
