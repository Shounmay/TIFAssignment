import Role from '../models/roleModel.js';

export const createRole = async (req, res) => {
	try {
		const { name } = req.body;
		const role = await new Role({ name }).save();
		res.status(200).json({
			status: 'true',
			content: { data: role },
		});
	} catch (error) {
		res.status(400).json({ Error: error.message });
	}
};

export const getAllRoles = async (req, res) => {
	try {
		const page = 1; //get from query--curr page
		const pageSize = 2;
		const total_documents = await Role.countDocuments({});
		const pages = Math.ceil(total_documents / pageSize);
		const allRoles = await Role.find({})
			.skip((page - 1) * pageSize)
			.limit(pageSize);
		res.status(200).json({
			status: 'true',
			content: {
				meta: { total: total_documents, pages: pages, page: page },
				data: allRoles,
			},
		});
	} catch (error) {
		res.status(400).json({
			Error: error.message,
		});
	}
};
