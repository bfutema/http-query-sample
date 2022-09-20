import { injectable, inject } from 'tsyringe';

import { User } from '../app/typeorm/entities/User';
import { IListUser } from '../contracts/IUserDTO';
import { IUsersRepository } from '../repositories/IUsersRepository';

@injectable()
class ListUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(params: IListUser): Promise<[User[], number]> {
    const users = await this.usersRepository.find(params);

    return users;
  }
}

export { ListUsersService };
