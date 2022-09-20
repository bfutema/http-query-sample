import { injectable, inject } from 'tsyringe';

import { AppError } from '../../../shared/errors/AppError';

import { User } from '../app/typeorm/entities/User';
import { IDeleteUser } from '../contracts/IUserDTO';
import { IUsersRepository } from '../repositories/IUsersRepository';

@injectable()
class DeleteUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ id }: IDeleteUser): Promise<User> {
    const foundedUser = await this.usersRepository.findById({ id });

    if (!foundedUser) {
      throw new AppError('User not found!', 404);
    }

    await this.usersRepository.delete(id);

    return foundedUser;
  }
}

export { DeleteUserService };
