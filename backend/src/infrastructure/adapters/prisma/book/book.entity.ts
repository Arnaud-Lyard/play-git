import { Book as BookCoreEntity } from '../../../../core/book.interface';
class Book {
  constructor(
    id: string,
    title: string,
    summary: string,
    author: string,
    totalPages: number,
    createdAt: Date,
  ) {
    this.id = id;
    this.title = title;
    this.summary = summary;
    this.author = author;
    this.totalPages = totalPages;
    this.createdAt = createdAt;
  }
  id: string;
  title: string;
  summary: string;
  author: string;
  totalPages: number;
  createdAt: Date;

  toDomainEntity(): BookCoreEntity {
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
