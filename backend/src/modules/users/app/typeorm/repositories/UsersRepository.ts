import { getRepository } from 'typeorm';

import { IUsersRepository } from '../../../repositories/IUsersRepository';
import { BaseRepository } from '../../../../../shared/infra/typeorm/repositories/BaseRepository';

import { User } from '../entities/User';

class UsersRepository extends BaseRepository<User> implements IUsersRepository {
  constructor() {
    super(getRepository(User));
  }
}

export { UsersRepository };
