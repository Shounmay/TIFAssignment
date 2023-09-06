//imports
import express from 'express';
import { connection } from './config/db.js';
import { test } from './test.js';
import userAuthRoutes from './routes/userAuthRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
//initialize variables
const app = express();
const PORT = process.env.PORT || 6002;
app.use(express.json({ limit: '10mb' }));

//routing
app.get('/health', (req, res) => {
	res.status(200).json({
		'server status': `running on PORT ${PORT} at ${new Date()}`,
	});
});
app.use('/v1/auth', userAuthRoutes);
app.use('/v1/community', communityRoutes);
app.use('/v1/role', roleRoutes);
app.use('/v1/member', memberRoutes);

// 404 middleware
app.use((_req, res, _next) => {
	res.status(404).send('404 - Not Found');
});
//server and DB connection
app.listen(PORT, () => {
	console.log(`Server is running on PORT ${PORT}`);
});
connection();
// test();
