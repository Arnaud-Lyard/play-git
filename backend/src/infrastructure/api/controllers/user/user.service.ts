import { PostUsersInputDto, PostUsersOutputDto } from './dto';

import SignInUserUseCase from '../../../../core/use-cases/sign-in-user.use-case';
import SignUpUserUseCase from '../../../../core/use-cases/sign-up-user.use-case';

export const signin = (
  login: string,
  password: string,
): Promise<PostUsersOutputDto | 'USER_NOT_FOUND'> =>
  new SignInUserUseCase().execute(login, password);

export const signup = (
  data: PostUsersInputDto,
): Promise<PostUsersOutputDto | 'USER_ALREADY_EXISTS'> =>
  new SignUpUserUseCase().execute(data);
