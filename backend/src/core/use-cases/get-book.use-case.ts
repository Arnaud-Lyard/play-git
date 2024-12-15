import { container } from 'tsyringe';

import { BookRepository } from '../ports/database.port';
import Logger from '../ports/logger.port';

import { Book } from '../book.interface';

class GetBook {
  private bookRepository: BookRepository;
  private logger: Logger;

  constructor() {
    this.bookRepository = container.resolve<BookRepository>('BookRepository');
    this.logger = container.resolve<Logger>('Logger');
  }

  async execute(id: string): Promise<Book | 'BOOK_NOT_FOUND'> {
    this.logger.debug('[Get-book usecase] Start');
    const data = await this.bookRepository.findById(id);
    return data ?? 'BOOK_NOT_FOUND';
  }
}

export default GetBook;
