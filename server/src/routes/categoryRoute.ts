import { Router } from 'express';
import { 
    createCategory,
     deleteCategory, 
     getAllCategories, 
     getCategoryById, 
     updateCategory } 
     from '../controllers/category.controller';
import verifyAdmin from '../middlewares/verifyAdmin';
import upload from '../configs/multer';


const router = Router();




router.post('/category', upload.single('image'),verifyAdmin,  createCategory);
router.get('/category', getAllCategories);
router.get('/category/:id', verifyAdmin, getCategoryById);
router.put('/category/:id', upload.single('image'),verifyAdmin,  updateCategory);
router.delete('/category/:id', verifyAdmin,  deleteCategory);

export default router;