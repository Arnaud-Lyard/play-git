import { AppDataSource, isInitialized } from '../data-source';

import UserDBEntity from './user.entity';

import { ExistingUser } from '../../../../core/entities/user.entity';
import {
  CreateUserInput,
  UserRepository,
} from '../../../../core/ports/database.port';

class TypeORMUserRepository implements UserRepository {
  async create({
    login,
    password,
  }: CreateUserInput): Promise<ExistingUser | 'USER_ALREADY_EXISTS'> {
    await isInitialized();

    const isExists = await AppDataSource.getRepository(UserDBEntity).exist({
      where: { login },
    });
    if (isExists) {
      return 'USER_ALREADY_EXISTS';
    }

    const userIdentifier = (
      await AppDataSource.getRepository(UserDBEntity).insert({
        login,
        password,
      })
    ).identifiers.at(0);

    if (!userIdentifier) {
      throw 'User entity creation failed in type-orm';
    }

    const user = await AppDataSource.getRepository(UserDBEntity).findOneBy({
      id: userIdentifier.id,
    });

    if (!user) {
      throw 'User creation failed in type-orm';
    }
    return user.toDomainEntity();
  }

  async findByLoginAndPassword(
    login: string,
    password: string,
  ): Promise<ExistingUser | null> {
    await isInitialized();

    const user = await AppDataSource.getRepository(UserDBEntity).findOne({
      where: { login, password },
    });
    return user ? user.toDomainEntity() : null;
  }

  async findById(id: string): Promise<ExistingUser | null> {
    await isInitialized();

    const user = await AppDataSource.getRepository(UserDBEntity).findOne({
      where: { id },
    });
    return user ? user.toDomainEntity() : null;
  }
}

export default TypeORMUserRepository;
