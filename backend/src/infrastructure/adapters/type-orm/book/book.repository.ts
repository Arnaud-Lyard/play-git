import { AppDataSource, isInitialized } from '../data-source';

import BookDBEntity from './book.entity';

import { Book } from '../../../../core/book.interface';
import {
  CreateBookInput,
  BookRepository,
} from '../../../../core/ports/database.port';

class TypeORMBookRepository implements BookRepository {
  async create({
    title,
    summary,
    author,
    totalPages,
  }: CreateBookInput): Promise<Book> {
    await isInitialized();

    const bookIdentifier = (
      await AppDataSource.getRepository(BookDBEntity).insert({
        title,
        summary,
        author,
        totalPages,
      })
    ).identifiers.at(0);

    if (!bookIdentifier) {
      throw 'Book entity creation failed in type-orm';
    }

    const book = await AppDataSource.getRepository(BookDBEntity).findOneBy({
      id: bookIdentifier.id,
    });

    if (!book) {
      throw 'Book creation failed in type-orm';
    }
    return book.toDomainEntity();
  }

  async list(): Promise<Book[]> {
    await isInitialized();

    const books = await AppDataSource.getRepository(BookDBEntity).find();
    return books.map((book) => {
      return book.toDomainEntity();
    });
  }

  async findById(id: string): Promise<Book | null> {
    await isInitialized();

    const book = await AppDataSource.getRepository(BookDBEntity).findOne({
      where: { id },
    });
    return book ? book.toDomainEntity() : null;
  }

  async delete(id: string): Promise<boolean> {
    await isInitialized();

    const deleteResult = await AppDataSource.getRepository(BookDBEntity).delete(
      { id: id },
    );
    return deleteResult.affected === 1;
  }
}

export default TypeORMBookRepository;
