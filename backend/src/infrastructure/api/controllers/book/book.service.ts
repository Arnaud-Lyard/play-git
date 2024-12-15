import {
  GetBookOutputDto,
  GetBooksOutputDto,
  PostBookInputDto,
  PostBooksOutputDto,
} from './dto';

import CreateBookUseCase from '../../../../core/use-cases/create-book.use-case';
import DeleteBookUseCase from '../../../../core/use-cases/delete-book.use-case';
import GetBookUseCase from '../../../../core/use-cases/get-book.use-case';
import ListBooksUseCase from '../../../../core/use-cases/list-books.use-case';

export const list = (): Promise<GetBooksOutputDto> =>
  new ListBooksUseCase().execute();

export const getById = (
  id: string,
): Promise<GetBookOutputDto | 'BOOK_NOT_FOUND'> =>
  new GetBookUseCase().execute(id);

export const create = (data: PostBookInputDto): Promise<PostBooksOutputDto> =>
  new CreateBookUseCase().execute(data);

export const deleteById = (id: string): Promise<void | 'BOOK_NOT_FOUND'> =>
  new DeleteBookUseCase().execute(id);
