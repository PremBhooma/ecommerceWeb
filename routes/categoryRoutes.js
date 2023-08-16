import express from "express"
import { requireSignIN, isAdmin } from './../middlewares/authMiddleware.js'
import { categoryController, createCategoryController, deleteCategoryController, singleCategoryController, updateCategoryController } from "../controllers/categoryController.js"

const router = express.Router()

// Create Category
router.post('/create-category', requireSignIN, isAdmin, createCategoryController)


// Upadte Category
router.put('/update-category/:id', requireSignIN, isAdmin, updateCategoryController)


// get all Category
router.get('/get-category', categoryController)

// Single Category
router.get('/single-category/:slug', singleCategoryController)

// Delete Category
router.delete('/delete-category/:id', requireSignIN, isAdmin, deleteCategoryController)

export default router