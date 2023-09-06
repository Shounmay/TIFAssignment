import Community from '../models/communityModel.js';
import Member from '../models/memberModel.js';

export const addMemberController = async (req, res) => {
	try {
		const { community, user, role } = req.body;

		const communityOwner = await Community.findOne({ _id: community }, 'owner');
		if (communityOwner.owner != req.user_id) {
			// console.log(communityOwner, req.user_id);
			throw new Error('NOT_ALLOWED_ACCESS');
		}

		const member = await new Member({ community, user, role }).save();
		res.status(200).json({
			status: 'true',
			content: { data: member },
		});
	} catch (error) {
		res.status(400).json({ Error: error.message });
	}
};

export const removeMemberController = async (req, res) => {
	try {
		const { id } = req.params;
		// console.log(id);
		const { community } = await Member.findOne({ _id: id }, 'community');
		// console.log(community);

		const communityDetail = await Community.findOne({ _id: community });
		// console.log(communityDetail);
		if (communityDetail.owner != req.user_id) {
			throw new Error('NOT_ALLOWED_ACCESS');
		}
		const deleted = await Member.deleteOne({ _id: id });
		res.status(200).json({ status: 'true' });
	} catch (error) {
		res.status(400).json({ Error: error.message });
	}
};
