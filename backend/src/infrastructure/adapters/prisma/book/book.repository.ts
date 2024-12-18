import { Book } from '@core/book.interface';
import { CreateBookInput, BookRepository } from '@core/ports/database.port';
import { PrismaClient } from '@prisma/client';
import BookDBEntity from './book.entity';

const prisma = new PrismaClient();
class PrismaBookRepository implements BookRepository {
  async create({
    title,
    summary,
    author,
    totalPages,
  }: CreateBookInput): Promise<Book> {
    const book = await prisma.book.create({
      data: { title, summary, author, totalPages },
    });

    if (!book) {
      throw 'Book creation failed in prisma';
    }

    return new BookDBEntity(book).toDomainEntity();
  }

  async list(): Promise<Book[]> {
    const books = await prisma.book.findMany();
    return books.map((book) => {
      return new BookDBEntity(book).toDomainEntity();
    });
  }

  async findById(id: string): Promise<Book | null> {
    const book = await prisma.book.findUnique({
      where: { id },
    });
    return book ? new BookDBEntity(book).toDomainEntity() : null;
  }

  async delete(id: string): Promise<boolean> {
    const deleteResult = await prisma.book.delete({
      where: { id },
    });
    return deleteResult !== null;
  }
}

export default PrismaBookRepository;
