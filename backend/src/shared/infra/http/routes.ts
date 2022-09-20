import { Router } from 'express';

import { usersRouter } from '../../../modules/users/app/http/routes/users.routes';

const routes = Router();

routes.use('/users', usersRouter);

export { routes };
