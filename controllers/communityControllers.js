import Community from '../models/communityModel.js';
import Member from '../models/memberModel.js';
import User from '../models/userModel.js';
export const createCommunity = async (req, res) => {
	try {
		// console.log(req.body);

		const owner = req.user_id;

		const { name } = req.body;
		if (name.length < 2) {
			throw new Error('Name must be of atleast 2 chars');
		}

		const community = await new Community({ name, owner }).save();

		res.status(200).json({ status: 'true', content: { data: community } });
	} catch (error) {
		res.status(400).json({ 'Error: ': error.message });
	}
};

export const getAllController = async (req, res) => {
	try {
		const page = 1; //retrive using query---curr page
		const pageSize = 2;
		const total_documents = await Community.countDocuments({});
		const total_pages = Math.ceil(total_documents / pageSize);
		const populated_communities = await Community.find({})
			.populate('owner', 'name id')
			.skip((page - 1) * pageSize)
			.limit(pageSize);
		res.status(200).json({
			status: 'true',
			content: {
				meta: { total: total_documents, pages: total_pages, page: page },
				data: populated_communities,
			},
		});
	} catch (error) {
		res.send(error.message);
	}
};

export const getAllMemberfromCommunityController = async (req, res) => {
	try {
		const { id } = req.params;
		const page = 1; //can retrive curr page from query
		const pageSize = 3;
		const total_documents = await Member.countDocuments({ community: id });
		const pages = Math.ceil(total_documents / pageSize);
		const member_list = await Member.find({ community: id })
			.populate('user role', 'id name')
			.skip((page - 1) * pageSize)
			.limit(pageSize);
		res.status(200).json({
			status: true,
			content: {
				meta: { total: total_documents, pages: pages, page: page },
				data: member_list,
			},
		});
	} catch (error) {
		res.status(400).json({ Error: error.message });
	}
};

export const getMyOwnedCommunityController = async (req, res) => {
	try {
		const page = 1; //can retrive curr page from query
		const pageSize = 3;
		const total_documents = await Community.countDocuments({
			owner: req.user_id,
		});
		const pages = Math.ceil(total_documents / pageSize);
		const community_list = await Community.find({ owner: req.user_id })
			.skip((page - 1) * pageSize)
			.limit(pageSize);
		res.status(200).json({
			status: true,
			content: {
				meta: { total: total_documents, pages: pages, page: page },
				data: community_list,
			},
		});
	} catch (error) {
		res.status(400).json({ Error: error.message });
	}
};

export const getJoinedCommunity = async (req, res) => {
	try {
		const page = 1; //can retrive curr page from query
		const pageSize = 3;
		const total_documents = await Member.countDocuments({
			user: req.user_id,
			role: { $ne: '64f79f9361d030067603a518' },
		});
		const pages = Math.ceil(total_documents / pageSize);
		const community_list = await Member.find(
			{ user: req.user_id, role: { $ne: '64f79f9361d030067603a518' } },
			'community'
		);
		//convert array to only community ids
		const community_id_array = community_list.map((objids) => {
			const { _id, community } = objids;
			return community;
		});
		const community_joined = await Community.find({
			_id: { $in: community_id_array },
		})
			.populate('owner', 'name id')
			.skip((page - 1) * pageSize)
			.limit(pageSize);

		res.status(200).json({
			status: true,
			content: {
				meta: { total: total_documents, pages: pages, page: page },
				data: community_joined,
			},
		});
	} catch (error) {
		res.status(400).json({ Error: error.message });
	}
};
