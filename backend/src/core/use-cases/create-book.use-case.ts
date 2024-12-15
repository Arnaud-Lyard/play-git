import { container } from 'tsyringe';

import { CreateBookInput, BookRepository } from '../ports/database.port';
import Logger from '../ports/logger.port';

import { Book } from '../book.interface';

class CreateBook {
  private bookRepository: BookRepository;
  private logger: Logger;

  constructor() {
    this.bookRepository = container.resolve<BookRepository>('BookRepository');
    this.logger = container.resolve<Logger>('Logger');
  }

  async execute({
    title,
    summary,
    author,
    totalPages,
  }: CreateBookInput): Promise<Book> {
    this.logger.debug('[Create-book usecase] Start');
    return this.bookRepository.create({ title, summary, author, totalPages });
  }
}

export default CreateBook;
