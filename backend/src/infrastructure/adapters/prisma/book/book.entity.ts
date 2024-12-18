import { Book as BookDomainEntity } from '@core/book.interface';
import { Book as BookPrismaEntity } from '@prisma/client';
class Book {
  constructor(book: BookPrismaEntity) {
    this.id = book.id;
    this.title = book.title;
    this.summary = book.summary;
    this.author = book.author;
    this.totalPages = book.totalPages;
    this.createdAt = book.createdAt;
  }
  id: string;
  title: string;
  summary: string;
  author: string;
  totalPages: number;
  createdAt: Date;

  toDomainEntity(): BookDomainEntity {
    return this.exclude(this, ['createdAt']);
  }

  exclude<Book extends Record<string, any>, Key extends keyof Book>(
    book: Book,
    keys: Key[],
  ): Omit<Book, Key> {
    return Object.fromEntries(
      Object.entries(book).filter(([key]) => !keys.includes(key as Key)),
    ) as Omit<Book, Key>;
  }
}

export default Book;
