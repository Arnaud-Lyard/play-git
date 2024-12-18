import 'reflect-metadata';

import { randomUUID } from 'crypto';
import { container } from 'tsyringe';

import GetBook from '@core/use-cases/get-book.use-case';
import { BookRepository } from '@core/ports/database.port';
import Logger from '@core/ports/logger.port';
import { Book } from '@core/book.interface';

describe('GetBook', () => {
  const id: string = randomUUID();
  const mock__data: Book = {
    id,
    title: 'My title',
    author: 'My author',
    summary: 'My summary',
    totalPages: 100,
  };

  // mock repository
  const mock__findById = jest.fn();
  const mock__BookRepository = () => {
    return {
      findById: mock__findById,
    };
  };

  container.register<Partial<BookRepository>>('BookRepository', {
    useValue: mock__BookRepository(),
  });

  // mock logger
  container.register<Partial<Logger>>('Logger', {
    useValue: {
      debug: jest.fn(),
    },
  });

  it('should return the book with id', async () => {
    mock__findById.mockResolvedValue(mock__data);

    const response = await new GetBook().execute(id);

    expect(response).toStrictEqual(mock__data);
    expect(
      container.resolve<BookRepository>('BookRepository').findById,
    ).toHaveBeenCalledWith(id);
  });

  it('should return not found with wrong id', async () => {
    mock__findById.mockResolvedValue(null);

    const response = await new GetBook().execute(id);

    expect(response).toStrictEqual('BOOK_NOT_FOUND');
  });
});
