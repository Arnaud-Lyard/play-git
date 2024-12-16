import { container } from 'tsyringe';

import Logger from '../../core/ports/logger.port';
import loggerConfig from './winston-logger/winston-logger.config';
import {
  LogLevel,
  WinstonLogger,
} from './winston-logger/winston-logger.adapter';

import { BookRepository, UserRepository } from '../../core/ports/database.port';
import PrismaUserRepository from './prisma/user/user.repository';
import PrismaBookRepository from './prisma/book/book.repository';
container
  .register<Logger>('Logger', {
    useValue: new WinstonLogger(loggerConfig.logLevel as LogLevel),
  })
  .register<BookRepository>('BookRepository', {
    useValue: new PrismaBookRepository(),
  })
  .register<UserRepository>('UserRepository', {
    useValue: new PrismaUserRepository(),
  });
