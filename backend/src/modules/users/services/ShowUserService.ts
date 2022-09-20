import { injectable, inject } from 'tsyringe';

import { AppError } from '../../../shared/errors/AppError';

import { User } from '../app/typeorm/entities/User';
import { IShowUser } from '../contracts/IUserDTO';
import { IUsersRepository } from '../repositories/IUsersRepository';

@injectable()
class ShowUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ id }: IShowUser): Promise<User> {
    const user = await this.usersRepository.findById({ id });

    if (!user) {
      throw new AppError('User not found!', 404);
    }

    return user;
  }
}

export { ShowUserService };
