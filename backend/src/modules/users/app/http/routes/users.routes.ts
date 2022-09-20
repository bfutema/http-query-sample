import { Router } from 'express';

import { UsersController } from '../controllers/UsersController';

const usersRouter = Router();

usersRouter.get('/', UsersController.index);
usersRouter.post('/', UsersController.create);
usersRouter.get('/:id', UsersController.show);
usersRouter.put('/:id', UsersController.update);
usersRouter.delete('/:id', UsersController.delete);

export { usersRouter };
