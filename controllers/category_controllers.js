const mongoose = require(`mongoose`)

const Category = require(`../models/category`)

const Candidate = require(`../models/candidate`)

exports.addCategory = async (req, res, next) =>{ 
    const {Position} = req.body
    if (!Position) {
        return res.status(400).json({
            status: false,
            message: "Position field is required"})
    }

    try {
        const existingCategory = await Category.findOne({Position})
        if (existingCategory) { return res.status(400).json({
                status: false,
                message: "Category already exists"})}

        const category = new Category ({
            Position,
        })
        const savedCategory = await category.save()
        if (!category) { return res.status(409).json({
            status: false,
            message: "Couldn't create category"})}

        return res.status(201).json({
            status: true,
            message: "New Category created", savedCategory})
        
    } catch (error) {
        console.error(error); 
        return res.status(500).json({
        message: `An internal error occured`
       })
    }
},

exports.allCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().select(`Position`)
    const count = await Category.countDocuments()

    if (!categories || categories.length == 0 ) { return res.status(404).json({
        status: false,
        message: "No categories found"})
    }
   
    return res.status(201).json({
        status: true,
        message: `Total categories:${count}` , categories})
    
    
  } catch (error) {
    console.error(error); 
    return res.status(500).json({
    message: `An internal error occured`
   })
  }
},

exports.getCategory = async (req, res, next) => {
    const Position = req.params.Position
  try {
    const category  = await Category.findOne({Position}).select(`candidate`)

    if (!category || category.length == 0 ) { return res.status(404).json({
        status: false,
        message: "No category found"})
    }
   
    return res.status(201).json({
        status: true,
         category})
    
    
  } catch (error) {
    console.error(error); 
    return res.status(500).json({
    message: `An internal error occured`
   })
  }
}

exports.deleteCategory = async(req, res, next) => {
    const id = req.params.id

    try {
        if (!mongoose.isValidObjectId(id)) { 
            return res.status(404).json({
                status: false,
                message: "Category Id doesn't exist"})
        }

        const category = await Category.findByIdAndDelete(id)
        if (!category) { return res.status(404).json({
            status: false,
            message: "Category doesn't exist"})
        }
       
        return res.status(201).json({
            status: true,
             message:`Category deleted succesfully`})
        
    } catch (error) {
        console.error(error); 
        return res.status(500).json({
        message: `An internal error occured`
       })
    }
}

exports.deleteCategoryByPosition = async(req, res, next) => {
    const Position = req.params.Position

    try {
       
        const category = await Category.findOneAndDelete(Position)
        if (!category) { return res.status(404).json({
            status: false,
            message: "Category doesn't exist"})
        }
       
        return res.status(201).json({
            status: true,
             message:`Category deleted succesfully`})
        
    } catch (error) {
        console.error(error); 
        return res.status(500).json({
        message: `An internal error occured`
       })
    }
}

exports.updateCategory = async(req, res, next) => {
    const {Position, newPosition} = req.body

    try {
        if (!Position) { 
            return res.status(404).json({
                status: false,
                message: "Kindly input what to update"})
        }

        const category = await Category.findOneAndUpdate({Position: Position}, {Position: newPosition}, {new:true})
        if (!category) { return res.status(404).json({
            status: false,
            message: "Category didn't update"})
        }
       
        return res.status(200).json({
            status: true,
             message:`Category updated succesfully`, category: category.Position})
        
    } catch (error) {
        console.error(error); 
        return res.status(500).json({
        message: `An internal error occured`
       })
    }
}

exports.updateCategorybyId = async(req, res, next) => {
    const categoryId = req.params.id
    const {Position} = req.body

    try {
        if (!mongoose.isValidObjectId(categoryId)) { 
            return res.status(404).json({
                status: false,
                message: "invalid Category Id "})
        }

        const category = await Category.findByIdAndUpdate(categoryId, {Position}, {new:true})
        if (!category) { return res.status(404).json({
            status: false,
            message: "Category didn't update"})
        }
       
        return res.status(200).json({
            status: true,
             message:`Category updated succesfully`, category: category.Position})
        
    } catch (error) {
        console.error(error); 
        return res.status(500).json({
        message: `An internal error occured`
       })
    }
}