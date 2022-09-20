import { instanceToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateUserService } from '../../../services/CreateUserService';
import { DeleteUserService } from '../../../services/DeleteUserService';
import { ListUsersService } from '../../../services/ListUsersService';
import { ShowUserService } from '../../../services/ShowUserService';
import { UpdateUserService } from '../../../services/UpdateUserService';
import { HttpQuery } from '../../../../../shared/helpers/HttpQueryHelper';

class UsersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const query = HttpQuery.getParsedQuery(request.query);

    const listUsersService = container.resolve(ListUsersService);

    const [users, total] = await listUsersService.execute({
      query,
      relations: request.headers.relations
        ? String(request.headers.relations).split(',')
        : [],
    });

    const results = {
      page: Number(query.page),
      limit: Number(query.limit),
      total: Number(total),
      data: users,
    };

    return response.status(200).json(instanceToInstance(results));
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { body } = request;

    const createUserService = container.resolve(CreateUserService);

    const createdUser = await createUserService.execute(body);

    return response.status(201).json(createdUser);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const showUserService = container.resolve(ShowUserService);

    const foundedUser = await showUserService.execute({ id: Number(id) });

    return response.status(200).json(foundedUser);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { body } = request;

    const updateUserService = container.resolve(UpdateUserService);

    const updatedUser = await updateUserService.execute({
      id: Number(id),
      ...body,
    });

    return response.status(200).json(updatedUser);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const deleteUserService = container.resolve(DeleteUserService);

    await deleteUserService.execute({ id: Number(id) });

    return response.status(204).send();
  }
}

const INSTANCE = new UsersController();

export { INSTANCE as UsersController };
