import { z } from 'zod';
import { BookOutputDto } from './book.dto';

export const PostBookInputDto = z.object({
  title: z.string().min(1),
  summary: z.string().min(5),
  author: z.string().min(1),
  totalPages: z.number().min(1),
});

export type PostBookInputDto = z.infer<typeof PostBookInputDto>;

export const PostBooksOutputDto = BookOutputDto;
export type PostBooksOutputDto = z.infer<typeof PostBooksOutputDto>;
