import bodyParser from 'body-parser';
import { Router } from 'express';

import { __dirname } from '../config.js';
import controller from '../controller/exercise.controller.js';

const urlencodedParser = bodyParser.urlencoded({ extended: false });

const route = Router({ mergeParams: true });

route.get('/', (_, res) => {
	res.sendFile(__dirname + '/views/exercise.html');
});

route.post('/api/users', urlencodedParser, controller.createUser);

route.get('/api/users', controller.getAllUsers);

route.post('/api/users/:_id/exercises', urlencodedParser, controller.postExercise);

route.get('/api/users/:_id/logs', controller.getLogs);

export default route;
