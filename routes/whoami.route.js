import { Router } from 'express';
import process from 'node:process';

const whoamiRoute = Router({ mergeParams: true });

whoamiRoute.get('/api/whoami', function (req, res) {
	const ipaddress = req.socket.remoteAddress;
	const language = req.headers['accept-language'];
	const software = req.headers['user-agent'];

	res.json({ ipaddress, language, software });
});

export default whoamiRoute;
