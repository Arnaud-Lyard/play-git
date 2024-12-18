import 'reflect-metadata';

import { randomUUID } from 'crypto';
import { container } from 'tsyringe';

import CreateBook from '@core/use-cases/create-book.use-case';
import { BookRepository } from '@core/ports/database.port';
import Logger from '@core/ports/logger.port';
import { Book } from '@core/book.interface';

describe('CreateBook', () => {
  const mock__data: Partial<Book> = {
    id: randomUUID(),
    title: 'My title',
    author: 'My author',
    summary: 'My summary',
    totalPages: 100,
  };

  // mock repository
  const mock__create = jest.fn();
  const mock__BookRepository = () => {
    return {
      create: mock__create,
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

  it('should create the book', async () => {
    mock__create.mockResolvedValue(mock__data);
    const body = {
      title: 'My title',
      author: 'My author',
      summary: 'My summary',
      totalPages: 100,
    };
    const response = await new CreateBook().execute(body);

    expect(response).toStrictEqual(mock__data);
    expect(
      container.resolve<BookRepository>('BookRepository').create,
    ).toHaveBeenCalledWith(body);
  });
});
