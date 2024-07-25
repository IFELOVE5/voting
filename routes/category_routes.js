const express = require(`express`)
const { addCategory, allCategories, getCategory, deleteCategory, deleteCategoryP, deleteCategoryByPosition, updateCategory, updateCategorybyId } = require("../controllers/category_controllers")


const checkJwt = require(`../middleware/jwt`)
const checkAdmin = require(`../middleware/jwt2`)

const categoryRoutes = express.Router()


categoryRoutes.post(`/create`, checkAdmin, addCategory)

categoryRoutes.get(`/all`, checkJwt, allCategories)

categoryRoutes.get(`/get/:Position`, checkJwt, getCategory)

categoryRoutes.delete(`/delete/:id`, checkAdmin, deleteCategory)

categoryRoutes.delete(`/:Position`, checkAdmin, deleteCategoryByPosition)

categoryRoutes.put(`/update`, checkAdmin, updateCategory)

categoryRoutes.put(`/update/:id`,checkAdmin, updateCategorybyId)







module.exports = categoryRoutes