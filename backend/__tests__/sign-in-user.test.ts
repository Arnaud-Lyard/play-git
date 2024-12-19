import 'reflect-metadata';

import { randomUUID } from 'crypto';
import { container } from 'tsyringe';

import SignInUser from '@core/use-cases/sign-in-user.use-case';
import { UserRepository } from '@core/ports/database.port';
import Logger from '@core/ports/logger.port';
import { ExistingUser, NotExistingUser } from '@core/entities/user.entity';
import { describe, it, test, expect, vi, beforeEach } from 'vitest';

describe('SignInUser', () => {
  const notExistingUser = new NotExistingUser();

  // mock repository
  const mock__findByLoginAndPassword = vi.fn();
  const mock__UserRepository = () => {
    return {
      findByLoginAndPassword: mock__findByLoginAndPassword,
    };
  };

  container.register<Partial<UserRepository>>('UserRepository', {
    useValue: mock__UserRepository(),
  });

  // mock logger
  container.register<Partial<Logger>>('Logger', {
    useValue: {
      debug: vi.fn(),
    },
  });

  it('should return an access token', async () => {
    mock__findByLoginAndPassword.mockResolvedValue(
      new ExistingUser({ id: randomUUID() }),
    );
    const body = {
      login: 'mylogin',
      password: 'mypassword',
    };
    const response = await new SignInUser().execute(body.login, body.password);

    expect(response).toHaveProperty('accessToken');
    expect(
      container.resolve<UserRepository>('UserRepository')
        .findByLoginAndPassword,
    ).toHaveBeenCalledWith(
      body.login,
      notExistingUser.hashPassword(body.password),
    );
    const accessToken = (response as unknown as { accessToken: string })
      .accessToken;
    expect(accessToken).not.toEqual(0);
    const payloadInToken =
      notExistingUser.verifyAndDecodeUserAccessToken(accessToken);
    expect(payloadInToken).toHaveProperty('id');
    expect(payloadInToken.id).not.toEqual(0);
  });

  it('should return not found with wrong login / password', async () => {
    mock__findByLoginAndPassword.mockResolvedValue(null);
    const body = {
      login: 'mylogin',
      password: 'bad password',
    };

    const response = await new SignInUser().execute(body.login, body.password);

    expect(response).toStrictEqual('USER_NOT_FOUND');
  });
});
