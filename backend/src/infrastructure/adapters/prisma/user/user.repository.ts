import { ExistingUser } from '@core/entities/user.entity';
import { CreateUserInput, UserRepository } from '@core/ports/database.port';
import { PrismaClient } from '@prisma/client';
import UserDBEntity from './user.entity';

const prisma = new PrismaClient();

class PrismaUserRepository implements UserRepository {
  async create({
    login,
    password,
  }: CreateUserInput): Promise<ExistingUser | 'USER_ALREADY_EXISTS'> {
    const isExists = await prisma.user.findFirst({
      where: { login },
    });
    if (isExists) {
      return 'USER_ALREADY_EXISTS';
    }

    const userIdentifier = await prisma.user.create({
      data: {
        login,
        password,
      },
    });

    if (!userIdentifier) {
      throw 'User entity creation failed in prisma';
    }

    const user = await prisma.user.findFirst({
      where: {
        id: userIdentifier.id,
      },
    });

    if (!user) {
      throw 'User creation failed in prisma';
    }

    return new UserDBEntity(
      user.id,
      user.login,
      user.password,
      user.createdAt,
    ).toDomainEntity();
  }

  async findByLoginAndPassword(
    login: string,
    password: string,
  ): Promise<ExistingUser | null> {
    const user = await prisma.user.findFirst({
      where: { login, password },
    });
    return user
      ? new UserDBEntity(
          user.id,
          user.login,
          user.password,
          user.createdAt,
        ).toDomainEntity()
      : null;
  }

  async findById(id: string): Promise<ExistingUser | null> {
    const user = await prisma.user.findFirst({
      where: { id },
    });
    return user
      ? new UserDBEntity(
          user.id,
          user.login,
          user.password,
          user.createdAt,
        ).toDomainEntity()
      : null;
  }
}

export default PrismaUserRepository;
