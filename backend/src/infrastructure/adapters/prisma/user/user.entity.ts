import { ExistingUser } from '../../../../core/entities/user.entity';

class User {
  constructor(id: string, login: string, password: string, createdAt: Date) {
    this.id = id;
    this.login = login;
    this.password = password;
    this.createdAt = createdAt;
  }
  id: string;

  login: string;

  password: string;

  createdAt: Date;

  toDomainEntity(): ExistingUser {
    return new ExistingUser({ id: this.id });
  }

  exclude<User extends Record<string, any>, Key extends keyof User>(
    user: User,
    keys: Key[],
  ): Omit<User, Key> {
    return Object.fromEntries(
      Object.entries(user).filter(([key]) => !keys.includes(key as Key)),
    ) as Omit<User, Key>;
  }
}
export default User;
