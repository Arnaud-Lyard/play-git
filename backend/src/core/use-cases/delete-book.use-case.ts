import { container } from "tsyringe";

import { BookRepository } from "../ports/database.port";
import Logger from '../ports/logger.port';

class DeleteBook {
  private bookRepository: BookRepository;
  private logger: Logger;

  constructor() {
    this.bookRepository = container.resolve<BookRepository>('BookRepository');
    this.logger = container.resolve<Logger>('Logger');
  }

  async execute(id: string): Promise<void | 'BOOK_NOT_FOUND'> {
    this.logger.debug('[Delete-book usecase] Start');
    const data = await this.bookRepository.delete(id);
    if (!data) {
      return 'BOOK_NOT_FOUND';
    }
  }
}

export default DeleteBook;
