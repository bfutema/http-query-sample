import { faker } from '@faker-js/faker';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

import { User } from '../../../../modules/users/app/typeorm/entities/User';

export default class Seed implements Seeder {
  public async run(_: Factory, connection: Connection): Promise<void> {
    const users = [];

    for (let i = 0; i < 1000; i++) {
      const name = faker.internet.userName();
      users.push({ name, email: `${name.toLowerCase()}@gmail.com` });
    }

    await connection
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(users)
      .execute();

  }
}
