import * as express from 'express';
import { container } from 'tsyringe';

import { UserRepository } from '../../../core/ports/database.port';
import { AuthenticatedContext } from '../../../core/ports/api.port';
import {
  ExistingUser,
  NotExistingUser,
} from '../../../core/entities/user.entity';

import { UnauthorizedError } from '../error-handler';

export type AuthenticatedRequest = Express.Request & {
  user: AuthenticatedContext;
};

const extractTokenFromRequest = (
  request: express.Request,
): 'TOKEN_NOT_FOUND' | string =>
  (request.header('authorization') ?? '').replace('Bearer ', '') ||
  'TOKEN_NOT_FOUND';

const verifyAndDecodeJwtToken = (
  token: string,
): 'INVALID_JWT_TOKEN' | { id: string } => {
  try {
    const notExistingUser = new NotExistingUser();
    return notExistingUser.verifyAndDecodeUserAccessToken(token);
  } catch {
    return 'INVALID_JWT_TOKEN';
  }
};

const retrieveUserFromId = async (
  userRepository: UserRepository,
  id: string,
): Promise<'UNKNOWN_USER' | ExistingUser> =>
  (await userRepository.findById(id)) || 'UNKNOWN_USER';

const getUserFromJwt = async (
  userRepository: UserRepository,
  token: string,
): Promise<'INVALID_JWT_TOKEN' | 'UNKNOWN_USER' | { userId: string }> => {
  const payload = verifyAndDecodeJwtToken(token);
  if (payload === 'INVALID_JWT_TOKEN') {
    return payload;
  }
  const user = await retrieveUserFromId(userRepository, payload.id);
  if (user === 'UNKNOWN_USER') {
    return user;
  }
  return {
    userId: user.id,
  };
};

export async function expressAuthentication(
  request: express.Request,
  _securityName: string,
  _scopes: string[],
): Promise<AuthenticatedContext> {
  const userRepository = container.resolve<UserRepository>('UserRepository');
  const token = extractTokenFromRequest(request);
  if (token === 'TOKEN_NOT_FOUND') {
    return Promise.reject(new UnauthorizedError('MISSING_AUTHENTICATION'));
  }

  const user = await getUserFromJwt(userRepository, token);
  if (user === 'INVALID_JWT_TOKEN' || user === 'UNKNOWN_USER') {
    return Promise.reject(new UnauthorizedError('INVALID_TOKEN'));
  }
  return Promise.resolve(user);
}
