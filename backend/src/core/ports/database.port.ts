import { Book } from '../book.interface';
import { ExistingUser } from '../entities/user.entity';

export type CreateBookInput = {
  title: string;
  summary: string;
  author: string;
  totalPages: number;
};

export type CreateUserInput = {
  login: string;
  password: string;
};

export interface BookRepository {
  create(args: CreateBookInput): Promise<Book>;
  findById(id: string): Promise<Book | null>;
  list(): Promise<Book[]>;
  delete(id: string): Promise<boolean>;
}

export interface UserRepository {
  create(args: CreateUserInput): Promise<ExistingUser | 'USER_ALREADY_EXISTS'>;
  findByLoginAndPassword(
    login: string,
    password: string,
  ): Promise<ExistingUser | null>;
  findById(id: string): Promise<ExistingUser | null>;
}
