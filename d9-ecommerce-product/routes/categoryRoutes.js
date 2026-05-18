import { Router } from 'express';
import { createCategory, getAllCategory, getCategoryById, updateCategory, deleteCategory } from '../controllers/categoryControllers.js';
import { createCategoryValidation, updateCategoryValidation, categoryIdValidation } from '../validators/categoryValidator.js';

const categoryRouter = Router();
categoryRouter.post('', createCategoryValidation, createCategory);
categoryRouter.get('', getAllCategory);
categoryRouter.get('/:id', categoryIdValidation, getCategoryById);
categoryRouter.put('/:id', categoryIdValidation, updateCategoryValidation, updateCategory);
categoryRouter.delete('/:id', categoryIdValidation, deleteCategory);

export default categoryRouter;
