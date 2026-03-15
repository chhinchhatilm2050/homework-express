import { Router } from "express";
import { insterBooks, findAllBooks, findBooksByCategory, findAvailableBooks, updateBook } from "../controllers/books-collection.js";
const bookRoutes = Router();
bookRoutes.post('/books', insterBooks);
bookRoutes.get('/books', findAllBooks);
bookRoutes.get('/books/category', findBooksByCategory);
bookRoutes.get('/books/available', findAvailableBooks);
bookRoutes.patch('/books/:bookId', updateBook)
export { bookRoutes };