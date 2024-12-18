import 'reflect-metadata';

import { randomUUID } from 'crypto';
import { container } from 'tsyringe';

import DeleteBook from '@core/use-cases/delete-book.use-case';
import { BookRepository } from '@core/ports/database.port';
import Logger from '@core/ports/logger.port';

describe('DeleteBook', () => {
  // mock repository
  const mock__delete = jest.fn();
  const mock__BookRepository = () => {
    return {
      delete: mock__delete,
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

  it('should delete the book with id', async () => {
    mock__delete.mockResolvedValue(true);
    const id: string = randomUUID();

    const response = await new DeleteBook().execute(id);

    expect(response).toBeUndefined();
    expect(
      container.resolve<BookRepository>('BookRepository').delete,
    ).toHaveBeenCalledWith(id);
  });

  it('should return not found with wrong id', async () => {
    mock__delete.mockResolvedValue(false);
    const id: string = randomUUID();

    const response = await new DeleteBook().execute(id);

    expect(response).toStrictEqual('BOOK_NOT_FOUND');
  });
});
