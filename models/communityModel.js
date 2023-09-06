import { mongoose, model } from 'mongoose';
import { Snowflake } from '@theinternetfolks/snowflake';
import slugify from 'slugify';
import bcrypt from 'bcrypt';
const communitySchema = new mongoose.Schema(
	{
		id: {
			type: String,
			default: Snowflake.generate({ timestamp: Date.now(), shard_id: 4 }),
			unique: true,
		},
		name: {
			type: String,
			maxlength: 128,
		},
		slug: {
			type: String,
			unique: true,
			maxlength: 255,
		},
		owner: {
			type: mongoose.Schema.Types.String,
			ref: 'User',
		},
	},
	{ timestamps: true }
);

communitySchema.pre('save', function () {
	this.slug = `${this.name}`;
});

export default model('Community', communitySchema);
