import { PrimitiveProperties } from '../../../shared/contracts/IGeneric';
import { IBaseRepository } from '../../../shared/infra/typeorm/repositories/IBaseRepository';

import { User } from '../app/typeorm/entities/User';

export type IUsersRepository = IBaseRepository<PrimitiveProperties<User>>;
