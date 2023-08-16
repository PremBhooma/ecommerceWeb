import slugify from "slugify"
import CategoryModel from "../models/CategoryModel.js"

export const createCategoryController = async (req, res) => {
    try {
        const { name } = req.body
        if (!name) {
            return res.status(401).send({ message: "Name is required" })
        }
        const existingCategory = await CategoryModel.findOne({ name })
        if (existingCategory) {
            return res.status(200).send({
                success: true,
                message: "Category Already Exists"
            })
        }
        const category = await new CategoryModel({ name, slug: slugify(name) }).save()
        res.status(201).send({
            success: true,
            message: "New Category Created",
            category
        })
    } catch (err) {
        console.log(err)
        res.status(500).send({
            success: false,
            err,
            message: "Error in Category"
        })
    }
}


// Update Category

export const updateCategoryController = async (req, res) => {
    try {
        const { name } = req.body
        const { id } = req.params
        const category = await CategoryModel.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true })
        res.status(200).send({
            success: true,
            message: "Category Updated",
            category,
        })
    } catch (err) {
        console.log(err)
        res.status(500).send({
            success: false,
            err,
            message: "Error in Updating Category"
        })
    }
}

// Get All Category

export const categoryController = async (req, res) => {
    try {
        const category = await CategoryModel.find({})
        res.status(200).send({
            success: true,
            message: "All Category List",
            category,
        })
    } catch (err) {
        console.log(err)
        res.status(500).send({
            success: false,
            err,
            message: "Error in Getting Category"
        })
    }
}


// Single category

export const singleCategoryController = async (req, res) => {
    try {
        const category = await CategoryModel.findOne({ slug: req.params.slug })
        res.status(200).send({
            success: true,
            message: "Get Single Category Successfully",
            category,
        })
    } catch (err) {
        console.log(err)
        res.status(500).send({
            success: false,
            err,
            message: "Error in getting Single Category"
        })
    }
}

// Delete Category

export const deleteCategoryController = async (req, res) => {
    try {
        const { id } = req.params
        await CategoryModel.findByIdAndDelete(id)
        res.status(200).send({
            success: true,
            message: "Category Deleted Successfully",
        })
    } catch (err) {
        console.log(err)
        res.status(500).send({
            success: false,
            err,
            message: "Error in Deleteing Category"
        })
    }
}