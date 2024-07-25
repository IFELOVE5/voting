const mongoose  = require(`mongoose`)

const Candidate = require(`../models/candidate.js`)

const Category = require(`../models/category.js`)

exports.addCandidate = async(req, res, next) => {
    const {name, party, category} = req.body
    if (!name || !party || !category) { return res.status(400).json({
        status: false,
        message: "All fields is required"})
    }

    try {
        if (!mongoose.isValidObjectId(category)) {
            return res.status(400).json({
                status: false,
                message: "Invalid category added"})
        }

        const existingcategory = await Category.findById(category)
        if(!existingcategory){
            return res.status(400).json({
                status: false,
                message: "category does  not exist"})
        }

        const existingCandidate = await Candidate.findOne({name, category})
        if (existingCandidate) { return res.status(400).json({
            status: false,
            message: "Candidate already exists in this category"})
        }    
        
        if (!req.file) {
            return res.status(400).json({ status: false, message: 'No file uploaded' });
        }
        
    const candidate = new Candidate({
        name,
        party,
        category,
        picture: req.file.path
    })
        
    savedCandidate = await candidate.save() 


    if (!savedCandidate) { return res.status(400).json({
        status: false,
        message: "Unable to create new candidate"})
    }     

    const newCandidate = {
        id: savedCandidate.id,
        name: savedCandidate.name,
        party: savedCandidate.party,
        category: existingcategory.Position,
        picture: savedCandidate.picture
    }

    return res.status(201).json({
        status: true,
        message: "New Candidate created", newCandidate})
        
    
    
    } catch (error) {
        console.error(error); 
        return res.status(500).json({
        message: `An internal error occured`
       })
    }
},

exports.allcandidates = async(req, res, next) => {
    try {
        const candidates = await Candidate.find().populate(`category`, `Position`).select(`name party category picture`)
        const count =  await Candidate.countDocuments()

        if (!candidates || candidates.length === 0) {  return res.status(400).json({
            status: false,
            message: "No candidates found"})
            
        }

        return res.status(201).json({
            status: true,
            message: `Number of candidates: ${count}`, candidates})
            
        
    } catch (error) {
        console.error(error); 
        return res.status(500).json({
        message: `An internal error occured`
       })
    }
},

exports.getCandidate = async (req, res, next) => {
    const name = req.params.name
    if (!name) { 
        return res.status(400).json({
            status: false,
            message: "No name of candidate in search"})
        
    }
    try {
        const candidate = await Candidate.findOne({name}).populate(`category`, `Position`).select(`name party category picture`)
        if (!candidate) {
            return res.status(400).json({
                status: false,
                message: "Candidate does not exist"})
            
        }

        return res.status(201).json({
            status: true,
            candidate})

    } catch (error) {
        console.error(error); 
        return res.status(500).json({
        message: `An internal error occured`
       })
    }

},

exports.getCandidatebyId = async (req, res, next) => {
    const id = req.params.id
    if (!id) { 
        return res.status(400).json({
            status: false,
            message: "kindly provide id of candidate to search for"})
        
    }
    try {
        const candidate = await Candidate.findById(id).populate(`category`, `Position`).select(`name party category picture`)
        if (!candidate) {
            return res.status(400).json({
                status: false,
                message: "Candidate does not exist"})
            
        }

        return res.status(201).json({
            status: true,
            candidate})

    } catch (error) {
        console.error(error); 
        return res.status(500).json({
        message: `An internal error occured`
       })
    }

},

exports.updateCandidate = async (req, res, next) => {
const name = req.params.name
const {newName, party, category} = req.body

if (!name) {
    return res.status(400).json({
        status: false,
        message: "kindly provide name of candidate to search for"})
}

try {

    if (!mongoose.isValidObjectId(category)) { 
        return res.status(404).json({
            status: false,
            message: "invalid category Id "})
    }

    const newCategory = await Category.findById(category)
    if (!newCategory) {
        return res.status(404).json({
            status: false,
            message: "category doesn't exist"})
    }


    const candidate = await Candidate.findOneAndUpdate(
         {name},
         {name: newName, party, category:newCategory,  picture: req.file.path}, 
         {new:true}).populate(`category`, `Position`).select(`name party category, picture`)

    const existingcandidate = await Candidate.findOne({name: newName})
    if (existingcandidate) {
        return res.status(404).json({
            status: false,
            message: "candidate with this name already exists, can't update"})
    }

    if (!candidate) {
        return res.status(404).json({
            status: false,
            message: "no candidate to update found"})
    }


    return res.status(200).json({
        status: true,
        message: `Candidate updated succesfully`, candidate})

    
} catch (error) {
    console.error(error); 
    return res.status(500).json({
    message: `An internal error occured`
   })
}

}


exports.updateCandidateById = async (req, res, next) => {
const id = req.params.id
const {newName, party, category} = req.body
if (!id) {
    return res.status(400).json({
        status: false,
        message: "No Id of candidate provided"})
}



try {

    if (!mongoose.isValidObjectId(id)) { 
        return res.status(404).json({
            status: false,
            message: "invalid candidate Id "})
    }

    if (!mongoose.isValidObjectId(category)) { 
        return res.status(404).json({
            status: false,
            message: "invalid category Id "})

    }

    const newCategory = await Category.findById(category)
    if (!newCategory) {
        return res.status(404).json({
            status: false,
            message: "category doesn't exist"})
    }


    const candidate = await Candidate.findByIdAndUpdate(
         id,
         {name: newName, party, category:newCategory}, 
         {new:true}).populate(`category`, `Position`).select(`name party category picture`)

         
    const existingcandidate = await Candidate.findOne({name: newName})
    if (existingcandidate) {
        return res.status(404).json({
            status: false,
            message: "candidate with this name already exists, can't update"})
    }
    console.log(existingcandidate)

    if (!candidate) {
        return res.status(404).json({
            status: false,
            message: "no candidate to update found"})
    }


    return res.status(200).json({
        status: true,
        message: `Candidate updated succesfully`, candidate})

    
} catch (error) {
    console.error(error); 
    return res.status(500).json({
    message: `An internal error occured`
   })
}

},

exports.deleteCandidate = async(req, res, next) => {
    const id = req.params.id
  try {

    if (!id) {
        return res.status(400).json({
            status: false,
            message: "No Id of candidate provided"})   
    }

    const candidate= await Candidate.findByIdAndDelete(id)

    if (!candidate) {
        return res.status(404).json({
            status: false,
            message: "no candidate to delete found"})   
    }

    
    return res.status(200).json({
        status: true,
        message: `Candidate deleted succesfully`})
    
  } catch (error) {
    console.error(error); 
    return res.status(500).json({
    message: `An internal error occured`
   })
  }
    
}


exports.updatePicture = async (req, res, next) => {
    const id = req.params.id
    
    try {
      const  candidate =await Candidate.findByIdAndUpdate(id, {picture: req.file.path}, {new: true})
      .populate(`category`, `Position`).select(`name party category picture`)
      

        if (!candidate) {
            return res.status(404).json({
                status: false,
                message: "no candidate to update found"})
        }
    
    
        return res.status(200).json({
            status: true,
            message: `Candidate updated succesfully`, candidate})
        
    } catch (error) {
        console.error(error); 
        return res.status(500).json({
        message: `An internal error occured`
       })
    }
}