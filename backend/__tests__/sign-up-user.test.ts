import 'reflect-metadata';

import { randomUUID } from 'crypto';
import { container } from 'tsyringe';

import SignUpUser from '../src/core/use-cases/sign-up-user.use-case';
import { UserRepository } from '../src/core/ports/database.port';
import Logger from '../src/core/ports/logger.port';
import {
  ExistingUser,
  NotExistingUser,
} from '../src/core/entities/user.entity';

describe('SignUpUser', () => {
  const notExistingUser = new NotExistingUser();

  // mock repository
  const mock__create = jest.fn();
  const mock__UserRepository = () => {
    return {
      create: mock__create,
    };
  };

  container.register<Partial<UserRepository>>('UserRepository', {
    useValue: mock__UserRepository(),
  });

  // mock logger
  container.register<Partial<Logger>>('Logger', {
    useValue: {
      debug: jest.fn(),
    },
  });

  it('should return an access token', async () => {
    mock__create.mockResolvedValue(
      new ExistingUser({ id: randomUUID() }),
    );
    const body = {
      login: 'mylogin',
      password: 'mypassword',
    };
    const response = await new SignUpUser().execute(body);

    expect(response).toHaveProperty('accessToken');
    expect(
      container.resolve<UserRepository>('UserRepository').create,
    ).toHaveBeenCalledWith({
      login: body.login,
      password: notExistingUser.hashPassword(body.password),
    });
    const accessToken = (response as unknown as { accessToken: string })
      .accessToken;
    expect(accessToken).not.toEqual(0);
    const payloadInToken =
      notExistingUser.verifyAndDecodeUserAccessToken(accessToken);
    expect(payloadInToken).toHaveProperty('id');
    expect(payloadInToken.id).not.toEqual(0);
  });

  it('should return already exist if provider returns this error', async () => {
    mock__create.mockResolvedValue('USER_ALREADY_EXISTS');
    const body = {
      login: 'login-already-exists',
      password: 'password',
    };

    const response = await new SignUpUser().execute(body);

    expect(response).toStrictEqual('USER_ALREADY_EXISTS');
  });
});
