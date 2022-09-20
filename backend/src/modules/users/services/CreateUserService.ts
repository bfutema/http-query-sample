import { injectable, inject } from 'tsyringe';

import { User } from '../app/typeorm/entities/User';
import { ICreateUser } from '../contracts/IUserDTO';
import { IUsersRepository } from '../repositories/IUsersRepository';

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(data: ICreateUser): Promise<User> {
    const { id } = await this.usersRepository.create(data);

    const createdUser = await this.usersRepository.findById({ id });

    return createdUser;
  }
}

export { CreateUserService };
