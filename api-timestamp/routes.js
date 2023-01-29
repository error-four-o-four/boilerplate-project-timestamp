import { Router } from 'express';

import controller from './controller.js';

const route = Router({ mergeParams: true });

route.get('/api', controller.getTimestamp);

route.get('/api/:timestamp', controller.parseTimestamp);

export default route;
