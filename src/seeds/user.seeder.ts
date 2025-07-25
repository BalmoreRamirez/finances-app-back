import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

export async function seedUser(dataSource: DataSource) {
  const repo = dataSource.getRepository(User);

  const username = 'admin';
  const email = 'admin@example.com';
  const plainPassword = 'admin123';
  const password = await bcrypt.hash(plainPassword, 10);

  const exists = await repo.findOne({ where: { username } });
  if (!exists) {
    await repo.save(
      repo.create({
        username,
        email,
        password,
      }),
    );
  }
}
