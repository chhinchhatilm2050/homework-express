import { Router } from "express";
import { insertBorrowings } from "../controllers/borrowings-collection.js";
const borrowingRoutes = Router();
borrowingRoutes.post('/borrowings', insertBorrowings)
export { borrowingRoutes };