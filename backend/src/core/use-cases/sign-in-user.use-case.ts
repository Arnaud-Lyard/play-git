import { container } from 'tsyringe';

import { UserRepository } from '../ports/database.port';
import Logger from '../ports/logger.port';

import { NotExistingUser } from '../entities/user.entity';

class SignInUser {
  private userRepository: UserRepository;
  private logger: Logger;

  constructor() {
    this.userRepository = container.resolve<UserRepository>('UserRepository');
    this.logger = container.resolve<Logger>('Logger');
  }

  async execute(
    login: string,
    password: string,
  ): Promise<{ accessToken: string } | 'USER_NOT_FOUND'> {
    this.logger.debug('[Get-user usecase] Start');
    const notExistingUser = new NotExistingUser();
    const user = await this.userRepository.findByLoginAndPassword(
      login,
      notExistingUser.hashPassword(password),
    );
    return user
      ? { accessToken: user.signAndEncodeUserAccessToken() }
      : 'USER_NOT_FOUND';
  }
}

export default SignInUser;
